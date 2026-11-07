# Domaine public — stopchaufferiehaubourdin.fr

## Summary — 30 secondes

Le domaine demandé est `stopchaufferiehaubourdin.fr`, avec DNS OVH et un A vers
Penthouse `141.94.98.109`. Les ressources sont préparées dans `k8s/domain.yaml` :
Issuer HTTP01, certificat, Ingress et accès réseau limité aux solveurs. Elles
n’étaient pas appliquées lors de la préparation du 7 novembre 2026. Attendre la
publication DNS avant l’émission ACME, puis vérifier TLS, les Golden Journeys et
la santé continue. Le staging reste accessible pendant cette opération.

## Synthèse — 3 minutes

Le propriétaire a autorisé la mise en service du domaine et une notification
Telegram après validation. Le nom `stopchaufferie.fr`, évoqué auparavant, n’est
pas inclus. Les serveurs DNS restent ceux d’OVH ; aucune zone ou clé Cloudflare
n’est nécessaire pour cette émission. La non-indexation reste active.

Le nouvel `Issuer` est limité à `site-chaufferie-cil`, utilise Let’s Encrypt
production, HTTP01 et l’adresse technique existante `devs@saletesincere.fr`.
cert-manager crée un Service `ClusterIP`, un Pod et un Ingress de challenge avec
la classe `public`. Le certificat couvre uniquement le domaine exact, sans `www`
ni wildcard. L’Ingress public sert le Service applicatif existant et réutilise
les middlewares HTTPS et non-indexation. Le ClusterIssuer partagé et l’Ingress
staging restent inchangés.

La nouvelle NetworkPolicy sélectionne uniquement les pods de solveur portant
le label propre à ce site et le label HTTP01 de cert-manager. Elle permet TCP
8089 depuis les pods Traefik et le contrôleur cert-manager de leurs namespaces
respectifs. Le self-check normal de cert-manager vise le domaine public sur le
port 80, puis passe par Traefik ; l’autorisation directe du contrôleur ne remplace
pas ce parcours. Les sorties du solveur et de l’application restent interdites
par `default-deny`. L’accès applicatif existant sur 3000 n’est pas élargi.

Le solveur demande `10m / 32Mi`, avec limites `100m / 64Mi`. Le contexte Pod
définit utilisateur non privilégié et seccomp `RuntimeDefault` ; cert-manager
v1.19.1 génère les protections du conteneur et désactive l’automontage du jeton.
Les quotas actuels permettent un solveur en même temps qu’un rollout applicatif.
Ils n’ont pas été augmentés.

Le 7 novembre vers 22 h 03 Paris, le registre `.fr` renvoyait encore `NXDOMAIN`.
Un A saisi dans une zone OVH ne prouve pas que le domaine est délégué. Attendre
les NS autoritaires, l’A correct et sa visibilité publique avant d’appliquer le
fichier ; vérifier aussi tout AAAA et CAA éventuellement présent. Les validations
serveur décrites ci-dessous n’ont émis aucun certificat ni créé de ressource.

Les métadonnées absolues nécessitent une image construite avec
`SITE_URL=https://stopchaufferiehaubourdin.fr`. L’ajout de l’Ingress peut réutiliser
le serveur existant ; la publication d’une image reste une étape distincte avec
son SHA qualifié. Le succès ne sera annoncé qu’après vérification sur le domaine
réel et au moins 60 secondes de santé continue après la dernière activation.

## Annexes

### Préconditions DNS et réseau

Contrôler l’hôte `game-prod-ovh-gra`, le contexte `microk8s`, les capacités,
l’image courante et les alertes selon le [guide de déploiement](deploiement.md).
Conserver le couple image / `APP_REVISION` et le digest de retour arrière.

```sh
dig @d.nic.fr stopchaufferiehaubourdin.fr NS +norecurse
dig @1.1.1.1 stopchaufferiehaubourdin.fr NS
dig @1.1.1.1 stopchaufferiehaubourdin.fr A
dig @8.8.8.8 stopchaufferiehaubourdin.fr A
dig @1.1.1.1 stopchaufferiehaubourdin.fr AAAA
dig @1.1.1.1 stopchaufferiehaubourdin.fr CAA
```

