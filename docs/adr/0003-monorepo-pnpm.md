# 0003 — Monorepo TypeScript avec pnpm workspaces

- **Statut** : Accepté
- **Date** : 2026-11-17

## Contexte

Le projet compte plusieurs paquets (cœur, builder, serveur, interface, plugins, thèmes, CLI) qui partagent des types et évoluent ensemble.

## Décision

Un seul dépôt, géré avec pnpm workspaces, en TypeScript strict et ESM. Changesets gère les versions des paquets publiables.

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Monorepo pnpm | Types partagés, un seul CI, changements atomiques entre paquets, pnpm rapide et strict | Configuration initiale plus longue |
| Un dépôt par paquet | Indépendance | Synchronisation des versions pénible, changements transverses en plusieurs PR |
| Monorepo + Nx/Turborepo | Cache de build | Outil de plus à apprendre ; inutile à cette taille (réévaluer plus tard) |

## Conséquences

- Les contributeurs clonent un seul dépôt.
- Une règle simple évite les cycles : `core` ne dépend d'aucun paquet interne.
