# Livraison des publications d’Haubourdin Alternative Citoyenne — 7 novembre 2026

## Summary — 30 secondes

Le [communiqué intégral](https://chaufferie-cil-staging.saletesincere.fr/communique-de-presse)
et la page Facebook officielle sont accessibles depuis l’accueil, « Je milite »
et le pied de page. La révision `c9aeea29e9bd9551f7aaa734041df0291b5575e8` est
déployée : 12 tests unitaires, 18 Golden Journeys en CI et 18 sur le domaine
réussissent. Image, TLS et 82 secondes finales de santé continue sont vérifiés.
Un timeout isolé pendant la bascule reste à expliquer.

## Synthèse — 3 minutes

Les neuf paragraphes du communiqué d’Haubourdin Alternative Citoyenne du
6 novembre 2026 sont conservés dans `content/press-release.md`, avec auteur,
date et provenance. Ils ont été comparés intégralement au document d’Haubourdin
Alternative Citoyenne.
La nouvelle page est lisible sans JavaScript ; son contact reste accessible
derrière Cloudflare. La page des sources renvoie aussi vers le communiqué.
L’URL Facebook a été confirmée depuis le Linktree public d’Haubourdin Alternative
Citoyenne ; le site propose un lien externe, sans intégrer de contenu ou de traceur
Facebook.

La [CI de cette révision](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42387190153)
a validé le contenu, le build, les types, les 12 tests unitaires et les
18 scénarios navigateur avant publication de l’image GHCR. La recette réelle
du domaine a obtenu **18/18**, sans échec, test ignoré ou instable. Six captures
ordinateur/mobile ont été inspectées ; aucun débordement, chevauchement ou
problème de lisibilité n’a été relevé. Le contrôle complémentaire n’a trouvé
aucune erreur console ou d’hydratation.

Le rollout s’est terminé le **7 novembre à 15:40:31 UTC**, soit 16:40:31
Europe/Paris. Seuls l’image et `APP_REVISION` du Deployment dédié ont changé.
Le pod est prêt, sans redémarrage, au digest publié. La sonde bornée, commencée
avant activation, a relevé 66 réponses HTTP 200 de l’ancienne révision, puis un
timeout isolé de 2 secondes après bascule, puis **82 secondes finales saines**.
La proximité avec le retrait de l’ancien pod ne démontre pas la cause du timeout.
Le [suivi 6](https://github.com/salete-sincere/site-chaufferie-cil/issues/6)
conserve cette question ; aucune absence absolue de coupure n’est revendiquée.

Les métriques récentes du nœud et du replica sont conformes, sans alerte ciblée.
La sonde HTTP permanente propre au site reste absente
([suivi 2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2)).
Les fichiers graphiques d’Haubourdin Alternative Citoyenne et les exports Canva
restent attendus
([suivi 1](https://github.com/salete-sincere/site-chaufferie-cil/issues/1)).
Les destinations externes sont interceptées après contrôle de leur URL dans les
tests ; leur disponibilité et la compatibilité de toutes les messageries ne sont
pas certifiées. Aucun courriel réel ni message Facebook n’a été envoyé.
Le bilan de livraison a été accepté par Telegram ; sa lecture n’est pas attestée.

## Annexes

### Révision et résultats

| Élément | Résultat |
| --- | --- |
| SHA applicatif testé et livré | `c9aeea29e9bd9551f7aaa734041df0291b5575e8` |
| Image | `ghcr.io/salete-sincere/site-chaufferie-cil:c9aeea29e9bd9551f7aaa734041df0291b5575e8` |
| Digest publié et actif | `sha256:f70d385102aed38611faaff58128b2c56e8c1b2951067f198257e6947c6c5030` |
| Pod qualifié | `site-chaufferie-cil-649cb5d8b8-ztt46`, 1/1, zéro redémarrage |
| CI E2E | 18 réussis ; début 15:37:50.502 UTC ; durée 20,612 s |
| Staging E2E | 18 réussis ; début 15:40:52.791 UTC ; durée 17,464 s |
| Contrôles visuels et console | 15:41:23.724–15:41:28.746 UTC ; six vues, zéro erreur |
| Environnement CI | Node.js 24, Ubuntu 22.04, Playwright 1.65.0, Chromium avec sandbox |
| Environnement staging | Node.js 24.22.2, Playwright 1.65.0, Chromium 153.0.8010.12 avec sandbox, un worker |
| Vues inspectées | Accueil, Je milite, communiqué ; 1440 × 1000 et 390 × 844 |
| Ressources observées | 31m CPU / 55Mi ; mesure ponctuelle, sans test de charge |
| Prometheus | 15:41:46 UTC ; métriques âgées de 20,69 s, cible kube-state-metrics UP ; pression mémoire/disque/PID à zéro |

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

La recette sur le domaine utilise l’exécutable Chromium autorisé :

```sh
PATH=/tmp/chaufferie-toolchain/node_modules/node/bin:$PATH \
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:e2e:staging
```

Les Golden Journeys vérifient les trois parcours existants et l’accès au communiqué
depuis l’accueil, « Je milite » et les pieds de page des huit routes. Les neuf
paragraphes, auteur, date, source, contact et URL Facebook sont contrôlés. La
lecture sans JavaScript, le clavier, le mobile, l’analyse automatique axe, les
routes inconnues et la non-indexation couvrent aussi la nouvelle page.
Les simulations du partage et du presse-papiers et l’audit axe ne constituent pas
une garantie universelle de compatibilité ou d’accessibilité.

### Observation de santé et retour arrière

```sh
node scripts/observe-health.mjs \
  https://chaufferie-cil-staging.saletesincere.fr/health \
  c9aeea29e9bd9551f7aaa734041df0291b5575e8 120 60
```

234 requêtes entre 15:39:58.860 et 15:41:56.776 UTC : 66 réponses de l’ancienne
révision avant bascule, un timeout à 15:40:34.257 (2 003 ms) et 167 réponses
conformes. Résumé à 15:41:57.255 UTC : `passed=true`, 82 secondes finales saines.
Les réponses conformes ont un p95 de 38 ms et un maximum de 77 ms. Aucun événement
Kubernetes `Warning` ni erreur applicative n’a été trouvé autour du timeout ;
son origine reste indéterminée.

Le retour arrière remet ensemble l’image
`ghcr.io/salete-sincere/site-chaufferie-cil:b92efa6d5be9b5a796a85af3f8763afb3908847d`
et `APP_REVISION=b92efa6d5be9b5a796a85af3f8763afb3908847d`, puis reprend les contrôles
du [guide de déploiement](deploiement.md). Aucune donnée métier n’est à migrer.

### Conservation des preuves

L’artefact CI `golden-journeys-c9aeea29e9bd9551f7aaa734041df0291b5575e8` est lié au
workflow, avec une rétention de sept jours. Les rapports CI et staging, captures,
relevés avant/après, sonde, état des notifications et empreintes sont conservés
hors Git dans `test-results/delivery-publications-20261107/` du dépôt durable
`/home/ubuntu/source/site-chaufferie-cil`.

Le présent rapport est un ajout documentaire postérieur au SHA applicatif testé.
Aucun fichier applicatif n’a changé après sa qualification. Le
[suivi 5](https://github.com/salete-sincere/site-chaufferie-cil/issues/5) porte
l’ajout des publications ; le [rapport initial](livraison-2026-11-07.md) conserve
les résultats de la première livraison.
