# Indexation du domaine public

## Summary — 30 secondes

À la demande du 16 novembre 2026, le site public autorise l’indexation. La mention
« Site non indexé » est retirée. Le sitemap est disponible à
`https://stopchaufferiehaubourdin.fr/sitemap.xml`, annoncé par `robots.txt` et prêt
à soumettre dans Google Search Console après livraison. La préversion et
`/health` restent non indexables. Aucune soumission Search Console n’est effectuée
par l’application ; la présence dans les résultats dépend du moteur.

## Synthèse — 3 minutes

La suppression du texte visible seule ne suffisait pas. Le layout n’émet plus de
métadonnée globale `noindex`, les en-têtes applicatifs ne bloquent plus les pages
publiques, et l’Ingress public ne référence plus le middleware `staging-noindex`.
La redirection HTTPS est conservée. Sur la préversion, le middleware existant et
une règle applicative liée au Host maintiennent `noindex, nofollow, noarchive`.
Les URL canoniques et cartes sociales des deux adresses restent celles du public.

La route Next.js `app/sitemap.ts` produit le XML des neuf pages navigables :
accueil, dossier, FAQ, chiffres, compléments, sources, militer, rejoindre et
communiqué. Elle exclut `/health`, les erreurs, les ressources et les ancres.
Aucune date de modification artificielle n’est publiée. `robots.txt` autorise le
crawl et indique l’URL absolue du sitemap ; il ne bloque pas la préversion pour
que les robots puissent lire sa directive de non-indexation.

Les tests vérifient le XML, ses neuf URL exactes, leur réponse HTTP 200 et leurs
canoniques, l’absence de `noindex` dans les pages publiques, la disparition de la
mention et la conservation du header staging. `/health` garde son header noindex ;
la page 404 garde sa directive native. Les Golden Journeys existants et les tests
d’aperçus sociaux sont requalifiés sans envoyer de courriel ni télémétrie de test.

## Annexes

### Search Console

Dans la propriété du domaine public, ouvrir « Sitemaps » et soumettre
`https://stopchaufferiehaubourdin.fr/sitemap.xml` (ou `sitemap.xml` si le champ
préremplit l’origine). La vérification de propriété et la soumission restent à
faire dans le compte du propriétaire. Aucun identifiant Search Console n’est ajouté.

### Qualification et livraison

Exécuter `npm run build`, `npm run typecheck`, `npm test`, `npm run test:e2e` avec
Node.js 24 et le Chromium approuvé. Fournir le token public Cloudflare configuré
pour les cas analytics ; ils interceptent les appels externes.
Qualifier les deux adresses après la livraison du SHA testé. Contrôler aussi
l’annotation réelle de l’Ingress public : une ancienne référence `staging-noindex`
continuera à bloquer l’indexation malgré la nouvelle image.

En cas de retour arrière, restaurer ensemble l’image/SHA et l’annotation précédente
de l’Ingress public, puis requalifier. Ne pas modifier le middleware partagé du
staging, les DNS ou les certificats. Voir le [guide de déploiement](deploiement.md).
