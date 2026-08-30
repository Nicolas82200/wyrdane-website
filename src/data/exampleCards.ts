// Cartes d'exemple réelles pour l'explorateur d'infos (types de carte, mots-clés,
// triggers) de la page d'accueil. Données extraites à la main des fichiers
// `.tres` du dépôt du jeu (E:\card-game\resources\cards\**\*.tres) — source de
// vérité, à préférer à CARDS.md qui peut être en retard sur le texte réel des
// cartes. Le nom/effet/flavour passent par `translateCardText` (comme partout
// ailleurs sur le site) : pas besoin de version anglaise ici, la table
// `cardTranslations.json` couvre déjà le texte exact de ces cartes existantes.
// Seul le texte de démonstration (`demo`) est propre à cette page et doit être
// écrit dans les deux langues.
import type { CardData } from "../types";
import type { Language } from "../i18n/language";

export type ExampleEntry = {
	card: CardData;
	demo: Record<Language, string>;
};

let nextId = 1;
function card(data: Omit<CardData, "id" | "lane" | "charges"> & { lane?: string | null; charges?: number | null }): CardData {
	return { id: nextId++, lane: null, charges: null, ...data };
}

// Cartes réutilisées telles quelles pour plusieurs entrées (types/mots-clés/triggers
// différents peuvent illustrer la même carte).
const dawnPaladin = card({
	name: "Paladin de l'Aube",
	race: "Humain",
	card_type: "Serviteur",
	cost: 5,
	attack: 4,
	hp: 5,
	rarity: "Épique",
	effect: "ÉGIDE, MOISSON\nArrivée : Invoque un Éclaireur Rapide 1/1 en rangée Avant.",
	flavor: "Il arrive à l'aube. Les morts reculent à la lumière. Lui aussi en a été surpris, la première fois.",
	image_path: "/assets/card_art/human/dawn-paladin.jpg",
});

const arrowVolley = card({
	name: "Volée de Flèches",
	race: "Humain",
	card_type: "Incantation",
	cost: 3,
	attack: null,
	hp: null,
	rarity: "Commune",
	effect: "Inflige 1 dégât à tous les serviteurs ennemis en rangée Avant.\nSi 4 ou plus en rangée Avant : 2 dégâts à la place.",
	flavor: "Plus ils sont nombreux, plus ça fait de cibles.",
	image_path: "/assets/card_art/human/arrow-volley.jpg",
});

const bottomlessAbyssRitual = card({
	name: "Rituel du Gouffre Sans Fond",
	race: "Demon",
	card_type: "Rituel",
	cost: 6,
	attack: null,
	hp: null,
	rarity: "Épique",
	charges: 2,
	effect: "Sacrifice 1 : Piochez une carte.\nVotre héros regagne 1 point de vie.",
	flavor: "Le seul rituel démoniaque qui rend plus qu'il ne prend, tant qu'il reste des charges.",
	image_path: "/assets/card_art/demon/bottomless-abyss-ritual.jpg",
});

const auraOfCorruption = card({
	name: "Aura de Corruption",
	race: "Demon",
	card_type: "Enchantement",
	cost: 3,
	attack: null,
	hp: null,
	rarity: "Rare",
	effect: "Résonance : Ce Démon attaquant inflige Corruption supplémentaire à sa cible.",
	flavor: "La corruption ne recule jamais. Elle s'accumule, discrètement.",
	image_path: "/assets/card_art/demon/aura-of-corruption.jpg",
});

const royalSeal = card({
	name: "Sceau du Royaume",
	race: "Humain",
	card_type: "Ressource",
	cost: 0,
	attack: null,
	hp: null,
	rarity: "Commune",
	effect: "Ajoute 1 Sceau à votre réserve.\nVous ne pouvez jouer qu'une ressource par tour.",
	flavor: "Frappé au nom du roi, il lie chaque soldat à son serment.",
	image_path: "/assets/card_art/resource/human-resource.jpg",
});

const mountAndRider = card({
	name: "Monture-et-Cavalier-Ne-Font-Qu'Un",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 4,
	attack: 4,
	hp: 3,
	rarity: "Rare",
	effect: "ASSAUT\nArrivée : Attaque immédiatement le serviteur ennemi le plus faible en points de vie, puis mute.",
	flavor: "On ne sait plus lequel des deux dirige encore l'autre.",
	image_path: "/assets/card_art/abomination/mount-and-rider-as-one.jpg",
});

const faithSoldier = card({
	name: "Soldat de la Foi",
	race: "Humain",
	card_type: "Serviteur",
	cost: 3,
	attack: 2,
	hp: 3,
	rarity: "Rare",
	effect: "ÉGIDE\nDernier Souffle : Invoque un Milicien du Bourg 2/1 en rangée Avant.",
	flavor: "Il croyait en quelque chose. Ce quelque chose l'a protégé, une fois.",
	image_path: "/assets/card_art/human/faith-soldier.jpg",
});

