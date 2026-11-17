# 0009 — Biome et Vitest pour l'outillage

- **Statut** : Accepté
- **Date** : 2026-11-17

## Contexte

Le mainteneur débute en TypeScript : l'outillage doit être simple, rapide et peu configurable à la main.

## Décision

Biome pour le lint et le formatage ; Vitest pour les tests unitaires et d'intégration ; Playwright pour les tests de l'interface à partir de la phase 2.

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Biome | Un seul outil, un seul fichier de config, très rapide | Moins de règles et plugins qu'ESLint |
| ESLint + Prettier | Standard, très complet | Deux outils, configuration plus lourde |
| Vitest | Compatible ESM et TypeScript sans config, API proche de Jest | — |

## Conséquences

- Si une règle ESLint indispensable manque (ex. accessibilité React), réévaluer en phase 2.
