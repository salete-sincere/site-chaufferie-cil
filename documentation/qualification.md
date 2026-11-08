# Qualification des Golden Journeys

## Summary — 30 secondes

Les trois Golden Journeys sont automatisés sur un build de production Next.js
via `npm run test:e2e`. Les rapports CI sont rattachés au SHA testé.
La recette du domaine vérifie également l’image effective, TLS et une fenêtre
de santé continue. Ce document précise les contrôles et leurs limites.
La [livraison du 8 novembre](livraison-identite-2026-11-08.md) passe 12 tests
unitaires et 22 scénarios E2E, après une qualification locale préalable de 20 scénarios.

## Synthèse — 3 minutes

**Je m’informe** vérifie l’accès aux dix points, aux 39 FAQ, aux 51 chiffres et aux
27 sources. La recherche, le filtre thématique, l’absence de résultat, les ancres
directes et le passage vers la source originale font partie du parcours.
L’accès au communiqué complet depuis l’accueil, la page « Je milite » et le pied
de page est vérifié, ainsi que sa provenance, son contact et le lien Facebook exact.
La navigation Facebook est interceptée après contrôle de sa destination ; son accès
peut dépendre des conditions de Meta et de la connexion du visiteur.
Le panorama vérifie aussi la recherche « Canopée », l’attribution des enquêtes,
les précautions sur Sully et Haubourdin, le fioul prévu, les périmètres des puissances,
l’autorisation préfectorale après avis défavorable et les références S18 à S27.
Les anciens liens directs sont conservés ; les textes à copier affichent les
comptages actualisés. Les deux nouveaux scénarios ont échoué sur l’ancien build
avant de qualifier le contenu mis à jour.

**Je milite** vérifie la copie des trois messages et de leurs liens, le partage
natif, son annulation et les replis lorsque partage ou presse-papiers sont absents
ou refusés. L’inscription aux nouvelles reste annoncée à venir, sans collecte.

**Je rejoins** vérifie les choix multiples, la possibilité de ne rien sélectionner,
le message facultatif, les accents et l’encodage de l’adresse, du sujet et du corps
du `mailto:`. Le courriel et l’adresse restent copiables. Aucune requête d’écriture,
aucun cookie ni stockage navigateur de la demande ne doit être créé. Un rechargement
efface les choix. Aucun mail réel n’est envoyé par la suite.

Des scénarios supplémentaires vérifient le clavier, le rendu mobile, l’absence de
débordement, la lecture essentielle sans JavaScript, les violations automatiques
WCAG 2.1 AA, la page 404 et les en-têtes de non-indexation des pages et assets.
Les captures sont inspectées visuellement et restent hors Git.

Les capacités navigateur sont simulées pour exercer les succès, refus et annulations.
Cela ne certifie ni le comportement de toutes les applications de partage ni la
délivrabilité d’un message. L’ouverture d’une source externe est interceptée après
vérification de sa destination afin de ne pas dépendre du site tiers. Un audit axe
automatique ne constitue pas une certification d’accessibilité.

Le nom Haubourdin Alternative Citoyenne est développé dans les textes publics,
les libellés accessibles et les partages. Le groupe d’opposition au conseil municipal
d’Haubourdin est présenté distinctement du comité en cours de constitution.

## Annexes

### Correction éditoriale du 8 novembre 2026

Qualification locale du répertoire de travail, sans commit ni déploiement : base
`6af048e5acd577bbdd5b0a4e81d3afd65090b2ec`, complétée par le diff applicatif
et les tests (`app`, `components`, `content`, `lib`, `test`, `tests`). Le
[patch qualifié](../test-results/nom-complet-local-20261108/candidate.patch) a pour
SHA-256 `c6307c42d66d1f50677a37129a0331e3f9f5a68716e010011180585ee0bb3491`.
Ce SHA de base seul ne désigne donc pas les modifications qualifiées.

Environnement : `game-prod-ovh-gra`, compte `ubuntu`, Node.js 24.22.2, build
Next.js de production servi sur `127.0.0.1:3100`, Chromium 1243 avec sandbox.
Commandes exactes, après sélection de Node.js 24 :

```sh
export PATH=/tmp/chaufferie-domain-toolchain/node_modules/node/bin:$PATH
npm run build
npm test
npm run typecheck
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:e2e
git diff --check
```

