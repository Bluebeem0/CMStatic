# 0005 — Schémas de contenus en Zod, déclarés par le thème

- **Statut** : Accepté
- **Date** : 2026-11-17

## Contexte

Chaque thème a besoin de ses propres types de contenus. Il faut valider les fichiers, typer le code des thèmes et générer les formulaires de l'interface, sans décrire les champs trois fois.

## Décision

Le thème exporte un manifeste `theme.config.ts` construit avec `defineTheme`, `collection`, `singleton` et les helpers `fields.*` de `@cmstatic/core`. Chaque helper produit un schéma Zod et des métadonnées d'interface (libellés traduits, aide, widget) sérialisables en JSON pour l'interface.

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Helpers maison au-dessus de Zod | Une seule déclaration pour validation, types et formulaires ; Zod déjà utilisé par Astro | API à concevoir et maintenir |
| Zod brut + introspection | Pas d'API maison | Libellés et widgets impossibles à exprimer proprement |
| JSON Schema | Standard, langage-agnostique | Typage TypeScript plus faible, verbeux pour les créateurs de thèmes |

## Conséquences

- L'API `fields.*` devient une API publique : elle doit être stable et documentée avant la v0.1.
- Un plugin pourra ajouter des types de champs en fournissant schéma + widget.
