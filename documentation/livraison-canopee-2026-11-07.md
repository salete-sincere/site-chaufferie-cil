# Livraison Canopée et panorama français — 7 novembre 2026

## Summary — 30 secondes

Le [dossier actualisé](https://chaufferie-cil-staging.saletesincere.fr/informer#ailleurs-en-france)
est livré au SHA `5367d95d5a5d1001f58058ebb6dc54e201d7f933` : 39 FAQ,
51 repères et 27 sources. Douze tests unitaires et 20 Golden Journeys passent
en CI ; les 20 scénarios passent aussi sur le domaine. Image, TLS et 108 secondes
finales de santé continue sont vérifiés. Un HTTP 502 et un timeout pendant la
bascule sont conservés dans le suivi 6.

## Synthèse — 3 minutes

Les ajouts du Google Doc sont intégrés aux contenus Markdown, en préservant les
anciens identifiants. Le bloc « Ailleurs en France » donne accès aux comparaisons
avec Surville et Sully, aux enquêtes de Canopée et aux décisions concernant les
projets lyonnais. Les chiffres affichés dans les pages et les textes à copier
suivent les collections actualisées.

Les enquêtes de Canopée sont attribuées, avec les contestations et limites du
document : elles n’établissent pas l’origine de l’approvisionnement d’Haubourdin
ou de Sully. Les 63 MW utiles, les 60 MW PCI et la récupération des fumées restent
distincts. Le recours prévu au fioul est précisé sans supposer un fonctionnement
permanent. L’avis défavorable de Saint-Genis-Laval est distingué de l’autorisation
préfectorale ultérieure.

Les dix nouvelles URL ont répondu HTTP 200. Une erreur bibliographique a été
corrigée explicitement : S19 est un dossier de Saint-Priest de janvier 2025,
dont § 1.2.2, p. 9 décrit les trois chaudières biomasse de Surville, soit 51 MW
utiles. Le Google Doc n’a pas été modifié. Les 39 réponses et leurs citations ont
été comparées à l’annexe ; neuf nouvelles descriptions de source sont fidèles,
la dixième porte cette correction vérifiée sur le PDF primaire.

La [CI du SHA livré](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42397394057)
a validé contenu, build, types, 12 tests unitaires et 20 scénarios navigateur avant
publication de l’image. La recette du domaine a réussi **20/20**, sans échec,
test ignoré ou instable. Six captures desktop/mobile ont été inspectées, sans
défaut constaté. Le contrôle console de trois pages n’a relevé aucune erreur.

Le rollout s’est terminé à **17:43:22 UTC**, soit 18:43:22 Europe/Paris. Seuls
l’image et `APP_REVISION` du Deployment ont changé. Le pod est prêt sans
redémarrage et son digest correspond à la CI. L’observation commencée avant
activation conserve 15 réponses de l’ancienne révision, un HTTP 502 et un timeout
de 2 secondes pendant la transition, puis **108 secondes finales saines**.
Aucune cause n’est démontrée ; la récurrence est rattachée au
[suivi 6](https://github.com/salete-sincere/site-chaufferie-cil/issues/6).

Les métriques récentes du nœud et du replica sont conformes, sans alerte ciblée.
La sonde HTTP permanente reste absente ([suivi 2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2))
et les fichiers graphiques d’Haubourdin Alternative Citoyenne restent attendus ([suivi 1](https://github.com/salete-sincere/site-chaufferie-cil/issues/1)).
Les tests interceptent les destinations externes après contrôle des URL et
simulent certaines capacités du navigateur. Aucun courriel réel n’est envoyé.
Le bilan Telegram a été accepté ; sa lecture n’est pas attestée.

## Annexes

### Révision et preuves

| Élément | Résultat |
| --- | --- |
| SHA applicatif testé et livré | `5367d95d5a5d1001f58058ebb6dc54e201d7f933` |
| Image | `ghcr.io/salete-sincere/site-chaufferie-cil:5367d95d5a5d1001f58058ebb6dc54e201d7f933` |
| Digest publié et actif | `sha256:0c2aabbf428ddefebe5a9f38151ab2163c0ad61b635f1b8821bdb853bd4fcf5c` |
| Pod qualifié | `site-chaufferie-cil-5b67f6cfd8-gvtgv`, 1/1, zéro redémarrage |
| CI E2E | 20 réussites ; début 17:40:54.611 UTC ; durée 37,995 s |
| Staging E2E | 20 réussites ; début 17:43:45.141 UTC ; durée 28,090 s |
| Contrôle console | 17:44:34.832–17:44:37.250 UTC ; trois pages, zéro erreur console/hydratation |
| Environnement CI | Node.js 24, Ubuntu 22.04, Playwright 1.65.0, Chromium avec sandbox |
| Environnement staging | Node.js 24.22.2, Playwright 1.65.0, Chromium 153.0.8010.12 avec sandbox, un worker |
| Vues inspectées | Panorama, Canopée, puissances ; desktop 1440 px et mobile 390 px |
| Ressources observées | 11m CPU / 42Mi ; mesure ponctuelle, sans test de charge |
| Prometheus | Postcontrôle 17:43:47 UTC ; séries âgées de 21,35 s, collecte Kubernetes postérieure au rollout, targets infra UP |

Commandes reproductibles exécutées :

```sh
npm run validate:content
npm test
npm run build
npm run typecheck
npm run test:e2e
npm run test:e2e:staging
git diff --check
```

Commande exacte de recette sur le domaine :

```sh
PATH=/tmp/chaufferie-toolchain/node_modules/node/bin:$PATH \
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:e2e:staging
```

Les Golden Journeys couvrent les trois parcours existants, la recherche Canopée,
les précautions éditoriales, les nouveaux chiffres et sources, les anciens liens
directs, la copie des textes actualisés, les replis du contact, le clavier, le
mobile, la lecture sans JavaScript, axe sur les huit routes, la page 404 et la
non-indexation. Les simulations ne prouvent pas la compatibilité de toutes les
messageries et l’analyse axe ne constitue pas une certification d’accessibilité.

Les deux nouveaux scénarios ont échoué sur l’ancien build, puis les 20 ont réussi
sur le build actualisé. Le premier passage complet avait trouvé un sélecteur de
test trop large pour un lien présent dans le résumé et dans le panorama ; il a
été ciblé avant une nouvelle exécution complète.

### Observation et limites

```sh
node scripts/observe-health.mjs \
  https://chaufferie-cil-staging.saletesincere.fr/health \
  5367d95d5a5d1001f58058ebb6dc54e201d7f933 120 60
```

234 requêtes entre 17:43:15.263 et 17:45:13.145 UTC : 15 réponses HTTP 200 de
l’ancienne révision, un HTTP 502 à 17:43:22.651, un timeout de 2 002 ms à
17:43:25.135 et 217 réponses conformes. Premier nouveau SHA valide à
17:43:25.189. Résumé final à 17:45:13.627 : `passed=true`, 108 secondes saines.
Réponses conformes : p95 de 29 ms, maximum de 59 ms. Les événements Kubernetes
normaux et l’absence d’erreur applicative ne suffisent pas à expliquer les
transitoires ; aucune absence absolue de coupure n’est revendiquée.

Un client Python avec son User-Agent par défaut reçoit un refus Cloudflare ;
la sonde documentée, curl et les parcours Chromium répondent correctement.
Cette différence de client est conservée dans le précontrôle. Une alerte
informative préexistante d’un autre namespace est distincte de cette livraison ;
aucune modification de service voisin n’a été effectuée.

### Conservation et retour arrière

L’artefact CI `golden-journeys-5367d95d5a5d1001f58058ebb6dc54e201d7f933` est disponible
sur le workflow pendant sept jours. Une copie des rapports CI et staging, captures,
relevés, sonde et notifications est conservée hors Git dans
`test-results/delivery-canopee-20261107/` du dépôt durable
`/home/ubuntu/source/site-chaufferie-cil`. Les preuves locales et la revue des
sources primaires restent dans `test-results/canopee-local-20261107/`.
Les empreintes accompagnent les deux ensembles.

Le retour arrière restaure ensemble l’image
`ghcr.io/salete-sincere/site-chaufferie-cil:c9aeea29e9bd9551f7aaa734041df0291b5575e8`
et `APP_REVISION=c9aeea29e9bd9551f7aaa734041df0291b5575e8`, puis reprend les contrôles
du [guide](deploiement.md). Aucune donnée métier n’est à migrer.

Le [suivi 7](https://github.com/salete-sincere/site-chaufferie-cil/issues/7) porte
cette mise à jour. Le présent rapport et son lien README sont documentaires ;
aucun contenu applicatif n’a changé après qualification du SHA livré.
