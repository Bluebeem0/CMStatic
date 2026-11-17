# 03 — Feuille de route

Sept phases, sans dates : on passe à la suivante quand le **critère de sortie** est atteint. Chaque phase se termine par une version publiée (`0.0.x` jusqu'au MVP, puis `0.x`).

| Phase | Nom | Livrable principal | Critère de sortie |
| --- | --- | --- | --- |
| 0 | Fondations | Monorepo, outillage, CI, docs | CI verte, dépôt public propre |
| 1 | Cœur et CLI de build | `core`, `builder`, thème starter, `cmstatic build` | La CLI construit le site d'exemple |
| 2 | Interface d'administration locale | `server`, `admin-ui`, `cmstatic dev` | On édite le site d'exemple sans toucher un fichier |
| 3 | Plugins et publication | `plugin-api`, `deploy`, Git sur publication | **MVP v0.1** (voir `04-specs-mvp.md`) |
| 4 | Application de bureau | Coque Electron, installateurs | Installation en un clic sur Windows, macOS, Linux |
| 5 | Git dans l'interface | Historique, branches, conflits | Deux personnes éditent le même site |
| 6 | Mode serveur | Comptes, rôles, LDAP/OIDC, Docker | Instance multi-utilisateurs déployée et supervisée |

---

## Phase 0 — Fondations

**Objectif** : un dépôt public propre, outillé, où chaque push est vérifié.

- [x] **0.1 Monorepo** — `package.json` racine (`private: true`, `packageManager: pnpm@…`), `pnpm-workspace.yaml` (`packages/*`, `apps/*`, `themes/*`, `plugins/*`, `examples/*`), `tsconfig.base.json` strict, `.nvmrc` (24), `engines.node` `>=22.22.0`, `.editorconfig`, `.gitignore`.
  - *Acceptation* : `pnpm install` fonctionne sur un clone neuf.
- [ ] **0.2 Outillage** — Biome (lint + format), Vitest configuré pour tout le workspace, scripts racine `typecheck`, `lint`, `format`, `test`, `build`.
  - *Acceptation* : les cinq scripts tournent sans erreur (avec un test factice).
- [ ] **0.3 CI** — GitHub Actions sur `push` et `pull_request` : install avec cache pnpm, `typecheck`, `lint`, `test`, `build`, `pnpm audit --audit-level=high` ; Node 22 et 24.
  - *Acceptation* : badge CI vert dans le README.
- [ ] **0.4 Fichiers communautaires** — `LICENSE` (MIT, © 2026 Fodié Diaouné), `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant), modèles d'issue (bug, fonctionnalité) et de pull request.
- [x] **0.5 Docs et ADR** — dossier `docs/` en place, ADR 0001 à 0009 présents, `docs/ideas.md` vide.
- [ ] **0.6 Versions** — Changesets initialisé ; Dependabot configuré (npm + GitHub Actions).

**Sortie** : tag Git annoté `v0.0.1` sur `main` (version du dépôt, distincte des versions de paquets gérées par Changesets ; aucun paquet publié sur npm).

---

## Phase 1 — Cœur et CLI de build

**Objectif** : `pnpm cmstatic build examples/demo-site` produit un site statique valide, avec des erreurs de contenu claires.

- [ ] **1.0 Prototype d'intégration Astro** : prototype jetable qui vérifie les critères de l'ADR 0010 (conception A, puis B si besoin).
  - *Acceptation* : ADR 0010 passé à « Accepté » avec la conception retenue et les résultats de chaque critère ; prototype supprimé.
- [ ] **1.1 `core` — schémas** : `defineTheme`, `collection`, `singleton`, helpers `fields.*` (voir architecture) qui produisent un schéma Zod + des métadonnées d'interface sérialisables en JSON.
  - *Acceptation* : tests unitaires de chaque helper (valeur valide, valeur invalide, valeur par défaut) ; la sérialisation JSON des métadonnées est testée par snapshot.
- [ ] **1.2 `core` — configuration du site** : lecture et validation de `cmstatic.config.yaml`.
  - *Acceptation* : une config invalide donne un message qui cite le fichier, la clé et la correction attendue.
- [ ] **1.3 `core` — entrées** : lire, écrire (atomique), lister et supprimer des entrées Markdown + frontmatter et des singletons YAML ; validation contre le schéma ; contrôle des slugs et des chemins.
  - *Acceptation* : tests couvrant aller-retour lecture/écriture sans perte, slug invalide refusé, tentative `../` refusée, rapport d'erreurs groupé par fichier.
- [ ] **1.4 `core` — chargement du site** : fonction `loadSite(path)` qui renvoie config + thème + toutes les entrées validées + liste des erreurs.
- [ ] **1.5 `themes/starter`** : thème Astro + Tailwind + composants shadcn/ui ; collections `pages`, `posts`, `projects`, singleton `settings` ; pages accueil, liste et détail d'articles, liste et détail de projets, page libre ; responsive, accessible (contrastes AA, navigation clavier), mode sombre.
  - *Acceptation* : le thème construit le site d'exemple ; Lighthouse ≥ 95 en performance et accessibilité sur la page d'accueil.
- [ ] **1.6 `builder`** : `buildSite(sitePath)` et `previewSite(sitePath)` qui pilotent Astro avec le thème du site et ses contenus, selon la conception retenue dans l'ADR 0010.
  - *Acceptation* : `dist/` contient `index.html` et une page par entrée publiée ; les brouillons (`draft: true`) sont exclus.
- [ ] **1.7 `apps/cli`** : commandes `cmstatic init <dossier> [--theme]` (crée un site avec contenu d'exemple, `git init` et premier commit ; accepter l'ADR 0008 avant), `cmstatic build [dossier]`, `cmstatic dev [dossier]` (aperçu seul pour l'instant) ; `--help` clair ; codes de sortie corrects.
- [ ] **1.8 `examples/demo-site` + test de bout en bout** : site d'exemple versionné ; un test Vitest enchaîne `init` → `build` dans un dossier temporaire et vérifie le HTML produit.

**Sortie** : version `0.0.2`, CI verte, README avec une section « Essayer en local ».

---

## Phase 2 — Interface d'administration locale

**Objectif** : éditer le site d'exemple de bout en bout depuis le navigateur.

- [ ] 2.1 `server` : API Hono (voir architecture), jeton de session, écoute `127.0.0.1`, validation Zod de chaque route, tests d'API.
- [ ] 2.2 ADR « éditeur de texte riche » (comparer au moins deux options sur l'aller-retour Markdown).
- [ ] 2.3 `admin-ui` : squelette React + Vite + Tailwind + shadcn/ui, routage, i18n fr/en, thème clair/sombre.
- [ ] 2.4 Navigation : liste des collections et singletons, liste des entrées avec recherche et filtre brouillon.
- [ ] 2.5 Formulaires générés depuis `/api/schema` (un composant par type de champ), validation côté client avec le même schéma.
- [ ] 2.6 Éditeur riche pour le corps Markdown.
- [ ] 2.7 Médiathèque : téléversement, liste, sélection depuis un champ image.
- [ ] 2.8 Aperçu en direct (iframe vers le serveur d'aperçu Astro) avec rechargement à l'enregistrement.
- [ ] 2.9 `cmstatic dev` lance serveur + aperçu et ouvre le navigateur.
- [ ] 2.10 Tests Playwright du parcours : créer un article, le modifier, le voir dans l'aperçu.

**Sortie** : version `0.0.3`.

---

## Phase 3 — Plugins et publication (MVP)

- [ ] 3.1 ADR « isolation et permissions des plugins ».
- [ ] 3.2 `plugin-api` : `definePlugin`, registre, exécution des points d'accroche, chargement depuis `cmstatic.config.yaml`.
- [ ] 3.3 Plugins d'exemple : `plugin-rss` (flux RSS), `plugin-sitemap`, `plugin-search` (recherche statique côté client).
- [ ] 3.4 `deploy` : cibles SFTP et S3 (point de terminaison configurable), envoi différentiel, rapport de progression.
- [ ] 3.5 Stockage des identifiants hors du dépôt (voir Sécurité) et écran de configuration des cibles.
- [ ] 3.6 Git : `init` à la création, commit automatique à chaque publication (isomorphic-git).
- [ ] 3.7 Bouton « Publier » dans l'interface avec suivi en direct.
- [ ] 3.8 Vérifier tous les critères de `04-specs-mvp.md` avec une personne non technique.

**Sortie** : **version `0.1.0` — MVP**, premiers paquets publiés sur npm.

---

## Phases 4 à 6 (à détailler le moment venu)

- **Phase 4 — Bureau** : coque Electron autour de `server` + `admin-ui`, Node embarqué pour Astro, installateurs signés si possible, mises à jour automatiques, secrets dans le trousseau du système. Mesurer la taille de l'installateur et réévaluer ADR 0007.
- **Phase 5 — Git dans l'interface** : historique d'une entrée, restauration, synchronisation avec un dépôt distant, branches de brouillon, résolution guidée des conflits.
- **Phase 6 — Serveur** : multi-sites, comptes et rôles (rédacteur, éditeur, admin), authentification LDAP et OIDC, image Docker, journalisation, métriques pour la supervision, sauvegardes, guide de durcissement.
