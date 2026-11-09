# Qualification des aperçus de partage — 9 novembre 2026

## Summary — 30 secondes

Les neuf pages annoncent leur URL publique et une nouvelle image PNG 1200 × 630,
avec cartes Open Graph et Twitter complètes. Le domaine staging n’est plus une
dépendance de leurs images. Build, types, 14 tests unitaires et 29 scénarios E2E
passent localement. La CI et la recette des deux domaines restent nécessaires
pour attester la livraison. Les essais HTTP ne certifient pas les caches ou
réglages des applications de messagerie.

## Synthèse — 3 minutes

Le diagnostic constate des balises déjà présentes dans le HTML brut, mais une
image annoncée sur le staging et l’absence de canonical et `og:url`. La variable
Actions `SITE_URL` imposait encore le staging aux builds. Les cinq agents HTTP
initialement essayés obtiennent un PNG valide ; Python-urllib reçoit un refus
sur le staging. Ce filtrage démontre une dépendance fragile, sans prouver que
les robots réels de messagerie sont refusés.

Le helper de métadonnées fournit, pour chaque page, canonical, `og:url`, titre,
description, image HTTPS absolue, dimensions, type MIME, alternative textuelle
et carte Twitter. La configuration publique est versionnée dans le workflow,
et la variable de dépôt est alignée sur le domaine public. Le staging conserve
ses accès, avec les mêmes URL canoniques publiques. La non-indexation reste active.

Le nouveau visuel annonce « Chaufferie à Haubourdin », garde le slogan existant
et l’attribution complète d’Haubourdin Alternative Citoyenne, à l’initiative du
comité en constitution. Il est généré en contours Open Sans locaux, sans appel
externe au runtime. Le PNG pèse 65 791 octets ; son URL datée renouvelle celle
que les pages annoncent. Les anciens alias restent disponibles.

La suite ajoute cinq scénarios au Golden Journey **Je milite**. Pour les profils
HTTP Facebook, WhatsApp, Signal, Telegram et Twitter, elle lit les neuf réponses
HTML sans exécuter le site, contrôle les cartes dans le `head` puis récupère le
PNG annoncé : statut, MIME, signature, dimensions et poids. Les titres sont
propres à chaque page. Le RED contre la production précédente échoue sur
l’absence de canonical ; le passage local complet réussit 29/29. Les anciens
parcours, refus/replis, non-persistance, mobile, clavier et sans JavaScript restent
qualifiés. Aucun courriel ou message réel n’est envoyé.

Ces agents HTTP sont des scénarios de compatibilité, pas une émulation complète
des applications ni de leurs réseaux. En local, le chemin de l’image est testé
sur le build ; en recette réelle, son URL absolue est suivie. Les caches des
messageries et les réglages de prévisualisation restent extérieurs au site.

## Annexes

### Révision locale et commandes

- Base : `b31c945ac7ea3960a483541960985b4177d0c127`.
- Patch applicatif et tests : `/tmp/chaufferie-og-20261109/local/candidate.patch`.
- SHA-256 : `555d371b552c1cccbcac91140ead4e1c3569ae75d4d923f8ff7c5754917ad0ae`.
- Environnement : Node.js 24.22.2, Next.js 16.4.5 production, Chromium 1243
  avec sandbox, un worker Playwright, hôte `game-prod-ovh-gra`.

```sh
export PATH=/tmp/chaufferie-content-toolchain/node_modules/node/bin:$PATH
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
E2E_BASE_URL=https://stopchaufferiehaubourdin.fr npm run test:e2e -- --grep 'WhatsApp reçoit'
npm run build
npm test
npm run typecheck
npm run test:e2e
git diff --check
```

Le premier appel constitue le RED sur la version précédente. Le build inclut
`validate:content` et la génération des images. Le passage GREEN complet donne
29 réussites, aucun échec, test ignoré ou instable, en 44,2 secondes.

Les preuves hors Git sont sous `/tmp/chaufferie-og-20261109/` : diagnostic,
RED, logs build/unit/types/E2E, rapports HTML et JSON, captures et patch. Les
comptages documentaires restent inchangés : 51 FAQ, 81 sources, dix compléments.

### Contrat des images

| Ressource | Format | Rôle |
| --- | --- | --- |
| `/partage-20261109.png` | PNG, 1200 × 630, 65 791 octets | Image annoncée dans les cartes |
| `/partage-20261109.svg` | SVG avec contours de glyphes | Source vectorielle générée |
| `/partage.png`, `/partage.svg` | Aliases identiques | Compatibilité avec les anciens liens |

Un futur changement de visuel doit publier une nouvelle URL et mettre à jour
le helper, les tests et la preuve de livraison. Un changement d’environnement
runtime seul ne recalcule pas les métadonnées prérendues.

### Références

- [Open Graph : propriétés et URL canonique](https://ogp.me/).
- [Next.js : métadonnées et remplacement des objets imbriqués](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).
- [Signal : liens HTTPS et réglage des aperçus](https://support.signal.org/hc/en-us/articles/360022474332-Link-Previews).
- [Suivi du domaine public et de ses métadonnées](https://github.com/salete-sincere/site-chaufferie-cil/issues/8).
