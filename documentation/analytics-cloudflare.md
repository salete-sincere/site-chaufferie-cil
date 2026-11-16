# Cloudflare Web Analytics

## Summary — 30 secondes

Intégration préparée le 16 novembre 2026 à la demande du propriétaire : mesure
d’audience Cloudflare Web Analytics sans écran d’opt-in, sans cookies et sans
modification des DNS OVH. Le token public fourni par le propriétaire est configuré par défaut
dans le workflow CI et le build Docker. Un build npm local sans token reste désactivé. Aucun déploiement n’est réalisé par ce changement.
Les statistiques réelles restent à vérifier après livraison sur le domaine.

## Synthèse — 3 minutes

La balise officielle est présente une seule fois dans le layout commun, en module
chargé sans bloquer l’analyse du HTML. Cloudflare prend en charge les navigations
SPA ; aucun second suivi des routes n’est ajouté. La CSP autorise uniquement le
script `https://static.cloudflareinsights.com/beacon.min.js` et les connexions à
`https://cloudflareinsights.com` lorsque la mesure est activée. Sans token, aucune
de ces autorisations n’est ajoutée. Le pied de page indique alors « Aucun traceur » ;
avec token, il indique « Mesure d’audience Cloudflare sans cookies ».

La configuration est prérendue : `CLOUDFLARE_WEB_ANALYTICS_TOKEN` est le token public
hexadécimal de 32 caractères issu du snippet Web Analytics, jamais une clé API.
Le token public `c5996ba1a5044c2bb15e78cbdffb2761` est configuré dans la CI et
comme argument Docker par défaut. Il figure dans le HTML public et ne donne aucun
accès au compte Cloudflare. Une valeur malformée fait échouer le build. Le workflow utilise la même variable
de dépôt lors de la qualification et de la construction Docker. L’activation ne
nécessite aucun accès réseau du serveur, changement DNS, proxy ou modification du
namespace Kubernetes. Les requêtes de mesure partent du navigateur vers Cloudflare.

Cloudflare décrit cette solution comme dépourvue de cookies et de suivi individuel.
Le contact conserve ses choix en mémoire uniquement et ne transmet pas les messages
préparés. Les blocages de la balise ne doivent pas empêcher la lecture, le partage
ou la préparation d’un courriel. Sans JavaScript, aucune mesure n’est émise.
Les visites bloquées par le navigateur ne sont pas comptabilisées.

Les tests E2E vérifient la présence et l’absence de balise, la CSP, l’unicité après
navigation client, le rechargement et le repli contact. Les appels externes sont
interceptés : la simulation vérifie le câblage et ne prouve ni le comportement
interne du script tiers ni la réception des données dans le tableau Cloudflare.
Les trois Golden Journeys existants sont exécutés avec la balise bloquée.

## Annexes

### Activer

1. Dans Cloudflare → Web Analytics → Add a site, ajouter
   `stopchaufferiehaubourdin.fr` comme site sans proxy. Copier le token du snippet
   dans Manage site. Aucune migration DNS n’est nécessaire.
2. Le token fourni est déjà la valeur par défaut dans la CI et Docker. La variable
   GitHub Actions `CLOUDFLARE_WEB_ANALYTICS_TOKEN` et l’argument Docker du même nom
   permettent de le remplacer. Pour un build npm local, fournir cette variable
   explicitement.
3. Qualifier une nouvelle image avec cette configuration, puis suivre le circuit
   de publication et de déploiement autorisé. Ne pas activer aussi l’injection
   automatique : une seule balise doit exister par page. Pour qualifier la
   préversion, utiliser un token configuré pour son propre domaine.
4. Après livraison, vérifier les requêtes du navigateur et l’arrivée de statistiques
   dans Cloudflare ; l’affichage peut prendre quelques minutes.

### Qualification reproductible

Avec Node.js 24 et le Chromium approuvé sur Penthouse :

```sh
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
# Valeur synthétique réservée à la qualification interceptée, sans collecte réelle.
export CLOUDFLARE_WEB_ANALYTICS_TOKEN=0123456789abcdef0123456789abcdef
npm run build
npm run typecheck
npm test
npm run test:e2e
# Vérifier aussi la configuration désactivée.
unset CLOUDFLARE_WEB_ANALYTICS_TOKEN
npm run build
npm run test:e2e
```

Les scénarios réservés à l’autre configuration sont explicitement ignorés.
Pour qualifier une adresse distante, fournir son token attendu avec `E2E_BASE_URL` ;
le cas d’absence de balise est réservé au build local sans token. Sans token attendu,
les trois cas analytics sont ignorés à distance ; tous les appels Cloudflare restent
bloqués avant navigation pour ne pas produire de statistiques réelles.
Les rapports restent hors Git dans `test-results/` et `playwright-report/` ; rattacher
les résultats au SHA et au diff réellement testés avant une PR. Pour désactiver,
construire avec un argument Docker explicitement vide
(`--build-arg CLOUDFLARE_WEB_ANALYTICS_TOKEN=`), qualifier et livrer une nouvelle
image. En CI, retirer aussi la valeur de repli du workflow pour désactiver la mesure.

### Références

- [Installation sans proxy](https://developers.cloudflare.com/web-analytics/get-started/).
- [CSP, endpoint manuel et limites](https://developers.cloudflare.com/web-analytics/faq/).
- [Présentation du service](https://developers.cloudflare.com/web-analytics/about/).
- [Absence de cookies et de fingerprinting selon Cloudflare](https://blog.cloudflare.com/privacy-first-web-analytics/).
- [Déploiement et retour arrière](deploiement.md).
