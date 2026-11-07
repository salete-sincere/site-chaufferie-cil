#!/usr/bin/env python3
"""Prepare or apply the exact staging DNS record and its private GHCR access.

Defaults to read-only checks. Credentials stay in process memory and stdin.
This script never updates an existing DNS record or an existing Secret.
"""

import argparse
import base64
import getpass
import json
import re
import socket
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

NAMESPACE = "site-chaufferie-cil"
SECRET_NAME = "site-chaufferie-cil-ghcr"
HOST = "chaufferie-cil-staging.saletesincere.fr"
ORIGIN = "141.94.98.109"
PACKAGE = "salete-sincere/site-chaufferie-cil"
KUBECTL = ["sudo", "-n", "/snap/bin/microk8s", "kubectl"]


class ProvisionError(Exception):
    """An explicitly safe, credential-free error message."""


class RejectRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        raise ProvisionError("Redirection HTTP refusée : destination à vérifier.")


OPENER = urllib.request.build_opener(RejectRedirect())


def command(arguments, input_data=None):
    try:
        result = subprocess.run(
            arguments, input=input_data, stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, check=False, text=True, timeout=30,
        )
    except (OSError, subprocess.TimeoutExpired):
        raise ProvisionError("Commande indisponible ou expirée ; aucun détail privé affiché.") from None
    if result.returncode:
        raise ProvisionError("Commande refusée ou en erreur ; aucun détail privé affiché.")
    return result.stdout


def request_json(url, headers, payload=None):
    request = urllib.request.Request(
        url, headers=headers,
        data=None if payload is None else json.dumps(payload).encode(),
    )
    try:
        with OPENER.open(request, timeout=20) as response:
            return json.load(response), response.headers
    except urllib.error.HTTPError as error:
        raise ProvisionError(f"Requête externe refusée (HTTP {error.code}) ; corps masqué.") from None
    except (urllib.error.URLError, TimeoutError, ValueError):
        raise ProvisionError("Requête externe échouée ; aucun détail privé affiché.") from None


def verify_target():
    if socket.gethostname() != "game-prod-ovh-gra" or getpass.getuser() != "ubuntu":
        raise ProvisionError("Exécution autorisée seulement sous ubuntu sur game-prod-ovh-gra.")
    if command(KUBECTL + ["config", "current-context"]).strip() != "microk8s":
        raise ProvisionError("Le contexte courant n'est pas microk8s.")


def provision_dns(apply):
    secret = json.loads(command(KUBECTL + [
        "-n", "cert-manager", "get", "secret", "cloudflare-api-token-secret", "-o", "json",
    ]))
    token = base64.b64decode(secret["data"]["api-token"]).decode()
    headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json"}

    def cloudflare(path, payload=None):
        value, _ = request_json("https://api.cloudflare.com/client/v4" + path, headers, payload)
        if not value.get("success"):
            raise ProvisionError("Cloudflare n'a pas confirmé l'opération ; détails masqués.")
        return value["result"]

    zones = cloudflare("/zones?name=saletesincere.fr")
    if len(zones) != 1 or zones[0]["name"] != "saletesincere.fr":
        raise ProvisionError("La zone Cloudflare exacte n'est pas identifiée de manière unique.")
    records_path = "/zones/" + zones[0]["id"] + "/dns_records"
    lookup = records_path + "?name=" + urllib.parse.quote(HOST)
    desired = {"type": "A", "name": HOST, "content": ORIGIN, "ttl": 1, "proxied": True}
    records = cloudflare(lookup)
    if records:
        if len(records) == 1 and all(records[0].get(key) == value for key, value in desired.items()):
            print("DNS déjà conforme ; aucune mutation.")
            return
        raise ProvisionError("Un enregistrement existe avec une autre configuration ; modification refusée.")
    print(f"DNS prévu : A {HOST} vers {ORIGIN}, proxy activé, TTL automatique.")
    if not apply:
        print("Vérification terminée ; aucun enregistrement créé (utiliser --apply pour appliquer).")
        return
    cloudflare(records_path, desired)
    records = cloudflare(lookup)
    if len(records) != 1 or not all(records[0].get(key) == value for key, value in desired.items()):
        raise ProvisionError("Création envoyée, mais conformité DNS non confirmée ; vérifier avant toute relance.")
    print("Enregistrement exact créé et relu ; propagation publique à vérifier séparément.")


