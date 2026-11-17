# 05 — Conventions

## Langues

- **Code, identifiants, commits, commentaires, docs techniques des paquets** : anglais.
- **Docs de cadrage (`docs/0*.md`, ADR)** : français.
- **Interface** : français et anglais dès le départ, toutes les chaînes passent par des clés i18n (aucun texte en dur dans les composants).

## Git

- Branche par défaut : `main`, toujours verte en CI.
- Une tâche = une branche : `feat/core-schemas`, `fix/cli-init-empty-dir`, `docs/adr-0010`, `chore/ci-cache`.
- Fusion par pull request, même en travaillant seul, pour garder une trace lisible.
- Jamais de `push --force` sur `main`.

### Messages de commit — Conventional Commits

```
<type>(<portée>): <résumé à l'impératif, en minuscules, sans point>

<corps : pourquoi ce changement, et pour une dépendance ajoutée : pourquoi elle>
```

- **Types** : `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`.
- **Portées** : nom du paquet sans préfixe (`core`, `builder`, `cli`, `server`, `admin-ui`, `plugin-api`, `deploy`, `theme-starter`) ou `repo`.
- Exemple : `feat(core): add fields.reference helper`.

## Versions

- SemVer ; `0.x` tant que les API de thèmes et de plugins peuvent changer.
- Les versions des dépendances partagées entre paquets (TypeScript, Zod, Astro…) sont fixées une seule fois dans le **catalogue pnpm** (`pnpm-workspace.yaml`) ; les paquets y font référence avec `catalog:`. Exception : les outils de la racine (TypeScript, Biome, Vitest…) sont fixés directement dans le `package.json` racine, car Dependabot gère mal `catalog:` à cet endroit.
- Chaque changement d'un paquet publiable s'accompagne d'un changeset (`pnpm changeset`).

## Code

- TypeScript `strict`, ESM, `"type": "module"` dans chaque paquet.
- Biome pour le lint et le format ; aucune règle désactivée sans commentaire.
- Noms : fichiers `kebab-case.ts`, fonctions et variables `camelCase`, types et composants `PascalCase`, constantes `SCREAMING_SNAKE_CASE` seulement pour les vraies constantes.
- Exports nommés ; un `index.ts` par paquet qui définit l'API publique — rien d'autre n'est importable depuis l'extérieur.
- Données externes validées avec Zod ; types dérivés des schémas avec `z.infer`.
- Effets (disque, réseau, horloge) isolés derrière de petites fonctions injectables, pour tester la logique sans eux.
- Erreurs métier : classes d'erreur typées avec un `code` stable (ex. `CONTENT_INVALID_SLUG`) traduit dans l'interface.

## Tests

- Vitest ; fichiers `*.test.ts` à côté du code testé.
- Chaque bug corrigé arrive avec un test qui le reproduit.
- Tests de bout en bout dans `examples/` et, pour l'interface, Playwright (phase 2).
- Pas d'accès réseau dans les tests unitaires ; les cibles de déploiement se testent contre des serveurs locaux (conteneurs) en CI.

## Documentation

- Le README de chaque paquet dit : à quoi il sert, comment l'utiliser, son API publique.
- Toute décision structurante = un ADR (`docs/adr/NNNN-titre.md`, modèle `0000-template.md`).
- Les idées hors périmètre vont dans `docs/ideas.md`.
