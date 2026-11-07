# Repères du site Comité chaufferie

## Summary — 30 secondes

Application Next.js autonome, contenus Markdown locaux, aucune base de données.
Respecter la distinction entre annonces du projet, positions d’HAC et questions
ouvertes. Le site prépare des courriels sans les envoyer. Avant livraison, qualifier
les trois Golden Journeys sur le build de production et rattacher les preuves au SHA.
Préserver le namespace dédié et les autres services d’infra-sincere.

## Synthèse — 3 minutes

Lire les consignes `/home/ubuntu/AGENTS.md` et `/home/ubuntu/source/AGENTS.md` sur
Penthouse, puis README, ADR et guide de déploiement du dépôt. Les contenus de référence
sont dans `content/` ; les identifiants des sources déjà publiées et les ancres publiques doivent rester
stables. Ne pas transformer une annonce en mesure, supprimer une précaution utile,
inventer une réunion, un porte-parole ou un résultat sanitaire.

Node.js 24 et npm sont requis. Utiliser les scripts `validate:content`, `test`,
`build`, `typecheck` et `test:e2e`. Les tests de comportement suivent RED/GREEN.
Ne pas envoyer de courriel réel pendant la qualification. Les captures et traces
restent hors Git. Conserver la sandbox Chromium ; sur Penthouse, choisir l’exécutable
déjà autorisé via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

La V1 ne collecte pas d’adresses, n’a pas de backend de contact, de Strapi ou de
PostgreSQL. L’ajout de ces fonctions nécessite une demande explicite. Le domaine
staging est public et non indexé, sans promesse de confidentialité.

Documentation et preuves suivent Summary / Synthèse / Annexes. Un build seul ne
prouve pas la réussite des Golden Journeys. Vérifier l’image et le SHA actifs, TLS,
le rollout, les parcours et la fenêtre de santé après chaque livraison autorisée.

## Annexes

- [README](README.md)
- [ADR](documentation/adr-001-next-markdown.md)
- [Déploiement](documentation/deploiement.md)
- [Qualification](documentation/qualification.md)

Les nouveaux travaux ne confèrent aucun mandat implicite de publication hors du
domaine et du namespace de ce projet. Ne jamais afficher de secrets ou les inclure
dans une commande partagée. Utiliser la sortie brute pour les preuves exhaustives.
