# ADR 001 — Next.js et contenus Markdown locaux

## Summary — 30 secondes

Décision acceptée le 7 novembre 2026 : utiliser Next.js App Router en production,
dans un conteneur autonome sur infra-sincere, avec des contenus Markdown versionnés.
La première version n’a ni PostgreSQL ni CMS. Le contact prépare un courriel côté
navigateur. Le domaine public retenu est `stopchaufferiehaubourdin.fr`, avec mise en
service à qualifier et préversion conservée. Les deux adresses restent soumises à
la consigne de non-indexation.

## Synthèse — 3 minutes

Le propriétaire demande une application Next.js complète. Les pages documentaires
sont prérendues au build et servies par le runtime Node.js standalone ; `/health`
expose la disponibilité HTTP et la révision. Le traitement des images est réalisé
au build. Aucune donnée mutable ni sortie réseau du serveur applicatif n’est nécessaire.

Les collections FAQ, chiffres, introduction et sources sont chargées depuis quatre
fichiers Markdown. Le communiqué de presse est un cinquième document indépendant,
avec auteur, date et provenance, rendu intégralement sur `/communique-de-presse`.
Leurs références et leur format sont contrôlés avant chaque build.
Le rendu interdit les protocoles de liens dangereux et échappe le HTML brut. Le CMS
futur remplacera ce chargement lorsqu’il sera décidé ; aucune abstraction de stockage
ou API d’administration inutilisée n’est introduite maintenant.

L’envoi direct aurait nécessité un service de courriel, une protection contre les
abus et une gestion des données de contact. Le parcours retenu génère un `mailto:`
et offre une copie manuelle. Il ne démontre pas la délivrabilité d’un courriel et
n’affiche jamais de confirmation d’envoi. Les tests contrôlent sa préparation,
sans transmettre de message réel au groupe.

Le domaine public retenu est `https://stopchaufferiehaubourdin.fr`. Son activation
suit la [procédure dédiée](domaine-public.md), avec DNS OVH vers Penthouse et
certificat HTTP-01 géré dans le namespace de l’application. La préversion
`https://chaufferie-cil-staging.saletesincere.fr` est maintenue. Les deux adresses
doivent rester accessibles sans authentification et conserver la consigne de non-indexation.
Ce choix permet la relecture par lien mais ne constitue pas une confidentialité.

`SITE_URL` définit les URL absolues des métadonnées lors du build, avec
`https://stopchaufferiehaubourdin.fr` comme valeur par défaut. Il peut être remplacé
pour une qualification de la préversion, y compris via l’argument de build Docker
du même nom. Les pages étant prérendues, un changement de cette valeur exige un
nouveau build. Le choix du domaine ne déclenche ni publication ni activation DNS.

Le code est public à la demande du propriétaire. L’accès au package GHCR est géré
séparément. Les ressources Kubernetes sont isolées dans
un namespace dédié, sans volume métier. Le retour arrière consiste à réactiver
une image et sa révision connues ; aucune migration de données n’est nécessaire.

## Annexes

- [Plan de qualification](qualification.md).
- [Procédure de déploiement](deploiement.md).
- [Mise en service du domaine public](domaine-public.md).
- [Fonctionnement Next.js standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).
