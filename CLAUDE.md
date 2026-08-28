# CLAUDE.md

Ce fichier fournit le contexte du projet à Claude Code pour travailler sur le site compagnon de Wyrdane.

## Vue d'ensemble

**wyrdane-website** est le site web compagnon du TCG **Wyrdane** (jeu Godot 4/GDScript dans `E:\card-game`, backend séparé dans `E:\wyrdane-backend`). React 19 + TypeScript + Vite (react-router-dom pour le routing SPA, axios pour l'API). Ce n'est plus seulement une vitrine : le site couvre la landing page (présentation du jeu, lanes, mots-clés, races, CTA Steam), les actus/devlogs, une page Contact, les pages légales (mentions légales, CGU, confidentialité, CGV), l'**authentification Steam** (connexion via popup OAuth, session partagée avec le compte joueur du jeu), un **deck builder web** répliquant celui du jeu (liste des decks sauvegardés + éditeur, réservés aux comptes connectés), et un **tableau de bord admin** (`/admin`, non listé dans la nav) avec stats de fréquentation/connexions Steam et suivi manuel de la wishlist Steam.

Réplique le deck builder et le rendu de carte du jeu (composant `GameCard`, règles/filtres/stats copiés de `DeckBuilder.gd`, export/import de codes de deck compatibles) — `src/data/gameCards.json`, `src/data/keywords.ts` et `src/assets/game/` sont des copies statiques du dépôt du jeu qui se désynchronisent silencieusement : à régénérer après tout ajout/renommage de carte ou de mot-clé côté `card-game`. Le lien carte site↔jeu passe par le nom FR exact de la carte (comme le backend).

Toutes les pages/features backend (auth, decks, currency/récompense de première connexion, analytics, admin) parlent HTTP au même backend que le jeu (`wyrdane-backend`, `VITE_API_URL`) via le client `src/api.ts` (axios, `withCredentials: true`, session par cookie comme `BackendClient.gd` côté jeu).

## Structure

```
src/
├── pages/        # Home, Play (renvoie vers la fiche Steam, pas de jeu en navigateur), News, DevLog,
│                  # Contact, LegalPage (mentions légales/CGU/confidentialité/CGV), ShowDecks, DeckBuilder,
│                  # Admin (tableau de bord, /admin uniquement par URL directe), RouteError
├── components/   # Navbar, SiteFooter, GameCard (rendu de carte), BoardDiagram, KeywordsExplorer,
│                  # AuthPanel, FirstLoginRewardPopup, DeckBuilderMobileNotice, Reveal, SocialLinks, Portal...
├── auth/          # AuthProvider (session via GET /api/auth/authVerif), useAuth, useSteamLoginPopup
│                  # (popup OAuth vers /api/auth/steam/redirect?popup=1, postMessage de retour)
├── helper/        # AuthRequire/AdminRequire (garde de route), costSystem.ts, deckNames.ts
├── hooks/         # useIsMobile, usePageviewTracking (POST /api/analytics/pageview à chaque navigation SPA)
├── i18n/          # LanguageContext + dictionnaires de contenu par page (home.ts, contact.ts, legal.ts...)
├── content/       # news/*.json et devlog/*.json (source des actus/devlogs), loadEntries.ts
├── data/          # gameCards.json, keywords.ts — copies statiques depuis card-game (voir ci-dessus)
└── assets/game/   # bordures, icônes, polices copiées de card-game pour le rendu GameCard

scripts/
└── generate-feed.mjs   # régénère public/feed.json depuis src/content/{news,devlog} (voir ci-dessous)

public/
└── feed.json      # généré automatiquement, jamais édité à la main (voir "Actus/devlogs" ci-dessous)
```

## Actus / devlogs → `feed.json` consommé par le jeu

Les actus (`src/content/news/*.json`) et devlogs (`src/content/devlog/*.json`) sont la source de vérité, éditée directement dans ce dépôt (un fichier JSON bilingue fr/en par entrée). `scripts/generate-feed.mjs` régénère `public/feed.json` à partir de ces fichiers — exécuté automatiquement via `predev`/`prebuild` (voir `package.json`), donc à chaque `npm run dev`/`npm run build`, aucune étape manuelle. Le jeu (`card-game`, `MainMenu.gd`, `NEWS_FEED_URL = "https://wyrdane.com/feed.json"`) lit ce fichier une fois déployé pour peupler son panneau « Actualités » ; en local le fichier est aussi servi par Vite depuis `public/`. Ajouter une actu/un devlog = ajouter un fichier JSON dans `src/content/` puis déployer (le build régénère `feed.json`).

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
