# Qualification des Golden Journeys

## Summary — 30 secondes

Les trois Golden Journeys sont automatisés sur un build de production Next.js.
Les commandes reproductibles sont `npm test`, `npm run build`,
`npm run typecheck` et `npm run test:e2e`. Les rapports CI sont rattachés au SHA
exact et publiés avec chaque exécution. Le déploiement doit en plus être vérifié
sur son domaine, avec l’image effective, TLS et une fenêtre de santé continue.
Ce document décrit les contrôles et leurs limites ; il ne remplace pas leurs résultats.

## Synthèse — 3 minutes

**Je m’informe** vérifie l’accès aux dix points, aux 34 FAQ, aux 48 chiffres et aux
17 sources. La recherche, le filtre thématique, l’absence de résultat, les ancres
directes et le passage vers la source originale font partie du parcours.
L’accès au communiqué complet depuis l’accueil, la page « Je milite » et le pied
de page est vérifié, ainsi que sa provenance, son contact et le lien Facebook exact.
La navigation Facebook est interceptée après contrôle de sa destination ; son accès
peut dépendre des conditions de Meta et de la connexion du visiteur.

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

## Annexes

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
sans lecture de contenu supplémentaire. Les sources restent celles du document HAC.

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
