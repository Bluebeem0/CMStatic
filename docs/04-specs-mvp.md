# 04 — Spécifications du MVP (v0.1)

## Critère de réussite

Une personne non technique, avec seulement le thème starter, **crée un site blog + portfolio, le remplit et le met en ligne sur son hébergement, sans aide et sans ouvrir de fichier**. Seule exception tolérée avant l'application de bureau : la commande de lancement `npx cmstatic dev`.

## Dans le périmètre

- Création d'un site à partir d'un thème, en local
- Thème `starter` (pages, articles, projets, réglages)
- Formulaires générés depuis les schémas du thème
- Éditeur riche, médiathèque, aperçu en direct
- Build statique, déploiement SFTP et S3
- Plugins RSS, sitemap et recherche
- Interface en français et en anglais
- Commit Git automatique à chaque publication

## Hors périmètre du MVP

- Application de bureau installée
- Historique, branches et conflits Git visibles dans l'interface
- Mode serveur, comptes, rôles
- Édition visuelle directement sur la page
- Place de marché de thèmes et plugins
- Import depuis d'autres CMS

## User stories et critères d'acceptation

### US-01 — Créer un site

En tant que rédacteur, je veux créer un nouveau site à partir d'un thème pour démarrer sans rien configurer.

- **Étant donné** que je lance `npx cmstatic init mon-site`, **quand** la commande se termine, **alors** le dossier contient `cmstatic.config.yaml`, des contenus d'exemple, un `.gitignore` et un dépôt Git initialisé avec un premier commit.
- **Étant donné** un dossier existant non vide, **quand** je lance `init` dessus, **alors** la commande refuse avec un message clair, sans rien écrire.

### US-02 — Ouvrir l'administration

- **Quand** je lance `npx cmstatic dev` dans le dossier du site, **alors** le navigateur s'ouvre sur l'interface d'administration, déjà authentifiée par jeton.
- **Alors** l'interface n'est joignable que depuis ma machine (`127.0.0.1`).

### US-03 — Modifier les réglages du site

- **Quand** j'ouvre « Réglages », **alors** je vois un formulaire généré depuis le singleton `settings` du thème (titre, description, liens).
- **Quand** j'enregistre, **alors** `content/settings.yaml` est mis à jour et l'aperçu se recharge.

### US-04 — Créer, modifier, supprimer une entrée

- **Quand** je crée un article avec un titre, **alors** un slug est proposé automatiquement à partir du titre (sans accents, en minuscules, tirets), modifiable avant le premier enregistrement.
- **Quand** j'enregistre, **alors** `content/posts/<slug>.md` est créé avec un frontmatter valide.
- **Quand** je supprime une entrée, **alors** une confirmation est demandée, puis le fichier est supprimé.
- **Étant donné** deux entrées au même slug, **alors** l'enregistrement est refusé avec un message clair.

### US-05 — Saisir des champs typés

- **Alors** chaque champ du schéma apparaît avec le widget correspondant (voir tableau de l'architecture), son libellé dans ma langue et son aide.
- **Quand** une valeur est invalide (champ requis vide, URL mal formée), **alors** l'erreur s'affiche sous le champ et l'enregistrement est bloqué.

### US-06 — Écrire le texte

- **Alors** j'écris le corps dans un éditeur riche (titres, gras, italique, listes, liens, images, citations, code) sans voir de Markdown brut.
- **Alors** un texte ouvert puis enregistré sans modification produit un fichier identique (aller-retour sans perte).

### US-07 — Ajouter une image

- **Quand** je téléverse une image (JPEG, PNG, WebP, AVIF, SVG assaini), **alors** elle est rangée dans `media/AAAA/MM/` avec un nom assaini.
- **Étant donné** un fichier trop lourd ou d'un type non autorisé, **alors** il est refusé avec la raison.

### US-08 — Voir l'aperçu

- **Alors** l'aperçu du site est visible à côté de l'éditeur.
- **Quand** j'enregistre, **alors** l'aperçu se met à jour en moins de 2 secondes sur le site d'exemple.

### US-09 — Comprendre une erreur de contenu

- **Étant donné** un fichier de contenu modifié à la main et devenu invalide, **alors** l'interface signale l'entrée concernée et le champ fautif, sans planter.

### US-10 — Configurer une cible de déploiement

- **Quand** j'ajoute une cible SFTP ou S3, **alors** les paramètres non secrets vont dans `cmstatic.config.yaml` et les identifiants sont stockés hors du dépôt.
- **Quand** je clique sur « Tester la connexion », **alors** je sais si les paramètres fonctionnent.

### US-11 — Publier

- **Quand** je clique sur « Publier », **alors** le site est construit, envoyé vers la cible, et je vois la progression puis le résultat (succès ou erreur compréhensible).
- **Alors** un commit Git « Publish: <date> » est créé dans le dépôt du site.
- **Alors** seuls les fichiers modifiés sont renvoyés quand la cible le permet.

### US-12 — Choisir la langue

- **Alors** je peux basculer l'interface entre français et anglais ; mon choix est mémorisé.

## Exigences non fonctionnelles

| Exigence | Cible |
| --- | --- |
| Performance du site produit (thème starter) | Lighthouse ≥ 95 en performance et en accessibilité |
| Accessibilité de l'interface | Navigable entièrement au clavier, contrastes WCAG AA |
| Build du site d'exemple | Moins de 10 s sur un portable récent |
| Systèmes | macOS, Windows, Linux, Node ≥ 22 |
| Robustesse | Aucune perte de données en cas d'arrêt brutal (écritures atomiques) |
| Sécurité | Règles de `02-architecture.md` respectées et testées |
| Couverture de tests | `core` ≥ 80 % de lignes |
