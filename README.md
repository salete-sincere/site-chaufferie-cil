# Comité chaufferie — Haubourdin

## Summary — 30 secondes

Ce site présente le comité en cours de constitution, à l’initiative d’Haubourdin
Alternative Citoyenne, groupe d’opposition au conseil municipal d’Haubourdin.
Il permet de s’informer, de partager et de préparer un courriel, sans collecte.
Next.js sert des contenus Markdown, sans base de données.
Le site public est `https://stopchaufferiehaubourdin.fr` ; la préversion
`https://chaufferie-cil-staging.saletesincere.fr` reste accessible.
Les deux adresses gardent la consigne de non-indexation.

## Synthèse — 3 minutes

Le dossier comprend dix points introductifs, 51 questions, 51 repères chiffrés
répartis en huit thèmes et 81 sources, ainsi que dix compléments documentaires. Chaque chiffre conserve son périmètre et
ses précautions. Les annonces du porteur, les positions d’Haubourdin Alternative
Citoyenne et les questions ouvertes sont identifiées. L’état documentaire est celui
du 9 novembre 2026.
Haubourdin Alternative Citoyenne est le groupe d’opposition à l’initiative du
comité d’intérêt local ; ce comité en cours de constitution est une entité distincte.
Le [code source est public](https://github.com/salete-sincere/site-chaufferie-cil).

Le bloc « Ailleurs en France » de `/informer` donne accès aux comparaisons avec
Surville et Sully, aux enquêtes de Canopée et aux décisions concernant Beaunant et
Saint-Genis-Laval. Les enquêtes associatives sont attribuées et ne sont pas présentées
comme des preuves de l’origine du combustible d’Haubourdin. Les puissances utiles,
la puissance du combustible et la récupération des fumées restent distinctes.

Le communiqué d’Haubourdin Alternative Citoyenne du 6 novembre 2026 se lit sur
`/communique-de-presse`, avec sa date, son auteur et le lien vers le document source.
Ses propos sont conservés et le nom du groupe y est développé en toutes lettres.
Les accès au communiqué et à la page Facebook officielle sont visibles sur l’accueil,
dans « Je milite » et dans le pied de page de toutes les pages.

Les visiteurs peuvent choisir plusieurs types d’action et préparer un courriel
adressé à `haubourdin_alternative_citoyenne@riseup.net`, objet « Comité chaufferie ».
Le site ne l’envoie pas : la personne l’envoie depuis sa propre messagerie. Une
adresse et un message copiables permettent de poursuivre sans client mail configuré.
La sélection reste en mémoire dans la page et disparaît au rechargement. Aucun
formulaire ne transmet d’adresse, aucun traceur n’est ajouté. Les journaux techniques
de l’hébergement restent distincts de cette absence de collecte applicative.

La palette d’Haubourdin Alternative Citoyenne et la police Open Sans sont utilisées.
Handelson Four, le logo original et les exports flyer/carrousel seront intégrés
lorsque les fichiers exploitables seront
accessibles. La signature textuelle est provisoire ; aucun logo d’Haubourdin
Alternative Citoyenne n’a été recréé.
L’inscription aux nouvelles, Strapi et PostgreSQL sont hors de cette première version.

Node.js 24 est requis. `npm run build` valide le contenu, produit le visuel de
partage PNG et construit le serveur Next.js standalone. La documentation
[de déploiement](documentation/deploiement.md) décrit GHCR, Kubernetes, TLS,
surveillance et retour arrière. Les trois Golden Journeys sont testés par
`npm run test:e2e` sur un build de production. Le rapport de
[qualification](documentation/qualification.md) indique les résultats réellement obtenus.

Le domaine public est actif depuis le 9 novembre 2026, avec DNS OVH et HTTPS
vers Penthouse, sans passage par Cloudflare. Les cartes de partage utilisent
ce domaine pour chaque page et pour leur image PNG 1200 × 630. La préversion
partage ces mêmes URL canoniques. La [procédure du domaine public](documentation/domaine-public.md)
décrit DNS, certificat et qualification ; la non-indexation reste active.

## Annexes

### Développement et qualification

```sh
npm ci
npm run dev
npm run validate:content
npm test
npm run build
npm run typecheck
npm run test:e2e
git diff --check
```

`npm run dev` écoute en loopback. `npm run start -- --port 3100` sert le build de
production. Playwright démarre et ferme ce serveur lorsqu’aucune `E2E_BASE_URL`
n’est fournie. Le navigateur conserve sa sandbox et un seul worker est utilisé.
Pour installer le navigateur en CI, le workflow utilise
`npx --no-install playwright install --with-deps chromium`.

Sur Penthouse, réutiliser le Chromium approuvé par AppArmor :

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:e2e
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npm run test:e2e:staging
```

Les captures, traces et rapports sont ignorés par Git dans `test-results/` et
`playwright-report/`. Ouvrir les captures pour la vérification visuelle. Ne jamais
désactiver la sandbox du navigateur pour résoudre un problème du harnais.

### Mettre à jour les contenus

Les cinq collections dans `content/` (`overview`, `faq`, `figures`, `sources` et
`complements`) contiennent des entrées Markdown séparées par
`<!-- entry -->`, avec un front matter YAML. Les IDs sont stables : `faq-01`,
`figure-01`, `point-01`, `S1`, etc. Les sources sont centralisées dans `sources.md`.
Une correction du Google Doc ne modifie pas automatiquement le site.
Les dix compléments de `/informer/complements` conservent les cas de navigation,
coûts, alternatives, inspections et données sanitaires avec leurs limites. Les
descriptions des sources acceptent des liens Markdown vers les pièces de suivi ;
plusieurs documents peuvent donc relever du même identifiant de source.

Le fichier distinct `content/press-release.md` contient le communiqué, son auteur,
sa date et sa provenance. Il est aussi validé au build. Ses propos sont conservés,
avec le nom du groupe développé en toutes lettres ; le contact est rendu séparément
pour rester lisible sans JavaScript derrière Cloudflare. L’URL Facebook vérifiée
depuis le Linktree d’Haubourdin Alternative Citoyenne est centralisée
dans `lib/hac.ts`. Il s’agit d’un lien externe, sans intégration Facebook ni traceur.

1. Revoir les pièces et leur date, puis modifier le Markdown et ses références.
2. Préserver les précautions et distinguer prévision, mesure et revendication.
3. Mettre à jour `updatedAt` de manière cohérente dans les cinq collections.
4. Exécuter validation, tests et build. Une modification du nombre d’entrées exige
   aussi d’actualiser les attentes de validation et la présentation publique.
5. Qualifier le nouveau SHA avant publication et activation sur OVH.

Le Markdown accepte paragraphes, listes, emphase et liens sûrs ; le HTML brut,
les images incorporées et les protocoles dangereux sont refusés au build. Aucun
code MDX ou JavaScript éditorial n’est exécuté.

### Routes et interfaces

Routes publiques : `/`, `/informer`, `/informer/faq`, `/informer/chiffres`,
`/informer/complements`, `/sources`, `/militer`, `/rejoindre`, `/communique-de-presse`. Les ancres FAQ et sources sont partageables.
`GET /health` répond `{ "status": "ok", "revision": "<APP_REVISION>" }`, sans cache.
Il n’existe aucune API d’inscription ou d’envoi. `APP_REVISION` désigne le SHA livré ;
`SITE_URL` configure les métadonnées absolues au build, avec
`https://stopchaufferiehaubourdin.fr` par défaut. La recette du staging utilise
`E2E_BASE_URL` pour changer la cible HTTP, tout en vérifiant les URL publiques
annoncées aux messageries :

```sh
npm run build
E2E_BASE_URL=https://chaufferie-cil-staging.saletesincere.fr npm run test:e2e
```

Pour une image Docker, utiliser l’argument de build `SITE_URL`. Les pages étant
prérendues, modifier seulement l’environnement du conteneur déjà construit ne
recalcule pas ces métadonnées. Cette configuration ne crée aucun enregistrement
DNS ni certificat ; leur activation suit la procédure dédiée.

Le workflow versionne `SITE_URL=https://stopchaufferiehaubourdin.fr` pour les
deux builds ; une ancienne variable de dépôt ne peut plus réintroduire le staging.
Les neuf pages ont un canonical, `og:url`, titre, description, image absolue et
carte Twitter explicites. `partage-20261109.png` renouvelle l’URL de l’image ; les
anciens alias restent disponibles. `npm run prepare:assets` régénère les SVG
et PNG avec les contours Open Sans locaux. Les tests d’aperçus lisent le HTML
brut et récupèrent l’image annoncée, sans exécuter les scripts du site.

Toutes les réponses portent `X-Robots-Tag: noindex, nofollow, noarchive`.
`robots.txt` permet le crawl afin que les moteurs puissent lire cette consigne ;
il ne s’agit pas d’une restriction d’accès.

### Références

- [Document source d’Haubourdin Alternative Citoyenne](https://docs.google.com/document/d/1PHJvxNW0oxgmq5ryXvIcbhpM9xZVpjjvby2sBQRTNt4/edit).
- [Choix d’architecture](documentation/adr-001-next-markdown.md).
- [Déploiement et retour arrière](documentation/deploiement.md).
- [Mise en service du domaine public](documentation/domaine-public.md).
- [Qualification et limites](documentation/qualification.md).
- [Qualification de l’import documentaire du 9 novembre 2026](documentation/qualification-contenus-2026-11-09.md).
- [Livraison du dossier documentaire du 9 novembre 2026](documentation/livraison-contenus-2026-11-09.md).
- [Qualification des aperçus de partage](documentation/qualification-partage-2026-11-09.md).
- [Preuves de livraison du 7 novembre 2026](documentation/livraison-2026-11-07.md).
- [Livraison du communiqué et des liens d’Haubourdin Alternative Citoyenne](documentation/livraison-publications-2026-11-07.md).
- [Livraison Canopée et panorama français](documentation/livraison-canopee-2026-11-07.md).
- [Livraison du nom complet et de la présentation municipale](documentation/livraison-identite-2026-11-08.md).
