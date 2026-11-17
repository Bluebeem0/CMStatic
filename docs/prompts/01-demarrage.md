# Prompts pour Claude Code

À copier-coller dans Claude Code, lancé à la racine du dépôt `cmstatic`. Un prompt par session ; attends la fin et relis avant de passer au suivant.

---

## Session 1 — Prise de connaissance (sans écrire de code)

```
Lis CLAUDE.md puis tous les fichiers de docs/ et docs/adr/ dans l'ordre indiqué par CLAUDE.md.

Ensuite, sans écrire de code :
1. Résume-moi le projet en 5 lignes pour vérifier que tu l'as compris.
2. Liste les points de la doc qui te semblent ambigus, contradictoires ou risqués techniquement
   (en particulier l'intégration Astro décrite dans docs/02-architecture.md : vérifie dans la
   documentation officielle à jour d'Astro que l'API JavaScript et le Content Layer permettent
   bien cette approche).
3. Propose ton plan pour la phase 0, tâche par tâche, avec les dépendances que tu comptes installer
   et leur version.

Attends ma validation avant de commencer.
```

## Session 2 — Phase 0

```
On attaque la phase 0 de docs/03-roadmap.md, tâche par tâche (0.1 à 0.6).
Pour chaque tâche : une branche, des commits Conventional Commits, typecheck/lint/test au vert,
puis coche la tâche dans la roadmap et donne-moi le résumé pédagogique prévu dans CLAUDE.md.
Arrête-toi après chaque tâche pour que je valide avant la suivante.
```

## Session 3 et suivantes — Phase 1

```
On passe à la tâche 1.X de docs/03-roadmap.md.
Rappelle-moi d'abord son critère d'acceptation, propose ton plan (fichiers, API publique,
tests), attends mon feu vert, puis implémente.
```

## Quand quelque chose bloque

```
Explique-moi le problème simplement, ce que tu as essayé, et 2 ou 3 options avec leurs
conséquences. Si c'est une décision structurante, rédige un ADR « Proposé » dans docs/adr/.
```

## Revue de fin de phase

```
Fais une revue de fin de phase X : relis le code de la phase, vérifie chaque critère de
sortie de docs/03-roadmap.md et les règles de sécurité de docs/02-architecture.md,
liste ce qui manque ou ce qui est fragile, et propose les corrections avant qu'on tague la version.
```