const soulDevourer = card({
	name: "Suceur d'Âmes",
	race: "Demon",
	card_type: "Serviteur",
	cost: 4,
	attack: 4,
	hp: 4,
	rarity: "Épique",
	effect: "MOISSON\nArrivée : Vole 4 points de vie au héros ennemi.\nPacte 3 : Vole 2 points de vie supplémentaires.",
	flavor: "Il prélève des deux côtés. C'est ce qui rend le marché intéressant, pour lui.",
	image_path: "/assets/card_art/demon/soul-devourer.jpg",
});

const formlessFury = card({
	name: "Fureur Sans Forme Fixe",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 4,
	attack: 5,
	hp: 4,
	rarity: "Épique",
	effect: "FRÉNÉSIE, MUTATION",
	flavor: "Plus il frappe, moins il ressemble à ce qu'il était en arrivant.",
	image_path: "/assets/card_art/abomination/formless-fury.jpg",
});

const shatteredVessel = card({
	name: "Vase Brisé, Encore Plein",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 3,
	attack: 5,
	hp: 1,
	rarity: "Rare",
	effect: "ASSAUT, VENIN MORTEL\nDernier Souffle : Se reforme en Amas Informe 2/2 sous votre contrôle (ne va pas au cimetière).",
	flavor: "Il ne meurt jamais tout à fait. Il se réarrange.",
	image_path: "/assets/card_art/abomination/shattered-vessel.jpg",
});

const putrefiedRavager = card({
	name: "Ravageur Putréfié",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 5,
	attack: 6,
	hp: 4,
	rarity: "Épique",
	effect: "RAVAGE\nMort-rage : Serviteurs Mort-Vivants alliés +2/+2.",
	flavor: "Chaque mort nourrit sa rage. Et il y a toujours de nouveaux morts.",
	image_path: "/assets/card_art/undead/putrefied-ravager.jpg",
});

const gauntAssassin = card({
	name: "Assassin Décharné",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 3,
	attack: 4,
	hp: 2,
	rarity: "Épique",
	effect: "INFILTRATION\nNe peut pas être ciblé par les sorts ennemis jusqu'à sa première attaque.",
	flavor: "On ne le voit pas venir. On ne le voit que partir.",
	image_path: "/assets/card_art/undead/gaunt-assassin.jpg",
});

const grandInquisitrix = card({
	name: "La Grande Inquisitrice",
	race: "Humain",
	card_type: "Serviteur",
	cost: 6,
	attack: 3,
	hp: 6,
	rarity: "Légendaire",
	effect: "DISCIPLINE\nÉveil : Détruit un enchantement ou rituel ennemi actif aléatoire.",
	flavor: "Elle ne combat pas la magie ennemie. Elle la refuse.",
	image_path: "/assets/card_art/human/grand-inquisitrix.jpg",
});

const lineLancer = card({
	name: "Lancier en Ligne",
	race: "Humain",
	card_type: "Serviteur",
	cost: 2,
	attack: 3,
	hp: 1,
	rarity: "Commune",
	effect: "FORMATION",
	flavor: "La ligne tient ou la ligne tombe. Il n'y a pas d'entre-deux.",
	image_path: "/assets/card_art/human/line-lancer.jpg",
});

const countermarchKnight = card({
	name: "Chevalier de la Contre-Marche",
	race: "Humain",
	card_type: "Serviteur",
	cost: 5,
	attack: 4,
	hp: 5,
	rarity: "Épique",
	effect: "CONTRE-ATTAQUE, ASSAUT\nBlessure : Gagne +2/+0 jusqu'à la fin du tour.",
	flavor: "Il charge. Il encaisse. Il charge encore. C'est tout ce qu'il sait faire, et c'est suffisant.",
	image_path: "/assets/card_art/human/countermarch-knight.jpg",
});

const campaignMarshal = card({
	name: "Maréchal de Campagne",
	race: "Humain",
	card_type: "Serviteur",
	cost: 5,
	attack: 2,
	hp: 5,
	rarity: "Épique",
	effect: "COMMANDEMENT\nÉveil : Tous les serviteurs Humains alliés gagnent +1/+0 jusqu'à la fin du tour.",
	flavor: "Il ne crie pas les ordres. Il les dit une fois, calmement. Ça suffit.",
	image_path: "/assets/card_art/human/campaign-marshal.jpg",
});

const livingRampart = card({
	name: "Le Rempart Vivant",
	race: "Humain",
	card_type: "Serviteur",
	cost: 6,
	attack: 4,
	hp: 10,
	rarity: "Légendaire",
	effect: "REMPART, FORTIFICATION, CONTRE-ATTAQUE\nBlessure : Invoque un Porteur de Bouclier 1/4 REMPART.",
	flavor: "On lui a demandé combien de temps il pouvait tenir. Il n'a pas répondu. Il tient encore.",
	image_path: "/assets/card_art/human/living-rampart.jpg",
});

