# CLAUDE.md — Instructions pour Claude Code

Ce fichier dit comment travailler sur CMStatic. Il prime sur tes habitudes par défaut. En cas de doute, demande.

## Le projet en une phrase

CMStatic est un CMS open source (MIT) qui génère des sites statiques avec Astro : contenus en fichiers Markdown/YAML dans Git, thèmes qui déclarent leurs types de contenus en Zod, interface d'administration React, d'abord en local, puis en application de bureau, puis en serveur.

## Avant de coder, lis dans cet ordre

1. `docs/01-vision.md` — pourquoi, pour qui, principes, glossaire
2. `docs/02-architecture.md` — comment c'est découpé
3. `docs/03-roadmap.md` — où on en est, quelle tâche faire
4. `docs/04-specs-mvp.md` — ce que « fini » veut dire pour l'utilisateur
5. `docs/05-conventions.md` — règles de code, Git, tests
6. `docs/adr/` — décisions déjà prises (ne pas les rediscuter sans raison)

## Le mainteneur

- Fodié, étudiant en administration systèmes et réseaux. Il est **débutant en TypeScript et React** et apprend avec ce projet.
- **Parle-lui en français.** Le code, les identifiants, les commits et les commentaires de code sont en anglais.
- Préfère toujours le code **simple et lisible** au code astucieux. Pas de types génériques complexes quand un type simple suffit.
- Commente le **pourquoi** dans le code quand ce n'est pas évident, de façon pédagogique.
- À la fin de chaque tâche, explique-lui en quelques lignes : ce que tu as fait, les notions nouvelles utilisées (avec un lien vers la doc officielle), et comment tester lui-même.

## Comment travailler

- **Une phase à la fois**, dans l'ordre de `docs/03-roadmap.md`. Ne commence pas une tâche d'une phase suivante.
- **Une tâche = une branche** (`feat/…`, `fix/…`, `chore/…`, `docs/…`) avec des commits petits et atomiques au format Conventional Commits. Ne fusionne jamais dans `main` sans accord explicite.
- **Avant une tâche** : annonce un plan court (fichiers touchés, dépendances ajoutées, tests prévus) et attends le feu vert si la tâche ajoute une dépendance ou change une API publique.
- **Pendant** : écris les tests en même temps que le code. Lance `pnpm typecheck && pnpm lint && pnpm test` avant chaque commit.
- **Après** : coche la tâche dans `docs/03-roadmap.md` et mets à jour la doc concernée.
- **Hors périmètre** : si une idée sort de la tâche ou de la phase, note-la dans `docs/ideas.md` et continue. N'élargis jamais le périmètre seul.
- **Décision structurante non couverte par un ADR** : rédige un nouvel ADR au statut « Proposé » (modèle `docs/adr/0000-template.md`) et attends sa validation.
- **Bibliothèques** : Astro, Tailwind, shadcn/ui et Zod évoluent vite. Vérifie la documentation officielle à jour avant d'utiliser une API ; ne te fie pas à ta mémoire. Si une API documentée ici n'existe plus, signale-le au lieu de contourner.

## Commandes

Elles existent à partir de la fin de la phase 0, sauf `pnpm cmstatic` qui arrive avec la CLI en phase 1 (tâche 1.7).

| Commande | Effet |
| --- | --- |
| `pnpm install` | Installe toutes les dépendances du monorepo |
| `pnpm typecheck` | Vérifie les types de tous les paquets |
| `pnpm lint` | Biome : lint + format (vérification, Markdown exclu) |
| `pnpm format` | Biome : reformate le code, trie les imports et applique les corrections sûres |
| `pnpm test` | Vitest sur tous les paquets |
| `pnpm build` | Construit tous les paquets |
| `pnpm cmstatic <cmd>` | Lance la CLI locale (`init`, `dev`, `build`, `deploy`) |

## Règles de code

- TypeScript `strict`, ESM uniquement, Node ≥ 22.22 (Node 24 en développement, voir `.nvmrc`).
- Pas de `any`. Pas de `as` pour faire taire le compilateur ; si c'est nécessaire, commente pourquoi.
- Toute donnée venant de l'extérieur (fichiers, requêtes HTTP, config, CLI) est validée avec **Zod** avant usage.
- Exports nommés, fichiers en `kebab-case.ts`, tests à côté du code en `*.test.ts`.
- Fonctions courtes ; la logique métier est pure et testable, les effets (disque, réseau) sont isolés en bordure.
- Les erreurs destinées à l'utilisateur sont claires, traduisibles (clé i18n) et disent quoi faire.

## Définition de « terminé »

Une tâche est terminée quand :

- [ ] `pnpm typecheck`, `pnpm lint` et `pnpm test` passent ;
- [ ] le nouveau comportement est couvert par des tests ;
- [ ] la doc concernée est à jour et la tâche est cochée dans la roadmap ;
- [ ] un changeset est ajouté si un paquet publiable change ;
- [ ] le résumé pédagogique a été donné au mainteneur.

## Sécurité — non négociable

- Le serveur d'administration local écoute **uniquement sur `127.0.0.1`** et exige un **jeton de session** aléatoire généré au lancement.
- Tout chemin ou slug reçu est normalisé et vérifié : aucune écriture en dehors du dossier du site (pas de `..`, pas de chemin absolu, pas de lien symbolique sortant).
- Les secrets (mots de passe SFTP, clés S3, jetons Git) ne sont **jamais** écrits dans le dépôt du site, ni dans les logs, ni dans les messages d'erreur.
- Chaque nouvelle dépendance est justifiée dans le corps du commit (pourquoi elle, maintenue ?, alternatives).
- Le HTML produit par le Markdown est assaini.

## À ne pas faire

- Pas de base de données : les fichiers du site sont la seule source de vérité.
- Pas de fonctionnalité d'une phase future « pendant qu'on y est ».
- Pas de modification d'un ADR accepté : on en écrit un nouveau qui le remplace.
- Pas de dépendance lourde ou peu maintenue sans accord.
- Pas de `git push --force`, pas de réécriture de l'historique de `main`.
