# Comité chaufferie — Haubourdin

## Summary — 30 secondes

Ce site présente le comité d’intérêt local en cours de constitution contre
l’implantation d’une chaufferie sur la friche Lever, à l’initiative d’Haubourdin
Alternative Citoyenne. Il permet de s’informer, de partager des contenus et de
préparer un courriel au groupe. Next.js fonctionne en production sur infra-sincere,
avec des contenus Markdown versionnés, sans base de données. La préversion publique
est destinée à `https://chaufferie-cil-staging.saletesincere.fr` avec non-indexation.
Le [code source est public](https://github.com/salete-sincere/site-chaufferie-cil).

## Synthèse — 3 minutes

Le dossier comprend dix points introductifs, 34 questions, 48 repères chiffrés
répartis en huit thèmes et 17 sources. Chaque chiffre conserve son périmètre et
ses précautions. Les annonces du porteur, les positions d’HAC et les questions
ouvertes sont identifiées. L’état documentaire est celui du 7 novembre 2026.

Les visiteurs peuvent choisir plusieurs types d’action et préparer un courriel
adressé à `haubourdin_alternative_citoyenne@riseup.net`, objet « Comité chaufferie ».
Le site ne l’envoie pas : la personne l’envoie depuis sa propre messagerie. Une
adresse et un message copiables permettent de poursuivre sans client mail configuré.
La sélection reste en mémoire dans la page et disparaît au rechargement. Aucun
formulaire ne transmet d’adresse, aucun traceur n’est ajouté. Les journaux techniques
de l’hébergement restent distincts de cette absence de collecte applicative.

La palette HAC et Open Sans sont utilisés. Handelson Four, le logo original et les
exports flyer/carrousel seront intégrés lorsque les fichiers exploitables seront
accessibles. La signature textuelle est provisoire ; aucun logo HAC n’a été recréé.
L’inscription aux nouvelles, Strapi et PostgreSQL sont hors de cette première version.

Node.js 24 est requis. `npm run build` valide le contenu, produit le visuel de
partage PNG et construit le serveur Next.js standalone. La documentation
[de déploiement](documentation/deploiement.md) décrit GHCR, Kubernetes, TLS,
surveillance et retour arrière. Les trois Golden Journeys sont testés par
`npm run test:e2e` sur un build de production. Le rapport de
[qualification](documentation/qualification.md) indique les résultats réellement obtenus.

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

Les quatre fichiers dans `content/` contiennent des entrées Markdown séparées par
`<!-- entry -->`, avec un front matter YAML. Les IDs sont stables : `faq-01`,
`figure-01`, `point-01`, `S1`, etc. Les sources sont centralisées dans `sources.md`.
Une correction du Google Doc ne modifie pas automatiquement le site.

1. Revoir les pièces et leur date, puis modifier le Markdown et ses références.
2. Préserver les précautions et distinguer prévision, mesure et revendication.
3. Mettre à jour `updatedAt` de manière cohérente dans les quatre collections.
4. Exécuter validation, tests et build. Une modification du nombre d’entrées exige
   aussi d’actualiser les attentes de validation et la présentation publique.
5. Qualifier le nouveau SHA avant publication et activation sur OVH.

Le Markdown accepte paragraphes, listes, emphase et liens sûrs ; le HTML brut,
les images incorporées et les protocoles dangereux sont refusés au build. Aucun
code MDX ou JavaScript éditorial n’est exécuté.

### Routes et interfaces

Routes publiques : `/`, `/informer`, `/informer/faq`, `/informer/chiffres`,
`/sources`, `/militer`, `/rejoindre`. Les ancres FAQ et sources sont partageables.
`GET /health` répond `{ "status": "ok", "revision": "<APP_REVISION>" }`, sans cache.
Il n’existe aucune API d’inscription ou d’envoi. `APP_REVISION` désigne le SHA livré ;
`SITE_URL` configure les métadonnées absolues au build, avec le domaine staging par défaut.

Toutes les réponses portent `X-Robots-Tag: noindex, nofollow, noarchive`.
`robots.txt` permet le crawl afin que les moteurs puissent lire cette consigne ;
il ne s’agit pas d’une restriction d’accès.

### Références

- [Document HAC source](https://docs.google.com/document/d/1PHJvxNW0oxgmq5ryXvIcbhpM9xZVpjjvby2sBQRTNt4/edit).
- [Choix d’architecture](documentation/adr-001-next-markdown.md).
- [Déploiement et retour arrière](documentation/deploiement.md).
- [Qualification et limites](documentation/qualification.md).
- [Preuves de livraison du 7 novembre 2026](documentation/livraison-2026-11-07.md).
