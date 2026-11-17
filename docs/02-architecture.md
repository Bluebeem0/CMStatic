# 02 — Architecture

## Vue d'ensemble

Toute la logique vit dans un cœur partagé ; l'admin local, l'application de bureau et le serveur n'en sont que des enveloppes (« coques »).

```
   ┌──────────────┐   ┌────────────────┐   ┌─────────────────────┐
   │ Admin local  │   │ Appli bureau   │   │ Serveur auto-hébergé│
   │ CLI, phase 1-3│  │ Electron, ph. 4│   │ comptes, phase 6    │
   └──────┬───────┘   └───────┬────────┘   └──────────┬──────────┘
          └───────────────────┼───────────────────────┘
                              ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ admin-ui  — React + shadcn/ui, formulaires générés des schémas│
   └──────────────────────────────┬───────────────────────────────┘
                                  ▼ HTTP JSON (server)
   ┌──────────────────────────────────────────────────────────────┐
   │ Cœur partagé                                                 │
   │  core        plugin-api      builder         deploy          │
   │  schémas,    types, champs,  rendu Astro,    SFTP, S3,       │
   │  fichiers,   points          build statique, Pages           │
   │  index, git  d'accroche      aperçu                          │
   └──────┬──────────────────────────┬───────────────────┬────────┘
          ▼ lit / écrit              ▲ se branchent      ▼ publie
   ┌──────────────┐        ┌──────────────────┐   ┌───────────────┐
   │ Dépôt Git du │        │ Thèmes, plugins  │   │ Site statique │
   │ site         │        │                  │   │ en ligne      │
   └──────────────┘        └──────────────────┘   └───────────────┘
```

## Paquets du monorepo