const plagueEmissary = card({
	name: "Émissaire de la Peste",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 4,
	attack: 3,
	hp: 4,
	rarity: "Rare",
	effect: "PESTIFÉRÉ",
	flavor: "Il ne vient pas combattre. Il vient annoncer.",
	image_path: "/assets/card_art/undead/plague-emissary.jpg",
});

const famishedGhoul = card({
	name: "Goule Affamée",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 1,
	attack: 2,
	hp: 1,
	rarity: "Commune",
	effect: "NÉCROPHAGE",
	flavor: "La faim ne disparaît pas avec la mort. Elle empire.",
	image_path: "/assets/card_art/undead/famished-ghoul.jpg",
});

const minorZombie = card({
	name: "Zombie Mineur",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 2,
	attack: 2,
	hp: 2,
	rarity: "Commune",
	effect: "HORDE",
	flavor: "Il était enfant. C'était avant.",
	image_path: "/assets/card_art/undead/minor-zombie.jpg",
});

const infectedBerserker = card({
	name: "Berserker Infecté",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 4,
	attack: 5,
	hp: 4,
	rarity: "Épique",
	effect: "FRÉNÉSIE, REVENANT\nMort-rage : +3/+0.",
	flavor: "La fièvre l'a tué. Ce qui reste est plus rapide.",
	image_path: "/assets/card_art/undead/infected-berserker.jpg",
});

const wanderingCorpse = card({
	name: "Cadavre Errant",
	race: "Mort-Vivant",
	card_type: "Serviteur",
	cost: 2,
	attack: 1,
	hp: 3,
	rarity: "Commune",
	effect: "REMPART, CHAIR MORTE",
	flavor: "Personne ne se souvient de son nom. Lui non plus.",
	image_path: "/assets/card_art/undead/wandering-corpse.jpg",
});

const pactBerserker = card({
	name: "Berserker du Pacte",
	race: "Demon",
	card_type: "Serviteur",
	cost: 4,
	attack: 5,
	hp: 4,
	rarity: "Épique",
	effect: "FRÉNÉSIE\nPacte 3 : Ce serviteur acquiert ASSAUT.",
	flavor: "Chaque contrat qu'il signe le rend plus rapide, et toi plus vulnérable.",
	image_path: "/assets/card_art/demon/pact-berserker.jpg",
});

const crimsonDemonKing = card({
	name: "Roi Démon Écarlate",
	race: "Demon",
	card_type: "Serviteur",
	cost: 7,
	attack: 6,
	hp: 8,
	rarity: "Légendaire",
	effect: "CORRUPTION\nArrivée : Inflige Corruption à tous les serviteurs ennemis.\nPacte 3 : Inflige une marque de Corruption supplémentaire.",
	flavor: "Son royaume ne s'étend pas par la conquête. Il s'étend par ce qu'il te fait accepter.",
	image_path: "/assets/card_art/demon/crimson-demon-king.jpg",
});

const carmineHarpy = card({
	name: "Harpie Carmine",
	race: "Demon",
	card_type: "Serviteur",
	cost: 3,
	attack: 4,
	hp: 2,
	rarity: "Commune",
	effect: "TERREUR",
	flavor: "Son cri ne blesse pas. Il paralyse.",
	image_path: "/assets/card_art/demon/carmine-harpy.jpg",
});

const ascendingHellspawn = card({
	name: "Larve Ascendante",
	race: "Demon",
	card_type: "Serviteur",
	cost: 2,
	attack: 1,
	hp: 2,
	rarity: "Rare",
	effect: "RANG INFERNAL",
	flavor: "Elle grandit dans les cicatrices, pas dans la lumière.",
	image_path: "/assets/card_art/demon/ascending-hellspawn.jpg",
});

const ashenGargoyle = card({
	name: "Gargouille de Cendres",
	race: "Demon",
	card_type: "Serviteur",
	cost: 2,
	attack: 1,
	hp: 3,
	rarity: "Commune",
	effect: "REMPART, CHAIR DE SOUFRE",
	flavor: "Elle a regardé brûler des cathédrales entières sans ciller.",
	image_path: "/assets/card_art/demon/ashen-gargoyle.jpg",
});

const grandBloodInquisitor = card({
	name: "Grand Inquisiteur du Sang",
	race: "Demon",
	card_type: "Serviteur",
	cost: 5,
	attack: 3,
	hp: 5,
	rarity: "Épique",
	effect: "SANG NOIR, RANG INFERNAL",
	flavor: "Plus tu payes, plus il devient difficile à ignorer.",
	image_path: "/assets/card_art/demon/grand-blood-inquisitor.jpg",
});

const ceaselessMass = card({
	name: "Masse-Qui-Ne-Cesse",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 4,
	attack: 4,
	hp: 5,
	rarity: "Rare",
	effect: "MUTATION, REMPART",
	flavor: "Elle a arrêté de compter les formes qu'elle a portées.",
	image_path: "/assets/card_art/abomination/ceaseless-mass.jpg",
});

