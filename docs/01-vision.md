# 01 — Vision

## Résumé

CMStatic est un CMS open source qui génère des sites statiques. Il combine une interface d'écriture accessible à un non-technicien, des thèmes modernes (Astro, Tailwind, shadcn/ui) qui déclarent leurs propres types de contenus, une API de plugins ouverte et une collaboration native par Git. Il démarre en application locale, devient une application de bureau, puis un serveur multi-utilisateurs.

| Élément | Valeur |
| --- | --- |
| Nom | CMStatic (provisoire) |
| Licence | MIT |
| Forge | GitHub, compte `bluebeem` |
| Mainteneur | Fodié Diaouné |
| Cadre | Projet personnel open source, sans échéance |

## Le problème

Les outils actuels obligent à choisir :

- les **CMS dynamiques** (serveur, base de données) sont simples à utiliser mais lourds à maintenir et à sécuriser ;
- les **générateurs de sites statiques** sont rapides et sûrs, mais demandent un terminal, Git et du code ;
- les **CMS basés sur Git** ajoutent une interface, mais supposent qu'un développeur a déjà monté le projet et configuré un fournisseur Git en ligne.

Personne ne propose à la fois : un outil utilisable seul par un non-technicien, hors ligne, avec des thèmes modernes aux contenus sur mesure, et Git intégré sans être visible.

## Vision

> La simplicité d'un logiciel de bureau pour celui qui écrit, la modernité d'Astro pour celui qui crée les thèmes, et Git sous le capot pour que rien ne se perde.

## Publics

| Public | Ce qu'il attend | Ce qu'il ne veut pas |
| --- | --- | --- |
| Rédacteur non technique (indépendant, association, TPE, enseignant…) | Écrire, ajouter des images, voir le résultat, publier en un clic | Terminal, Git, Markdown brut, hébergement à gérer |
| Créateur de thèmes | Astro, Tailwind, shadcn/ui, types de contenus libres, une API claire | Un langage de gabarit propriétaire |
| Développeur de plugins | Une API typée, documentée, avec des points d'accroche clairs | Modifier le cœur pour ajouter une fonction |
| Administrateur (agence, organisation) | Plusieurs sites et utilisateurs, authentification centralisée, sauvegardes | Une application par poste impossible à suivre |

## Objectifs produit

1. Un non-technicien crée, modifie et met en ligne son site sans ouvrir de terminal (hors commande de lancement tant que l'appli de bureau n'existe pas) ni connaître Git.
2. Un créateur de thèmes utilise Astro, Tailwind et shadcn/ui, et déclare ses propres types de contenus.
3. Un développeur étend l'outil par plugins : types de contenus, champs, étapes de build, écrans d'administration, sources de données externes.
4. Plusieurs personnes travaillent sur un même site, avec historique et relecture.
5. Le même cœur fonctionne en local, en application de bureau et en serveur auto-hébergé.

## Objectifs du projet pour le mainteneur

- Monter en compétences en TypeScript, React, architecture logicielle et conduite d'un projet open source.
- Disposer d'un projet phare sur GitHub, lisible par des recruteurs, des écoles et des clients.
- Relier développement et infrastructure : packaging, CI/CD, déploiement S3/SFTP, mode serveur conteneurisé, supervision, sauvegarde, durcissement.

## Principes directeurs

Ces règles tranchent quand deux options se valent.

1. **Le contenu appartient à l'utilisateur.** Fichiers ouverts (Markdown, YAML, JSON), lisibles sans l'outil, jamais de format propriétaire.
2. **Un seul cœur, plusieurs coques.** Toute logique métier vit dans le cœur ; local, bureau et serveur ne sont que des enveloppes.
3. **Simple pour le rédacteur, puissant pour le développeur.** La complexité va dans les thèmes et les plugins, pas dans l'interface d'écriture.
4. **Le site produit est statique et sobre.** HTML/CSS par défaut, JavaScript seulement là où un îlot le justifie.
5. **Sécurisé dès la conception.** Serveur local verrouillé, plugins qui déclarent leurs permissions, secrets hors du dépôt, dépendances surveillées.
6. **Chaque décision est écrite.** Un ADR par choix structurant, pour que les contributeurs comprennent le pourquoi.

## Non-objectifs (pour tout le projet)

- Remplacer un CMS dynamique pour des sites applicatifs (e-commerce, espaces membres, commentaires côté serveur).
- Éditeur visuel « glisser-déposer » de mise en page : la mise en page appartient au thème.
- Hébergement géré par le projet : CMStatic publie vers l'hébergement de l'utilisateur.

## Glossaire

| Terme | Définition |
| --- | --- |
| **Site** | Un dossier (dépôt Git) contenant la configuration, les contenus et les médias d'un site web |
| **Thème** | Un projet Astro empaqueté qui fournit la mise en page et déclare les types de contenus via `theme.config.ts` |
| **Collection** | Un type de contenu à plusieurs entrées (articles, projets…), un fichier par entrée |
| **Singleton** | Un type de contenu à une seule entrée (réglages, page d'accueil…) |
| **Entrée** | Un fichier de contenu : frontmatter YAML + corps Markdown |
| **Champ** | Une propriété typée d'une entrée, décrite par un schéma Zod |
| **Plugin** | Un paquet qui étend CMStatic via `plugin-api` |
| **Coque** | Une enveloppe d'exécution du cœur : CLI locale, application de bureau, serveur |
| **Cible de déploiement** | Une destination de publication du site construit (SFTP, S3, GitHub/GitLab Pages) |
