# CLAUDE.md

Ce fichier fournit le contexte du projet à Claude Code pour travailler sur le site compagnon de Wyrdane.

## Vue d'ensemble

**wyrdane-website** est le site web compagnon du TCG **Wyrdane** (jeu Godot 4/GDScript dans `E:\card-game`, backend séparé dans `E:\wyrdane-backend`). React 19 + TypeScript + Vite (react-router-dom pour le routing SPA, axios pour l'API). Ce n'est plus seulement une vitrine : le site couvre la landing page (présentation du jeu, lanes, mots-clés, races, CTA Steam), les actus/devlogs, une page Contact, les pages légales (mentions légales, CGU, confidentialité, CGV), l'**authentification Steam** (connexion via popup OAuth, session partagée avec le compte joueur du jeu), un **deck builder web** répliquant celui du jeu (liste des decks sauvegardés + éditeur, réservés aux comptes connectés), et un **tableau de bord admin** (`/admin`, non listé dans la nav) avec stats de fréquentation/connexions Steam et suivi manuel de la wishlist Steam.

Réplique le deck builder et le rendu de carte du jeu (composant `GameCard`, règles/filtres/stats copiés de `DeckBuilder.gd`, export/import de codes de deck compatibles) — `src/data/gameCards.json` et `src/data/devAllCards.json` (régénérés par `scripts/generate-game-cards.mjs [chemin-vers-card-game]`), `src/data/keywords.ts`, `src/data/cardTranslations.json` (table FR→EN des textes de carte, régénérée par `scripts/generate-card-translations.mjs [chemin-vers-card-game]` depuis `translations/game.csv` du jeu — voir l'en-tête de `src/i18n/cardText.ts`) et `src/assets/game/` (dont `borders/border.png`, bordure unique commune aux quatre races depuis le 2026-11-19 — à recopier en RGBA, pas en PNG indexé, sinon la transparence douce du cadre est perdue) sont des copies statiques du dépôt du jeu qui se désynchronisent silencieusement : à régénérer après tout ajout/renommage de carte ou de mot-clé côté `card-game`. Le lien carte site↔jeu passe par le nom FR exact de la carte (comme le backend). Quatre autres copies ne sont PAS régénérables et sont donc écrites à la main : `src/data/triggers.ts` et `src/i18n/keywords.ts` (descriptions de déclencheurs et de mots-clés, copies mot pour mot des clés `TRIG_*_DESC`/`KW_*_DESC` de `translations/game.csv`), `src/i18n/home.ts` (vitrine des mots-clés/déclencheurs) et `src/data/raceColors.ts` (`Card.RACE_ICON_COLORS`, la teinte de repère par race — ses quatre valeurs avaient divergé jusqu'au 2026-11-25). Elles dérivent en silence : au 2026-11-20, la vitrine présentait encore deux déclencheurs (« Déclin », « Sortilège ») retirés de `TriggerType.gd` depuis longtemps. Après tout changement de règle ou de mot-clé côté jeu, les comparer au CSV plutôt que les reformuler.

**L'habillage est lui aussi une copie du jeu, et dérive de la même façon.** Le site ne partage aucune feuille de style avec `card-game` : la palette des boutons (`src/index.css`, variables `--btn-*`), les polices et la géométrie de la carte (`GameCard.css`/`GameCard.tsx`), de la ligne de deck et de la tuile de deck sont des portages à la main de `resources/themes/ui_theme.tres`, `scenes/card/Card.tscn`/`scripts/card/Card.gd`, `DeckBuilder.gd` et `DeckList.gd`. Au 2026-11-25, le site portait encore les **fonds de bouton navy** de l'ancien thème du jeu (`rgba(26, 26, 46, 0.667)` est mot pour mot l'ancien `Color(0.102, 0.102, 0.18, 0.667)`), devenus bruns côté jeu depuis longtemps, ainsi qu'une carte d'avant la pilule de coût, la ligne de race et les deux carrés de coût de la liste de deck. Règle à tenir : **lire la valeur dans le fichier du jeu, jamais la réinventer** — chaque règle CSS concernée nomme sa source en commentaire, c'est ce qui rend l'écart repérable la fois suivante. Les textes denses du deck builder sont en **PT Sans** (`DeckBuilder.UI_FONT` côté jeu) et non en Crimson Text : ce dernier, décoratif, devient illisible sous ~15px, qui est précisément la taille de tous ces libellés.

Les trois explorateurs de la page d'accueil (types de cartes, mots-clés, déclencheurs) ne montrent plus une carte d'exemple écrite à la main — `src/data/exampleCards.ts`, la quatrième copie manuelle qui dérivait, a été **supprimée** — mais **toutes les vraies cartes concernées**, en carrousel qui défile en boucle sans fin : cartes en noir et blanc, colorées au survol (défilement en pause pendant le survol). Source unique : `src/data/devAllCards.json` (les 304 cartes avec stats, art, mots-clés et déclencheurs), filtré par `src/data/cardFilters.ts` — les ids des entrées de `src/i18n/{home,keywords}.ts` sont exactement le slug du nom français du mot-clé ou du type, les déclencheurs passant par une table vers les noms d'enum de `TriggerType.gd`. `node scripts/check-card-filters.mjs` vérifie qu'aucune entrée ne se retrouve avec un carrousel vide — c'est ce garde-fou qui remplace la comparaison manuelle au CSV pour cette vitrine.

Toutes les pages/features backend (auth, decks, currency/récompense de première connexion, analytics, admin) parlent HTTP au même backend que le jeu (`wyrdane-backend`, `VITE_API_URL`) via le client `src/api.ts` (axios, `withCredentials: true`, session par cookie comme `BackendClient.gd` côté jeu).

## Structure

```
src/
├── pages/        # Home, Play (renvoie vers la fiche Steam, pas de jeu en navigateur), News, DevLog,
│                  # Contact, LegalPage (mentions légales/CGU/confidentialité/CGV), ShowDecks, DeckBuilder,
│                  # Lore (Journal d'Aldrenia, voir plus bas), Admin (tableau de bord, /admin uniquement
│                  # par URL directe), RouteError
├── components/   # Navbar, SiteFooter, GameCard (rendu de carte), BoardDiagram, KeywordsExplorer,
│                  # ExplorerPanel + CardTypeExplorer/InfoExplorer + CardCarousel (explorateurs de la page
│                  # d'accueil), AuthPanel, FirstLoginRewardPopup, DeckBuilderMobileNotice, Reveal,
│                  # SocialLinks, Portal...
├── auth/          # AuthProvider (session via GET /api/auth/authVerif), useAuth, useSteamLoginPopup
│                  # (popup OAuth vers /api/auth/steam/redirect?popup=1, postMessage de retour)
├── helper/        # AuthRequire/AdminRequire (garde de route), costSystem.ts, deckNames.ts
├── hooks/         # useIsMobile, usePageviewTracking (POST /api/analytics/pageview à chaque navigation SPA)
├── i18n/          # LanguageContext + dictionnaires de contenu par page (home.ts, contact.ts, legal.ts...)
├── content/       # news/*.json et devlog/*.json (source des actus/devlogs), loadEntries.ts
├── data/          # gameCards.json, devAllCards.json, keywords.ts, cardTranslations.json — copies statiques
│                  # depuis card-game (voir ci-dessus) ; cardFilters.ts sélectionne les cartes des carrousels
└── assets/game/   # bordures, icônes, polices copiées de card-game pour le rendu GameCard

scripts/
├── generate-feed.mjs        # régénère public/feed.json depuis src/content/{news,devlog} (voir ci-dessous)
└── check-card-filters.mjs   # garde-fou : chaque type/mot-clé/déclencheur de la page d'accueil doit avoir
                             # au moins une carte, et chaque carte son art (à lancer après régénération)

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
le registre est tenu. Il **se referme sur une 4e de couverture** (`{ kind: "cover", back: true }`,
dernière page, même visuel que le 1er plat retourné) — plus de cahier scellé ni de colophon, un
tome fini se ferme comme un livre, sans page d'annonce. Cette dernière page n'a de sens que seule
dans sa double page, ce que `showCover` ne donne qu'avec un **nombre pair de pages**, couvertures
comprises : ajouter ou retirer du contenu se fait donc par deux.

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

**La couverture est prechargee depuis la salle des archives.** `book-01.png` pese 1,2 Mo et
n'etait demandee qu'au clic sur un tome : le bloc de pages restait ~330 ms a l'ecran avant que son
plat ne se pose dessus, et le livre s'ouvrait en deux temps. `Lore.tsx` la charge donc au montage
de la page (`new Image()` + `decode()`, pas `onload` : on veut l'image decodee, prete a peindre),
et `openBook` attend cette promesse — plafonnee, pour qu'une connexion lente ouvre un livre encore
nu plutot que de laisser un clic sans effet. Toute image lourde ajoutee a la vue de lecture pose le
meme probleme et merite le meme traitement.

Le lien « Retour au site » n'existe que dans la salle des archives ; la vue de lecture n'a que son
bouton Retour, qui referme le livre. Ouvrir ou refermer un tome passe par `resetFlipState()` :
sans ça, le tome suivant hérite de l'état de feuilletage du précédent.

**Page unique (téléphone, fenêtre étroite ou courte).** Sous 826px de large (ou 511px de haut),
StPageFlip bascule de lui-même en page unique : une seule page à la fois, toujours un recto, jamais
de page côté gauche. Un seul réglage n'existe que pour ce mode.

`.lore-flipbook.stf__parent` (`Lore.css`) relâche les `min-width`/`min-height` que la librairie pose
en inline d'après ses props `minWidth`/`minHeight` (380x463) : sur un téléphone, ces planchers sont
plus grands que le livre lui-même (328px de large sur un écran de 390px), donc le bloc de pages
débordait de 52px à droite du livre et de l'écran, couverture et pages collées au bord droit au lieu
d'être centrées.

**Typographie : une proportion, aucun palier.** Polices, marges, lettrine et folio sont tous un
`calc(var(--lore-page-w) * k)`, où `--lore-page-w` est la largeur RÉELLE d'une page, mesurée en JS
(`ResizeObserver` dans `Lore.tsx`, attaché à l'ouverture d'un tome — pas au montage de la page, où
le livre n'est pas encore dans le DOM). Toutes les pages ont le même ratio (0.82), donc une page de
téléphone est une page de bureau à l'échelle et le texte y occupe la même part : ce qui tient sur
l'une tient sur l'autre. Les `clamp()` et la réduction de police propre au téléphone ont été
supprimés — ce sont précisément leurs bornes qui cassaient la proportion (le plafond s'appliquait
sur grand écran, la pente en plein sur téléphone, d'où des pages coupées net en bas). Les
coefficients sont calés pour redonner exactement les tailles de bureau d'avant sur une page de
552.5px : s'ils doivent changer, les recalculer **en bloc**, jamais un seul isolément.

**Pas de vérification visuelle automatisée.** Il n'y a ni navigateur headless dans le projet ni
script de débordement dans le dépôt (`check-overflow.cjs` est hors dépôt) : les pages sont
calibrées à 2 paragraphes, et une page trop longue se repère en ouvrant `/lore`. Toute retouche de
calage (position d'une tranche, `top` de l'infobulle) est à valider à l'œil.

## Actus / devlogs → `feed.json` consommé par le jeu

Les actus (`src/content/news/*.json`) et devlogs (`src/content/devlog/*.json`) sont la source de vérité, éditée directement dans ce dépôt (un fichier JSON bilingue fr/en par entrée). `scripts/generate-feed.mjs` régénère `public/feed.json` à partir de ces fichiers — exécuté automatiquement via `predev`/`prebuild` (voir `package.json`), donc à chaque `npm run dev`/`npm run build`, aucune étape manuelle. Le jeu (`card-game`, `MainMenu.gd`, `NEWS_FEED_URL = "https://wyrdane.com/feed.json"`) lit ce fichier une fois déployé pour peupler son panneau « Actualités » ; en local le fichier est aussi servi par Vite depuis `public/`. Ajouter une actu/un devlog = ajouter un fichier JSON dans `src/content/` puis déployer (le build régénère `feed.json`).

### Images dans une entrée

Une section d'actu/devlog peut porter des captures : `"images": [{ "src", "alt", "caption" }]` à côté de `paragraphs` (type `EntryImage` dans `src/content/loadEntries.ts`, rendu par `EntryAccordion`). Les sections étant déjà dédoublées par langue, `alt`/`caption` sont de simples chaînes, à écrire dans les deux. `src` est une **URL servie depuis `public/`** (`/devlog/<date>/<nom>.jpg`), pas un import : les JSON de contenu ne passent pas par le bundler. Les fichiers vont donc dans `public/devlog/<date>/`.

Conventions : largeur 1400 px (la colonne de texte fait 1100 px, voir `.news-hub-inner`), JPEG qualité ~88 pour une capture de jeu (~200 Ko ; un PNG de la même image en pesait 1,2 Mo), `alt` toujours renseigné. `feed.json` ignore les images : le panneau « Actualités » du jeu reste en texte.

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
