# 0001 — Contenus en fichiers Markdown + YAML dans un dépôt Git

- **Statut** : Accepté
- **Date** : 2026-11-17

## Contexte

Les contenus doivent rester la propriété de l'utilisateur, être versionnés, permettre la collaboration et être lisibles par les trois coques (local, bureau, serveur) sans divergence.

## Décision

Chaque site est un dossier initialisé comme dépôt Git. Les entrées de collections sont des fichiers Markdown avec frontmatter YAML ; les singletons et la configuration sont des fichiers YAML. Aucune base de données n'est la source de vérité ; un index en mémoire ou en cache (`.cmstatic/`) peut accélérer les lectures mais se reconstruit toujours depuis les fichiers.

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Fichiers + Git | Portable, diff lisible, historique et collaboration gratuits, aucune dépendance | Requêtes complexes plus lentes, conflits de fusion possibles |
| Base SQLite locale | Requêtes rapides, transactions | Format opaque, pas de diff, collaboration difficile, synchronisation à inventer |
| Base serveur (PostgreSQL…) | Multi-utilisateurs natif | Impossible hors ligne, alourdit le mode local |

## Conséquences

- Collaboration et historique reposent sur Git (phases 3 et 5).
- Il faut gérer les écritures atomiques et la validation à la lecture (un fichier peut être modifié à la main).
- Les très gros sites (milliers d'entrées) pourront demander un index en cache.
