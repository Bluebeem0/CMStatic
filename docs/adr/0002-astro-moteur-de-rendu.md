# 0002 — Astro comme moteur de rendu des sites

- **Statut** : Accepté
- **Date** : 2026-11-17

## Contexte

Il faut produire des sites statiques rapides avec des thèmes modernes (Tailwind, composants React/shadcn/ui), sans réécrire un générateur.

## Décision

Les thèmes sont des projets Astro. `@cmstatic/builder` pilote Astro par son API JavaScript et lui fournit les contenus du site via les collections de contenu (Content Layer).

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Astro | HTML statique par défaut, îlots React, Tailwind natif, collections typées en Zod, grand écosystème | Dépendance à un projet tiers qui évolue vite ; Node requis au build |
| Générateur maison | Contrôle total, formateur | Des mois de travail sur une brique non différenciante |
| Eleventy | Simple, stable | Pas d'îlots React natifs, typage plus faible |
| Next.js en export statique | Écosystème React | Lourd pour des sites de contenu, JavaScript client plus important |

## Conséquences

- Les créateurs de thèmes profitent de toute la documentation Astro.
- Node doit être disponible au moment du build, y compris dans l'application de bureau (ADR 0007).
- Le rendu est isolé derrière l'interface de `builder` pour limiter l'impact des changements majeurs d'Astro ; versions figées.
