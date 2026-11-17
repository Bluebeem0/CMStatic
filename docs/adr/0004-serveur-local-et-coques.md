# 0004 — Admin = serveur local + interface web ; coques ensuite

- **Statut** : Accepté
- **Date** : 2026-11-17

## Contexte

CMStatic doit exister en local, en application de bureau et en serveur multi-utilisateurs, sans maintenir trois applications.

## Décision

L'administration est une API HTTP (`@cmstatic/server`) et une interface web (`@cmstatic/admin-ui`). En phase 1 à 3, la CLI démarre ce serveur sur `127.0.0.1` et ouvre le navigateur. L'application de bureau (phase 4) et le mode serveur (phase 6) réutilisent les mêmes paquets et n'ajoutent que l'enveloppe (fenêtre native, authentification, multi-sites).

## Options étudiées

| Option | Pour | Contre |
| --- | --- | --- |
| Serveur local + web d'abord | Un seul code, testable dans un navigateur, ouvre la voie au mode serveur | Nécessite une commande de lancement avant la phase 4 |
| Application de bureau d'abord | Expérience finale plus tôt | Packaging et mises à jour à gérer dès le début, mode serveur à refaire |

## Conséquences

- Le serveur local doit être verrouillé dès le départ (127.0.0.1, jeton de session).
- L'interface ne suppose jamais un accès direct au disque : tout passe par l'API.