const knotSower = card({
	name: "Semeur de Nœuds",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 3,
	attack: 2,
	hp: 3,
	rarity: "Épique",
	effect: "FUSION\nAttaque : Invoque un Amas Informe 1/2 en rangée Avant.",
	flavor: "Il ne construit rien. Il fait pousser.",
	image_path: "/assets/card_art/abomination/knot-sower.jpg",
});

const bitterSeed = card({
	name: "Semence Amère",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 1,
	attack: 1,
	hp: 1,
	rarity: "Commune",
	effect: "VIRULENT",
	flavor: "Elle n'attend pas d'être plantée. Elle éclate là où elle tombe.",
	image_path: "/assets/card_art/abomination/bitter-seed.jpg",
});

const secondGaze = card({
	name: "Second Regard",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 3,
	attack: 2,
	hp: 3,
	rarity: "Rare",
	effect: "CHAIR ADAPTATIVE\nArrivée : Piochez 1 carte.",
	flavor: "Il voit ce que les autres pourraient devenir, avant qu'ils ne le sachent eux-mêmes.",
	image_path: "/assets/card_art/abomination/second-gaze.jpg",
});

const bottomlessHunger = card({
	name: "Faim Sans Fond",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 4,
	attack: 4,
	hp: 4,
	rarity: "Épique",
	effect: "MOISSON, ASSIMILATION",
	flavor: "Elle ne prend pas la vie. Elle l'intègre.",
	image_path: "/assets/card_art/abomination/bottomless-hunger.jpg",
});

const illFittingHide = card({
	name: "Peau-Trop-Grande",
	race: "Abomination",
	card_type: "Serviteur",
	cost: 2,
	attack: 1,
	hp: 3,
	rarity: "Commune",
	effect: "REMPART, INSTABLE",
	flavor: "Elle flotte autour de ce qu'elle contient, comme si elle attendait encore d'être remplie.",
	image_path: "/assets/card_art/abomination/ill-fitting-hide.jpg",
});

const warHymn = card({
	name: "Hymne de Guerre",
	race: "Humain",
	card_type: "Rituel",
	cost: 4,
	attack: null,
	hp: null,
	rarity: "Rare",
	charges: 3,
	effect: "Renfort : Le serviteur Humain invoqué gagne +1/+1.",
	flavor: "Le chant ne les rend pas invincibles. Il leur rappelle qu'ils ne sont pas seuls.",
	image_path: "/assets/card_art/human/war-hymn.jpg",
});

const epidemic = card({
	name: "Épidémie",
	race: "Mort-Vivant",
	card_type: "Rituel",
	cost: 4,
	attack: null,
	hp: null,
	rarity: "Épique",
	charges: 2,
	effect: "Présence : Serviteurs non Mort-Vivants ennemis -1/-1.",
	flavor: "Elle ne tue pas. Elle prépare, jour après jour.",
	image_path: "/assets/card_art/undead/epidemic.jpg",
});

const altarOfSacrifice = card({
	name: "Autel des Sacrifices",
	race: "Demon",
	card_type: "Enchantement",
	cost: 3,
	attack: null,
	hp: null,
	rarity: "Rare",
	effect: "Deuil : Piochez une carte.\nPacte 2 : Piochez une carte supplémentaire.",
	flavor: "L'autel ne demande jamais deux fois. Il attend, c'est tout.",
	image_path: "/assets/card_art/demon/altar-of-sacrifice.jpg",
});

const impassableWall = card({
	name: "Mur Infranchissable",
	race: "Humain",
	card_type: "Rituel",
	cost: 6,
	attack: null,
	hp: null,
	rarity: "Épique",
	charges: 2,
	effect: "Sortilège ennemi : Annulé s'il cible un serviteur Humain allié en rangée Avant.",
	flavor: "La magie s'arrête là où la volonté commence.",
	image_path: "/assets/card_art/human/impassable-wall.jpg",
});

const circleOfAssembly = card({
	name: "Cercle de l'Assemblage",
	race: "Abomination",
	card_type: "Rituel",
	cost: 5,
	attack: null,
	hp: null,
	rarity: "Épique",
	charges: 2,
	effect: "Sacrifice 2 : Un allié restant aléatoire gagne +2/+2 de façon permanente.",
	flavor: "Deux corps entrent. Un seul en ressort, plus grand.",
	image_path: "/assets/card_art/abomination/circle-of-assembly.jpg",
});

const swornBlade = card({
	name: "Lame-Jurée",
	race: "Humain",
	card_type: "Serviteur",
	cost: 3,
	attack: 4,
	hp: 2,
	rarity: "Rare",
	effect: "DISCIPLINE\nExécution : Gagne +1/+1 de façon permanente.",
	flavor: "Elle a juré sur sa lame. La lame, elle, a juré de le mériter.",
	image_path: "/assets/card_art/human/sworn-blade.jpg",
});