Consulter aussi directement les NS OVH retournés par la délégation. L’A doit
valoir `141.94.98.109`. Aucun AAAA n’est requis pour cette livraison ; si un AAAA
existe, contrôler son origine et l’accessibilité IPv6 avant ACME, sans le modifier
automatiquement. Si un CAA restreint les autorités, vérifier qu’il permet Let’s
Encrypt. Une absence de CAA est acceptable. Les caches négatifs peuvent persister
après l’apparition de la délégation : maintenir l’attente, sans recréer des Orders.

Le port HTTP 80 doit être accessible publiquement. Le challenge dispose de son
propre Ingress, sans les middlewares de l’Ingress applicatif : son chemin précis
`/.well-known/acme-challenge/...` est traité par le solveur. Conserver l’Issuer
et la politique du solveur pour les renouvellements automatiques.

### Ressources et quotas vérifiés

| Ressource | Nom dans `site-chaufferie-cil` |
| --- | --- |
| NetworkPolicy | `allow-http01-solver` |
| Issuer | `letsencrypt-production-http01` |
| Secret de compte ACME géré par cert-manager | `letsencrypt-production-http01-account` |
| Certificate | `site-chaufferie-cil-public` |
| Secret TLS géré par cert-manager | `site-chaufferie-cil-public-tls` |
| Ingress | `site-chaufferie-cil-public` |

Contrôle du 7 novembre 2026 : cert-manager `v1.19.1`, classe `public` gérée par
Traefik, Traefik sans `hostNetwork`, namespace en politique Pod Security
`restricted`, aucun NetworkPolicy dans le namespace du contrôleur cert-manager.
Les ressources du nouveau domaine restent exclusivement dans le namespace du site.

| Situation | Pods | Demandes CPU / mémoire | Limites CPU / mémoire |
| --- | --- | --- | --- |
| Application seule | 1 | 100m / 128Mi | 500m / 512Mi |
| Rollout et un solveur | 3 | 210m / 288Mi | 1 100m / 1 088Mi |
| Quota du namespace | 4 | 500m / 512Mi | 2 000m / 2 048Mi |

Ces valeurs décrivent la réservation, pas une mesure de performance du solveur.
L’émission réelle devra confirmer son exécution dans ces limites.

### Validation et activation ordonnée

Le renderer inclut désormais `domain.yaml`. Un rendu complet destiné à une
première installation ne doit donc pas être appliqué tant que le DNS public
n’est pas prêt. Pour ajouter uniquement le domaine à l’installation existante,
appliquer seulement le fichier dédié après qualification : ne pas réappliquer
aveuglément le Deployment présent dans un rendu complet.

```sh
release_commit=$(git rev-parse HEAD)
npm run --silent deploy:render -- "$release_commit" salete-sincere > /tmp/chaufferie-release.yaml
sudo -n /snap/bin/microk8s kubectl apply --dry-run=server -f k8s/domain.yaml
git diff --check
```

Le 7 novembre 2026, la validation serveur des quatre objets a réussi. Un Pod
synthétique reproduisant le contexte de sécurité et les ressources du solveur
a également été accepté avec `kubectl create --dry-run=server` : aucun Pod réel
ni challenge ACME n’a été créé. Le renderer et sa syntaxe JavaScript ont été
contrôlés. Ces vérifications ne prouvent ni la résolution DNS ni l’émission TLS.
Les preuves de préparation locales sont dans `/tmp/chaufferie-domain-validation`.

Après publication DNS, activation autorisée par le propriétaire :

```sh
sudo -n /snap/bin/microk8s kubectl apply -f k8s/domain.yaml
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil wait --for=condition=Ready issuer/letsencrypt-production-http01 --timeout=120s
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil wait --for=condition=Ready certificate/site-chaufferie-cil-public --timeout=300s
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil get certificate,certificaterequest,order,challenge
curl --fail --silent --show-error https://stopchaufferiehaubourdin.fr/health
```

