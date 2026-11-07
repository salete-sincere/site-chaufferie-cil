# Hébergement du comité chaufferie

## Summary — 30 secondes

Le site dispose d'une image Next.js autonome et de manifests pour le namespace
`site-chaufferie-cil`, sur le MicroK8s d'infra-sincere. La cible publique est
<https://chaufferie-cil-staging.saletesincere.fr>. Le workflow qualifie les Golden
Journeys puis publie une image GHCR identifiée par le SHA Git complet. L'activation
sur OVH reste une opération explicite. Les prérequis DNS, lecture du registre et
TLS doivent être vérifiés avant d'annoncer le site disponible.

## Synthèse — 3 minutes

Un seul processus Node.js 24 sert les pages et les ressources locales. Aucune base,
collecte de courriels, tâche de fond, sortie réseau applicative ou donnée persistée
n'est nécessaire. Le conteneur s'exécute sans privilège, avec une racine en lecture
seule et un répertoire temporaire borné. Les requêtes sont limitées à `100m` CPU /
`128Mi` mémoire, les plafonds à `500m` / `512Mi`. Un replica supplémentaire permet
un rollout sans retrait préalable du pod sain ; le quota prévoit cette marge.

Traefik, via l'ingressClass `public`, expose uniquement ce Service. Le certificat
utilise le ClusterIssuer existant `letsencrypt-production-cloudflare`. Le nom
« staging » désigne l'environnement du site ; le certificat doit être reconnu par
les navigateurs. Une NetworkPolicy bloque les sorties applicatives et n'autorise
que l'entrée de Traefik. Les accès aux sites sources et à la messagerie partent du
navigateur des visiteurs.

Le header `X-Robots-Tag: noindex, nofollow, noarchive` est posé par l'application et
l'ingress, y compris pour les ressources. Cette consigne ne protège pas l'accès :
le site est public. Aucune identité, clé ou configuration privée ne doit entrer
dans l'image ou dans Git.

Le registre privé nécessite un Secret `site-chaufferie-cil-ghcr` de type
`kubernetes.io/dockerconfigjson` dans le namespace dédié, avec des identifiants
existants autorisés à lire le package. Le manifeste ne contient aucun identifiant.
La publication est faite par le `GITHUB_TOKEN` éphémère du workflow ; aucun jeton
de publication supplémentaire n'est prévu.

Une livraison est vérifiée par l'image effective, les pods, TLS, les trois Golden
Journeys sur le domaine et une fenêtre d'au moins 60 secondes de santé continue.
La sonde bornée en annexe contrôle le statut **et le SHA**, pas seulement HTTP 200.
Les alertes et métriques disponibles ainsi que la notification au propriétaire
suivent le guide infra commun. L'absence de sonde Prometheus pour ce nouveau
service est une limite à déclarer, pas une preuve de bonne santé.

## Annexes

### Qualification et publication

Le workflow `.github/workflows/ci.yml` exécute :

```sh
npm ci --no-audit --no-fund
npm run build
npm run typecheck
npm test
npm run test:e2e
```

Il installe Chromium pour Playwright et joint les rapports au SHA testé. La
publication GHCR intervient après ces validations sur `main`. Une pull request ne
publie ni ne déploie. Les tags d'image sont les SHA Git complets : aucun `latest`.
Une modification du contenu testé exige une nouvelle qualification. La publication
de l'image ne prouve pas son activation sur OVH.

Le build local équivalent est :

```sh
release_commit=$(git rev-parse HEAD)
sudo -n docker build \
  --build-arg REVISION="$release_commit" \
  --build-arg SOURCE=https://github.com/salete-sincere/site-chaufferie-cil \
  --tag "ghcr.io/salete-sincere/site-chaufferie-cil:$release_commit" .
```

Vérifier un checkout propre, le SHA et la provenance du package avant publication.
Le dépôt GitHub est public, à la demande du propriétaire. La visibilité du package
GHCR reste indépendante ; son accès de lecture est vérifié avant activation.
Ne pas changer sa visibilité pour masquer une erreur d'authentification.

### Première installation

1. Vérifier l'identité `game-prod-ovh-gra`, le contexte `microk8s`, la capacité, le
   RAID, les événements récents et les alertes pertinentes. Lire le [guide commun
   de livraison](/home/ubuntu/source/infra-sincere/documentation/deploiement-surveillance-notifications.md)
   depuis la révision infra actuellement applicable.
2. Vérifier le record Cloudflare dédié : `A`, nom
   `chaufferie-cil-staging.saletesincere.fr`, origine `141.94.98.109`, TTL automatique,
   proxy activé comme pour le staging existant. Créer uniquement ce record s'il
   est absent ; ne pas changer la zone ou les enregistrements existants.
3. Créer le namespace à partir de `k8s/namespace.yaml`, puis provisionner le seul
   Secret de lecture GHCR de cette application. Réutiliser un accès de lecture
   autorisé ; ne jamais imprimer ni conserver sa valeur dans Git ou une commande
   partagée. La création du certificat par cert-manager ne requiert pas de recopier
   le jeton DNS dans ce namespace.
4. Générer les manifests pour le SHA réellement qualifié, puis examiner le rendu :

```sh
release_commit=$(git rev-parse HEAD)
node scripts/render-manifests.mjs "$release_commit" salete-sincere > /tmp/chaufferie-release.yaml
sudo -n /snap/bin/microk8s kubectl apply --dry-run=server -f /tmp/chaufferie-release.yaml
sudo -n /snap/bin/microk8s kubectl diff -f /tmp/chaufferie-release.yaml
```

