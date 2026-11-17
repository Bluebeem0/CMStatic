# 0007 — Electron pour la coque de bureau

- **Statut** : Proposé (à confirmer au début de la phase 4)
- **Date** : 2026-11-17

## Contexte

L'application de bureau doit embarquer le serveur local et l'interface, et pouvoir lancer des builds Astro, qui nécessitent Node.

## Décision proposée

Utiliser Electron, qui inclut Node : le serveur et le builder tournent dans le processus principal, l'interface dans une fenêtre.

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Electron | Node inclus, tout en TypeScript, écosystème mûr (mises à jour, signature) | Installateur et mémoire plus lourds |
| Tauri + Node embarqué à côté | Coque légère, sécurité par défaut | Rust à apprendre ; embarquer Node réduit fortement l'avantage de taille |

## Conséquences

- Mesurer la taille de l'installateur et la mémoire en début de phase 4, puis accepter ou remplacer cet ADR.
- L'architecture (ADR 0004) garde la coque remplaçable.