Le build inclut `validate:content` : 10 points, 39 questions, 51 chiffres et
27 sources validés. Types et diff valides, **12 tests unitaires et 20 scénarios
E2E réussis**. Les trois Golden Journeys, leurs erreurs et replis, la non-persistance,
la lecture sans JavaScript, le clavier et l’audit axe passent. Les 13 captures ont
été ouvertes et relues ; aucun nouveau débordement lié au nom complet constaté.
Les réserves décoratives préexistantes de l’accueil sont précisées dans le
[compte rendu de livraison](livraison-identite-2026-11-08.md).
Les huit pages publiques générées ne contiennent plus de sigle dans leur texte
ou leurs libellés accessibles. Les IDs, ancres, destinations et propos du communiqué
sont préservés ; seul le nom y est développé, avec une note hors communiqué.

Preuves locales ignorées par Git : [rapport E2E](../test-results/nom-complet-local-20261108/playwright-report/index.html),
[résultats JSON](../test-results/nom-complet-local-20261108/results.json),
[journal du build](../test-results/nom-complet-local-20261108/build.log),
[tests unitaires](../test-results/nom-complet-local-20261108/unit.log),
[types](../test-results/nom-complet-local-20261108/typecheck.log),
[journal E2E](../test-results/nom-complet-local-20261108/e2e.log),
[contrôle éditorial](../test-results/nom-complet-local-20261108/editorial-check.log).
Les essais initiaux ont révélé deux attentes de date devenues obsolètes, corrigées,
et des restrictions du harnais sur les sous-processus et le serveur local ; les
commandes concernées ont ensuite réussi avec l’élévation autorisée, sans désactiver
la sandbox Chromium. Les simulations externes décrites en synthèse restent les
mêmes. Cette qualification ne constitue pas une recette du domaine ni une preuve
de publication ; tout changement applicatif ultérieur doit être requalifié.

### Commandes et preuves par révision

```sh
npm ci
npm run build
npm run typecheck
npm test
npm run test:e2e
git diff --check
```

Le [workflow du dépôt](https://github.com/salete-sincere/site-chaufferie-cil/actions)
conserve le SHA, l’environnement Node.js 24 / Ubuntu 22.04 / Chromium avec sandbox,
les résultats
et l’artefact `golden-journeys-<SHA>`. Les captures, traces d’échec et rapports
expurgés sont dans cet artefact, conservé sept jours. Toute modification d’un
contenu applicatif testé impose une nouvelle qualification.

Les tests unitaires vérifient la composition du courriel et l’intégrité documentaire :
comptages, IDs stables uniques, références connues, cohérence des dates et refus
du HTML brut ou des liens dangereux. Le premier cycle local du 7 novembre 2026 a
exercé les régressions RED/GREEN du parser et du courriel. Le premier passage
navigateur a fait corriger le nom accessible du message facultatif et plusieurs
hypothèses de sélection des tests avant requalification.

La première recette du domaine au SHA `15a0be0` a trouvé un défaut absent en local :
Cloudflare masquait l'adresse et les liens de courriel sans JavaScript. Les preuves
initiales (16 réussites, un échec) sont conservées. La correction encadre uniquement
les liens publics avec les commentaires d'exception du CDN, et le parcours sans
JavaScript vérifie aussi le pied de page et l'absence de liens d'obfuscation.
Le [suivi 3](https://github.com/salete-sincere/site-chaufferie-cil/issues/3) doit être
clos seulement après réussite de la nouvelle recette sur le domaine.

### Sources externes — contrôle du 7 novembre 2026

Quinze sources sur dix-sept ont répondu HTTP 200 à une requête HEAD. S8 (ADEME)
et S10 (Pappers) ont répondu 403 en HEAD et GET limité : disponibilité automatisée
non vérifiée, sans preuve de lien mort. S14 a été contrôlée uniquement par HEAD,
sans lecture de contenu supplémentaire. Les sources restent celles du document
d’Haubourdin Alternative Citoyenne.

### Recette sur le domaine

```sh
npm run test:e2e:staging
```

Utiliser le même exécutable Chromium approuvé que pour la qualification locale.
Rattacher au bilan de livraison le SHA de `/health`, le tag et le digest de l’image
active, l’état des pods, TLS et le rapport de santé décrit dans
[le guide de déploiement](deploiement.md). Distinguer les éventuels échecs initiaux
de la première installation de la fenêtre saine après rollout. L’absence de
metrics permanentes propres au nouveau site doit être déclarée explicitement.

### Limites éditoriales de la préversion

Les exports Canva du flyer/carrousel et les fichiers du logo original et de
Handelson Four ne sont pas disponibles via les accès utilisés. La préversion
emploie Open Sans et une signature textuelle. Elle ne propose aucun faux bouton
de téléchargement. La newsletter, Strapi et PostgreSQL restent hors périmètre.
