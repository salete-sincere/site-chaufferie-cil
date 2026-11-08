# Livraison du comité chaufferie — 7 novembre 2026

## Summary — 30 secondes

Le [site de staging](https://chaufferie-cil-staging.saletesincere.fr) est livré sur
infra-sincere au SHA `b92efa6d5be9b5a796a85af3f8763afb3908847d`.
Le [dépôt est public](https://github.com/salete-sincere/site-chaufferie-cil).
Dix tests unitaires et 17 Golden Journeys passent en CI ; les 17 scénarios passent
également sur le domaine. L’image active, TLS et 102 secondes de santé continue
sont vérifiés. Restent les fichiers graphiques d’Haubourdin Alternative Citoyenne,
les exports Canva et la surveillance permanente.

## Synthèse — 3 minutes

Les trois parcours sont disponibles : dix points introductifs, 34 FAQ avec recherche
et liens directs, 48 repères chiffrés dans huit thèmes, 17 sources, trois messages
à partager et préparation du courriel de participation. Les contenus Markdown sont
versionnés. La sélection d’actions et le message restent dans la page ; aucun
courriel n’est envoyé ni conservé par l’application. L’inscription aux nouvelles
est annoncée à venir. Le site est librement accessible avec non-indexation.

La [CI de la révision livrée](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/42384423387)
a validé le build, les types, les dix tests unitaires et les 17 scénarios navigateur.
La recette du domaine a réussi le 7 novembre à 15:07 UTC : 17/17, sans test ignoré
ni instable. Les captures desktop/mobile ont été inspectées. Le contact sans
JavaScript, le footer et les interactions sont vérifiés derrière Cloudflare ;
aucune erreur console ou d’hydratation n’a été relevée au contrôle complémentaire.

Le rollout s’est terminé à **15:07:11 UTC, soit 16:07:11 Europe/Paris**. Le pod
est prêt, sans redémarrage, sous UID 10001 avec racine en lecture seule. Le digest
actif correspond à la publication CI. La sonde finale a observé les anciennes
réponses avant bascule, puis un timeout isolé de deux secondes, puis **102 secondes
de santé continue au SHA attendu**. Ces échecs sont conservés ; aucune absence
absolue de coupure n’est revendiquée. TLS est valide. Les métriques récentes de
pression de l’hôte valent zéro ; aucune alerte ciblée hôte/namespace ne déclenche.

Limites : la sonde HTTP permanente propre à ce site est encore absente
([suivi 2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2)).
Open Sans et la signature textuelle restent provisoires en attendant le logo,
Handelson Four et les exports Canva validés
([suivi 1](https://github.com/salete-sincere/site-chaufferie-cil/issues/1)).
Les capacités natives de partage/presse-papiers sont simulées dans les tests ;
les sources externes sont interceptées après vérification de leur destination.
Aucun courriel réel n’a été envoyé. Le bilan Telegram a été accepté ; sa lecture
n’est pas attestée.

## Annexes

### Révision et preuves

| Élément | Résultat |
| --- | --- |
| SHA applicatif testé et livré | `b92efa6d5be9b5a796a85af3f8763afb3908847d` |
| Image | `ghcr.io/salete-sincere/site-chaufferie-cil:b92efa6d5be9b5a796a85af3f8763afb3908847d` |
| Digest publié et `imageID` actif | `sha256:4fb825c8068d89ca53d1f1c96521560d134f8a2844f78fbfa561c1b0217ba7c6` |
| Pod qualifié | `site-chaufferie-cil-fbfbd8566-hk8nd`, 1/1, zéro redémarrage |
| Environnement CI | Node.js 24, Ubuntu 22.04, Playwright 1.65.0, Chromium avec sandbox |
| Environnement de recette | Penthouse, Node.js 24.22.2, Chromium 153.0.8010.12, sandbox active, un worker |
| CI E2E | 17 réussis, zéro échec/ignoré/instable ; début 15:04:08.379 UTC, durée 24,060 s |
| Staging E2E | 17 réussis, zéro échec/ignoré/instable ; début 15:07:28.660 UTC, durée 14,825 s |
| Contrôle hydratation | 15:08:20–15:08:21 UTC, zéro erreur console/page, message et actions fonctionnels |
| Ressources demandées / plafonds | 100m CPU / 128Mi ; 500m / 512Mi |
| Mesure ponctuelle après rollout | 6m CPU, 44Mi mémoire ; ce relevé ne constitue pas un test de charge |
| Prometheus | 15:08:17 UTC ; pression mémoire/disque/PID à zéro, échantillons âgés de 21 s, cible kube-state-metrics UP |

Commandes versionnées réellement exécutées :

```sh
npm run build
npm run typecheck
npm test
npm run test:e2e
npm run test:e2e:staging
git diff --check
```

Commande exacte de recette locale, avec le navigateur autorisé :

```sh
PATH=/tmp/chaufferie-toolchain/node_modules/node/bin:$PATH \
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome \
npm run test:e2e:staging
```

L’artefact CI `golden-journeys-b92efa6d5be9b5a796a85af3f8763afb3908847d` est disponible
sur la page du workflow, avec rétention de sept jours. Une copie durable des
rapports CI, staging, de l’échec initial, des relevés et de leurs empreintes est
conservée **hors Git** dans
`/home/ubuntu/source/site-chaufferie-cil/test-results/delivery-20261107/`.
Ce rapport et les corrections documentaires postérieures ne changent pas le SHA
applicatif livré ; aucun contenu applicatif n’a été modifié après qualification.

### Couverture des Golden Journeys

- **Je m’informe** : dossier, FAQ, recherche/thèmes, absence de résultat, ancres,
  chiffres et accès à la référence exacte.
- **Je milite** : copie des trois textes, partage natif, annulation, refus et
  replis manuels lorsque les capacités du navigateur manquent.
- **Je rejoins** : choix multiples ou aucun choix, message facultatif, adresse,
  objet et encodage du courriel, copie, absence de requête d’écriture et de
  persistance, lecture/contact sans JavaScript.
- **Contrôles transverses** : clavier, mobile sans débordement, analyse automatique
  axe WCAG 2.1 AA, route inconnue et non-indexation des pages/ressources.

Les simulations ne prouvent ni la délivrabilité ni la compatibilité de toutes les
applications de messagerie/partage. L’analyse axe ne vaut pas certification.
S8 et S10 ont répondu 403 aux contrôles automatisés des sources ; leur indisponibilité
pour un lecteur humain n’est pas démontrée. Voir [qualification](qualification.md).

### Santé et historique des corrections

Observation finale, bornée à 120 secondes au maximum, sans chevauchement :

```sh
node scripts/observe-health.mjs \
  https://chaufferie-cil-staging.saletesincere.fr/health \
  b92efa6d5be9b5a796a85af3f8763afb3908847d 120 60
```

Du 15:06:59.024 au 15:08:56.404 UTC : 233 requêtes, dont 26 réponses HTTP 200 de
l’ancienne révision avant bascule, un timeout de 2 s à 15:07:14.386 et 206 réponses
conformes à la révision livrée. Fenêtre finale saine : 102 s ; p95 des réponses
conformes : 38 ms, maximum : 63 ms. Résumé final `passed=true` à 15:08:56.884 UTC.

Les échecs précédents restent documentés :

- La première CI `42383012995` ne pouvait pas lancer le navigateur avec sandbox
  sur `ubuntu-latest`. Le runner de qualification a été fixé à Ubuntu 22.04,
  en conservant `chromiumSandbox: true`.
- Le SHA `15a0be0` passait les 17 tests en CI, mais seulement 16 sur le domaine :
  Cloudflare obfusquait les liens de contact sans JavaScript. Les marqueurs HTML
  ciblés corrigent ce comportement sans modifier la zone globale ;
  [suivi 3](https://github.com/salete-sincere/site-chaufferie-cil/issues/3).
- La première installation a produit 16 réponses 404 et 18 réponses 503 avant
  disponibilité du premier pod. L’ancien observateur produisait ensuite un faux
  timeout à son échéance ; la régression a été reproduite puis corrigée. Le bilan
  initial demeure échoué ; [suivi 4](https://github.com/salete-sincere/site-chaufferie-cil/issues/4).

### Exploitation et suites

Le namespace est dédié, avec un seul replica, Service interne, Traefik, TLS,
politiques réseau restrictives et aucune base/PVC métier/SMTP/CMS. DNS et Secret de
lecture GHCR ont été créés pour ce site uniquement. Les services voisins n’ont
pas été modifiés. Le retour arrière réactive une image et son `APP_REVISION`
ensemble, puis exige une nouvelle recette selon le [guide](deploiement.md).
La révision technique précédente `15a0be0` réintroduirait le défaut de contact sans
JavaScript ; elle n’est pas une version fonctionnellement équivalente.

Les issues 1 et 2 portent les échéances de revue, charges indicatives et critères
restants. La collecte d’adresses, PostgreSQL et Strapi demeurent reportés.