Si l’attente expire, lire les événements, le statut du challenge et l’état du
solveur ; un timeout ne justifie pas de recréer l’Issuer ou de multiplier les
demandes de certificat. Ne pas exposer les clés des Secrets.

Vérifier l’HTTP vers HTTPS, la chaîne TLS et le nom couvert, le SHA de `/health`,
la non-indexation et les trois Golden Journeys avec `E2E_BASE_URL`. La révision
attendue est celle de l’image réellement activée et qualifiée : un ajout de
domaine seul ne change ni l’image ni `APP_REVISION`, même si le checkout a avancé.
Contrôler le couple actif et le comparer au SHA et au digest de la livraison :

```sh
active_revision=$(sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil get deployment site-chaufferie-cil -o jsonpath='{.spec.template.spec.containers[?(@.name=="web")].env[?(@.name=="APP_REVISION")].value}')
active_image=$(sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil get deployment site-chaufferie-cil -o jsonpath='{.spec.template.spec.containers[?(@.name=="web")].image}')
test "$active_image" = "ghcr.io/salete-sincere/site-chaufferie-cil:$active_revision" || exit 1
E2E_BASE_URL=https://stopchaufferiehaubourdin.fr npm run test:e2e
node scripts/observe-health.mjs https://stopchaufferiehaubourdin.fr/health "$active_revision" 180 60
```

Après un changement d’image, vérifier que ce couple correspond au nouveau SHA
qualifié une fois le rollout terminé. Si le domaine est ajouté à une ancienne
image construite avec un autre `SITE_URL`, fournir cette valeur à la suite E2E
pour contrôler ses métadonnées réelles ; la migration des métadonnées exige la
nouvelle image prévue dans cette livraison.

Sur Penthouse, conserver la sandbox et l’exécutable Chromium approuvé selon
le README. Si une observation est déjà active pour la livraison, la réutiliser.
La fenêtre saine doit se situer après la fin du rollout effectif. Vérifier aussi
le staging et les métriques fraîches avant la notification Telegram autorisée.

### Retour arrière limité au domaine

Si l’ajout du domaine échoue, retirer son unique Ingress de service afin de
laisser le staging inchangé :

```sh
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil delete ingress site-chaufferie-cil-public
```

Pour abandonner également une émission en cours, retirer le `Certificate` dédié,
puis contrôler les propriétaires des CertificateRequests, Orders, Challenges et
ressources solveurs restantes. cert-manager doit nettoyer son propre challenge ;
ne pas supprimer d’autres ressources par un sélecteur global. Si le certificat
avait été délivré, le conserver évite une nouvelle émission lors de la reprise.

L’Issuer, le Secret de compte ACME et le Secret TLS peuvent être conservés pour
reprendre sans changer de compte ni de clé. Leur suppression n’est pas nécessaire
au retour arrière du routage. Ne pas supprimer le namespace, le Service, les
middlewares, les ressources staging ou les ClusterIssuers partagés, et ne pas
modifier le DNS OVH pour masquer une erreur applicative.

Si une nouvelle image a également été activée, restaurer séparément son couple
image / `APP_REVISION` connu et reprendre les contrôles selon le guide général.

### Références techniques

- [Configuration HTTP01 et template de solveur cert-manager](https://cert-manager.io/docs/configuration/acme/http01/).
- [Construction des pods, cert-manager v1.19.1](https://github.com/cert-manager/cert-manager/blob/v1.19.1/pkg/issuer/acme/http/pod.go) : le contexte Pod fourni remplace celui par défaut ; conserver `runAsNonRoot` et `seccompProfile` ensemble.
- [Self-check HTTP01, cert-manager v1.19.1](https://github.com/cert-manager/cert-manager/blob/v1.19.1/pkg/issuer/acme/http/http.go).
- [Sémantique des NetworkPolicies Kubernetes](https://kubernetes.io/docs/concepts/services-networking/network-policies/).
