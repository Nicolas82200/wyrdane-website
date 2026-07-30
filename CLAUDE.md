# CLAUDE.md

Ce fichier fournit le contexte du projet à Claude Code pour travailler sur le site compagnon de Wyrdane.

## Vue d'ensemble

**wyrdane-website** est le site web compagnon du TCG **Wyrdane** (jeu Godot 4/GDScript dans `E:\card-game`, backend séparé dans `E:\wyrdane-backend`). React + TypeScript + Vite. Réplique le deck builder et le rendu de carte du jeu (composant `GameCard`, règles/filtres/stats copiés de `DeckBuilder.gd`, export/import de codes de deck compatibles) — `src/data/gameCards.json`, `src/data/keywords.ts` et `src/assets/game/` sont des copies statiques du dépôt du jeu qui se désynchronisent silencieusement : à régénérer après tout ajout/renommage de carte ou de mot-clé côté `card-game`. Le lien carte site↔jeu passe par le nom FR exact de la carte (comme le backend).

## Démarrage

```bash
npm install
cp .env.sample .env   # VITE_API_URL=http://localhost:3000 (ou l'URL du backend en prod)
npm run dev
```

- `npm run build` — build de production (`dist/`)
- `npm run lint` — ESLint

## Déploiement

En prod, le site est un **build statique** (`npm run build` → `dist/`) servi directement par **Nginx** sur un **VPS OVH**, partagé avec `wyrdane-backend` (`wyrdane.com`/`www.wyrdane.com`, HTTPS Let's Encrypt via Certbot). Nginx sert `dist/` avec `try_files $uri $uri/ /index.html` (routing SPA côté client).

Le repo est privé — le VPS y accède via une clé de déploiement dédiée (lecture seule, GitHub Deploy Key). Le déploiement est **continu** : tout push sur `main` déclenche automatiquement (GitHub Actions, `.github/workflows/deploy.yml`) un script sur le serveur (`deploy-website.sh` : `git pull && npm ci && npm run build`) qui régénère `dist/` en place — aucune action manuelle nécessaire après un merge. Secrets du repo GitHub : `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`. Détails complets de l'infra (Docker, Nginx, sécurité) dans le `CLAUDE.md` de `wyrdane-backend`.

## Workflow Git

Même convention que `card-game`/`wyrdane-backend` : branches `NNNN-slug` (numéro séquentiel + court descriptif kebab-case anglais), commits en anglais, jamais de commit direct sur `main`.
