# CMStatic

> CMS open source qui génère des sites statiques modernes.
> Simple pour celui qui écrit, puissant pour celui qui crée les thèmes, et Git sous le capot pour que rien ne se perde.

**Statut : en conception — aucune version publiée.**

## Ce que c'est

CMStatic est une application qui permet de créer, modifier et publier un site web statique sans connaissances techniques :

- **pour le rédacteur** : une interface d'écriture claire, un aperçu en direct, un bouton « Publier » ;
- **pour le créateur de thèmes** : des thèmes écrits avec Astro, Tailwind et shadcn/ui, qui déclarent leurs propres types de contenus (articles, projets, événements, fiches…) ;
- **pour le développeur** : une API de plugins typée pour ajouter des types de contenus, des champs, des étapes de build ou des écrans d'administration ;
- **pour tous** : des contenus stockés en fichiers Markdown/YAML dans un dépôt Git, lisibles et récupérables sans l'outil.

CMStatic fonctionne d'abord en local (dans le navigateur), puis en application de bureau, puis en serveur auto-hébergé multi-utilisateurs. Les trois partagent le même cœur.

## Documentation

| Document | Contenu |
| --- | --- |
| [docs/01-vision.md](docs/01-vision.md) | Vision, publics, objectifs, principes, glossaire |
| [docs/02-architecture.md](docs/02-architecture.md) | Paquets, modèle de données, flux, API, sécurité, pile technique |
| [docs/03-roadmap.md](docs/03-roadmap.md) | Phases, livrables, critères de sortie, tâches détaillées |
| [docs/04-specs-mvp.md](docs/04-specs-mvp.md) | User stories et critères d'acceptation du MVP |
| [docs/05-conventions.md](docs/05-conventions.md) | Git, code, tests, documentation, i18n |
| [docs/adr/](docs/adr/) | Décisions d'architecture |
| [CLAUDE.md](CLAUDE.md) | Instructions pour les agents de code |

## Démarrer

Les instructions d'installation arriveront avec la première version (fin de la phase 1).

## Contribuer

Les contributions sont les bienvenues : voir [CONTRIBUTING.md](CONTRIBUTING.md) (en anglais) et le [code de conduite](CODE_OF_CONDUCT.md). Les failles de sécurité se signalent en privé, voir [SECURITY.md](SECURITY.md).

## Licence

[MIT](LICENSE) © 2026 Fodié Diaouné
