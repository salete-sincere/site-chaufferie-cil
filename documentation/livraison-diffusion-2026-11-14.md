# Livraison — diffusion, tract imprimable et accueil au pluriel

## Summary — 30 secondes

Le site est en ligne sur les deux domaines au SHA `54142ddf0c35800e715e872abfc252565479b74a`. L’accueil affiche « Nos quartiers. Nos avenirs. Nos voix. », le bandeau invite à faire savoir autour de soi et « Je milite » propose le PDF A5 original. Les 30 Golden Journeys passent sur chaque adresse. Les transitoires de bascule et le défaut intermittent d’ancre FAQ restent suivis, sans incident persistant observé lors des fenêtres qualifiées.

## Synthèse — 3 minutes

La [PR 14](https://github.com/salete-sincere/site-chaufferie-cil/pull/14) ajoute le bloc « Le tract à votre fenêtre » et son téléchargement natif sans JavaScript ni compte Canva. Le PDF fourni est conservé octet pour octet : une page A5, 82 780 octets, polices intégrées. Le bandeau « Version de travail » devient « Faites savoir autour de vous » ; la mention « de travail » du pied de page est retirée. La [PR 15](https://github.com/salete-sincere/site-chaufferie-cil/pull/15) reprend le texte final demandé et « Un autre choix pour nos quartiers ». Corpus, sources, ancres et cartes de partage sont préservés.

Les builds, types, 14 tests unitaires et 30 scénarios E2E passent en CI. Le nouveau Golden Journey télécharge réellement le PDF, vérifie l’empreinte d’origine et les octets reçus, puis retrouve le lien après rechargement. Les trois Golden Journeys, droits, refus et replis, absence de persistance, lecture sans JavaScript, clavier, mobile, axe et aperçus restent couverts. Les 34 captures finales des domaines ont été ouvertes et inspectées ; aucun défaut visuel nouveau constaté.

Copilot a relu les têtes finales en état `COMMENTED`. Sa demande de contrôle SHA-256 est corrigée. Sa remarque liée à l’ancienne description du titre est réfutée par la formulation finale explicitement confirmée, puis résolue ; code et description concordent. Le CSS, classé généré par Copilot, a été relu indépendamment. Aucune approbation formelle inexistante n’est annoncée.

Deux activations limitées à l’image et à `APP_REVISION` du conteneur `web` sont qualifiées. La dernière se termine le 14 novembre à **12 h 04 min 29 s Europe/Paris (11:04:29 UTC)**. Image et digest actifs, pod prêt sans redémarrage, TLS et métriques fraîches passent au postflight. Les recettes finales sont **30/30 sur chaque adresse**. Les sondes commencées avant chaque bascule conservent tous les transitoires ; les fenêtres finales durent 140 s et 143 s après le dernier rollout. Les 502/timeouts restent rattachés au [suivi 6](https://github.com/salete-sincere/site-chaufferie-cil/issues/6), sans cause démontrée.

Un échec CI initial d’ancre FAQ (29/30, réponse ouverte mais titre hors écran) reste suivi en [16](https://github.com/salete-sincere/site-chaufferie-cil/issues/16) ; les passages finaux ne prouvent pas sa correction. La sonde HTTP permanente reste absente ([2](https://github.com/salete-sincere/site-chaufferie-cil/issues/2)). Des signaux informatifs hors projet sont conservés. Partages et destinations tierces restent simulés dans leurs scénarios ; le PDF ne l’est pas. Aucun courriel réel envoyé, aucune impression physique ni certification d’accessibilité revendiquée. Le bilan Telegram est accepté ; lecture non attestée.

## Annexes

### Révision finale et exploitation

| Élément | Preuve |
| --- | --- |
| SHA actif public et staging | `54142ddf0c35800e715e872abfc252565479b74a` |
| Image immuable active | `ghcr.io/salete-sincere/site-chaufferie-cil:54142ddf0c35800e715e872abfc252565479b74a@sha256:6aaa369ba40dcb863b2f650b1231e136dbce035cd550861e2d2c88ff87686f67` |
| Manifest Linux amd64 | `sha256:a9ca0fe62394ab37a625a36ec61f879057aa9c387cd3f937f8f82b76cbca5dbf` |
| Labels OCI | Révision `54142ddf0c35800e715e872abfc252565479b74a`, source `https://github.com/salete-sincere/site-chaufferie-cil` |
| Pod | `site-chaufferie-cil-6b4c85994d-nlf4h`, prêt, zéro redémarrage |
| Rollout | `11:04:29 UTC`, succès ; Deployment génération 9 |
| Postflight | `2026-11-14T11:08:04.567559+00:00`, 13/13 contrôles |
| Âge de la métrique de disponibilité | 19.54 s, un replica disponible |
| Alertes | Aucune du namespace ; InfoInhibitor et CPUThrottlingHigh informatives dans argocd, préexistantes |
| Certificat public | Valide, échéance `Feb  7 14:10:53 2027 GMT` |
| Certificat staging | Valide, échéance `Dec 15 11:42:24 2026 GMT` |
| Notification propriétaire | Acceptée à `2026-11-14T11:11:46.920183+00:00`, lecture non attestée |

Le précédent couple de retour arrière reste disponible : révision `1397c5bef983852bf1464d85485871dcea001c8e`, image épinglée au digest `sha256:0b6413f1ad943d6f4f2e0591b0592660e05e9ef090cb93cf022e23d987b378d3`. Le patch inverse est conservé avec des gardes. Aucune migration de données n’est impliquée. Les autres namespaces et le monitoring n’ont pas été modifiés.

### Résultats et commandes reproductibles

| Qualification | Révision | Résultat |
| --- | --- | --- |
| CI finale PR 14 | Tête `9c4b9da`, fusion simulée `116f6c7` | [43585934277](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/43585934277), succès |
| CI de publication du flyer | `1397c5b` | [43586242878](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/43586242878), succès |
| CI finale PR 15 | Tête `fc41a7c` | [43587394970](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/43587394970), succès |
| CI finale main | `54142ddf0c35800e715e872abfc252565479b74a` | [43587795810](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/43587795810), 30/30, 59.193 s |
| Recette HTTPS publique | `54142ddf0c35800e715e872abfc252565479b74a` | 30/30, début `2026-11-14T11:05:27.227Z`, 45.539 s |
| Recette HTTPS staging | `54142ddf0c35800e715e872abfc252565479b74a` | 30/30, début `2026-11-14T11:08:00.164Z`, 51.189 s |

En local et pour les recettes : Node.js 24.22.2, Playwright 1.65.0, Chromium approuvé avec sandbox, un worker. CI : Node.js 24 et Ubuntu 22.04. Le checkout des recettes correspond exactement au SHA actif.

```sh
export PATH=/tmp/chaufferie-content-toolchain/node_modules/node/bin:$PATH
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome
npm run build
npm run typecheck
npm test
npm run test:e2e
git diff --check
export SITE_URL=https://stopchaufferiehaubourdin.fr
E2E_BASE_URL=https://stopchaufferiehaubourdin.fr npm run test:e2e
E2E_BASE_URL=https://chaufferie-cil-staging.saletesincere.fr npm run test:e2e
```

Le premier run de PR 15 [43587102976](https://github.com/salete-sincere/site-chaufferie-cil/actions/runs/43587102976) est conservé avec sa trace et son unique échec FAQ ; le test de visibilité n’a pas été affaibli. Voir le [diagnostic et critères de suivi](https://github.com/salete-sincere/site-chaufferie-cil/issues/16). Les revues sont [5903860299](https://github.com/salete-sincere/site-chaufferie-cil/pull/14#pullrequestreview-5903860299) et [5903953641](https://github.com/salete-sincere/site-chaufferie-cil/pull/15#pullrequestreview-5903953641), avec fils résolus.

### Observations des deux bascules

| Révision | Domaine | Mesures | Anciennes saines | Erreurs réelles | Fenêtre finale saine |
| --- | --- | ---: | ---: | ---: | ---: |
| `1397c5b` | public | 354 | 64 | 2 | 142 s |
| `1397c5b` | staging | 353 | 57 | 2 | 146 s |
| `54142dd` | public | 353 | 70 | 2 | 140 s |
| `54142dd` | staging | 354 | 64 | 1 | 143 s |

Durée bornée : 180 s par sonde, au plus deux requêtes par seconde et par domaine, sans chevauchement, timeout 2 s. Les secondes finales commencent après le marqueur de fin du rollout et le dernier transitoire. Première livraison : un 502 et un timeout sur chaque adresse. Dernière livraison : un 502 et un timeout publics, un timeout staging. Aucun seuil de trois erreurs réelles consécutives atteint. Les horodatages détaillés et la revue proposée au 16 novembre sont conservés dans le [suivi 6](https://github.com/salete-sincere/site-chaufferie-cil/issues/6#issuecomment-6876396573). Aucun intervalle non mesuré n’est présenté comme une continuité attestée.

### PDF et captures

Le [PDF original](https://stopchaufferiehaubourdin.fr/documents/tract-chaufferie-haubourdin.pdf) est accessible depuis [Je milite](https://stopchaufferiehaubourdin.fr/militer). Format A5 portrait 147,90 × 210,08 mm, une page, 82 780 octets ; SHA-256 `0c374b0adc3ec9fc58851251df60a3dae849f06eef87380b9f5b6151d9a3b58f`. L’identité des octets et le titre exact de l’accueil sont également vérifiés via les deux ingresses. Les polices Handelson Four et Open Sans sont intégrées. Impression physique, colorimétrie et décodage QR non testés ; le petit logo raster peut perdre en netteté en agrandissement.

Les 17 paires de captures public/staging sont identiques par SHA-256. Les largeurs de page sont 390 px sur mobile et 1440 px sur ordinateur. Les unités des grands chiffres serrées et le cartouche jaune de l’affiche mobile sont deux réserves décoratives préexistantes, distinctes du nouveau titre et du téléchargement.

### Conservation

Les preuves expurgées, rapports HTML/JSON, captures, traces, journaux, vérifications PDF/OCI/TLS, patches de retour arrière, sondes et accusé Telegram sont conservés hors Git sous `test-results/delivery-diffusion-20261114/`, avec document d’accompagnement et manifeste SHA-256. Les artefacts CI restent attachés aux runs ci-dessus pendant leur rétention. Aucun secret ni état de connexion n’est versionné. Le commit documentaire de ce rapport ne modifie pas le contenu applicatif qualifié.