const vortexOfTheDamned = card({
	name: "Vortex des Damnés",
	race: "Demon",
	card_type: "Enchantement",
	cost: 6,
	attack: null,
	hp: null,
	rarity: "Légendaire",
	effect: "Carnage : Gagnez 1 mana temporaire ce tour.\nPacte 2 : Gagnez 1 mana temporaire supplémentaire.",
	flavor: "Les âmes qui s'y perdent paient toujours un peu plus que prévu.",
	image_path: "/assets/card_art/demon/vortex-of-the-damned.jpg",
});

export const EXAMPLE_CARDS: Record<string, ExampleEntry> = {
	// Types de carte
	serviteur: {
		card: dawnPaladin,
		demo: {
			fr: "Le Paladin de l'Aube (5 mana, 4/5) est un serviteur : il occupe une case de la rangée Avant ou Arrière et reste en jeu tant qu'il n'est pas détruit.",
			en: "Dawn Paladin (5 mana, 4/5) is a minion: it takes a spot in the Front or Back row and stays in play until destroyed.",
		},
	},
	ephemere: {
		card: arrowVolley,
		demo: {
			fr: "Volée de Flèches inflige ses dégâts dès qu'elle est jouée, puis part directement au cimetière : c'est un Éphémère, sans présence durable sur le plateau.",
			en: "Arrow Volley deals its damage the instant it's played, then goes straight to the graveyard: it's an Instant, with no lasting presence on the board.",
		},
	},
	rituel: {
		card: bottomlessAbyssRitual,
		demo: {
			fr: "Le Rituel du Gouffre Sans Fond reste en jeu avec 2 charges : chaque fois qu'un Sacrifice 1 le déclenche réellement, il perd une charge, jusqu'à disparaître.",
			en: "Bottomless Abyss Ritual stays in play with 2 charges: each time a Sacrifice 1 actually triggers it, it loses one charge, until it runs out.",
		},
	},
	enchantement: {
		card: auraOfCorruption,
		demo: {
			fr: "Aura de Corruption reste en jeu indéfiniment et s'applique passivement à chaque attaque d'un Démon allié : c'est un Enchantement, sans charges à consommer.",
			en: "Aura of Corruption stays in play indefinitely and applies passively to every allied Demon attack: it's an Enchantment, with no charges to spend.",
		},
	},
	ressource: {
		card: royalSeal,
		demo: {
			fr: "Jouer le Sceau du Royaume ajoute 1 au pool de mana Humain (actuel et maximum), puis la carte quitte simplement la partie : aucune zone ne la conserve.",
			en: "Playing Royal Seal adds 1 to the Human mana pool (current and max), then the card simply leaves the game: no zone keeps hold of it.",
		},
	},

	// Mots-clés génériques
	rempart: {
		card: livingRampart,
		demo: {
			fr: "Le Rempart Vivant (4/10) porte REMPART : tant qu'il est en rangée Avant, les serviteurs ennemis doivent l'attaquer en priorité avant tout autre allié.",
			en: "Living Rampart (4/10) has TAUNT: as long as it's in the Front row, enemy minions must attack it before any other ally.",
		},
	},
	assaut: {
		card: mountAndRider,
		demo: {
			fr: "Monture-et-Cavalier-Ne-Font-Qu'Un porte ASSAUT : il peut attaquer dès le tour où il est invoqué, sans attendre le tour suivant.",
			en: "Mount and Rider as One has CHARGE: it can attack the very turn it's summoned, without waiting a turn.",
		},
	},
	egide: {
		card: faithSoldier,
		demo: {
			fr: "Soldat de la Foi (2/3) porte ÉGIDE : la prochaine fois qu'il devrait subir des dégâts, le bouclier les absorbe entièrement puis disparaît.",
			en: "Faith Soldier (2/3) has AEGIS: the next time it would take damage, the shield absorbs it entirely, then disappears.",
		},
	},
	moisson: {
		card: soulDevourer,
		demo: {
			fr: "Suceur d'Âmes porte MOISSON : les 4 points de vie volés au héros ennemi à son arrivée soignent votre propre héros d'autant.",
			en: "Soul Devourer has HARVEST: the 4 HP it steals from the enemy hero on arrival heal your own hero by the same amount.",
		},
	},
	frenesie: {
		card: formlessFury,
		demo: {
			fr: "Fureur Sans Forme Fixe (5/4) porte FRÉNÉSIE : elle peut attaquer deux fois lors du même tour au lieu d'une seule.",
			en: "Formless Fury (5/4) has FURY: it can attack twice in the same turn instead of just once.",
		},
	},
	venin_mortel: {
		card: shatteredVessel,
		demo: {
			fr: "Vase Brisé, Encore Plein porte VENIN MORTEL : la moindre blessure qu'il inflige détruit sa cible, même un serviteur à pleine vie.",
			en: "Shattered Vessel, Still Full has DEADLY POISON: any wound it deals destroys the target, even a minion at full health.",
		},
	},
	ravage: {
		card: putrefiedRavager,
		demo: {
			fr: "Ravageur Putréfié (6/4) porte RAVAGE : s'il attaque un serviteur avec moins de 6 PV, le surplus de dégâts passe directement au héros adverse.",
			en: "Putrefied Ravager (6/4) has RAVAGE: if it attacks a minion with less than 6 HP, the excess damage carries straight through to the enemy hero.",
		},
	},
	infiltration: {
		card: gauntAssassin,
		demo: {
			fr: "L'Assassin Décharné (4/2) porte INFILTRATION : il ignore la rangée Avant ennemie et peut attaquer directement la rangée Arrière ou le héros.",
			en: "Gaunt Assassin (4/2) has INFILTRATION: it ignores the enemy Front row and can attack the Back row or the hero directly.",
		},
	},

	// Mots-clés Humain
	discipline: {
		card: grandInquisitrix,
		demo: {
			fr: "La Grande Inquisitrice porte DISCIPLINE : elle est immunisée au silence, au contrôle mental et à la peur, quoi que l'adversaire lui inflige.",
			en: "The Grand Inquisitrix has DISCIPLINE: she is immune to silence, mind control, and fear, whatever the opponent throws at her.",
		},
	},
	formation: {
		card: lineLancer,
		demo: {
			fr: "Lancier en Ligne (3/1) porte FORMATION : tant qu'un allié occupe une case adjacente, il combat en 4/2 au lieu de 3/1.",
			en: "Line Lancer (3/1) has FORMATION: as long as an ally occupies an adjacent slot, it fights as a 4/2 instead of a 3/1.",
		},
	},
	contre_attaque: {
		card: countermarchKnight,
		demo: {
			fr: "Le Chevalier de la Contre-Marche porte CONTRE-ATTAQUE : s'il survit à une blessure, il inflige aussitôt son ATK en retour à l'attaquant.",
			en: "Countermarch Knight has COUNTERATTACK: if it survives a wound, it immediately deals its ATK back to the attacker.",
		},
	},
	commandement: {
		card: campaignMarshal,
		demo: {
			fr: "Le Maréchal de Campagne porte COMMANDEMENT : chaque serviteur Humain allié invoqué après lui gagne +1/+0 de façon permanente, pas seulement pour ce tour.",
			en: "Campaign Marshal has COMMAND: every allied Human minion summoned after it permanently gains +1/+0, not just for that turn.",
		},
	},
	fortification: {
		card: livingRampart,
		demo: {
			fr: "Le Rempart Vivant porte aussi FORTIFICATION : impossible pour l'adversaire de le déplacer, de le renvoyer en main ou de le transformer.",
			en: "Living Rampart also has FORTIFICATION: the opponent cannot move it, bounce it to hand, or transform it.",
		},
	},

	// Mots-clés Mort-Vivant
	pestifere: {
		card: plagueEmissary,
		demo: {
			fr: "Émissaire de la Peste (3/4) porte PESTIFÉRÉ : chacune de ses attaques inflige une marque d'Infection à sa cible, en plus des dégâts normaux.",
			en: "Plague Emissary (3/4) has PLAGUEBEARER: each of its attacks inflicts an Infection stack on its target, on top of normal damage.",
		},
	},
	necrophage: {
		card: famishedGhoul,
		demo: {
			fr: "Goule Affamée (2/1) porte NÉCROPHAGE : chaque fois qu'un allié meurt à ses côtés, elle gagne +1/+1 de façon permanente.",
			en: "Famished Ghoul (2/1) has NECROPHAGE: every time an ally dies nearby, it permanently gains +1/+1.",
		},
	},
	horde: {
		card: minorZombie,
		demo: {
			fr: "Zombie Mineur (2/2) porte HORDE : dès que vous contrôlez 3 Morts-Vivants ou plus, il combat en 3/2 au lieu de 2/2.",
			en: "Minor Zombie (2/2) has HORDE: as soon as you control 3 or more Undead, it fights as a 3/2 instead of a 2/2.",
		},
	},
	revenant: {
		card: infectedBerserker,
		demo: {
			fr: "Berserker Infecté porte REVENANT : la première fois qu'il devrait mourir, il se relève avec 1 PV au lieu de partir au cimetière — une seule fois par partie.",
			en: "Infected Berserker has REVENANT: the first time it would die, it rises with 1 HP instead of going to the graveyard — once per game.",
		},
	},
	chair_morte: {
		card: wanderingCorpse,
		demo: {
			fr: "Cadavre Errant porte CHAIR MORTE : il est immunisé à l'Infection, au poison et à la peur, contrairement à la plupart des autres serviteurs.",
			en: "Wandering Corpse has DEADFLESH: it's immune to Infection, poison, and fear, unlike most other minions.",
		},
	},

	// Mots-clés Démon
	pacte: {
		card: pactBerserker,
		demo: {
			fr: "En jouant le Berserker du Pacte, Pacte 3 vous permet de payer 3 points de vie pour qu'il acquière ASSAUT de façon permanente — un choix optionnel, jamais obligatoire.",
			en: "When you play Pact Berserker, Pact 3 lets you optionally pay 3 HP so it permanently gains Charge — never mandatory.",
		},
	},
	corruption: {
		card: crimsonDemonKing,
		demo: {
			fr: "Le Roi Démon Écarlate porte CORRUPTION : chaque serviteur ennemi touché perd 1 ATK de façon permanente et cumulable, en plus des dégâts subis.",
			en: "Crimson Demon King has CORRUPTION: every enemy minion it hits permanently loses 1 ATK, stacking, on top of the damage taken.",
		},
	},
	terreur: {
		card: carmineHarpy,
		demo: {
			fr: "Harpie Carmine porte TERREUR : le serviteur qu'elle attaque est incapable de contre-attaquer lors du prochain tour ennemi.",
			en: "Carmine Harpy has TERROR: the minion it attacks is unable to attack back on the next enemy turn.",
		},
	},
	rang_infernal: {
		card: ascendingHellspawn,
		demo: {
			fr: "Larve Ascendante (1/2) porte RANG INFERNAL : elle gagne +1/+0 pour chaque tranche de 10 PV manquants sur votre héros — plus votre héros est blessé, plus elle frappe fort.",
			en: "Ascending Hellspawn (1/2) has INFERNAL RANK: it gains +1/+0 for every 10 HP missing from your hero — the more wounded your hero, the harder it hits.",
		},
	},
	chair_de_soufre: {
		card: ashenGargoyle,
		demo: {
			fr: "Gargouille de Cendres porte CHAIR DE SOUFRE : immunisée à la Corruption, à la peur et au contrôle mental, contrairement aux autres Démons.",
			en: "Ashen Gargoyle has SULFUR FLESH: immune to Corruption, fear, and mind control, unlike other Demons.",
		},
	},
	sang_noir: {
		card: grandBloodInquisitor,
		demo: {
			fr: "Grand Inquisiteur du Sang porte SANG NOIR : chaque fois que votre héros perd des PV à cause de l'une de vos propres cartes (comme un Pacte), il gagne +1/+0 de façon permanente.",
			en: "Grand Blood Inquisitor has BLACK BLOOD: every time your hero loses HP from one of your own cards (like a Pact), it permanently gains +1/+0.",
		},
	},

	// Mots-clés Abomination
	mutation: {
		card: ceaselessMass,
		demo: {
			fr: "Masse-Qui-Ne-Cesse porte MUTATION : chaque fois qu'elle survit à une blessure, elle mute selon la Table de Mutation (croissance, renforcement ou dégénérescence), des effets permanents et cumulables.",
			en: "Ceaseless Mass has MUTATION: every time it survives a wound, it mutates according to the Mutation Table (growth, reinforcement, or degeneration) — permanent, stacking effects.",
		},
	},
	fusion: {
		card: knotSower,
		demo: {
			fr: "Le mot-clé FUSION permet de sacrifier un allié adjacent pour absorber définitivement ses stats restantes et l'un de ses mots-clés au choix, comme sur le Semeur de Nœuds.",
			en: "The FUSION keyword lets a minion sacrifice an adjacent ally to permanently absorb its remaining stats and one of its keywords, as on Knot Sower.",
		},
	},
	virulent: {
		card: bitterSeed,
		demo: {
			fr: "Semence Amère (1/1) porte VIRULENT : à sa mort, le serviteur allié adjacent déclenche immédiatement une mutation, sans attendre une blessure.",
			en: "Bitter Seed (1/1) has VIRULENT: on death, the adjacent allied minion immediately triggers a mutation, without needing to be wounded.",
		},
	},
	chair_adaptative: {
		card: secondGaze,
		demo: {
			fr: "Second Regard porte CHAIR ADAPTATIVE : à son arrivée, il copie de façon permanente un mot-clé au choix présent sur n'importe quel serviteur en jeu, allié ou ennemi, pas seulement un adjacent.",
			en: "Second Gaze has ADAPTIVE FLESH: on arrival, it permanently copies a keyword of your choice from any minion in play, ally or enemy, not just an adjacent one.",
		},
	},
	assimilation: {
		card: bottomlessHunger,
		demo: {
			fr: "Faim Sans Fond porte ASSIMILATION : lors d'une Dévoration, elle peut absorber les restes pour gagner +1/+1 jusqu'au début du prochain tour, une fois par mort.",
			en: "Bottomless Hunger has ASSIMILATION: on a Devour, it can absorb the remains to gain +1/+1 until the start of the next turn, once per death.",
		},
	},
	instable: {
		card: illFittingHide,
		demo: {
			fr: "Peau-Trop-Grande porte INSTABLE : sa chair est trop erratique pour être stabilisée, aucun effet de soin, allié ou ennemi, ne peut la cibler.",
			en: "Ill-Fitting Hide has UNSTABLE: its flesh is too erratic to stabilize — no healing effect, allied or enemy, can target it.",
		},
	},

	// Triggers
	t_arrival: {
		card: dawnPaladin,
		demo: {
			fr: "\"Arrivée\" sur le Paladin de l'Aube se déclenche au moment précis où il atteint le champ de bataille : il invoque aussitôt un Éclaireur Rapide 1/1.",
			en: "\"Arrival\" on Dawn Paladin fires the instant it reaches the battlefield: it immediately summons a 1/1 Swift Scout.",
		},
	},
	t_reinforcement: {
		card: warHymn,
		demo: {
			fr: "\"Renfort\" sur Hymne de Guerre (3 charges) se déclenche chaque fois qu'un serviteur Humain allié arrive en jeu : celui-ci gagne aussitôt +1/+1.",
			en: "\"Reinforcement\" on War Hymn (3 charges) fires every time an allied Human minion enters play: it immediately gains +1/+1.",
		},
	},
	t_deathrattle: {
		card: shatteredVessel,
		demo: {
			fr: "\"Dernier Souffle\" sur Vase Brisé, Encore Plein se déclenche à sa mort : au lieu de partir au cimetière, il se reforme en Amas Informe 2/2 sous votre contrôle.",
			en: "\"Deathrattle\" on Shattered Vessel, Still Full fires on death: instead of going to the graveyard, it reforms into a 2/2 Formless Mass under your control.",
		},
	},
	t_wound: {
		card: countermarchKnight,
		demo: {
			fr: "\"Blessure\" sur le Chevalier de la Contre-Marche se déclenche dès qu'il subit des dégâts sans mourir : il gagne alors +2/+0 jusqu'à la fin du tour.",
			en: "\"Wounded\" on Countermarch Knight fires as soon as it takes damage without dying: it then gains +2/+0 until the end of the turn.",
		},
	},
	t_awaken: {
		card: campaignMarshal,
		demo: {
			fr: "\"Éveil\" sur le Maréchal de Campagne se déclenche au tout début de votre tour : tous vos serviteurs Humains gagnent +1/+0 jusqu'à la fin du tour.",
			en: "\"Awakening\" on Campaign Marshal fires right at the start of your turn: all your Human minions gain +1/+0 until end of turn.",
		},
	},
	t_decline: {
		card: epidemic,
		demo: {
			fr: "L'un des deux triggers d'Épidémie se déclenche en \"Déclin\", au début du tour ennemi, pour maintenir son malus -1/-1 actif sur les serviteurs non Mort-Vivants adverses.",
			en: "One of Epidemic's two triggers fires on \"Decline\", at the start of the enemy turn, to keep its -1/-1 debuff active on non-Undead enemy minions.",
		},
	},
	t_attack: {
		card: knotSower,
		demo: {
			fr: "\"Attaque\" sur le Semeur de Nœuds se déclenche chaque fois qu'il attaque : il invoque aussitôt un Amas Informe 1/2 en rangée Avant.",
			en: "\"Attack\" on Knot Sower fires every time it attacks: it immediately summons a 1/2 Formless Mass in the Front row.",
		},
	},
	t_grief: {
		card: altarOfSacrifice,
		demo: {
			fr: "\"Deuil\" sur l'Autel des Sacrifices se déclenche chaque fois qu'un serviteur allié meurt : vous piochez alors une carte.",
			en: "\"Mourning\" on Altar of Sacrifice fires every time an allied minion dies: you then draw a card.",
		},
	},
	t_spell: {
		card: impassableWall,
		demo: {
			fr: "\"Sortilège\" sur le Mur Infranchissable se déclenche quand l'adversaire lance un sort : celui-ci est annulé s'il cible un Humain allié en rangée Avant.",
			en: "\"Spell\" on Impassable Wall fires when the opponent casts a spell: it's cancelled if it targets an allied Human in the Front row.",
		},
	},
	t_sacrifice: {
		card: circleOfAssembly,
		demo: {
			fr: "L'effet du Cercle de l'Assemblage se déclenche après avoir sacrifié 2 serviteurs alliés : un allié restant aléatoire gagne alors +2/+2 de façon permanente.",
			en: "Circle of Assembly's effect triggers after sacrificing 2 allied minions: a random remaining ally then permanently gains +2/+2.",
		},
	},
	t_execution: {
		card: swornBlade,
		demo: {
			fr: "\"Exécution\" sur Lame-Jurée se déclenche quand elle tue un ennemi en l'attaquant : elle gagne alors +1/+1 de façon permanente.",
			en: "\"Execution\" on Sworn Blade fires when it kills an enemy by attacking: it then permanently gains +1/+1.",
		},
	},
	t_carnage: {
		card: vortexOfTheDamned,
		demo: {
			fr: "\"Carnage\" sur Vortex des Damnés se déclenche à chaque mort de serviteur, allié ou ennemi : vous gagnez alors 1 mana temporaire pour ce tour.",
			en: "\"Carnage\" on Vortex of the Damned fires on any minion death, allied or enemy: you then gain 1 temporary mana for that turn.",
		},
	},
};
