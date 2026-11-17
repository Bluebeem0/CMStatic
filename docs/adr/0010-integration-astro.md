# 0010 — Intégration avec Astro : comment `builder` pilote un thème

- **Statut** : Proposé (à trancher par le prototype de la tâche 1.0)
- **Date** : 2026-11-17

## Contexte

L'ADR 0002 décide que les thèmes sont des projets Astro, pilotés par l'API JavaScript d'Astro et alimentés par le Content Layer. Il ne dit pas *comment*. La vérification de la documentation d'Astro 7 (novembre 2026) montre que :

- l'API JavaScript (`build()`, `dev()` avec un `AstroInlineConfig`) existe mais est **expérimentale** : sa signature peut changer à une version mineure ;
- le chargeur `glob()` accepte un dossier `base` absolu, n'importe où sur le disque : lire `mon-site/content/` est possible ;
- il n'existe pas de canal officiel pour transmettre le chemin du site au `src/content.config.ts` d'un thème ;
- Astro écrit des fichiers (cache, types `.astro/`) dans la racine du projet ; si la racine est un thème installé dans `node_modules`, ce dossier peut être partagé entre sites ou en lecture seule ;
- Tailwind v4 ignore `node_modules` lors de la détection automatique des classes (à confirmer) ;
- le helper `image()` résout les chemins par rapport au fichier de l'entrée, alors que nos chemins de médias sont relatifs à la racine du site ;
- Astro injecte tel quel le HTML brut d'un contenu Markdown ;
- on ignore si le serveur de dev surveille un dossier de contenus situé hors de sa racine (exigence US-08 : aperçu en moins de 2 s).

## Décision proposée

Choisir entre deux conceptions **sur la base d'un prototype jetable** (tâche 1.0), en essayant d'abord A :

- **A — Thème = projet Astro classique.** `builder` appelle `build()` / `dev()` avec la racine sur le dossier du thème, la sortie vers `mon-site/dist/` et le cache dans `mon-site/.cmstatic/`. Le chemin du site passe par une variable d'environnement lue par un helper de `core` dans le `content.config.ts` du thème.
- **B — Thème = intégration Astro.** `builder` génère un petit projet Astro dans `mon-site/.cmstatic/astro/` (configuration et collections générées) qui charge l'intégration du thème ; le thème injecte ses pages (`injectRoute`).

Dans les deux cas, `core` fournit un chargeur de contenus construit sur `glob()` qui convertit les chemins `media/…` en chemins relatifs à l'entrée, et `builder` impose `rehype-sanitize`.

### Critères du prototype (dans l'ordre)

1. Le build fonctionne avec un thème installé dans un `node_modules` en lecture seule.
2. Les classes Tailwind du thème sont présentes dans le CSS produit.
3. Une image de `mon-site/media/` est optimisée par le pipeline d'images d'Astro.
4. Un `<script>` écrit dans un contenu Markdown est retiré du HTML produit.
5. En mode dev, une modification d'un contenu hors de la racine Astro est visible en moins de 2 s.
6. Deux sites construits en parallèle ne partagent ni cache ni fichiers.

Si A échoue sur un critère sans solution propre, on passe à B. Le résultat est consigné ici (statut « Accepté ») avant de figer l'API `fields.*` et d'implémenter `builder`. Le prototype est ensuite supprimé.

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| A — Projet Astro classique | Un créateur de thème écrit de l'Astro standard, toute la doc Astro s'applique ; proche de l'ADR 0002 | Écritures dans la racine du thème ; chemin du site transmis hors des canaux officiels |
| B — Intégration Astro + projet généré | Rien n'est écrit dans `node_modules` ; sites isolés ; configuration contrôlée par `builder` | Un thème s'écrit comme une intégration, moins familier ; plus de code dans `builder` |

## Conséquences

- L'API `fields.*` (tâche 1.1) dépend de ce choix pour `fields.image` : elle n'est figée qu'après la tâche 1.0.
- Astro est figé à une version exacte ; `builder` reste le seul paquet qui importe `astro`, pour contenir l'impact des changements de l'API expérimentale.
- Un test de bout en bout (tâche 1.8) vérifie le build à chaque montée de version d'Astro.