| Chemin | Paquet npm | Rôle | Dépend de | Phase |
| --- | --- | --- | --- | --- |
| `packages/core` | `@cmstatic/core` | Schémas, config du site, lecture/écriture des entrées, index, Git | — | 1 |
| `packages/builder` | `@cmstatic/builder` | Lance Astro pour construire ou prévisualiser un site avec son thème | core | 1 |
| `packages/server` | `@cmstatic/server` | API HTTP locale (Hono) qui expose le cœur à l'interface | core, builder ; deploy à partir de la phase 3 | 2 |
| `packages/admin-ui` | `@cmstatic/admin-ui` | Interface React (Vite, shadcn/ui), servie par `server` | — (parle à l'API) | 2 |
| `packages/plugin-api` | `@cmstatic/plugin-api` | Types et fonctions `definePlugin`, registre des points d'accroche | core | 3 |
| `packages/deploy` | `@cmstatic/deploy` | Cibles de déploiement SFTP, S3, Pages | core | 3 |
| `apps/cli` | `cmstatic` | Commandes `init`, `dev`, `build`, `deploy` | tous | 1 |
| `apps/desktop` | — | Coque Electron | server, admin-ui | 4 |
| `apps/server` | — | Mode serveur multi-utilisateurs | server, admin-ui | 6 |
| `themes/starter` | `@cmstatic/theme-starter` | Thème officiel de démonstration | core | 1 |
| `plugins/*` | `@cmstatic/plugin-*` | Plugins officiels d'exemple | plugin-api | 3 |
| `examples/demo-site` | — | Site d'exemple utilisé par les tests de bout en bout | — | 1 |

Règle de dépendance : `core` ne dépend d'aucun autre paquet interne ; aucune dépendance circulaire.

## Modèle de données

### Structure d'un site

Un site est un dossier, initialisé comme dépôt Git.

```
mon-site/
├── cmstatic.config.yaml     # réglages du site (validés par Zod)
├── content/
│   ├── posts/               # une collection = un dossier
│   │   ├── premier-article.md
│   │   └── deuxieme-article.md
│   ├── projects/
│   │   └── refonte-reseau.md
│   └── settings.yaml        # un singleton = un fichier YAML
├── media/                   # images et fichiers téléversés
│   └── 2026/11/photo.webp
├── dist/                    # site construit (ignoré par Git)
├── .cmstatic/               # cache local (ignoré par Git)
└── .gitignore
```

### `cmstatic.config.yaml`

```yaml
# Réglages du site. Aucun secret ici : ce fichier est versionné.
version: 1
site:
  title: "Mon site"
  url: "https://exemple.fr"
  languages: [fr]          # première langue = langue par défaut
theme:
  name: "@cmstatic/theme-starter"
  version: "^0.1.0"
deploy:
  - id: production
    type: sftp             # sftp | s3 | github-pages | gitlab-pages
    host: "ssh.exemple.fr"
    path: "/var/www/mon-site"
    # les identifiants sont stockés hors du dépôt (voir Sécurité)
```

### Une entrée

```markdown
---
title: "Refonte du réseau"
date: 2026-11-17
cover: media/2026/11/photo.webp
tags: [réseau, vlan]
draft: false
---

Le corps de l'entrée, en **Markdown**.
```

- Le **slug** est le nom du fichier sans extension : `[a-z0-9]+(-[a-z0-9]+)*`, unique dans sa collection.
- Le frontmatter est validé par le schéma Zod de la collection ; le corps est du Markdown CommonMark + GFM.
- Les chemins de médias sont relatifs à la racine du site.

### Thème et déclaration des types de contenus

Un thème est un projet Astro empaqueté qui exporte un manifeste `theme.config.ts`. Le cœur lit ce manifeste ; l'interface en génère les formulaires ; le builder s'en sert pour valider et charger les contenus.

```ts
// themes/starter/theme.config.ts — exemple indicatif, l'API exacte se fixe en phase 1
import { defineTheme, collection, singleton, fields } from "@cmstatic/core";

export default defineTheme({
  name: "@cmstatic/theme-starter",
  label: { fr: "Starter", en: "Starter" },
  collections: {
    posts: collection({
      label: { fr: "Articles", en: "Posts" },
      schema: {
        title: fields.text({ label: { fr: "Titre", en: "Title" }, required: true }),
        date: fields.date({ label: { fr: "Date", en: "Date" }, required: true }),
        cover: fields.image({ label: { fr: "Image de couverture", en: "Cover" } }),
        tags: fields.tags({ label: { fr: "Étiquettes", en: "Tags" } }),
        draft: fields.boolean({ label: { fr: "Brouillon", en: "Draft" }, default: false }),
      },
      body: true, // l'entrée a un corps Markdown
    }),
    projects: collection({ /* … */ }),
  },
  singletons: {
    settings: singleton({ /* titre, description, liens sociaux… */ }),
  },
});
```

Les helpers `fields.*` produisent **à la fois** un schéma Zod (validation) et des métadonnées d'interface (libellé, aide, widget). Correspondance prévue :

| Helper | Type Zod sous-jacent | Widget dans l'admin |
| --- | --- | --- |
| `fields.text` | `z.string()` | Champ texte |
| `fields.textarea` | `z.string()` | Zone de texte |
| `fields.number` | `z.number()` | Champ numérique |
| `fields.boolean` | `z.boolean()` | Interrupteur |
| `fields.date` | `z.coerce.date()` | Sélecteur de date |
| `fields.select` | `z.enum([...])` | Liste déroulante |
| `fields.tags` | `z.array(z.string())` | Saisie d'étiquettes |
| `fields.image` | `z.string()` (chemin dans `media/`) | Sélecteur / téléversement d'image |
| `fields.url` | `z.string().url()` | Champ URL |
| `fields.reference` | `z.string()` (slug d'une autre collection) | Liste des entrées de la collection cible |
| `fields.list` | `z.array(objet)` | Liste répétable de sous-champs |

## Flux principaux

### Construire (`cmstatic build`)

1. `core` lit et valide `cmstatic.config.yaml`.
2. `core` résout le thème et charge `theme.config.ts`.
3. `core` lit toutes les entrées et les valide ; en cas d'erreur, rapport lisible (fichier, champ, message) et arrêt.
4. `builder` lance la construction Astro du thème, alimenté par les contenus du site.
5. Le résultat est écrit dans `mon-site/dist/`.

### Éditer (`cmstatic dev`, à partir de la phase 2)

1. La CLI démarre `server` sur `127.0.0.1` avec un jeton aléatoire et ouvre le navigateur.
2. L'interface charge la liste des collections et le schéma de chaque champ via l'API.
3. À l'enregistrement, l'API valide l'entrée avec Zod, puis `core` écrit le fichier de façon atomique (fichier temporaire puis renommage).
4. Le serveur d'aperçu Astro détecte le changement et recharge l'aperçu affiché dans l'interface.

### Publier (phase 3)

1. Build complet (flux « Construire »).
2. `deploy` envoie `dist/` vers la cible choisie (envoi différentiel quand la cible le permet).
3. `core` crée un commit Git « Publish: <date> » dans le dépôt du site.

## Intégration avec Astro

- Le thème est un **projet Astro** autonome (pages, layouts, composants, Tailwind).
- Les contenus du site sont fournis à Astro via ses **collections de contenu** (Content Layer) : un chargeur pointe vers `mon-site/content/<collection>/` et réutilise le schéma Zod déclaré dans `theme.config.ts`.
- `builder` pilote Astro via son **API JavaScript** (`build`, `dev`) avec la racine sur le thème, la sortie vers `mon-site/dist/` et le chemin du site passé en configuration.
- Les médias de `mon-site/media/` sont exposés au thème et optimisés par le pipeline d'images d'Astro quand c'est possible.

> ⚠️ Vérifier ces API dans la documentation Astro à jour avant d'implémenter (Content Layer, loaders, API JavaScript). Si l'approche ne tient pas, proposer un ADR alternatif plutôt que de contourner.

## API HTTP du serveur local (phase 2)

Toutes les routes sont préfixées par `/api`, exigent l'en-tête `Authorization: Bearer <jeton>` et répondent en JSON. Les corps de requête sont validés par Zod.

| Méthode | Route | Effet |
| --- | --- | --- |
| GET | `/api/site` | Config du site et métadonnées du thème |
| GET | `/api/schema` | Collections, singletons et champs (sérialisés pour l'interface) |
| GET | `/api/collections/:collection` | Liste des entrées (slug, titre, date, brouillon) |
| GET | `/api/collections/:collection/:slug` | Une entrée (frontmatter + corps) |
| PUT | `/api/collections/:collection/:slug` | Crée ou remplace une entrée |
| DELETE | `/api/collections/:collection/:slug` | Supprime une entrée |
| GET / PUT | `/api/singletons/:singleton` | Lit / écrit un singleton |
| POST | `/api/media` | Téléverse un média (taille et type contrôlés) |
| GET | `/api/media` | Liste les médias |
| POST | `/api/build` | Lance un build, renvoie le rapport |
| POST | `/api/deploy/:targetId` | Construit puis publie (phase 3) |
| GET | `/api/events` | Flux SSE : progression des builds, changements de fichiers |

## Plugins (phase 3, esquisse)

```ts
import { definePlugin } from "@cmstatic/plugin-api";

export default definePlugin({
  name: "@cmstatic/plugin-rss",
  version: "0.1.0",
  permissions: ["content:read", "build:write"], // déclarées et affichées à l'utilisateur
  hooks: {
    "build:after": async ({ site, entries, outDir }) => { /* écrit rss.xml */ },
  },
});
```

Points d'accroche prévus : `config:loaded`, `content:beforeSave`, `content:afterSave`, `build:before`, `build:after`, `deploy:before`, `deploy:after`. Un plugin pourra aussi apporter des collections, des types de champs et des pages d'administration. Le modèle d'isolation (permissions, processus séparé) est à trancher par ADR avant la phase 3.

## Sécurité

| Sujet | Règle |
| --- | --- |
| Serveur local | Écoute sur `127.0.0.1` seulement ; jeton aléatoire de 32 octets généré au lancement, transmis à l'interface par l'URL d'ouverture puis gardé en mémoire ; en-têtes CORS fermés |
| Chemins | Slugs validés par regex ; chemins normalisés et vérifiés comme descendants du dossier du site ; liens symboliques refusés |
| Écritures | Atomiques (temporaire + renommage) pour ne jamais laisser un fichier à moitié écrit |
| Médias | Liste blanche d'extensions et de types MIME, taille maximale configurable, noms de fichiers assainis |
| Markdown | HTML assaini à la génération (pas de script injecté par un contenu) |
| Secrets | Hors du dépôt du site : trousseau du système (phase 4) ; avant cela, fichier `~/.config/cmstatic/credentials.json` en permissions `600` ou variables d'environnement ; jamais journalisés |
| Dépendances | Dependabot, `pnpm audit` en CI, versions figées par le lockfile |
| Plugins | Permissions déclarées ; aucun plugin tiers chargé sans confirmation explicite |

## Pile technique

| Domaine | Choix | Remarque |
| --- | --- | --- |
| Langage | TypeScript strict, ESM | Node ≥ 22.22 (minimum exigé par Astro 7.4) ; Node 24 LTS en développement ; CI sur 22 et 24 |
| Monorepo | pnpm workspaces | ADR 0003 |
| Lint / format | Biome | Un seul outil, ADR 0009 |
| Tests | Vitest ; Playwright pour l'interface (phase 2) | ADR 0009 |
| Versions | Changesets + Conventional Commits | |
| Validation | Zod | ADR 0005 |
| Rendu des sites | Astro + Tailwind CSS + shadcn/ui (îlots React) | ADR 0002 |
| Frontmatter / YAML | `gray-matter` + `yaml` | À confirmer en phase 1 |
| CLI | `commander` | |
| Serveur local | Hono sur Node | Phase 2 |
| Interface | React + Vite + Tailwind + shadcn/ui, TanStack Query, react-hook-form | Phase 2 |
| Éditeur de texte riche | À décider par ADR en phase 2 (critère : aller-retour Markdown fiable) | |
| Git | isomorphic-git | ADR 0008 (proposé, à accepter dès la tâche 1.7 car `init` crée le dépôt) |
| Déploiement | `ssh2-sftp-client`, `@aws-sdk/client-s3` (compatible S3 : Garage, MinIO…) | Phase 3 |
| Bureau | Electron | ADR 0007 (proposé) |
| i18n | Fichiers de traduction JSON, fr + en dès le départ | |
