# Import du dossier documentaire du 9 novembre 2026

## Summary — 30 secondes

Le contenu du Google Doc est intégré localement : 51 FAQ, 81 sources et dix
compléments documentaires, avec les anciennes ancres conservées. Validation,
build, types, 14 tests unitaires et 24 scénarios E2E passent sur le build de
production. Les 17 captures finales ont été ouvertes et relues. Cette qualification
concerne le SHA de base et le patch identifiés ci-dessous ; aucun commit, push
ou déploiement n’avait été réalisé lors de cette qualification préalable.

## Synthèse — 3 minutes

Le [document source](https://docs.google.com/document/d/1PHJvxNW0oxgmq5ryXvIcbhpM9xZVpjjvby2sBQRTNt4/edit?tab=t.z95zhysf2doj)
du 9 novembre ajoute douze FAQ et les références S28 à S81. Les 39 FAQ et les
27 sources antérieures restent inchangées, hors date de collection. Les dix
points et 51 chiffres répartis en huit thèmes sont conservés.

La nouvelle page `/informer/complements` restitue dix sections : navigation,
climat, raccordement, ressources associatives, pièces à demander, hydrothermie,
coûts détaillés, industries, santé et effets cumulés. Les tableaux du document
deviennent 39 cas sous des sous-titres lisibles sur mobile. La page est accessible
depuis le dossier, la FAQ, les chiffres et le pied de page, avec des ancres stables.

Les notes internes, la mention personnelle et la piste orale non confirmée sur
Kuhlmann sont exclues. Le nom Haubourdin Alternative Citoyenne est développé.
La proposition au comité reste présentée comme une proposition ; les exemples
de coûts ne sont pas des factures finales. Les hypothèses énergétiques, échelles
sanitaires et dates d’inspection gardent leurs précautions. Les six documents
secondaires de S60, S64, S66, S69, S71 et S73 restent consultables dans les
descriptions Markdown des sources, sous les mêmes protections de rendu.

Les trois Golden Journeys passent : **Je m’informe**, **Je milite** et
**Je rejoins le comité**. Les nouvelles vérifications couvrent recherche et filtre,
ancre FAQ après rechargement, hypothèses d’hydrothermie, limites des données de
santé et accès au suivi d’inspection. Lecture sans JavaScript, mobile, clavier,
audit axe et non-indexation passent. Aucun courriel n’est envoyé et les demandes
de contact ne persistent pas au rechargement.

Le premier passage E2E a donné 23 réussites et un échec du sélecteur de thème
du nouveau test : `innerText()` renvoyait les majuscules CSS, différentes du
libellé de l’option. Le test utilise désormais le texte source ; le passage final
complet réussit 24 scénarios. Les capacités de partage et presse-papiers ainsi
que les destinations externes restent simulées. Les 54 publications nouvelles
n’ont pas fait l’objet d’une contre-vérification indépendante exhaustive.

Le résultat est local : aucune CI, image livrée, recette TLS ou fenêtre de santé
du domaine n’est attestée par ce rapport. Une publication devra identifier le
commit candidat et suivre le [guide de déploiement](deploiement.md).

## Annexes

### Révision qualifiée et provenance

- SHA de base : `e5d102bc3bd33612087e4e84a9ebca25533d5b4e`.
- [Patch applicatif et tests](../test-results/content-import-20261109/candidate.patch),
  SHA-256 : `a2c4e9b53aea28c9acdfb4e8320a95da70ed3d3f750ee8d8d09750f7a8816b4a`.
- Périmètre du patch : `app`, `components`, `content`, `lib`, `scripts`, `test`,
  `tests`, y compris les deux nouveaux fichiers non encore suivis par Git.
- Empreinte SHA-256 de la lecture native du Google Doc :
  `268b50bbba28cffaab512f2be3fb4515c8619d9790c3d77addb589a54eafd3cd`.
  La révision du Doc a été relue avant import et était identique à celle de la revue.
- [Métadonnées de qualification](../test-results/content-import-20261109/candidate.json).

Le SHA de base seul ne désigne pas les modifications testées. Les changements
documentaires de domaine présents simultanément dans le répertoire sont hors
du patch applicatif de cette qualification. Tout changement applicatif ultérieur
doit être requalifié ; les corrections de documentation n’altèrent pas le build.

### Environnement et commandes reproductibles

Hôte `game-prod-ovh-gra`, compte `ubuntu`, Node.js 24.22.2, Next.js 16.4.5,
Chromium 1243 avec sandbox, un worker Playwright. Build de production servi sur
`127.0.0.1:3100`. Les métadonnées du build utilisent la valeur par défaut
`https://stopchaufferiehaubourdin.fr`. Passage E2E final le 9 novembre 2026 à
16 h 42, heure de Paris, durée 42,9 secondes.

Node.js 22 étant celui du PATH initial, Node.js 24 a été installé dans un
répertoire temporaire distinct, sans changer les dépendances du projet :

```sh
npm install --prefix /tmp/chaufferie-content-toolchain --cache /tmp/chaufferie-content-npm-cache --no-audit --no-fund node@24.22.2
export PATH=/tmp/chaufferie-content-toolchain/node_modules/node/bin:$PATH
npm run validate:content
npm test
npm run build
npm run typecheck
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:e2e
git diff --check
```

Le build inclut à nouveau la validation du contenu. Les premières tentatives
dans le bac à sable ont échoué sur les sous-processus du build et l’écoute
loopback du test de santé ; elles sont conservées, puis les mêmes scripts ont
réussi avec l’élévation autorisée. Aucune protection Chromium n’a été désactivée.

### Résultats et artefacts locaux

| Contrôle | Résultat |
| --- | --- |
| Validation du contenu | 10 points, 51 FAQ, 51 chiffres, 81 sources, 10 compléments ; communiqué valide |
| Tests unitaires | 14 réussites, aucun échec |
| Build de production et types | Réussis |
| Golden Journeys et contrôles transverses | 24 réussites, aucun échec, aucun test ignoré |
| Captures finales | 17 ouvertes et relues, aucun nouveau défaut visuel constaté |
| Diff | Aucun défaut d’espacement détecté |

- [Cycle RED initial](../test-results/content-import-20261109/red-unit.log) :
  l’attente de 51 FAQ échoue sur l’ancien corpus de 39 FAQ, avant implémentation.
- [Tests unitaires](../test-results/content-import-20261109/unit.log),
  [build](../test-results/content-import-20261109/build.log),
  [types](../test-results/content-import-20261109/typecheck.log).
- [Journal E2E final](../test-results/content-import-20261109/e2e.log),
  [résultats JSON](../test-results/content-import-20261109/results.json),
  [rapport HTML](../test-results/content-import-20261109/playwright-report/index.html).
- [Captures finales](../test-results/content-import-20261109/artifacts/),
  [premier passage E2E et trace de l’échec corrigé](../test-results/content-import-20261109/first-run/).

Les artefacts restent ignorés par Git et locaux à ce répertoire. Les destinations
externes sont interceptées après vérification de leurs URL ; leur accessibilité
réelle et l’authenticité de leur contenu ne sont pas prouvées par ces simulations.
L’audit axe ne constitue pas une certification d’accessibilité. Le décor incliné
et la typographie serrée des unités sur l’accueil sont préexistants à cet import.

### Revue des originaux avant publication

La revue Copilot de la PR 11 sur `a138b7693cee2141045901ac11317d863c09ae61`
ne relève pas de défaut de code, mais demande de vérifier les affirmations
sanitaires et industrielles contre les pièces originales. Cette réserve est
traitée par une lecture ciblée des documents, distincte des simulations E2E.

Pour S63 à S67, les PDF MRAe, OR2S, registre des tumeurs et Santé publique France
confirment les chiffres, périodes et échelles retenus. Les graphiques OR2S et
le tableau du registre sont aussi vérifiés visuellement. Le scénario de 380
cancers évitables reste conditionnel ; les données territoriales ne permettent
pas d'attribuer un risque sanitaire au seul projet de chaufferie.

Le contrôle du rapport S70, p. 10, conduit à compléter la chronologie du CVO de
Sequedin : après le défaut de mai et les réparations, le contrôle des rejets des
biofiltres du 14 au 17 décembre 2025 ne relève pas de non-conformité aux valeurs
limites applicables. Les procédures et fréquences de contrôle restent à compléter.
Cette précision est ajoutée au complément et à la source. Elle est postérieure
au patch local qualifié ci-dessus : la CI doit donc requalifier la révision
candidate avant fusion. Ce contrôle ciblé ne vaut pas audit exhaustif des 54
nouvelles références.
