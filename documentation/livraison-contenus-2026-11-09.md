# Livraison — dossier documentaire du 9 novembre 2026

## Summary — 30 secondes

Le dossier est publié sur le [site public](https://stopchaufferiehaubourdin.fr)
et la [préversion](https://chaufferie-cil-staging.saletesincere.fr), au SHA
`d01dcc714defc899e7b69d3092b1a1c858137860` : 51 FAQ, 81 sources et dix compléments.
Les 24 scénarios E2E passent sur chaque domaine, avec 273 secondes finales saines.
Les brefs 502/timeouts de bascule sont consignés au suivi 6. L’image précédente
et son SHA sont conservés pour un rollback conjoint.

## Synthèse — 3 minutes

La [PR 11](https://github.com/salete-sincere/site-chaufferie-cil/pull/11) ajoute
douze FAQ, 54 sources et la page `/informer/complements`. Les anciennes ancres,
les 51 chiffres et les dix points sont préservés. Les tableaux deviennent des
cas lisibles sur mobile ; les rapports de suivi restent accessibles. Les notes
internes sont exclues et les hypothèses, dates et périmètres conservés.

Les deux revues Copilot sont `COMMENTED`, sans défaut de code ouvert, avec une
réserve éditoriale. La lecture ciblée par les agents des originaux S63 à S78
confirme les chiffres sanitaires et les constats industriels datés. Elle conduit
à ajouter le contrôle conforme des biofiltres du CVO de décembre 2025, avec les
compléments documentaires encore demandés. Ce travail ne constitue ni une
validation éditoriale humaine ni un audit exhaustif des 54 nouvelles références.
La publication a été explicitement demandée par le propriétaire.

La CI du SHA livré valide build, types, 14 tests unitaires et 24 scénarios E2E
avant publication de l’image. Les trois Golden Journeys — **Je m’informe**,
**Je milite**, **Je rejoins le comité** — passent ensuite sur les deux domaines :
recherche, filtre, ancres après rechargement, sources, partage et ses replis,
préparation de courriel sans envoi, absence de persistance, mobile, clavier,
lecture sans JavaScript, axe et non-indexation. Les 34 captures sont ouvertes
et relues ; aucune nouvelle régression visuelle n’est constatée.

Seuls l’image et `APP_REVISION` du conteneur `web` changent, avec garde sur la
configuration précédente. Le rollout est confirmé terminé à **16:17:46 UTC**.
Un timeout de deux secondes touche le domaine public ; le staging présente un
502 puis un timeout. Le nouveau pod reste prêt sans redémarrage ; les deux
sondes terminent par **273 secondes continues saines**. Un avertissement de
readiness de l’ancien pod pendant son arrêt coïncide avec ces transitoires,
sans causalité établie ([suivi 6](https://github.com/salete-sincere/site-chaufferie-cil/issues/6)).

TLS et métriques récentes sont conformes, sans alerte active pertinente.
La sonde HTTP permanente reste absente ([suivi 2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2)).
Les métadonnées compilées conservent le domaine staging configuré dans Actions
([suivi 8](https://github.com/salete-sincere/site-chaufferie-cil/issues/8)).
Les capacités navigateur et destinations externes restent simulées dans les E2E ;
aucun courriel réel n’est envoyé. Le bilan Telegram est accepté, lecture non attestée.

## Annexes

### Révision, image et contrôles

| Élément | Résultat |
| --- | --- |
| SHA applicatif livré | `d01dcc714defc899e7b69d3092b1a1c858137860` |
| Image immuable | `ghcr.io/salete-sincere/site-chaufferie-cil:d01dcc714defc899e7b69d3092b1a1c858137860@sha256:56bf29cb492ee72ec5fc88c18c996b6d5d339d60a16a79b202d1dcae537d4bba` |
| Manifest Linux amd64 vérifié dans GHCR | `sha256:0fed910b3861d8fcae7bc3847e1035ec88b0a5170d4b774b09e8282b9e6ca2f4` |
| imageID du pod | `ghcr.io/salete-sincere/site-chaufferie-cil@sha256:56bf29cb492ee72ec5fc88c18c996b6d5d339d60a16a79b202d1dcae537d4bba` |
| Pod actif | `site-chaufferie-cil-8d64d64c8-597nm`, Ready, zéro redémarrage |
| Deployment | Génération 6 convergée, 1/1 disponible |
| CI du SHA livré | 14/14 unitaires, 24/24 E2E en 47,3 s |
| Recette publique | 24/24 en 42.5 s, début `2026-11-09T16:18:03.057Z` |
| Recette staging | 24/24 en 51.5 s, début `2026-11-09T16:19:55.007Z` |
| Contrôle d’exploitation | 16:19:14 UTC, 13 contrôles conformes ; Prometheus âgé de 30 s |
| Observation publique | 593 mesures, 43 anciennes réponses saines, 1 timeout, 273 s finales saines |
| Observation staging | 594 mesures, 44 anciennes réponses saines, 502 + timeout, 273 s finales saines |

Containerd rapporte ici le digest de l’index dans `imageID`. Le nom d’image
attendu est contrôlé dans la spec du pod, et non dans `status.image`, qui peut
contenir un digest de configuration. Le premier rapport du collecteur, faux
négatif sur ce dernier champ, est conservé avec sa correction ; l’application
n’a pas été modifiée pour faire passer ce contrôle.

- [CI finale de PR](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42651672273) :
  tête `3717b1f4982ab747f7f74f8d9643ed64252de89b`, fusion simulée testée
  `53e2404d7eb560aa9b1fca6387cdfd30725303a5`, 24/24 en 59,0 s.
- [CI du SHA livré et publication de l’image](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42652372239).
- Artefacts CI `golden-journeys-<SHA>` : rapports HTML, JSON et captures,
  rétention sept jours ; copies locales conservées avec la livraison.
- [Qualification locale préalable et provenance du Google Doc](qualification-contenus-2026-11-09.md).

### Commandes et périmètre des Golden Journeys

CI : Ubuntu 22.04, Node.js 24, Chromium avec sandbox. Recette réelle :
`game-prod-ovh-gra`, compte `ubuntu`, Node.js 24.22.2, un worker Playwright,
Chromium 1243 avec sandbox. Les deux recettes sont exécutées successivement.

```sh
npm ci --no-audit --no-fund
npm run build
npm run typecheck
npm test
npm run test:e2e

export PATH=/tmp/chaufferie-content-toolchain/node_modules/node/bin:$PATH
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
export SITE_URL=https://chaufferie-cil-staging.saletesincere.fr
E2E_BASE_URL=https://stopchaufferiehaubourdin.fr npm run test:e2e
E2E_BASE_URL=https://chaufferie-cil-staging.saletesincere.fr npm run test:e2e
```

Le build inclut `validate:content`. Les E2E vérifient les URL externes via
interception ; la lecture des originaux est un contrôle distinct. Axe n’est
pas une certification complète. Deux réserves décoratives préexistantes restent
visibles sur l’accueil : unités serrées et cartouche mobile recouvrant une partie
de l’affiche. Les 17 captures du staging sont identiques à celles du domaine public.

Un précontrôle ponctuel via `urllib` a reçu HTTP 403 sur le staging, avant tout
lancement E2E. Le contrôle a été effectué avec le même client Node et les mêmes
en-têtes que l’observateur, puis Chromium a réussi 24/24. Aucun réglage de
protection n’a été changé ; l’origine de ce refus ponctuel n’est pas établie.

### Surveillance, preuves locales et rollback

Deux observateurs commencent avant le patch et s’arrêtent automatiquement après
300 s ; au plus deux requêtes/s/cible, sans chevauchement, timeout 2 s. Ils
exigent HTTP 200, `status=ok` et le SHA exact, distinguent l’ancienne version saine,
et imposent au moins 60 s continues sur la nouvelle. Aucun seuil de trois échecs
consécutifs n’est atteint. Fin de surveillance : 16:22:13 UTC.

Transitoires conservés : public à 16:17:39.852 UTC (timeout 2 002 ms), staging
à 16:17:36.611 UTC (502, 17 ms), puis 16:17:39.096 UTC (timeout 2 002 ms).
Les mesures n’établissent pas une absence absolue d’interruption entre deux sondes.

Preuves hors Git : `/tmp/chaufferie-publication-20261109/` — préflight,
manifestes/digests, patches protégés, logs CI, rapports E2E, 34 captures,
sondes JSONL, rapports d’exploitation et accusé de notification.

Retour arrière exact, à restaurer conjointement :

- Image : `ghcr.io/salete-sincere/site-chaufferie-cil:f784919504433970d530a03fa03d3e55c2646133@sha256:fb772020327c14f38390ff8160c23880173236cf67cf903e543d274b9b31d11e`.
- `APP_REVISION=f784919504433970d530a03fa03d3e55c2646133`.
- Patch préparé : `/tmp/chaufferie-publication-20261109/rollback.json`, avec tests
  du nouveau couple avant remplacement par l’ancien.

Le rollback doit suivre le [guide de déploiement](deploiement.md) : vérifier la
configuration active, restaurer seulement ce couple, attendre le rollout puis
reprendre les Golden Journeys des deux domaines et une nouvelle fenêtre saine.
Aucun rollback n’a été exécuté ; aucune migration ou donnée métier n’est concernée.