def provision_registry(revision, apply):
    if not re.fullmatch(r"[a-f0-9]{40}", revision):
        raise ProvisionError("Un SHA Git complet est obligatoire.")
    # Inspect the scopes through the gh client's normal GitHub connection.
    # Do not transmit credentials extracted from another application's Secret.
    identity_response = command(["gh", "api", "--include", "user"])
    match = re.search(r"(?im)^x-oauth-scopes:\s*([^\r\n]*)", identity_response)
    scopes = set() if not match else {scope.strip() for scope in match[1].split(",")}
    if "read:packages" not in scopes or scopes.intersection({"write:packages", "delete:packages"}):
        raise ProvisionError("Le compte gh n'atteste pas un accès GHCR limité à la lecture des packages.")
    login = command(["gh", "api", "user", "--jq", ".login"]).strip()
    if login != "thedamfr":
        raise ProvisionError("L'identité GitHub attendue est thedamfr ; autre identité refusée.")
    token = command(["gh", "auth", "token", "--hostname", "github.com"]).strip()
    authorization = base64.b64encode((login + ":" + token).encode()).decode()

    # Exchange with the intended registry for this one package's pull capability.
    # Refuse HTTP redirects, so authorization never follows a different host.
    query = urllib.parse.urlencode({"service": "ghcr.io", "scope": "repository:" + PACKAGE + ":pull"})
    granted, _ = request_json("https://ghcr.io/token?" + query, {
        "Authorization": "Basic " + authorization,
        "User-Agent": "site-chaufferie-cil-provision/1.0",
    })
    pull_token = granted.get("token") or granted.get("access_token")
    if not pull_token:
        raise ProvisionError("Le registre n'a pas fourni de droit de lecture pour ce package.")
    _, response_headers = request_json(
        "https://ghcr.io/v2/" + PACKAGE + "/manifests/" + revision,
        {"Authorization": "Bearer " + pull_token,
         "Accept": "application/vnd.oci.image.index.v1+json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json"},
    )
    digest = response_headers.get("Docker-Content-Digest", "")
    if not re.fullmatch(r"sha256:[a-f0-9]{64}", digest):
        raise ProvisionError("Le digest de l'image publiée n'est pas confirmé.")
    print("Lecture GHCR du SHA publié confirmée : " + digest)
    print("Scope packages en lecture seule confirmé ; le compte gh conserve aussi ses autres scopes existants.")
    if not command(KUBECTL + ["get", "namespace", NAMESPACE, "--ignore-not-found", "-o", "name"]).strip():
        raise ProvisionError("Namespace dédié absent ; créer uniquement k8s/namespace.yaml avant le Secret.")
    if command(KUBECTL + ["-n", NAMESPACE, "get", "secret", SECRET_NAME, "--ignore-not-found", "-o", "name"]).strip():
        raise ProvisionError("Secret dédié déjà présent ; aucun remplacement automatique, vérifier le pull du Deployment.")
    if not apply:
        print("Secret dédié prêt à créer ; aucune mutation (utiliser --apply pour appliquer).")
        return
    docker_config = {"auths": {"ghcr.io": {"auth": authorization}}}
    resource = {
        "apiVersion": "v1", "kind": "Secret",
        "metadata": {"name": SECRET_NAME, "namespace": NAMESPACE,
                     "labels": {"app.kubernetes.io/name": NAMESPACE}},
        "type": "kubernetes.io/dockerconfigjson",
        "data": {".dockerconfigjson": base64.b64encode(json.dumps(docker_config).encode()).decode()},
    }
    command(KUBECTL + ["create", "-f", "-"], input_data=json.dumps(resource))
    print("Secret de lecture GHCR créé dans le seul namespace dédié ; aucune valeur affichée.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="operation", required=True)
    dns = commands.add_parser("dns", help="Vérifier ou créer le seul DNS staging exact.")
    dns.add_argument("--apply", action="store_true")
    registry = commands.add_parser("registry", help="Vérifier ou provisionner le pull GHCR du SHA publié.")
    registry.add_argument("revision")
    registry.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    try:
        verify_target()
        if args.operation == "dns":
            provision_dns(args.apply)
        else:
            provision_registry(args.revision, args.apply)
    except ProvisionError as error:
        print(str(error), file=sys.stderr)
        return 1
    except Exception:
        print("Opération non confirmée ; exception masquée pour préserver les identifiants.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
