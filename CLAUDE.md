# CLAUDE.md

Ce fichier fournit le contexte du projet à Claude Code pour travailler sur le site compagnon de Wyrdane.

## Vue d'ensemble

**wyrdane-website** est le site web compagnon du TCG **Wyrdane** (jeu Godot 4/GDScript dans `E:\card-game`, backend séparé dans `E:\wyrdane-backend`). React 19 + TypeScript + Vite (react-router-dom pour le routing SPA, axios pour l'API). Ce n'est plus seulement une vitrine : le site couvre la landing page (présentation du jeu, lanes, mots-clés, races, CTA Steam), les actus/devlogs, une page Contact, les pages légales (mentions légales, CGU, confidentialité, CGV), l'**authentification Steam** (connexion via popup OAuth, session partagée avec le compte joueur du jeu), un **deck builder web** répliquant celui du jeu (liste des decks sauvegardés + éditeur, réservés aux comptes connectés), et un **tableau de bord admin** (`/admin`, non listé dans la nav) avec stats de fréquentation/connexions Steam et suivi manuel de la wishlist Steam.

Réplique le deck builder et le rendu de carte du jeu (composant `GameCard`, règles/filtres/stats copiés de `DeckBuilder.gd`, export/import de codes de deck compatibles) — `src/data/gameCards.json` (régénéré par `scripts/generate-game-cards.mjs [chemin-vers-card-game]`), `src/data/keywords.ts`, `src/data/cardTranslations.json` (table FR→EN des textes de carte, régénérée par `scripts/generate-card-translations.mjs [chemin-vers-card-game]` depuis `translations/game.csv` du jeu — voir l'en-tête de `src/i18n/cardText.ts`) et `src/assets/game/` sont des copies statiques du dépôt du jeu qui se désynchronisent silencieusement : à régénérer après tout ajout/renommage de carte ou de mot-clé côté `card-game`. Le lien carte site↔jeu passe par le nom FR exact de la carte (comme le backend).

Toutes les pages/features backend (auth, decks, currency/récompense de première connexion, analytics, admin) parlent HTTP au même backend que le jeu (`wyrdane-backend`, `VITE_API_URL`) via le client `src/api.ts` (axios, `withCredentials: true`, session par cookie comme `BackendClient.gd` côté jeu).

## Structure

```
src/
├── pages/        # Home, Play (renvoie vers la fiche Steam, pas de jeu en navigateur), News, DevLog,
│                  # Contact, LegalPage (mentions légales/CGU/confidentialité/CGV), ShowDecks, DeckBuilder,
│                  # Lore (Journal d'Aldrenia, voir plus bas), Admin (tableau de bord, /admin uniquement
│                  # par URL directe), RouteError
├── components/   # Navbar, SiteFooter, GameCard (rendu de carte), BoardDiagram, KeywordsExplorer,
│                  # AuthPanel, FirstLoginRewardPopup, DeckBuilderMobileNotice, Reveal, SocialLinks, Portal...
├── auth/          # AuthProvider (session via GET /api/auth/authVerif), useAuth, useSteamLoginPopup
│                  # (popup OAuth vers /api/auth/steam/redirect?popup=1, postMessage de retour)
├── helper/        # AuthRequire/AdminRequire (garde de route), costSystem.ts, deckNames.ts
├── hooks/         # useIsMobile, usePageviewTracking (POST /api/analytics/pageview à chaque navigation SPA)
├── i18n/          # LanguageContext + dictionnaires de contenu par page (home.ts, contact.ts, legal.ts...)
├── content/       # news/*.json et devlog/*.json (source des actus/devlogs), loadEntries.ts
├── data/          # gameCards.json, keywords.ts, cardTranslations.json — copies statiques depuis card-game (voir ci-dessus)
└── assets/game/   # bordures, icônes, polices copiées de card-game pour le rendu GameCard

scripts/
└── generate-feed.mjs   # régénère public/feed.json depuis src/content/{news,devlog} (voir ci-dessous)

public/
└── feed.json      # généré automatiquement, jamais édité à la main (voir "Actus/devlogs" ci-dessous)
```

## Journal d'Aldrenia (page `/lore`)

Livre feuilletable (`react-pageflip`) posé dans une salle des archives. Contenu dans
`src/data/journalAldrenia.ts`, rendu par `src/pages/Lore.tsx` + `Lore.css`.

**Source canon.** Le dépôt local `E:\wyrdane-lore` est la source de vérité du lore
(`Wyrdane_LORE_complet.md` + `eras/*.md`, un fichier par époque). Toute donnée factuelle qui
apparaît dans le Journal — souverain, capitale, délai de voyage, nom propre, événement — doit
rester cohérente avec ce dépôt, et tout fait *introduit* ici doit y être répercuté : un nom qui
n'existe que dans ce fichier sera réinventé différemment à la prochaine époque écrite (c'est
arrivé avec les noms des cinq éclaireurs).

**Un tome par époque.** `JOURNAL_BOOKS` liste les tomes (`id`, `label` bilingue affiché en
infobulle, `shelfLeft`, `pages`). Règle à tenir : le tome I décrit le monde tel qu'il était, et
**chaque nouvelle vague ouvre un tome neuf** qui court jusqu'à la suivante. Chaque tome commence
par sa propre page `kind: "cover"` (le flipbook est monté avec `showCover` et `startPage` 0),
renumérote ses folios depuis 1, **repart à « Entrée I »** pour ses pages `divider`, et s'ouvre sur
une page qui donne son rang (« Cahier premier », « Cahier second »...) et la raison pour laquelle
le registre est tenu. Le cahier scellé et le colophon, qui annoncent la suite, vivent à la fin du
**dernier** tome et doivent déménager quand un tome est ajouté.

**Voix du registre : première personne du pluriel.** Le Journal est tenu par la Chancellerie de
Caldrath et parle en « nous » / « notre Chancellerie » (demande explicite). Ne jamais écrire « les
scribes font ceci » ni « ce registre consigne cela » : « nous consignons », « trois d'entre nous »,
« l'un de nous ». `ce registre` ne subsiste que lorsqu'il désigne l'objet qu'on tient (« il entre
dans ce registre »). Les tiers — le Conseil du Roi, les érudits, les prêtres, Aldrenia elle-même —
restent à la troisième personne. Attention : les fichiers `eras/*.md` du dépôt canon, eux, sont des
textes *sur* l'époque et restent en troisième personne ; la bascule en « nous » se fait en écrivant
le tome.

**Salle des archives.** Une tranche cliquable par tome, positionnée par `shelfLeft` en % de
l'image source `archives.jpg` (1344x768), le reste du calage venant de `.lore-archive-book`. Trois
points à ne pas casser :

- la boîte cliquable fait 1,4 % de large et `background-size` vaut 250 % pour compenser : la
  tranche *dessinée* garde la largeur qu'elle avait quand la boîte faisait 3,5 %. Si cette largeur
  change, recalculer `background-size` comme `3.5 / <largeur> * 100%`, sinon le livre maigrit ou
  grossit avec sa zone de clic ;
- espacer deux tomes d'au moins la largeur de boîte, sinon celle du suivant recouvre la tranche du
  précédent et le clic ouvre le mauvais tome ;
- `cursor: inherit` sur les tranches : la pièce a son propre curseur plume, c'est lui qu'on garde
  au survol (ni flèche système, ni main de lien). L'infobulle est maison (`.lore-archive-tip`,
  survol **et** focus clavier), jamais l'attribut `title`.

Le lien « Retour au site » n'existe que dans la salle des archives ; la vue de lecture n'a que son
bouton Retour, qui referme le livre. Ouvrir ou refermer un tome passe par `resetFlipState()` :
sans ça, le tome suivant hérite de l'état de feuilletage du précédent.

**Pas de vérification visuelle automatisée.** Il n'y a ni navigateur headless dans le projet ni
script de débordement dans le dépôt (`check-overflow.cjs` est hors dépôt) : les pages sont
calibrées à 2 paragraphes, et une page trop longue se repère en ouvrant `/lore`. Toute retouche de
calage (position d'une tranche, `top` de l'infobulle) est à valider à l'œil.

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
