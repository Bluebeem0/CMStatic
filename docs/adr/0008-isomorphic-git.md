# 0008 — isomorphic-git pour les opérations Git

- **Statut** : Proposé (à confirmer en phase 3)
- **Date** : 2026-11-17

## Contexte

CMStatic initialise un dépôt Git par site et commit à chaque publication, sans exiger que l'utilisateur ait Git installé (cas fréquent sur Windows et macOS pour un non-technicien).

## Décision proposée

Utiliser isomorphic-git, implémentation de Git en JavaScript pur, derrière une petite interface dans `core` (`initRepo`, `commitAll`, `log`…).

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| isomorphic-git | Aucun binaire requis, fonctionne dans Electron et en serveur | Plus lent sur de gros dépôts, certaines fonctions avancées absentes |
| simple-git (binaire `git`) | Toutes les fonctions de Git, rapide | Exige Git installé et dans le PATH |

## Conséquences

- L'interface Git de `core` permet de changer d'implémentation plus tard.
- Vérifier en phase 5 que la fusion et la gestion des conflits suffisent.
