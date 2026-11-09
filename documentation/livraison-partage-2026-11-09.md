# Livraison — aperçus de partage du 9 novembre 2026

## Summary — 30 secondes

La révision `cbefb664e5e67e31cdbe55049e0c7d2281fde23b` est déployée : les neuf
pages annoncent leurs URL publiques et une image PNG datée, avec cartes Open
Graph et Twitter complètes. La CI valide 14 tests unitaires ; les 29 scénarios
E2E passent sur chaque domaine. Après un timeout par domaine, les sondes
terminent par 147 et 148 secondes continues saines. La non-indexation est
conservée. Les essais HTTP ne certifient pas les caches ou réglages des messageries.

## Synthèse — 3 minutes

La [PR 12](https://github.com/salete-sincere/site-chaufferie-cil/pull/12) corrige
une image encore annoncée sur le staging et l’absence de canonical et `og:url`.
Les balises OG et Twitter existaient déjà dans le HTML ; le diagnostic ne
démontrait pas un refus des robots réels. Le workflow versionne désormais
`SITE_URL=https://stopchaufferiehaubourdin.fr`, et la variable de dépôt est alignée.
Chaque page fournit son titre, sa description, son URL et une carte complète.
Le staging reste accessible avec les mêmes URL canoniques publiques ; la
non-indexation est conservée.

Le nouveau visuel de 1200 × 630 pixels pèse **65 791 octets**. Son adresse
publique est [partage-20261109.png](https://stopchaufferiehaubourdin.fr/partage-20261109.png).
Les anciens alias restent valides. Les contours Open Sans locaux garantissent
une génération indépendante des polices système ; le visuel et sa vignette
ont été relus, et les quatre fichiers reproduits à l’identique.

La revue Copilot du 9 novembre à 16:49:38 UTC recommande l’approbation, sans
remarque ouverte, avec l’état GitHub **COMMENTED**, sur `992afbdb5494076d17957fc9bfacad355039db7a`.
Le diff et l’héritage des métadonnées ont aussi été relus indépendamment.
La CI de PR passe 29/29 E2E en 50,5 s ; celle du SHA livré passe 14/14 unitaires
et 29/29 E2E en 58,98 s avant publication de l’image immuable.

Les trois Golden Journeys — **Je m’informe**, **Je milite**, **Je rejoins le
comité** — conservent leurs contrôles de recherche, sources, partage et replis,
préparation de courriel sans envoi, absence de persistance, mobile, clavier,
sans JavaScript et accessibilité automatisée. Cinq profils HTTP supplémentaires
(Facebook, WhatsApp, Signal, Telegram et Twitter) lisent chacun les neuf cartes
dans le HTML brut, puis récupèrent le PNG annoncé. En recette externe, l’URL
absolue de l’image est réellement suivie. La recette publique passe 29/29 en
44,5 s et celle du staging en 52,6 s. Les 34 captures des deux domaines sont
ouvertes et relues, identiques à la qualification locale.

Seuls l’image et `APP_REVISION` du conteneur `web` changent dans le Deployment,
avec vérification préalable du couple précédent. Le rollout se termine à
16:56:19 UTC ; le contrôle d’exploitation de 16:56:51 UTC est favorable sur
13 critères. Un timeout touche chaque domaine après la bascule, sans 502 ;
les sondes terminent par 147 s saines sur le public et 148 s sur le staging,
sans atteindre le seuil de trois échecs consécutifs. La sonde HTTP permanente reste absente
([suivi 2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2)). Le bilan
Telegram final est accepté par le relais ; sa lecture n’est pas attestée.

Les profils HTTP simulent des requêtes, sans reproduire les applications ni
leurs réseaux. Une nouvelle URL d’image ne purge pas les aperçus déjà mémorisés ;
les caches et réglages de prévisualisation peuvent différer. Aucun message ni
courriel réel n’est envoyé par la qualification.

## Annexes

### Révision, image et preuves CI

| Élément | Résultat |
| --- | --- |
| SHA applicatif livré | `cbefb664e5e67e31cdbe55049e0c7d2281fde23b` |
| Image immuable | `ghcr.io/salete-sincere/site-chaufferie-cil:cbefb664e5e67e31cdbe55049e0c7d2281fde23b@sha256:9c161c55eb360e1ed5cfe428e9752b11f82d37951a838bce730dad5504001202` |
| Manifest Linux amd64 vérifié dans GHCR | `sha256:ab46bbd8b992fdcfbf4fb768f923d138c454082d025e576ff802bb7364982102` |
| imageID du pod | `ghcr.io/salete-sincere/site-chaufferie-cil@sha256:9c161c55eb360e1ed5cfe428e9752b11f82d37951a838bce730dad5504001202` |
| Pod actif | `site-chaufferie-cil-6c697bd7f7-58xsp`, Ready, zéro redémarrage au contrôle de 16:56:51 UTC |
| Deployment | Génération 7 convergée, 1/1 disponible |
| CI de PR | Fusion simulée `8e6a391f756c12c90ce44db49041f03db902a8d1`, 29/29 E2E en 50,5 s |
| CI du SHA livré | 14/14 unitaires, 29/29 E2E en 58,98 s |
| Recette publique | 29/29 en 44,5 s, début `2026-11-09T16:56:47.903Z` |
| Recette staging | 29/29 en 52,6 s, début `2026-11-09T16:57:45.467Z` |
| Observation publique | 353 mesures, 54 anciennes réponses saines, 1 timeout, 147 s finales saines |
| Observation staging | 354 mesures, 56 anciennes réponses saines, 1 timeout, 148 s finales saines |
| Contrôle d’exploitation | 16:56:51 UTC, 13/13 critères conformes ; métrique Prometheus âgée de 6,70 s |

- [CI finale de PR](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42658197041) :
  tête `992afbdb5494076d17957fc9bfacad355039db7a`, fusion simulée indiquée ci-dessus.
- [CI du SHA livré et publication de l’image](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42658836042).
- [Revue Copilot](https://github.com/salete-sincere/site-chaufferie-cil/pull/12#pullrequestreview-5829355136) :
  recommandation favorable, sans la présenter comme une review GitHub `APPROVED`.
- Artefacts `golden-journeys-<SHA>` : rapports HTML, JSON et captures,
  rétention CI de sept jours ; copies locales conservées avec la livraison.
- [Qualification préalable](qualification-partage-2026-11-09.md) : diagnostic,
  RED contre l’ancienne production, GREEN local et contrat des images.

Containerd rapporte le digest de l’index OCI dans `imageID`. Le nom d’image
est contrôlé dans la spec du pod ; le champ runtime `image` contient séparément
le digest de configuration. Les labels OCI et le manifest amd64 ont été vérifiés
dans GHCR avant activation.

### Commandes et périmètre des Golden Journeys

CI : Ubuntu 22.04, Node.js 24, Chromium avec sandbox. Recette réelle :
`game-prod-ovh-gra`, compte `ubuntu`, Node.js 24.22.2, Chromium 1243 avec sandbox,
un worker Playwright. Les recettes des deux domaines sont successives.

```sh
npm ci --no-audit --no-fund
npm run build
npm run typecheck
npm test
npm run test:e2e

export PATH=/tmp/chaufferie-content-toolchain/node_modules/node/bin:$PATH
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
export SITE_URL=https://stopchaufferiehaubourdin.fr
E2E_BASE_URL=https://stopchaufferiehaubourdin.fr npm run test:e2e
E2E_BASE_URL=https://chaufferie-cil-staging.saletesincere.fr npm run test:e2e
```

Le build inclut la validation du contenu et la génération des images. Avant
chaque recette, le lanceur vérifie le SHA du checkout et le SHA renvoyé par
`/health`. Les cinq profils vérifient statut HTTP, cartes dans le `head`,
canonical, `og:url`, titres distincts, descriptions, image HTTPS, type MIME,
signature PNG, dimensions et poids. Le slash final de l’accueil est normalisé
avant comparaison, conformément au HTML rendu par Next.js.

Les permissions de partage, le presse-papiers et les destinations externes des
autres scénarios sont simulés. Axe ne constitue pas une certification complète
d’accessibilité. Les tests ne connectent aucun compte de messagerie et ne
prouvent pas l’affichage d’un aperçu dans une conversation réelle.

### Image, surveillance et preuves locales

Le PNG annoncé possède le SHA-256
`e94c465ac97db104a4885e61e23898c49cd24e56aec4729a414f69d22edc07b6`.
Le générateur produit `partage-20261109.png`, `partage-20261109.svg` et leurs
alias `partage.png`, `partage.svg`. Aucun appel externe n’est nécessaire au runtime.
À 16:58:42 UTC, le PNG récupéré à l’URL annoncée dans le HTML public répond
HTTP 200, `image/png`, avec le même poids et le même SHA-256 ; ses octets sont
identiques au visuel qualifié. L’image livrée a également été ouverte et relue.

Deux observateurs ciblés commencent avant la bascule, pour 180 secondes au
maximum, à deux requêtes/s/cible au plus, sans chevauchement et avec timeout
de deux secondes. Ils distinguent l’ancienne révision saine de la nouvelle,
exigent HTTP 200, `status=ok`, le SHA attendu et au moins 60 secondes continues
saines après activation. Les premières mesures datent de 16:55:52 UTC pour le
staging et de 16:55:53 UTC pour le public. Les résumés finaux, à 16:58:50 et
16:58:51 UTC, valident ce seuil, sans interruption des observateurs.

Deux transitoires sont conservés : timeout staging de 2 003 ms à
16:56:22.173 UTC et timeout public de 2 002 ms à 16:56:23.047 UTC. Aucun HTTP 502
n’est observé et le seuil de trois échecs consécutifs n’est pas atteint.
Les réponses suivantes retrouvent le SHA attendu ; aucune causalité précise
n’est établie pour ces délais. Les mesures ne prouvent pas l’absence absolue
d’interruption entre deux sondes. Ces transitoires relèvent du
[suivi de bascule existant](https://github.com/salete-sincere/site-chaufferie-cil/issues/6).

Le contrôle d’exploitation confirme TLS 1.3 sur les deux domaines, les
certificats attendus, le pod prêt sans redémarrage et des métriques Prometheus
récentes. La seule alerte globale active est Watchdog ; aucune alerte pertinente
sur le namespace ou l’hôte n’est relevée. L’absence de sonde HTTP permanente
reste distincte de ces observations bornées.

Preuves hors Git : `/tmp/chaufferie-og-20261109/` contient diagnostic, RED,
qualification locale, revue Copilot et artefacts CI. Son sous-dossier `release/`
contient préflight, index/manifests GHCR, patches protégés, rollout, recettes
des domaines, 34 captures, sondes JSONL, contrôles d’exploitation, preuve
`partage-live.json` et accusé de notification `notification-final.json`. Les vérifications HTTPS
ponctuelles restent distinctes de la fenêtre continue et des Golden Journeys.

### Retour arrière

Le couple précédent est à restaurer conjointement :

- Image : `ghcr.io/salete-sincere/site-chaufferie-cil:d01dcc714defc899e7b69d3092b1a1c858137860@sha256:56bf29cb492ee72ec5fc88c18c996b6d5d339d60a16a79b202d1dcae537d4bba`.
- `APP_REVISION=d01dcc714defc899e7b69d3092b1a1c858137860`.
- Patch : `/tmp/chaufferie-og-20261109/release/rollback.json`, avec tests du
  nouveau couple avant remplacement par l’ancien.

Suivre le [guide de déploiement](deploiement.md) : contrôler l’état actif,
restaurer seulement ce couple, attendre le rollout, puis reprendre les Golden
Journeys et une nouvelle fenêtre saine sur les deux domaines. Ce rollback
rétablirait aussi les anciennes métadonnées et l’image annoncée sur le staging.
Aucun rollback n’a été exécuté ; aucune migration ou donnée métier n’est concernée.
