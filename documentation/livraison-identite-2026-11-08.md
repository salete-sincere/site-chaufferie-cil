# Livraison — nom complet et présentation du groupe municipal

## Summary — 30 secondes

La correction est déployée sur la [préversion](https://chaufferie-cil-staging.saletesincere.fr)
au SHA `f784919504433970d530a03fa03d3e55c2646133`. Haubourdin Alternative Citoyenne
est écrit en toutes lettres et présenté comme groupe d’opposition au conseil
municipal d’Haubourdin, distinct du comité en constitution. Les 22 scénarios E2E
passent en CI et sur le domaine. Un HTTP 502 et un timeout transitoires sont
conservés dans le suivi de bascule ; les contrôles après rétablissement sont conformes.

## Synthèse — 3 minutes

La [PR 10](https://github.com/salete-sincere/site-chaufferie-cil/pull/10) développe
le nom dans les pages, références, textes à partager, métadonnées et libellés
accessibles. L’accueil, le pied de page et les publications précisent le rôle
municipal. Le communiqué garde ses propos et sa date ; une note indique le
développement du nom. Les IDs, ancres et destinations restent stables.

Le candidat reprend les améliorations de la FAQ et la préparation du domaine
public déjà fusionnées. Seul le service staging existant est mis à jour. La
variable Actions `SITE_URL` transmet son adresse à la qualification et au build
Docker ; les métadonnées de partage correspondent donc au domaine actif. Aucun
nouveau DNS, Ingress ou certificat n’est activé.

La revue Copilot du 8 novembre à 17:05:23 UTC sur `f8e1e5a` recommande
l’approbation sans remarque ouverte (état `COMMENTED`). La
[CI du SHA livré](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42503321580)
valide les contenus, le build, les types, 12 tests unitaires et **22 scénarios E2E**
avant publication. La recette HTTPS réelle passe **22/22**, sans test ignoré,
instable ou en échec. Les 13 captures finales sont inspectées : nom complet et
titre mobile lisibles, sans nouveau débordement. Deux réserves décoratives de
l’accueil sont préexistantes : unités des grands chiffres serrées et cartouche
jaune recouvrant une partie de la phrase finale de l’affiche sur mobile.

Le rollout se termine à **17:11:25 UTC**. Seuls l’image et `APP_REVISION` changent,
avec garde préalable sur la version précédente et digest immuable. Le nouveau
pod est prêt sans redémarrage. La sonde commencée avant la bascule distingue
23 réponses normales de l’ancienne révision, un HTTP 502 à 17:11:25.595, puis un
timeout de 2 002 ms à 17:11:28.077. Le service rétabli présente ensuite
163 secondes finales continues de réponses conformes. La readiness de l’ancien pod en
arrêt échoue au même instant ; aucune causalité n’est établie. Cette récurrence
reste rattachée au [suivi 6](https://github.com/salete-sincere/site-chaufferie-cil/issues/6).

Les métriques postérieures au rollout sont fraîches, le replica disponible et
aucune nouvelle alerte n’apparaît. La sonde HTTP permanente reste absente
([suivi 2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2)). Les
destinations externes et certaines capacités navigateur sont simulées dans les
E2E ; aucun courriel réel n’est envoyé. Ces contrôles ne certifient pas toutes
les messageries ni l’accessibilité complète.
Le bilan a été accepté par le relais Telegram du propriétaire ; sa lecture n’est
pas attestée.

## Annexes

### Révision et preuves

| Élément | Résultat |
| --- | --- |
| SHA livré | `f784919504433970d530a03fa03d3e55c2646133` |
| Image | `ghcr.io/salete-sincere/site-chaufferie-cil:f784919504433970d530a03fa03d3e55c2646133` |
| Digest index publié, épinglé et actif | `sha256:fb772020327c14f38390ff8160c23880173236cf67cf903e543d274b9b31d11e` |
| Manifest linux/amd64 | `sha256:4bce34b4af8e1bfc6524180a5de7be73c0df63fb53cd543303ceaa00dffd203b` |
| Pod | `site-chaufferie-cil-5c67466bbd-ct8l5`, prêt, zéro redémarrage |
| CI du SHA final | 22/22 ; début 17:08:07.342 UTC ; durée 24,651 s |
| Recette du domaine | 22/22 ; début 17:11:46.008 UTC ; durée 27,904 s |
| Prometheus postcontrôle | 17:12:13 UTC ; replica disponible 1, échantillon âgé de 9,6 s |
| Observation bornée | 353 mesures, 23 réponses de l’ancienne version, 2 erreurs transitoires, 163 secondes finales saines |
| Retour arrière | Image et `APP_REVISION` `5367d95d5a5d1001f58058ebb6dc54e201d7f933` |

La CI de PR utilise la fusion simulée `8fd529e2304bfbbdee6f1e8a3f9873c83e49aad3`
pour la tête `f8e1e5a3b380a196e65e2005f9719f487e737302` :
[run 42502962773](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42502962773).
La CI de publication requalifie ensuite le SHA fusionné effectivement livré.

Environnement local et recette : Node.js 24.22.2, Playwright 1.65.0, Chromium
approuvé avec sandbox, un worker. La CI utilise Node.js 24 et Ubuntu 22.04.

```sh
export PATH=/tmp/chaufferie-domain-toolchain/node_modules/node/bin:$PATH
export SITE_URL=https://chaufferie-cil-staging.saletesincere.fr
npm run build
npm run typecheck
npm test
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:e2e
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:e2e:staging
git diff --check
```

Les trois Golden Journeys couvrent s’informer, militer et rejoindre, avec les
erreurs/replis, la non-persistance, le clavier, le mobile, la lecture sans
JavaScript, axe, Open Graph et la non-indexation. Les artefacts CI sont rattachés
au SHA dans chaque run. Les preuves locales restent hors Git sous
`test-results/delivery-nom-complet-20261108/` : rapports, captures, logs,
préflight/postflight, digests et patches protégés d’activation/retour arrière.

L’observateur borné reprend celui du projet avec les seuls champs additionnels
`receivedRevision` et `healthStatusOk` pour distinguer l’ancienne version saine
d’une erreur HTTP. Cadence maximale 500 ms sans chevauchement, timeout 2 s,
durée 180 s et minimum final sain 60 s. Le journal conserve les échecs ; le
compteur brut inclut aussi les 23 réponses de l’ancienne version avant bascule.
Le retour arrière restaure ensemble l’image et sa révision, puis impose une
nouvelle recette et une fenêtre saine selon le [guide](deploiement.md).