`kubectl diff` retourne `1` lorsque des changements sont proposés. Le renderer ne
modifie ni le cluster ni les sources. Il refuse un SHA incomplet ; appliquer
directement `k8s/app.yaml` laisserait un marqueur d'image non publiable.

5. Avant activation, démarrer la surveillance bornée. Appliquer le rendu examiné :

```sh
sudo -n /snap/bin/microk8s kubectl apply -f /tmp/chaufferie-release.yaml
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil rollout status deployment/site-chaufferie-cil --timeout=180s
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil wait --for=condition=Ready certificate/site-chaufferie-cil-staging --timeout=180s
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil get pods -o wide
sudo -n /snap/bin/microk8s kubectl -n site-chaufferie-cil get deployment/site-chaufferie-cil -o jsonpath='{.spec.template.spec.containers[0].image}'
```

Contrôler aussi le digest `imageID` du pod, les réponses de toutes les routes,
les en-têtes de non-indexation et l'absence d'écriture/runtime cache sur la racine
du conteneur. Conserver la preuve des résultats, limites et éventuelles erreurs.

Le CDN peut modifier le HTML après le serveur : le repli contact sans JavaScript
doit donc être testé sur le domaine. Les liens de courriel publics sont encadrés
par les commentaires `email_off` [documentés par Cloudflare](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/).
Seuls ces commentaires constants sont insérés en HTML brut ; les adresses, textes
et messages restent rendus et échappés par React. Aucun réglage global de zone
n'est modifié pour cette exception locale.

### Provisionnement des accès

`scripts/provision-access.py` prépare uniquement le nom DNS et le Secret GHCR
décrits dans ce document. Par défaut, il effectue des vérifications en lecture
seule ; `--apply` déclenche la création. Il refuse de remplacer un enregistrement
DNS différent ou un Secret existant, vérifie hôte/compte/contexte et n'écrit aucun
identifiant dans les arguments, fichiers temporaires ou sorties.

```sh
python3 scripts/provision-access.py dns
python3 scripts/provision-access.py dns --apply
python3 scripts/provision-access.py registry "$release_commit"
python3 scripts/provision-access.py registry "$release_commit" --apply
```

Le DNS réutilise le jeton Cloudflare de cert-manager uniquement en mémoire et
uniquement auprès de l'API Cloudflare, pour ce record. Le registre utilise l'accès
`gh` local après confirmation de `read:packages` et absence de `write:packages` ou
`delete:packages`. Il vérifie le pull et le digest du SHA effectivement publié
avant la création. L'image doit donc déjà exister, ainsi que le namespace.

Cette identité OAuth possède également les scopes GitHub existants `repo`,
`gist` et `read:org` : son usage GHCR est en lecture, mais le jeton n'est pas un
identifiant globalement limité à ce seul site. Aucun droit supplémentaire n'est
créé ; l'application n'a pas de token de service Kubernetes ni de sortie réseau.
Les identifiants d'autres applications ne sont pas copiés : leurs scopes de
lecture n'ont pas été attestés. Une rotation ultérieure relève de la gestion des
identifiants, sans remplacement automatique par ce script.

### Surveillance bornée

Depuis une session de terminal contrôlable, avant le rollout :

```sh
node scripts/observe-health.mjs \
  https://chaufferie-cil-staging.saletesincere.fr/health \
  "$release_commit" 180 60 > /tmp/chaufferie-health.jsonl
```

Cette commande réalise au plus deux requêtes par seconde, sans chevauchement,
avec un timeout de deux secondes et une durée maximale de dix minutes. Les
arguments finaux sont la durée totale et la fenêtre saine minimale. Choisir une
durée qui couvre le rollout et les 60 secondes suivantes. Une première installation
peut naturellement produire des échecs avant exposition ; ils restent consignés.

Le contrat attendu est `{ "status": "ok", "revision": "<SHA attendu>" }`.
Le rapport ne contient aucun corps de réponse. Après trois échecs consécutifs,
la commande rappelle d'envoyer une seule alerte via le relais Telegram existant ;
elle n'envoie aucun message elle-même. Un arrêt anticipé, une fenêtre saine trop
courte ou une mauvaise révision produit un code de sortie non nul. Les erreurs
antérieures restent dans le bilan même après rétablissement.

Consulter les métriques et alertes récentes de l'hôte/namespace selon le guide
infra. Pour ce nouveau service, ne pas modifier globalement la collecte ou ajouter
une sonde permanente sans décision explicite. Consigner toute couverture absente.
Après toutes les validations, envoyer le bilan avec URL, SHA, heure, résultat du
rollout et durée observée via le relais autorisé. Ne pas démarrer de second poller.

### Mise à jour et retour arrière

Pour une mise à jour, mémoriser l'image et le SHA actuellement actifs avant de
changer uniquement ceux de `web`. Activer une image déjà publiée et qualifiée ;
éviter de réappliquer un manifeste d'amorçage contenant un ancien tag.

En cas d'échec, réactiver l'image immuable précédente **et** sa valeur
`APP_REVISION`, attendre le rollout puis reprendre les Golden Journeys et une
fenêtre saine. La révision précédente du Deployment conserve ce couple ; vérifier
sa valeur avant un éventuel `rollout undo`. La première installation n'a aucune
version antérieure à restaurer. Ne supprimer ni ressource ni secret partagé pour
masquer son échec. Aucune migration ou restauration de données n'est nécessaire.
