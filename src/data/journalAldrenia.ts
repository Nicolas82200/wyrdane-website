// Contenu du "Journal d'Aldrenia". Voir lore/eras/*.md et
// lore/Wyrdane_LORE_complet.md côté card-game pour la source canonique :
// toute donnée factuelle ajoutée ici (souverains, capitales, puissance
// militaire/économique d'un royaume) doit y rester cohérente. Pas de nom de
// version ni de calendrier dans le texte (aucune mention d'époque codée) :
// le journal est écrit du point de vue d'Aldrenia, qui ne connaît aucun de
// ces repères.
//
// Bilingue (demande explicite, 2026-10) : chaque champ de texte est une paire
// { fr, en } (type Bi) plutôt qu'une chaîne nue — Lore.tsx choisit la bonne
// langue via useLanguage() (même source que le reste du site, bouton FR/EN
// dédié sur cette page puisqu'elle n'a pas de Navbar). paragraphs est un
// tableau DE PAIRES (pas deux tableaux fr/en séparés) : ça garantit que les
// deux langues ont toujours exactement le même nombre de paragraphes, donc
// la même pagination/numérotation de folio des deux côtés.
//
// Pages groupées à 2 paragraphes (calibré à l'oeil + check-overflow.cjs,
// hors dépôt, contre le gabarit réel du livre une fois la taille corrigée) :
// pas de défilement interne (voir Lore.css), donc un groupe qui déborde se
// scinde, mais inutile de descendre à un paragraphe par page partout.

export type Bi = { fr: string; en: string };

export type JournalPage =
	| { kind: "cover" }
	| { kind: "divider"; bookNo: Bi; bookTitle: Bi; bookSub: Bi }
	| {
			kind: "sealed";
			bookNo: Bi;
			bookTitle: Bi;
			bookSub: Bi;
			waxList: string[];
			note: Bi;
	  }
	| { kind: "colophon"; title: Bi; paragraphs: Bi[] }
	| {
			kind: "content";
			title?: Bi;
			dropcap?: boolean;
			// Marque dans la navigation laterale (voir BOOKMARKS, Lore.tsx) : un
			// "point important" (chapitre/royaume), jamais une sous-section d'un
			// chapitre deja marque (demande explicite, 2026-10 — garder la liste
			// courte : un marque-page par sujet, pas un par page).
			bookmark?: boolean;
			paragraphs: Bi[];
			// Coin déchiré en variante de texture (voir parchment2-*.webp) :
			// marquer DEUX pages consécutives (un recto et son verso, la même
			// feuille physique) avec la même valeur suffit, le CSS choisit tout
			// seul l'image br/bl (bottom) ou tr/tl (top) selon le côté
			// --left/--right que react-pageflip assigne à chacune.
			torn?: "bottom" | "top";
	  }
	| { kind: "content-italic"; text: Bi }
	| { kind: "map"; srcFr: string; srcEn: string };

export type JournalBook = {
	// Sert de cle React et de fragment d'URL eventuel : stable, jamais traduit.
	id: string;
	// Libelle complet du tome, affiche en infobulle sur sa tranche dans la
	// salle des archives (voir Lore.tsx) et nulle part ailleurs.
	label: Bi;
	// Position horizontale de la BOITE cliquable de la tranche sur
	// l'etagere d'archives.jpg, en % de l'image source (1344x768), passee en
	// style inline a .lore-archive-book. La tranche dessinee est centree dans
	// cette boite : son milieu tombe donc a shelfLeft + largeur/2, soit
	// +0.7% avec la boite de 1.4% actuelle (c'est ce decalage que reprend
	// l'infobulle, voir Lore.tsx). Espacer deux tomes de la largeur de boite
	// exactement (1.4%) les rend jointifs sans jamais se recouvrir : au-dela,
	// la boite du suivant mangerait la tranche du precedent, et le clic
	// ouvrirait le mauvais tome. L'etagere libre documentee va de 61% a 71%,
	// avec un livret deja peint vers 65% : au-dela de quelques tomes, prendre
	// les rangees libres notees dans Lore.tsx plutot que d'empiler ici au
	// risque de tomber sur ce livret.
	shelfLeft: string;
	pages: JournalPage[];
};

const VOLUME_I_PAGES: JournalPage[] = [
	{ kind: "cover" },

	// --- Ex-libris : le numero du cahier, et pourquoi il a ete ouvert ---
	// Chaque tome commence par une page de ce genre (demande explicite) : son
	// rang dans le registre, et la raison pour laquelle on l'a tenu. Le motif
	// pose ici — ecrire pour apres, au cas ou le royaume ne serait plus la pour
	// le dire lui-meme — est repris par les deux tomes suivants, qui s'y
	// referent comme a une charge deja ancienne.
	{
		kind: "content",
		title: { fr: "Cahier premier", en: "First Volume" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Ce registre a été ouvert au lendemain de la catastrophe, par notre Chancellerie, sur ordre du Conseil du Roi, et voici le premier de ses cahiers. Notre charge est simple à énoncer et incertaine à tenir, consigner le déroulement des événements, sans rien y ajouter que nous ne tenions de première main, à mesure qu'ils se produisent, et pour aussi longtemps qu'il y aura quelque chose à y consigner.",
				en: "This register was opened the day after the catastrophe, by our Chancellery, on the order of the King's Council, and this is the first of its volumes. Our charge is simple to state and uncertain to keep: to record the unfolding of events, adding nothing we do not hold firsthand, as they occur, and for as long as there remains something to record.",
			},
			{
				fr: "Le Conseil n'a pas ordonné ce travail pour lui-même. La secousse a appris à Aldrenia qu'un royaume peut cesser d'exister en quelques minutes, et qu'il ne reste alors de lui que ce que d'autres mains en avaient écrit. Si celui-ci devait connaître un sort funeste, que ce qu'il savait de lui-même et du monde ne s'éteigne pas avec lui : ce cahier est donc tenu autant pour ceux qui viendront après que pour la cour qui le commande.",
				en: "The Council did not order this work for itself. The tremor taught Aldrenia that a kingdom can cease to exist in a few minutes, and that nothing then remains of it but what other hands had written down. Should this one meet a grievous end, let what it knew of itself and of the world not go out with it: this volume is therefore kept as much for those who come after as for the court that commissions it.",
			},
		],
	},
	{
		kind: "content",
		title: {
			fr: "Ce que garde ce premier cahier",
			en: "What This First Volume Keeps",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "C'est pourquoi le premier de ces cahiers ne parle pas de la catastrophe. Il décrit le monde tel qu'il tenait encore la veille, les six royaumes, leurs forces, leurs souverains et leurs dieux, parce que ce savoir-là n'était écrit nulle part en entier, et que nul ne peut plus garantir qu'il sera encore vrai l'an prochain.",
				en: "That is why the first of these volumes does not speak of the catastrophe. It describes the world as it still stood the day before: the six kingdoms, their strengths, their sovereigns and their gods, because that knowledge was nowhere written down in full, and no one can any longer guarantee it will still be true a year from now.",
			},
			{
				fr: "Nous espérons, en vérité, n'avoir pas grand-chose à y écrire. Un registre qui s'épaissit est rarement le signe d'un royaume qui se porte bien, et nul parmi nous ne souhaite voir celui-ci grossir d'année en année.",
				en: "We hope, in truth, to have little to write in it. A register that thickens is rarely the sign of a kingdom in good health, and none among us wishes to see this one swell year after year.",
			},
			{
				fr: "Mais notre vœu n'arrête ni une secousse ni ce qu'elle réveille, et ce premier cahier s'ouvre déjà plus lourd qu'aucun de nous n'aurait su le prédire la veille encore. Qu'il reste, pour l'heure, le témoin de ce que le royaume savait de lui-même avant que tout ne bascule.",
				en: "But our own wish stops neither a tremor nor what it wakes, and this first volume opens already heavier than any of us could have foreseen the day before. Let it stand, for now, as witness to what the kingdom knew of itself before everything tipped over.",
			},
		],
	},

	{
		kind: "divider",
		bookNo: { fr: "Entrée I", en: "Entry I" },
		bookTitle: { fr: "Le monde tel qu'il était", en: "The World As It Was" },
		bookSub: {
			fr: "Ce qu'Aldrenia savait des six royaumes, avant que la terre ne se mette à trembler.",
			en: "What Aldrenia knew of the Six Kingdoms, before the earth began to shake.",
		},
	},

	{
		kind: "map",
		srcFr: "map-fr.png",
		srcEn: "map-en.png",
	},

	{
		kind: "content",
		title: { fr: "Les trois mers", en: "The Three Seas" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Trois mers bordent Mydaria, et chacune tient une place différente dans la vie des royaumes. À l'ouest, par-delà les plaines d'Eorthal, l'Océan Occidental ferme le continent sur une étendue que nul n'a jamais prétendu traverser. À l'est, la Mer de l'Est est celle de Caldrath, celle dont le port remplit les coffres de la Couronne et vers laquelle le palais royal tourne ses terrasses depuis des générations. Au sud, enfin, la Mer de Mydaria porte les routes de Thelmere et la plus grande part des cargaisons qui circulent entre les six royaumes.",
				en: "Three seas border Mydaria, and each holds a different place in the life of the kingdoms. To the west, beyond Eorthal's plains, the Occidental Ocean closes the continent upon an expanse no one has ever claimed to cross. To the east, the Eastern Sea is Caldrath's own, the one whose harbour fills the Crown's coffers and toward which the royal palace has turned its terraces for generations. To the south, the Sea of Mydaria carries Thelmere's routes and the greater part of the cargo moving between the six kingdoms.",
			},
			{
				fr: "Toutes trois se longent sans difficulté, et pêcheurs comme caboteurs y travaillent depuis toujours à portée de côte. Ce qui change, c'est ce qui arrive à ceux qui s'en écartent.",
				en: "All three can be followed along the shore without difficulty, and fishermen and coasters have always worked them within sight of land. What changes is what happens to those who leave it.",
			},
		],
	},

	{
		kind: "content",
		title: { fr: "Les mers sans retour", en: "The Seas of No Return" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Au-delà de ces trois mers, personne n'est jamais revenu. Les quelques expéditions tentées au fil des siècles par la flotte de Thelmere, la plus développée du monde connu, n'ont jamais rapporté la moindre terre nouvelle : certains navires ne sont simplement jamais revenus, d'autres sont rentrés au port des mois plus tard, l'équipage incapable de dire où il était passé, sinon qu'il n'avait jamais cessé de voir la tempête.",
				en: "Beyond these three seas, no one has ever returned. The few expeditions attempted over the centuries by Thelmere's fleet, the most developed in the known world, never brought back the slightest new land: some ships simply never returned, others sailed back into port months later, their crews unable to say where they had been, only that they had never once stopped seeing the storm.",
			},
			{
				fr: "On raconte, dans les tavernes comme dans les temples, que c'est Mydare elle-même qui retient ainsi les mers déchaînées au-delà des côtes connues, non par malveillance mais pour protéger les peuples de ce continent de ce qui se trouve plus loin. D'autres n'y voient que la nature la plus hostile des mers du large, sans intervention divine d'aucune sorte. Aucune des deux explications n'a jamais pu être vérifiée : ce qui s'étend par-delà ces eaux reste entièrement inexploré.",
				en: "It is said, in taverns as in temples, that it is Mydare herself who holds the seas thus unleashed beyond the known coasts, not out of malice but to protect the peoples of this continent from what lies farther still. Others see nothing more than the open sea's own hostile nature, with no divine hand in it at all. Neither explanation has ever been confirmed: what stretches beyond these waters remains wholly unexplored.",
			},
		],
	},

	// --- La langue commune --------------------------------------------------
	{
		kind: "content",
		title: { fr: "L'Averan", en: "The Averan" },
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Des siècles de caravanes, de traités et de mariages de raison ont fini par faire naître, entre les six royaumes, l'Averan, une langue de personne et de tout le monde à la fois, qu'on dit née sur les routes marchandes bien avant qu'aucun scribe n'ait songé à l'écrire, et que plus personne ne sait attribuer à un seul royaume d'origine.",
				en: "Centuries of caravans, treaties, and marriages of convenience eventually gave rise, among the six kingdoms, to the Averan, a language belonging to no one and to everyone at once, said to have been born on the trade roads long before any scribe thought to write it down, and which no one can now trace back to a single kingdom of origin.",
			},
			{
				fr: "Sans lui, un marchand d'Eorthal ne saurait pas négocier à Dunmarr, ni un diplomate aldrenien se faire comprendre sur les quais de Thelbridge. C'est la langue des comptoirs, des traités scellés à la hâte et des campements où se croisent des soldats de trois royaumes à la fois.",
				en: "Without it, a merchant from Eorthal could not bargain in Dunmarr, nor an Aldrenian diplomat make himself understood on the docks of Thelbridge. It is the language of trading posts, of treaties sealed in haste, and of camps where soldiers of three kingdoms cross paths at once.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			{
				fr: "Mais l'Averan n'efface aucune des langues du foyer. L'aldrenien, l'eorthalien, le skeldarien, le dreamarien, le thelmérien et l'ostranais restent celles qu'on parle entre soi, au coin du feu, et qu'un étranger ne maîtrise jamais vraiment, même après des années passées à commercer sur place. Un marchand peut conclure une vente entière dans l'Averan sans jamais en apprendre davantage sur celui qu'il a en face de lui.",
				en: "But the Averan erases none of the tongues of home. Aldrenian, Eorthalian, Skeldarian, Dreamarian, Thelmerian and Ostranai remain the languages spoken among one's own, by the fireside, which a stranger never truly masters, even after years spent trading on the spot. A merchant can close an entire sale in the Averan without ever learning anything more of the man across from him.",
			},
			{
				fr: "C'est une langue de passage, pas une langue de confidence. Ce que chaque royaume pense réellement de ses voisins, il continue de le dire dans sa propre langue, et c'est précisément ce qu'Aldrenia ne peut jamais tout à fait entendre.",
				en: "It is a language of passage, not a language of confidence. What each kingdom truly thinks of its neighbours, it goes on saying in its own tongue, and that is precisely what Aldrenia can never quite hear.",
			},
		],
	},

	// --- Aldrenia : géographie, pouvoir, religion, armée, économie ---------
	{
		kind: "content",
		title: { fr: "Aldrenia", en: "Aldrenia" },
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Aldrenia est le royaume ancien, celui dont les autres racontent qu'il était déjà vieux quand le leur n'était encore qu'un campement. Sa capitale, Caldrath, se dresse à l'est des forêts de Dreamar, les pieds tournés vers la Mer de l'Est, bâtie au croisement de routes commerciales.",
				en: "Aldrenia is the ancient kingdom, the one the others say was already old when theirs was still but a camp. Its capital, Caldrath, stands east of the forests of Dreamar, its feet turned toward the Eastern Sea, built at the crossing of trade roads.",
			},
			{
				fr: "D'autres royaumes humains ont existé avant lui sur ces mêmes terres, dont il ne reste que des noms à moitié oubliés dans de vieux parchemins. Les archives de Caldrath en gardent trois, écrits d'une main si ancienne que nous ne nous accordons plus sur leur prononciation, Ith-Caldra, Oren-Thal et Vaskyr.",
				en: "Other human kingdoms existed before it on these same lands, of which only half-forgotten names remain in old parchments. The archives of Caldrath keep three such names, written in a hand so ancient that we no longer agree on their pronunciation: Ith-Caldra, Oren-Thal, and Vaskyr.",
			},
			{
				fr: "Du premier, certains érudits soutiennent que Caldrath n'est qu'une corruption, du dernier, on ne sait même pas dans quelle langue il fut écrit. Aldrenia est le seul de cette lignée à avoir traversé les âges sans jamais s'éteindre, et c'est de cette endurance, plus que de toute conquête, qu'elle tire sa fierté.",
				en: "Of the first, some scholars maintain that Caldrath is merely a corruption; of the last, no one even knows in which tongue it was written. Aldrenia is the only one of this lineage to have crossed the ages without ever going dark, and it is from this endurance, more than from any conquest, that it draws its pride.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		torn: "bottom",
		paragraphs: [
			{
				fr: "Ses terres ne sont pas les plus riches de Mydaria, loin derrière les plaines généreuses d'Eorthal, mais son sol porte des forêts de chêne séculaires, des mines de fer dans les collines de l'est et des vignes sur les coteaux qui descendent vers la mer. Caldrath elle-même s'étend en terrasses de pierre pâle, ses toits de tuile rousse serrés autour d'un palais royal qui domine le port depuis des générations.",
				en: "Its lands are not the richest in Mydaria, far behind the generous plains of Eorthal, but its soil carries centuries-old oak forests, iron mines in the eastern hills, and vineyards on the slopes running down to the sea. Caldrath itself spreads in terraces of pale stone, its russet-tiled roofs huddled around a royal palace that has overlooked the harbour for generations.",
			},
			{
				fr: "C'est une capitale qui sent la pierre chaude et le sel, où les cloches des temples d'Aldrene répondent aux cornes des navires marchands, et où l'on croise, sur les mêmes marchés, des armuriers skeldariens de passage et des négociants venus d'Eorthal pour vendre leur grain. Peu de villes de Mydaria mêlent autant de langues en un seul après-midi de marché.",
				en: "It is a capital that smells of warm stone and salt, where the bells of Aldrene's temples answer the horns of merchant ships, and where one crosses, in the same markets, Skeldarian armourers passing through and traders come from Eorthal to sell their grain. Few cities in Mydaria mix so many tongues in a single market afternoon.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "La couronne et le culte", en: "The Crown and the Faith" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Aldrenia est gouvernée par le roi Varic Rhen, qu'on surnomme déjà, à mi-voix et avec un respect prudent, le Vieux Roi. Il ne décide jamais seul. Un Conseil siège à ses côtés, composé de ses plus hauts généraux et des prêtres les plus influents d'Aldrene, et aucune décision de poids ne se prend sans que cette assemblée n'ait été consultée. Deux voix y pèsent plus que les autres, celle du général Dorric Marn et celle de Sereth Vael, Haute Voix d'Aldrene.",
				en: "Aldrenia is ruled by King Varic Rhen, already known, in a hushed voice and with wary respect, as the Old King. He never decides alone. A Council sits at his side, made up of his highest generals and the most influential priests of Aldrene, and no decision of weight is made without that assembly being consulted. Two voices there carry more weight than the rest: that of General Dorric Marn, and that of Sereth Vael, High Voice of Aldrene.",
			},
			{
				fr: "La majorité des Aldreniens vénèrent Aldrene, qu'ils tiennent pour une déesse salvatrice et protectrice. Dans leur tradition, c'est Mydare qui porte la responsabilité d'une grande part des souffrances du monde, maladie, guerre, famine, catastrophe.",
				en: "Most Aldrenians worship Aldrene, whom they hold to be a saving, protective goddess. In their tradition, it is Mydare who bears the blame for much of the world's suffering: sickness, war, famine, catastrophe.",
			},
			{
				fr: "Personne ne sait avec certitude si les deux déesses sont sœurs, rivales, ou deux visages d'une même force plus ancienne qu'elles, toutes deux, pourtant, semblent liées à de véritables bénédictions dont la nature profonde échappe encore aux plus savants théologiens d'Aldrene.",
				en: "No one knows for certain whether the two goddesses are sisters, rivals, or two faces of one older force, yet both seem linked to true blessings whose deeper nature still escapes even Aldrene's most learned theologians.",
			},
		],
	},
	{
		kind: "content",
		title: {
			fr: "La question de la suite",
			en: "The Question of What Follows",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Varic Rhen règne depuis assez longtemps pour que la plupart de ses sujets n'aient jamais connu d'autre roi, et c'est précisément ce qui inquiète. On l'appelle le Vieux Roi avec affection, mais on compte aussi, en silence, les années qu'il lui reste.",
				en: "Varic Rhen has reigned long enough that most of his subjects have never known another king, and that is precisely what worries them. They call him the Old King with affection, but they also count, in silence, the years he has left.",
			},
			{
				fr: "Son fils, le prince Ilyan Rhen, est tenu pour un homme capable et mesuré, qui n'a toutefois jamais eu à décider seul de quoi que ce soit d'important. Le Conseil se partage entre ceux qui voient en lui la continuité du royaume et ceux qui redoutent qu'un règne neuf n'arrive au plus mauvais moment. Nul ne dit ces choses à voix haute tant que le roi est vivant. Nous notons seulement qu'elles se disent.",
				en: "His son, Prince Ilyan Rhen, is held to be a capable and measured man, who has nonetheless never had to decide anything of import alone. The Council is split between those who see in him the kingdom's continuity and those who fear a new reign arriving at the worst possible time. No one says such things aloud while the king still lives. We note only that they are being said.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Les légions", en: "The Legions" },
		dropcap: true,
		paragraphs: [
			{
				fr: "La force d'Aldrenia ne tient ni au nombre ni à l'abondance de ses terres, mais à la discipline de ses légions et à l'ancienneté de leur doctrine. Des générations entières d'officiers ont affiné la même formation en coin, les mêmes manœuvres de rempart, jusqu'à en faire une armée que ses ennemis redoutent moins pour sa taille que pour sa constance.",
				en: "Aldrenia's strength lies neither in numbers nor in the richness of its lands, but in the discipline of its legions and the age of their doctrine. Whole generations of officers have refined the same wedge formation, the same rampart manoeuvres, until they made of it an army its enemies fear less for its size than for its constancy.",
			},
			{
				fr: "Aux dernières nouvelles parvenues à la cour, ces légions sont engagées dans une guerre de frontière avec Skeldara, un conflit qu'Aldrenia vit au jour le jour. Des soldats y meurent chaque saison, des avant-postes y changent de main, sans qu'aucun des deux royaumes ne paraisse en mesure de l'emporter tout à fait. C'est une guerre d'usure plus que de conquête, et elle façonne depuis des années l'humeur de toute la frontière septentrionale. Le gros des légions y est retenu. Du reste, quelques cohortes tiennent les frontières d'Eorthal au titre de l'alliance, et ce qui n'est ni au nord ni à l'ouest garde les routes, les mines et les murs d'Aldrenia elle-même.",
				en: "By the latest word to reach the court, these legions are engaged in a border war with Skeldara, a conflict Aldrenia lives day by day. Soldiers die there every season, outposts change hands, without either kingdom seeming able to win outright. It is a war of attrition more than conquest, and it has shaped the mood of the whole northern frontier for years. The bulk of the legions is held up there. Of the rest, a few cohorts hold Eorthal's borders under the alliance, and what is neither north nor west guards Aldrenia's own roads, mines and walls.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Le commerce et l'alliance", en: "Trade and the Alliance" },
		dropcap: true,
		paragraphs: [
			{
				fr: "La richesse d'Aldrenia vient moins de ce qu'elle produit que de ce qu'elle fait transiter. Sa position au carrefour des routes maritimes et terrestres en fait un passage obligé pour qui commerce entre le nord et l'ouest de Mydaria, et chaque convoi qui traverse ses terres y laisse des taxes qui remplissent lentement les coffres de la Couronne.",
				en: "Aldrenia's wealth comes less from what it produces than from what it moves through. Its position at the crossing of sea and land routes makes it an unavoidable passage for anyone trading between the north and the west of Mydaria, and every convoy crossing its lands leaves behind taxes that slowly fill the Crown's coffers.",
			},
			{
				fr: "Elle entretient surtout une alliance de longue date avec Eorthal. Des troupes aldreniennes protègent les plaines eorthaliennes contre les raids venus de Skeldara, en échange de conditions commerciales très favorables sur le grain qui nourrit une bonne part de sa propre population. Cette alliance ne fait pas d'Aldrenia la maîtresse d'Eorthal, qui demeure un royaume pleinement indépendant.",
				en: "Above all it maintains a long-standing alliance with Eorthal. Aldrenian troops protect the Eorthalian plains against raids from Skeldara, in exchange for very favourable trade terms on the grain that feeds a good part of its own population. This alliance does not make Aldrenia Eorthal's master; Eorthal remains a fully independent kingdom.",
			},
		],
	},

	// --- Eorthal --------------------------------------------------------
	{
		kind: "content",
		title: { fr: "Eorthal", en: "Eorthal" },
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "À l'ouest d'Aldrenia s'étend Eorthal, une mer de plaines fertiles qui court jusqu'à l'Océan Occidental sans qu'une seule colline n'en rompe l'horizon. Les voyageurs aldreniens qui s'y aventurent au printemps décrivent des champs de blé si vastes que le vent y dessine des vagues, et des fermes isolées qui semblent flotter, seules, au milieu de l'or des récoltes.",
				en: "West of Aldrenia stretches Eorthal, a sea of fertile plains running all the way to the Occidental Ocean without a single hill breaking the horizon. Aldrenian travellers who venture there in spring describe wheat fields so vast the wind draws waves across them, and lone farmsteads that seem to float, alone, amid the gold of the harvest.",
			},
			{
				fr: "Sa capitale, Granholt, s'élève au cœur de ces terres comme une île de pierre dans un océan de céréales, des greniers hauts comme des tours, des marchés aux grains qui débordent jusque dans les rues, et un fleuve navigable qui charrie, chaque automne, des barges trop chargées pour sembler sûres. Le royaume est gouverné par la comtesse Ysolde Varn, qui a elle-même négocié, de sa propre voix, l'alliance avec Aldrenia destinée à protéger ses terres des appétits de Skeldara.",
				en: "Its capital, Granholt, rises at the heart of these lands like an island of stone in an ocean of grain, granaries tall as towers, grain markets spilling into the streets, and a navigable river that carries, every autumn, barges loaded too heavily to look safe. The kingdom is governed by Countess Ysolde Varn, who herself negotiated, in her own voice, the alliance with Aldrenia meant to protect her lands from Skeldara's appetite.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Une puissance sans armée", en: "A Power Without an Army" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Dépourvu d'une puissance militaire comparable à celle de ses deux puissants voisins, Eorthal ne lève que des milices de récolte, des paysans armés de faux et de piques capables de tenir un instant mais non une bataille. Aux dernières nouvelles, sa défense repose sur les quelques cohortes aldreniennes postées à ses frontières au titre de l'alliance, et plus encore sur ce qu'elles annoncent, le gros des légions retenu au nord mais prêt à descendre. Sans ce rempart emprunté, le royaume aurait sans doute déjà cédé, au moins en partie, aux raids skeldariens.",
				en: "Lacking a military power to match either of its two powerful neighbours, Eorthal raises only harvest militias, peasants armed with scythes and pikes able to hold for a moment but not a battle. By the latest word, its defence rests on the few Aldrenian cohorts posted at its borders under the alliance, and still more on what they announce: the bulk of the legions, held in the north but ready to come down. Without that borrowed rampart, the kingdom would surely have already yielded, at least in part, to Skeldarian raids.",
			},
			{
				fr: "Ce déséquilibre n'échappe à personne à Eorthal, et il nourrit une méfiance ancienne envers l'idée même d'une armée permanente. Certains, à Granholt, murmurent qu'une terre trop occupée à nourrir le monde n'a jamais le temps d'apprendre à se défendre elle-même, et que c'est précisément ce que Skeldara attend depuis des générations.",
				en: "This imbalance escapes no one in Eorthal, and it feeds an old wariness toward the very idea of a standing army. Some in Granholt murmur that a land too busy feeding the world never has time to learn to defend itself, and that this is precisely what Skeldara has been waiting for, for generations.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Le grenier de Mydaria", en: "The Granary of Mydaria" },
		dropcap: true,
		torn: "top",
		paragraphs: [
			{
				fr: "Ce que le royaume perd en force militaire, il le regagne cent fois en puissance économique. La fertilité de ses terres nourrit à elle seule une bonne part de Mydaria, et aucun royaume, pas même Aldrenia, ne pourrait aujourd'hui se passer longtemps de ses exportations de grain sans en ressentir la faim.",
				en: "What the kingdom loses in military strength, it regains a hundredfold in economic power. The fertility of its lands alone feeds a good part of Mydaria, and no kingdom, not even Aldrenia, could today go long without its grain exports without feeling hunger for it.",
			},
			{
				fr: "Les Eorthaliens expliquent cette abondance par une bénédiction que Mydare leur aurait elle-même accordée, voilà si longtemps que plus personne, à Eorthal, ne songe à en douter. Que la cause en soit divine ou simplement le fruit d'une terre généreuse, le résultat est le même. C'est le blé d'Eorthal qui, plus que n'importe quelle légion, tient aujourd'hui l'équilibre entre les royaumes.",
				en: "Eorthalians explain this abundance by a blessing Mydare is said to have granted them herself, so long ago that no one in Eorthal thinks to doubt it anymore. Whether the cause is divine or simply the fruit of a generous land, the result is the same. It is Eorthal's wheat that, more than any legion, today holds the balance between the kingdoms.",
			},
		],
	},

	// --- Skeldara --------------------------------------------------------
	{
		kind: "content",
		title: { fr: "Skeldara", en: "Skeldara" },
		dropcap: true,
		bookmark: true,
		torn: "top",
		paragraphs: [
			{
				fr: "Au nord, au-delà des contreforts que les éclaireurs aldreniens n'osent franchir qu'en groupe, s'accrochent les pics et les cols de Skeldara. C'est une terre de pierre nue et de vent constant, où les villages se blottissent dans les failles des montagnes et où, dit-on, un enfant apprend à tenir une lame avant de savoir lire. Les soldats aldreniens qui en reviennent décrivent un pays sans tendresse apparente, mais dont chaque pierre semble taillée pour la guerre.",
				en: "To the north, beyond the foothills that Aldrenian scouts dare cross only in groups, cling the peaks and passes of Skeldara. It is a land of bare stone and constant wind, where villages huddle in the mountains' fissures and where, it is said, a child learns to hold a blade before learning to read. Aldrenian soldiers who return from it describe a country with no apparent softness, yet one where every stone seems cut for war.",
			},
			{
				fr: "Sa capitale, Dunmarr, est une forteresse autant qu'une ville, cernée de remparts de pierre grise encerclant des halls de pierre plus grise encore, construits à flanc de montagne de telle sorte qu'aucune armée ne pourrait l'approcher sans être vue des heures à l'avance. Elle est dirigée par le roi Gorath Thorne, dont la lignée règne sans partage depuis plusieurs générations, et que les officiers aldreniens qui l'ont affronté décrivent comme un chef aussi redouté par ses propres troupes que par ses ennemis.",
				en: "Its capital, Dunmarr, is as much fortress as city, ringed by grey stone ramparts enclosing halls of even greyer stone, built into the mountainside so that no army could approach it without being seen hours in advance. It is ruled by King Gorath Thorne, whose line has reigned unchallenged for several generations, and whom the Aldrenian officers who have faced him describe as a leader feared as much by his own troops as by his enemies.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Une culture de guerriers", en: "A Culture of Warriors" },
		dropcap: true,
		paragraphs: [
			{
				fr: "La société skeldarienne tout entière semble façonnée par la guerre. Les vétérans y occupent le rang le plus haut après la couronne, les raiders y sont des figures respectées plutôt que des hors-la-loi, et l'on y mesure, dit-on, la valeur d'un homme à la taille de son armure plus qu'à celle de ses terres. Le royaume est dévoué à Mydare et rejette avec un mépris ouvert le culte d'Aldrene, une hostilité nourrie par des générations de guerre frontalière avec Aldrenia.",
				en: "Skeldarian society as a whole seems shaped by war. Veterans hold the highest rank after the crown, raiders are respected figures rather than outlaws, and a man's worth, it is said, is measured by the size of his armour more than that of his lands. The kingdom is devoted to Mydare and rejects the cult of Aldrene with open contempt, a hostility fed by generations of border war with Aldrenia.",
			},
			{
				fr: "Ce qui se vit réellement derrière ces frontières, Aldrenia ne le connaît que par ce que ses soldats en rapportent du champ de bataille, et ce qu'ils en rapportent suffit à inspirer un respect prudent, une discipline de fer, une tolérance à la souffrance que les officiers aldreniens eux-mêmes jugent inhabituelle, et une capacité à se reformer après une défaite que bien peu de royaumes pourraient égaler.",
				en: "What truly happens behind those borders, Aldrenia knows only through what its soldiers bring back from the battlefield, and what they bring back is enough to inspire a wary respect: an iron discipline, a tolerance for suffering that Aldrenian officers themselves judge unusual, and a capacity to reform after defeat that very few kingdoms could match.",
			},
		],
	},
	{
		kind: "content",
		title: {
			fr: "Une terre pauvre, une guerre riche",
			en: "A Poor Land, a Rich War",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Les hautes terres skeldariennes n'offrent presque rien à cultiver. Quelques vallées abritées suffisent à peine à nourrir la population, et c'est dans les entrailles des montagnes, au fer et à l'argent qu'on en extrait, que le royaume trouve l'essentiel de sa richesse. Ses mines sont profondes, dit-on, au point que certains tunnels courent sous la montagne depuis plusieurs générations sans en avoir encore atteint le fond.",
				en: "The Skeldarian highlands offer almost nothing to cultivate. A few sheltered valleys barely suffice to feed the population, and it is in the mountains' bellies, in the iron and silver drawn from them, that the kingdom finds the bulk of its wealth. Its mines run deep, it is said, to the point that some tunnels have run beneath the mountain for several generations without yet reaching bottom.",
			},
			{
				fr: "Le reste de son économie, Skeldara le tire de la guerre elle-même, butin de raid, tribut arraché aux villages frontaliers d'Eorthal, armes et armures vendues à prix d'or à qui peut se le permettre. C'est une richesse de conquête plus que de récolte, et elle explique, mieux qu'aucun traité, pourquoi la paix avec ce royaume n'a jamais tout à fait tenu.",
				en: "The rest of its economy, Skeldara draws from war itself: raid plunder, tribute wrung from Eorthal's border villages, weapons and armour sold at a gold price to whoever can afford them. It is a wealth of conquest more than harvest, and it explains, better than any treaty, why peace with this kingdom has never quite held.",
			},
		],
	},

	// --- Dreamar --------------------------------------------------------
	{
		kind: "content",
		title: { fr: "Dreamar", en: "Dreamar" },
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Entre Aldrenia et le reste du continent s'étendent les forêts profondes de Dreamar, un royaume que les voyageurs aldreniens décrivent moins qu'ils ne le devinent. La canopée y est si dense, disent-ils, que le jour y prend la couleur du crépuscule même à midi, et les sentiers qu'on y trace une saison ont souvent disparu sous la mousse à la suivante.",
				en: "Between Aldrenia and the rest of the continent stretch the deep forests of Dreamar, a kingdom Aldrenian travellers describe less than they guess at. The canopy there is so dense, they say, that daylight takes on the colour of dusk even at noon, and paths cut in one season have often vanished beneath moss by the next.",
			},
			{
				fr: "Sa capitale, Nyrelle, se dissimule si bien parmi les arbres que les rares visiteurs aldreniens peinent à dire où elle commence vraiment. On raconte que ses toits sont tressés de branches vivantes, et que certains quartiers entiers changent de place au fil des saisons, selon une logique que nul étranger n'a jamais su suivre.",
				en: "Its capital, Nyrelle, hides so well among the trees that the rare Aldrenian visitors struggle to say where it truly begins. It is said that its roofs are woven of living branches, and that whole districts shift place with the seasons, following a logic no outsider has ever managed to follow.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Un conseil sans visage", en: "A Faceless Council" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Dreamar ne connaît pas de roi au sens où Aldrenia l'entend. Un conseil de visionnaires le dirige, mais ce conseil reste volontairement secret, sans nom connu hors de ses propres forêts. La Haute Augure Mirelle Senn en est le visage public, mais même cela, Aldrenia ne peut l'affirmer avec certitude. Nul ne sait si c'est bien elle qui décide, ou si elle n'est que la porte-parole d'une assemblée qui préfère rester dans l'ombre.",
				en: "Dreamar knows no king in the sense Aldrenia understands the word. A council of visionaries governs it, but that council remains deliberately secret, with no name known beyond its own forests. High Augur Mirelle Senn is its public face, but even that much Aldrenia cannot state with certainty. No one knows whether she truly decides, or whether she is merely the mouthpiece of an assembly that prefers to stay in the shadows.",
			},
			{
				fr: "Ces augures prétendent recevoir des visions d'événements à venir, un pouvoir que nul, même à Dreamar, ne sait expliquer avec certitude. Aucun Aldrenien n'a jamais assisté lui-même à l'une d'elles pour trancher entre don véritable et mise en scène savamment entretenue, et c'est peut-être précisément ainsi que Dreamar l'entend.",
				en: "These augurs claim to receive visions of events to come, a power no one, even in Dreamar, can explain with certainty. No Aldrenian has ever witnessed one of these visions himself to settle whether it is a true gift or a carefully maintained performance, and that may be exactly how Dreamar intends it.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Le foyer de la magie", en: "The Home of Magic" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Si la magie existe à Mydaria, c'est de Dreamar qu'elle vient. Elle reste rare partout, y compris là-bas, et rien n'explique pourquoi la plupart de ceux qui naissent avec elle naissent sous ces arbres. Aucun royaume ne discute pourtant ce fait, Aldrenia comprise, qui envoie depuis des générations ses blessés les plus fortunés chercher dans ces forêts ce qu'aucun de ses propres médecins ne sait faire.",
				en: "If magic exists in Mydaria, it comes from Dreamar. It remains rare everywhere, there included, and nothing explains why most of those born with it are born beneath those trees. No kingdom disputes the fact, however, Aldrenia included, which has for generations sent its wealthiest wounded into those forests to seek what none of its own physicians can do.",
			},
			{
				fr: "Une part de cette magie guérit, referme certaines blessures, repousse certaines maladies, tient en vie des hommes qu'on avait déjà veillés. Elle n'annule pas tout et ne rend personne à la vie, et les guérisseurs de Dreamar sont les premiers à le dire. L'autre part se dit divine, accordée par Mydare elle-même à qui la sert, et c'est là que le savoir d'Aldrenia s'arrête. Que cette puissance vienne de la déesse ou d'ailleurs, nul ici ne saurait le démontrer, et le culte d'Aldrene se garde bien de l'admettre à voix haute.",
				en: "Part of that magic heals, closes certain wounds, pushes back certain sicknesses, keeps alive men who had already been watched over. It undoes nothing entirely and returns no one to life, and Dreamar's healers are the first to say so. The other part is called divine, granted by Mydare herself to those who serve her, and that is where Aldrenia's knowledge stops. Whether this power comes from the goddess or from elsewhere, no one here could prove, and the cult of Aldrene is careful not to concede it aloud.",
			},
		],
	},

	{
		kind: "content",
		title: { fr: "Une force qu'on ne voit jamais", en: "A Force Never Seen" },
		dropcap: true,
		paragraphs: [
			{
				fr: "De la puissance militaire de Dreamar, Aldrenia sait étonnamment peu de choses, et ce peu suffit à décourager toute velléité d'invasion. Aucune armée n'a jamais pénétré bien loin dans ses forêts sans en ressortir désorientée, affaiblie, ou pas du tout. Les éclaireurs qui en reviennent parlent de chemins qui se referment derrière eux et de bruits qu'ils ne savent attribuer ni à une bête ni à un homme.",
				en: "Of Dreamar's military strength, Aldrenia knows remarkably little, and that little is enough to discourage any thought of invasion. No army has ever gone far into its forests without coming out disoriented, weakened, or not at all. Scouts who return from it speak of paths that close behind them and of sounds they cannot attribute to either beast or man.",
			},
			{
				fr: "Son économie reste tout aussi discrète, du bois qu'aucune hache ordinaire ne semble pouvoir fendre, des teintures dont la couleur ne pâlit jamais, et des services que la Haute Augure rend, dit-on, à qui peut s'offrir une audience. C'est une richesse qui se négocie à voix basse, loin des marchés publics où se comptent les fortunes des autres royaumes.",
				en: "Its economy is just as discreet: timber no ordinary axe seems able to split, dyes whose colour never fades, and services the High Augur renders, it is said, to whoever can afford an audience. It is a wealth negotiated in hushed voices, far from the public markets where the other kingdoms' fortunes are counted.",
			},
		],
	},

	// --- Thelmere --------------------------------------------------------
	{
		kind: "content",
		title: { fr: "Thelmere", en: "Thelmere" },
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Seule puissance insulaire parmi les six royaumes, Thelmere se dresse au large, hors d'atteinte de toute route terrestre. On y accède par une route maritime balisée de phares, et l'on dit que nul capitaine étranger ne s'y aventure sans un pilote thelmérien à son bord, tant les courants y sont réputés traîtres.",
				en: "The only island power among the six kingdoms, Thelmere stands out at sea, beyond the reach of any land road. It is reached by a sea route marked with lighthouses, and it is said that no foreign captain ventures there without a Thelmerian pilot aboard, so treacherous are the currents said to be.",
			},
			{
				fr: "Sa capitale, Thelbridge, se dresse sur cette île comme une ville de mâts et de toits d'ardoise, reliée au reste des terres thelmériennes par un pont si vaste qu'il est devenu, à lui seul, une merveille dont on parle jusqu'à Aldrenia. Il franchit le bras de mer qui sépare l'île de ces terres, et les marins l'appellent le Pas-de-Mer ; aucun Thelmérien n'a jamais jugé utile de lui chercher un nom plus savant. Au-delà de ses ports, la vie intérieure de Thelmere reste mal connue des marchands aldreniens, trop occupés à compter leurs cargaisons pour s'y attarder.",
				en: "Its capital, Thelbridge, stands on this island as a city of masts and slate roofs, linked to the rest of the Thelmerian lands by a bridge so vast that it alone has become a wonder spoken of as far as Aldrenia. It spans the arm of sea that separates the island from those lands, and sailors call it the Sea-Step; no Thelmerian has ever thought it needed a more learned name. Beyond its ports, Thelmere's inner life remains little known to Aldrenian merchants, too busy counting their cargoes to linger over it.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "La flotte avant tout", en: "The Fleet Above All" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Le royaume est gouverné par la Haute Amirale Corwin Dray, dont l'autorité repose autant sur le commandement de la flotte que sur un quelconque droit héréditaire. À Thelmere, on ne commande pas d'abord des terres mais des navires, et c'est là, plus que dans aucun palais, que se décide réellement qui dirige.",
				en: "The kingdom is governed by High Admiral Corwin Dray, whose authority rests as much on command of the fleet as on any hereditary right. In Thelmere, one commands ships before land, and it is there, more than in any palace, that who truly rules is decided.",
			},
			{
				fr: "Sa puissance militaire tient presque entièrement à cette flotte, la plus développée du monde connu aux dernières nouvelles parvenues à la cour d'Aldrenia. Aucun royaume ne peut aujourd'hui lui disputer les mers sans risquer d'y perdre jusqu'au dernier de ses navires. Son armée de terre, en revanche, reste modeste, car Thelmere n'a jamais eu besoin de défendre ses côtes autrement qu'en mer.",
				en: "Its military strength rests almost entirely on this fleet, the most developed in the known world by the latest word to reach the Aldrenian court. No kingdom today can dispute the seas with it without risking the loss of its last ship. Its land army, by contrast, remains modest, for Thelmere has never needed to defend its coasts other than at sea.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Le monopole des quais", en: "The Monopoly of the Docks" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Cette même flotte assure à Thelmere un quasi-monopole sur le commerce des métaux, des tissus, du bois précieux et des denrées rares qui circulent entre les royaumes. Presque rien ne traverse les mers de Mydaria sans passer, d'une manière ou d'une autre, par un port thelmérien ou par un navire battant son pavillon.",
				en: "This same fleet grants Thelmere a near-monopoly on the trade in metals, cloth, precious wood, and rare goods moving between the kingdoms. Almost nothing crosses the seas of Mydaria without passing, in one way or another, through a Thelmerian port or aboard a ship flying its flag.",
			},
			{
				fr: "C'est une richesse qui se compte en cargaisons plus qu'en terres, et qui donne à ce petit royaume insulaire un poids économique sans commune mesure avec sa taille. Les marchands d'Aldrenia le savent bien. Négocier avec Thelmere, c'est toujours négocier en position de faiblesse, car le royaume peut, d'un mot, fermer ses ports à qui lui déplaît.",
				en: "It is a wealth counted in cargoes more than in lands, and it gives this small island kingdom an economic weight far beyond its size. Aldrenia's merchants know it well. To negotiate with Thelmere is always to negotiate from a position of weakness, for the kingdom can, with a single word, close its ports to whoever displeases it.",
			},
		],
	},

	// --- Ostrane : ce qu'on ne sait pas -----------------------------------
	{
		kind: "content",
		title: { fr: "Ostrane", en: "Ostrane" },
		dropcap: true,
		bookmark: true,
		torn: "bottom",
		paragraphs: [
			{
				fr: "Repliée sur les terres méridionales du continent, Ostrane rompt avec tout ce schéma. Seul des six royaumes à s'être toujours tenu à l'écart du commerce, des guerres et des alliances des cinq autres, il n'a jamais laissé le temps construire sur lui le même savoir accumulé que sur ses voisins. Les voyageurs aldreniens qui s'y aventurent en reviennent avec des récits qui se contredisent presque tous, terres arides pour les uns, collines verdoyantes pour les autres.",
				en: "Withdrawn upon the continent's southern lands, Ostrane breaks with this whole pattern. The only one of the six kingdoms to have always kept itself apart from the trade, wars, and alliances of the other five, it has never let time build upon it the same accumulated knowledge as upon its neighbours. Aldrenian travellers who venture there come back with accounts that almost all contradict one another: arid lands for some, green hills for others.",
			},
			{
				fr: "Même le nom de sa capitale, Farwatch, n'est connu que par ouï-dire, rapporté de bouche en bouche par des marchands qui n'y ont jamais mis les pieds eux-mêmes. Aucune carte dressée à Aldrenia ne s'accorde tout à fait avec une autre sur l'emplacement exact de ses frontières.",
				en: "Even the name of its capital, Farwatch, is known only by hearsay, passed from mouth to mouth by merchants who have never themselves set foot there. No map drawn in Aldrenia quite agrees with another on the exact location of its borders.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "Une puissance qu'on ignore", en: "A Power No One Knows" },
		dropcap: true,
		paragraphs: [
			{
				fr: "De la force militaire d'Ostrane, Aldrenia ne sait rigoureusement rien. Aucun soldat aldrenien ne s'y est jamais heurté, aucun espion n'en est revenu avec un chiffre crédible à rapporter. Certains, à la cour, supposent une armée réduite, faute d'ennemis déclarés, d'autres y voient au contraire la preuve d'une force qu'on préfère ne jamais montrer.",
				en: "Of Ostrane's military strength, Aldrenia knows strictly nothing. No Aldrenian soldier has ever clashed with it, no spy has ever come back with a credible figure to report. Some at court assume a small army, for lack of declared enemies; others see in this, on the contrary, proof of a strength one prefers never to show.",
			},
			{
				fr: "Son poids économique reste tout aussi incertain. Nul marchand aldrenien ne tient de comptoir sur ses terres, nulle caravane n'en rapporte de marchandise qu'on puisse attribuer avec certitude à son origine. Ce que l'on sait seulement, c'est que ses dirigeants, quels qu'ils soient, semblent chercher avant tout la paix sur leur propre territoire. Aucun diplomate n'a jamais pu en rapporter de nom de souverain, de conseil ou de dynastie, et certains à Aldrenia doutent même qu'il existe un dirigeant unique.",
				en: "Its economic weight remains just as uncertain. No Aldrenian merchant holds a trading post on its lands, no caravan brings back goods one could attribute with certainty to its origin. What is known is only that its rulers, whoever they are, seem to seek above all peace within their own territory. No diplomat has ever managed to bring back the name of a sovereign, council, or dynasty, and some in Aldrenia even doubt that a single ruler exists.",
			},
		],
	},

	{
		kind: "content-italic",
		text: {
			fr: "Ainsi se referme le premier de ces cahiers. Nous y avons consigné le monde tel qu'il tenait encore, pendant que le suivant, déjà commencé sur la même table, s'ouvrait sur le jour où il a cessé de tenir.",
			en: "Thus closes the first of these volumes. In it we recorded the world as it still stood, while the next one, already begun on the same table, opened on the day it ceased to stand.",
		},
	},
];

const VOLUME_II_PAGES: JournalPage[] = [
	{ kind: "cover" },

	{
		kind: "content",
		title: {
			fr: "Cahier second",
			en: "Second Volume",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Voici le second cahier de ce registre. Le premier a été refermé sur le monde tel qu'il tenait encore ; celui-ci s'ouvre sur le jour où il a cessé de tenir, et sur l'année qui a suivi. Il est tenu sous la même charge et pour la même raison que le précédent : si ce royaume devait ne pas durer, que ce qui lui est arrivé reste écrit quelque part, de la main de ceux qui l'ont vu.",
				en: "This is the second volume of this register. The first was closed upon the world as it still stood; this one opens on the day it ceased to stand, and on the year that followed. It is kept under the same charge and for the same reason as the last: should this kingdom not endure, let what happened to it remain written somewhere, in the hand of those who saw it.",
			},
			{
				fr: "La règle que le Conseil a fixée au premier jour n'a pas changé d'un cahier à l'autre : on n'inscrit ici que ce qu'un homme a vu lui-même et rapporté, et l'on nomme rumeur tout le reste. C'est une règle facile à tenir quand il ne se passe rien. Les pages qui suivent diront ce qu'elle a coûté cette année-là.",
				en: "The rule the Council laid down on the first day has not changed from one volume to the next: nothing is entered here but what a man saw himself and reported, and everything else is called rumour. It is an easy rule to keep when nothing happens. The pages that follow will say what it cost that year.",
			},
		],
	},

	{
		kind: "divider",
		bookNo: { fr: "Entrée II", en: "Entry II" },
		bookTitle: {
			fr: "Le jour où tout changea",
			en: "The Day Everything Changed",
		},
		bookSub: {
			fr: "Ce que l'on sait, ce que l'on raconte, et ce que personne, pour l'instant, n'ose encore nommer.",
			en: "What is known, what is told, and what no one, for now, yet dares to name.",
		},
	},

	// --- Le cataclysme -----------------------------------------------------
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			{
				fr: "Sans aucun signe annonciateur, Aldrenia est frappée par un cataclysme d'une ampleur inconnue jusque-là. Le ciel, pourtant, ne change pas de couleur. Aucun astre ne tombe, aucune trompette ne sonne. C'est la terre elle-même qui se met à trembler sous les pieds de tous à la fois, les bêtes qui se mettent à hurler sans raison dans les étables, et dans certaines maisons les lampes qui s'éteignent toutes ensemble sans qu'aucun souffle ne les ait touchées.",
				en: "Without any warning sign, Aldrenia is struck by a cataclysm of a scale unknown until then. The sky, however, does not change colour. No star falls, no trumpet sounds. It is the earth itself that begins to shake under everyone's feet at once, the animals that begin howling for no reason in their stalls, and in some houses the lamps that go out all together, though no breath has touched them.",
			},
			{
				fr: "Ce n'est qu'après coup, dans les heures et les jours qui suivent, une fois les premiers récits recoupés entre eux, que l'on comprend qu'il ne s'agit pas d'un simple tremblement de terre isolé, mais de quelque chose qui a frappé bien plus loin que les frontières d'Aldrenia, peut-être le monde tout entier.",
				en: "It is only afterward, in the hours and days that follow, once the first accounts are cross-checked against one another, that it becomes clear this is no simple isolated earthquake, but something that struck far beyond Aldrenia's borders, perhaps the whole world.",
			},
			{
				fr: "L'événement n'a pas de nom. Dans les jours qui suivent, personne ne sait comment le désigner autrement qu'en le décrivant à sa manière, par « la grande secousse », prononcé à voix basse, comme si lui donner un nom trop précis risquait de lui donner aussi une raison.",
				en: 'The event has no name. In the days that follow, no one knows how to call it other than by describing it in their own way, as "the great tremor", spoken in a hushed voice, as if giving it too precise a name risked also giving it a reason.',
			},
		],
	},

	// --- Aldrenia, ce jour-là -----------------------------------------------
	{
		kind: "content",
		title: { fr: "Aldrenia, ce jour-là", en: "Aldrenia, That Day" },
		dropcap: true,
		paragraphs: [
			{
				fr: "À Aldrenia même, la terre tremble. Mais au-delà du tremblement, quelque chose de plus profond se produit. Sur plusieurs lieues de son propre territoire, le sol semble se plier sur lui-même, et à l'endroit où il se redresse, ce n'est plus tout à fait la même terre qui reprend sa place.",
				en: "In Aldrenia itself, the earth shakes. But beyond the shaking, something deeper happens. Across several leagues of its own territory, the ground seems to fold in on itself, and where it straightens again, it is no longer quite the same earth that settles back into place.",
			},
			{
				fr: "Des pierres inconnues, des reliefs que nul Aldrenien n'a jamais vus, des bâtiments dont l'architecture n'appartient à aucun style connu se trouvent soudain là, comme si un fragment entier d'un autre monde venait simplement de se poser sur le sien.",
				en: "Unknown stones, landforms no Aldrenian has ever seen, buildings whose architecture belongs to no known style are suddenly there, as though an entire fragment of another world had simply come to rest upon its own.",
			},
			{
				fr: "Les paysans qui découvrent ces lieux au petit matin en parlent avec une prudence presque religieuse, comme s'ils craignaient qu'approcher de trop près ne les y attache à leur tour. Certains, plus curieux ou plus désespérés, s'y rendent déjà pour y chercher on ne sait quoi. Faute de mieux, on parle bientôt de la Pliure, du nom de ce que les premiers témoins ont cru voir, la terre se pliant sur elle-même.",
				en: "The peasants who discover these places at first light speak of them with an almost religious caution, as though fearing that coming too close might bind them to it in turn. Some, more curious or more desperate, already go there in search of they know not what. For lack of a better word, people soon speak of the Fold, after what the first witnesses believed they saw: the earth folding in on itself.",
			},
		],
	},

	// --- Les premiers témoignages --------------------------------------------
	{
		kind: "content",
		title: { fr: "Les premiers témoignages", en: "The First Accounts" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Dans les heures qui suivent la secousse, les récits affluent, d'abord timides, puis de plus en plus pressants. Un soldat posté sur les remparts orientaux jure avoir vu, au loin, un arbre se redresser avec un torse d'homme greffé à son tronc, ses branches se tordant comme des bras désarticulés, avant de s'immobiliser pour de bon.",
				en: "In the hours following the tremor, accounts pour in, timid at first, then more and more urgent. A soldier posted on the eastern ramparts swears he saw, in the distance, a tree rise up with a man's torso grafted to its trunk, its branches twisting like disjointed arms, before going still for good.",
			},
			{
				fr: "Un fermier affirme avoir trouvé dans son champ une masse de chair et de pierre qui respirait encore, lourdement, comme un animal pris au piège. Une marchande, revenue en larmes du marché aux bestiaux, raconte avoir vu deux de ses bêtes se confondre sous ses yeux en une seule créature, avant de s'enfuir en boitant vers la forêt la plus proche.",
				en: "A farmer claims to have found in his field a mass of flesh and stone still breathing, heavily, like a trapped animal. A merchant woman, returning in tears from the cattle market, tells of watching two of her beasts merge before her eyes into a single creature, before it fled limping toward the nearest forest.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			{
				fr: "Aucun de ces récits ne ressemble tout à fait à un autre, et pourtant tous décrivent, sous des formes différentes, la même chose, des fusions impossibles de chair, d'os, d'écorce, de pierre ou de métal, nées de rien et de tout à la fois. Personne, à ce stade, ne sait leur donner un nom qui tienne au-delà d'une rue ou d'un village.",
				en: "No two of these accounts quite resemble each other, and yet all describe, in different shapes, the same thing: impossible fusions of flesh, bone, bark, stone or metal, born of nothing and everything at once. No one, at this stage, can give them a name that holds beyond a single street or village.",
			},
			{
				fr: "Les prêtres n'y reconnaissent aucune création connue de Mydare ni d'Aldrene. Les érudits de la cour n'y trouvent ni logique, ni motif, ni la moindre règle qu'on puisse noter avec quelque assurance.",
				en: "The priests recognise in them no known creation of Mydare or Aldrene. The court's scholars find in them neither logic nor pattern, nor the slightest rule they could write down with any confidence.",
			},
			{
				fr: "Ce que l'on sait, en revanche, c'est la peur qu'elles inspirent. Ceux qui les croisent en reviennent rarement capables d'en parler calmement, certains n'en reviennent pas du tout, et leurs familles continuent de les attendre, debout sur le pas de leur porte, plus longtemps qu'il ne serait raisonnable d'espérer. Dans les tavernes et sur les marchés, chacun leur invente déjà un nom de fortune, sans qu'aucun ne s'impose encore sur les autres.",
				en: "What is known, however, is the fear they inspire. Those who encounter them rarely come back able to speak of it calmly; some do not come back at all, and their families go on waiting for them, standing in their doorways, longer than it would be reasonable to hope. In taverns and markets, everyone is already inventing a makeshift name for them, though none has yet won out over the others.",
			},
		],
	},

	// --- Entre Aldrene et Mydare ---------------------------------------------
	{
		kind: "content",
		title: { fr: "Entre Aldrene et Mydare", en: "Between Aldrene and Mydare" },
		dropcap: true,
		paragraphs: [
			{
				fr: "La cour et les temples d'Aldrenia s'emplissent aussitôt de questions auxquelles personne ne sait répondre. Pour certains prêtres d'Aldrene, c'est elle qui se manifeste, à sa manière, impossible à comprendre, peut-être pour avertir, peut-être pour protéger. D'autres y voient au contraire la main de Mydare, enfin déchaînée après des siècles de patience divine. Aucune des deux explications ne peut être vérifiée, et les deux camps se gardent, pour l'instant, de l'affirmer trop haut.",
				en: "The court and temples of Aldrenia fill at once with questions no one can answer. For some priests of Aldrene, it is she manifesting, in her own incomprehensible way, perhaps to warn, perhaps to protect. Others see in it instead the hand of Mydare, unleashed at last after centuries of divine patience. Neither explanation can be verified, and both camps are, for now, careful not to claim it too loudly.",
			},
			{
				fr: "Personne, à Aldrenia, ne sait si Eorthal, Skeldara, Dreamar, Thelmere et Ostrane subissent la même chose au même instant. Dans les tavernes comme dans les couloirs du palais, la même question circule, murmurée plus qu'elle n'est posée franchement. Est-ce fini, ou cela ne fait-il que commencer ?",
				en: "No one in Aldrenia knows whether Eorthal, Skeldara, Dreamar, Thelmere and Ostrane are suffering the same thing at the same moment. In taverns as in the palace corridors, the same question circulates, murmured more than openly asked. Is it over, or is it only beginning?",
			},
		],
	},

	// --- Les éclaireurs -------------------------------------------------------
	{
		kind: "content",
		title: { fr: "Les éclaireurs", en: "The Scouts" },
		dropcap: true,
		torn: "top",
		paragraphs: [
			{
				fr: "Face à ce silence et à ces questions sans réponse, le roi Varic Rhen ne peut se permettre d'attendre que les réponses viennent d'elles-mêmes. Dans les jours qui suivent, des éclaireurs sont choisis parmi les plus endurants et les plus discrets de ses armées, puis envoyés dans toutes les directions à la fois, vers chacun des royaumes voisins, avec pour seule instruction de voir, d'écouter, et de revenir.",
				en: "Faced with this silence and these unanswered questions, King Varic Rhen cannot afford to wait for answers to come on their own. In the days that follow, scouts are chosen from among the most enduring and discreet of his armies, then sent out in every direction at once, toward each of the neighbouring kingdoms, with the sole instruction to see, to listen, and to return.",
			},
			{
				fr: "Le voyage est long. Il faut compter environ sept à huit jours pour atteindre les terres skeldariennes et autant pour en revenir, cinq vers Eorthal, quatre pour n'atteindre que la lisière des forêts de Dreamar, et plus de deux semaines vers Thelmere, le plus reculé des six. Vers Ostrane, seule exception, la route elle-même est courte, à peine plus longue que celle d'Eorthal. En attendant, le peuple d'Aldrenia n'a d'autre choix que d'apprendre à vivre avec l'inconnu, un jour après l'autre.",
				en: "The journey is long. It takes roughly seven to eight days to reach Skeldarian lands and as many to return, five toward Eorthal, four to reach no more than the edge of Dreamar's forests, and over two weeks toward Thelmere, the most distant of the six. Toward Ostrane, the sole exception, the road itself is short, barely longer than the one to Eorthal. In the meantime, the people of Aldrenia have no choice but to learn to live with the unknown, one day after another.",
			},
		],
	},

	{
		kind: "divider",
		bookNo: { fr: "Entrée III", en: "Entry III" },
		bookTitle: {
			fr: "Ce que les éclaireurs ont rapporté",
			en: "What the Scouts Brought Back",
		},
		bookSub: {
			fr: "Le retour, royaume par royaume, et ce que le monde est devenu un an après la secousse.",
			en: "Their return, kingdom by kingdom, and what the world has become a year after the tremor.",
		},
	},

	{
		kind: "map",
		srcFr: "1aw-map-fr.png",
		srcEn: "1aw-map-en.png",
	},

	// --- Retour d'Eorthal ---------------------------------------------------
	{
		kind: "content",
		title: { fr: "Le retour d'Eorthal", en: "Eorthal's Return" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Le premier éclaireur à rentrer est Halder Crenn, celui qu'on avait envoyé vers Eorthal. Il revient les traits tirés, avec moins de certitudes qu'il n'en espérait, et un récit qu'il nous faut plusieurs jours pour démêler des rumeurs qui l'accompagnent déjà.",
				en: "The first scout to return is Halder Crenn, the one sent toward Eorthal. He comes back drawn and weary, with fewer certainties than he had hoped for, and an account it takes us several days to untangle from the rumours already surrounding it.",
			},
			{
				fr: "Dans quelques hameaux isolés du royaume, des morts ne sont pas restés morts. Pas une armée, pas une invasion, des cas épars, signalés ici et là par des paysans qui préfèrent encore ne pas en parler trop fort, de peur qu'en parler ne fasse revenir autre chose. Ceux qui en ont vu décrivent des proches enterrés depuis des jours, parfois des années, qui se relèvent sans un mot, le regard vide, sans reconnaître ni leur maison ni ceux qui les pleurent. Le mot que les habitants eux-mêmes emploient pour les désigner, un mort-vivant, voyage avec l'éclaireur jusqu'à Caldrath, et c'est sous ce nom, faute d'un meilleur, qu'il entre dans ce registre.",
				en: "In a few isolated hamlets of the kingdom, the dead have not stayed dead. Not an army, not an invasion: scattered cases, reported here and there by peasants who still prefer not to speak of it too loudly, for fear that speaking might call something else back. Those who have seen them describe kin buried for days, sometimes years, rising without a word, their eyes empty, recognising neither their home nor those who mourn them. The word the people themselves use to name them, undead, travels with the scout all the way to Caldrath, and it is under this name, for lack of a better one, that it enters this register.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			{
				fr: "C'est en recueillant ces mêmes récits que l'éclaireur entend parler, pour la première fois, d'un certain Edrin Fenn, du hameau d'Ellerwick. Un fermier, disent les villageois des environs, mort le jour de la secousse, et que l'on aurait vu depuis marcher les routes aux abords de sa ferme avec, derrière lui, trois silhouettes qu'il appelle encore sa femme et ses enfants. Il les nomme même, à qui veut l'entendre, Maren, Joren et Liss. Nul à Eorthal ne sait dire avec certitude s'il est à l'origine de ce qui se passe dans le royaume ou s'il n'en est qu'un cas parmi d'autres, le premier simplement à avoir un nom.",
				en: "It is while gathering these same accounts that the scout hears, for the first time, of a certain Edrin Fenn, of the hamlet of Ellerwick. A farmer, say the villagers nearby, dead on the day of the tremor, who has since been seen walking the roads near his farm with, behind him, three figures he still calls his wife and children. He even names them, to anyone who will listen, Maren, Joren and Liss. No one in Eorthal can say for certain whether he is the origin of what is happening in the kingdom, or merely one case among others, the first simply to have a name.",
			},
			{
				fr: "Ce retour ne provoque ni panique ni soulagement. Il remplace une peur sans visage par une peur qui commence, timidement, à en avoir un.",
				en: "This return provokes neither panic nor relief. It replaces a faceless fear with one that is, timidly, beginning to wear one.",
			},
		],
	},

	// --- Retour de Skeldara ---------------------------------------------------
	{
		kind: "content",
		title: { fr: "Le retour de Skeldara", en: "Skeldara's Return" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Le second éclaireur, Orvin Drach, rentre quelques jours plus tard, du côté des contreforts du nord où se tient toujours le front. Ce qu'il rapporte est d'une tout autre nature. Des créatures sont apparues sur les lignes skeldariennes, venues de nulle part que quiconque puisse désigner, et assez organisées pour qu'on ne les prenne pas, d'emblée, pour de simples bêtes égarées. Les soldats skeldariens qui les ont affrontées en parlent comme d'un ennemi à part entière, hostile, conscient. Le mot qui circule désormais sur le front, rapporté tel quel par l'éclaireur, est démon, et c'est ce mot qui s'impose dans ce registre à partir de ce jour.",
				en: "The second scout, Orvin Drach, returns a few days later, from the northern foothills where the front still stands. What he reports is of an altogether different nature. Creatures have appeared along the Skeldarian lines, come from nowhere anyone can point to, and organised enough that they are not mistaken, at first, for mere strayed beasts. The Skeldarian soldiers who have fought them speak of them as a foe in their own right, hostile, aware. The word now circulating along the front, reported exactly as the scout heard it, is demon, and it is this word that takes hold in this register from this day on.",
			},
			{
				fr: "Les officiers aldreniens restent prudents sur ce que cela change à la guerre elle-même. Rien, pour l'instant, n'indique que Skeldara envisage une trêve, même face à cette menace commune : les deux camps semblent se contenter de se battre sur deux fronts à la fois plutôt que d'en fermer un seul. Certains, à la cour, se demandent déjà combien de temps un royaume peut tenir ainsi.",
				en: "Aldrenian officers remain cautious about what this changes to the war itself. Nothing, for now, suggests that Skeldara is considering a truce, even in the face of this shared threat: both sides seem content to fight on two fronts at once rather than close either one. Some at court already wonder how long a kingdom can hold out this way.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			{
				fr: "L'éclaireur ne rapporte pas que cela. Avant même d'atteindre le front, son escorte a traversé à deux reprises des lieues de terrain que rien n'explique : une colline entière dont la pierre semblait avoir poussé comme une plante, un bosquet aux troncs tordus en formes trop régulières pour être naturelles. Dans l'un de ces endroits, l'escorte a croisé l'une de ces créatures nées de la secousse, mi-bête mi-pierre, qui a chargé sans un bruit avant d'être repoussée, deux chevaux n'en sont pas revenus. L'éclaireur n'a plus voulu s'arrêter avant d'avoir quitté ces terres.",
				en: "The scout brings back more than that. Even before reaching the front, his escort twice crossed leagues of ground nothing can explain: an entire hill whose stone seemed to have grown like a plant, a grove of trees twisted into shapes too regular to be natural. In one of these places, the escort crossed paths with one of those creatures born of the tremor, half beast, half stone, which charged without a sound before being driven off; two horses never came back from it. The scout refused to stop again until he had left those lands.",
			},
		],
	},

	// --- Silence de Dreamar ---------------------------------------------------
	{
		kind: "content",
		title: { fr: "Le silence de Dreamar", en: "Dreamar's Silence" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Ewen Thalm, l'éclaireur envoyé vers Dreamar, atteint la lisière des forêts en quelques jours, comme prévu. Il ne revient que bien plus tard que tous les autres, seul, les vêtements déchirés par des branches qu'il ne sait plus situer, incapable de dire avec certitude combien de jours il a réellement passés sous le couvert des arbres.",
				en: "Ewen Thalm, the scout sent toward Dreamar, reaches the forest's edge within a few days, as expected. He returns far later than all the others, alone, his clothes torn by branches he can no longer place, unable to say for certain how many days he truly spent beneath the cover of the trees.",
			},
			{
				fr: "Son récit n'entre pas proprement dans ce registre : des sentiers qui ne menaient nulle part deux fois de suite, des arbres aux formes qu'il ne reconnaît plus, des bruits qu'il n'attribue ni à une bête ni à un homme. Une nuit, dit-il, quelque chose l'a suivi entre les arbres sans jamais se montrer complètement, une silhouette trop grande, faite de bois et d'autre chose encore, qu'il n'a pas cherché à affronter.",
				en: "His account does not fit properly into this register: paths that never led anywhere the same way twice, trees shaped into forms he no longer recognises, sounds he attributes to neither beast nor man. One night, he says, something followed him among the trees without ever fully showing itself, a shape too tall, made of wood and something else besides, which he did not try to face.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		torn: "bottom",
		paragraphs: [
			{
				fr: "Il n'a rencontré aucun Dreamarien, n'a aperçu ni Nyrelle ni la moindre âme vivante. Nous nous résolvons à écrire, simplement, que la forêt semble avoir avalé plus de temps qu'elle n'a laissé de réponses.",
				en: "He met no Dreamarian, glimpsed neither Nyrelle nor a single living soul. We settle for writing, simply, that the forest seems to have swallowed more time than it left answers.",
			},
		],
	},

	// --- Thelmere ---------------------------------------------------------
	{
		kind: "content",
		title: {
			fr: "Ce que Thelmere n'a plus",
			en: "What Thelmere No Longer Has",
		},
		dropcap: true,
		torn: "top",
		paragraphs: [
			{
				fr: "Berec Morth, parti vers Thelmere, est l'un des derniers à rentrer, près d'un mois après son départ. Ce qu'il rapporte n'est pas une nouvelle de Thelmere : c'est l'absence de toute possibilité d'en avoir une. Arrivé au terme de la route maritime, là où le Pas-de-Mer joignait autrefois l'île au reste des terres thelmériennes, il n'a trouvé que la mer. Pas de ruines, pas de pierres éparses, pas la moindre pile engloutie que la marée aurait pu découvrir, rien, comme si le pont n'avait jamais existé.",
				en: "Berec Morth, sent toward Thelmere, is one of the last to return, nearly a month after setting out. What he reports is not news of Thelmere: it is the absence of any possibility of having news at all. Arriving at the end of the sea route, where the Sea-Step once joined the island to the rest of the Thelmerian lands, he found only the sea. No ruins, no scattered stones, not the slightest sunken pier the tide might have uncovered, nothing, as though the bridge had never existed.",
			},
			{
				fr: "Le Pas-de-Mer a disparu, et avec lui tout moyen d'atteindre Thelbridge : pas un navire à l'horizon, pas un pavillon thelmérien sur aucune des trois mers depuis ce jour. De Thelmere elle-même, aucune nouvelle n'est jamais parvenue à Caldrath, par aucune voie.",
				en: "The Sea-Step is gone, and with it any way of reaching Thelbridge: not a ship on the horizon, not a Thelmerian flag on any of the three seas since that day. Of Thelmere itself, no word has ever reached Caldrath, by any road.",
			},
		],
	},

	// --- Ostrane : l'eclaireur qui ne revient pas ----------------------
	{
		kind: "content",
		title: {
			fr: "L'éclaireur qui n'est pas revenu",
			en: "The Scout Who Never Came Back",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Reste Kerrow Vane, envoyé vers Ostrane. De tous, c'est lui qu'on attendait le plus tôt, la route du sud étant la plus courte, à peine plus longue que celle d'Eorthal, et la cour comptait son retour pour le dixième jour. Il n'est jamais rentré. Pas de corps, pas de cheval, pas un mot porté par un marchand de passage. Les dernières sentinelles à l'avoir vu l'ont regardé prendre la route du sud, et personne, depuis, n'a rien à ajouter.",
				en: "That leaves Kerrow Vane, sent toward Ostrane. Of them all, he was the one expected soonest, the southern road being the shortest, barely longer than the one to Eorthal, and the court counted on his return by the tenth day. He never came back. No body, no horse, not a word carried by a passing merchant. The last sentries to see him watched him take the southern road, and no one, since, has anything to add.",
			},
			{
				fr: "Aldrenia ne sait donc même pas ce qui l'a arrêté, une frontière gardée qui l'aurait refoulé, un refus, une mauvaise rencontre sur la route, ou rien de tout cela. D'Ostrane, aucune nouvelle n'est venue, pas même celle d'un homme renvoyé chez lui. Nous consignons ce blanc avec un embarras que nous peinons à cacher, car pour une fois il n'y avait rien à démêler, et c'est précisément ce qui inquiète. Un royaume qui se tait, on sait le lire. Un royaume d'où ne revient pas même le silence, non.",
				en: "Aldrenia does not even know what stopped him: a guarded border turning him away, a refusal, a bad encounter on the road, or none of these. From Ostrane, no word has come, not even that of a man sent home. We record this blank with an embarrassment we can hardly hide, for once there was nothing to untangle, and that is precisely what unsettles it. A kingdom that keeps silent can be read. A kingdom from which not even the silence returns cannot.",
			},
		],
	},

	// --- Un an plus tard ---------------------------------------------------
	{
		kind: "content",
		title: { fr: "Un an plus tard", en: "A Year Later" },
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Depuis ces premiers retours, les mois ont passé, et le monde que la cour d'Aldrenia observe aujourd'hui ne ressemble déjà plus à celui que les éclaireurs avaient décrit à leur arrivée. À Eorthal, ce qui n'était que des cas isolés ne l'est plus. Les morts-vivants s'y sont multipliés mois après mois, assez pour que les marchands aldreniens hésitent désormais à s'aventurer au-delà de certaines routes, et assez pour que le royaume tout entier porte maintenant un nom que personne n'emploierait à la légère : le Royaume des Morts.",
				en: "Since those first returns, months have passed, and the world the Aldrenian court observes today no longer resembles the one the scouts described on their arrival. In Eorthal, what was once a handful of isolated cases is no longer so. The undead have multiplied there month after month, enough that Aldrenian merchants now hesitate to venture beyond certain roads, and enough that the whole kingdom now carries a name no one would use lightly: the Kingdom of the Dead.",
			},
			{
				fr: "On raconte, de bouche en bouche plus que par rapport officiel, qu'Edrin Fenn n'est plus le simple fermier dont on parlait il y a un an. Qu'il a perdu, peu à peu, ce qui lui restait de raison. Qu'il considère toujours sa femme et ses enfants comme vivants, malgré ce qu'en voient tous ceux qui les croisent. Et que des pouvoirs proches de ce que les vieux textes de Caldrath appellent la nécromancie semblent s'éveiller en lui à mesure que le monde change. Rien de tout cela n'est vérifié de première main.",
				en: "It is said, mouth to mouth more than by official report, that Edrin Fenn is no longer the simple farmer spoken of a year ago. That he has, little by little, lost what reason remained to him. That he still considers his wife and children to be alive, whatever those who cross their path may see. And that powers close to what the old texts of Caldrath call necromancy seem to be awakening in him as the world changes. None of this is verified firsthand.",
			},
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			{
				fr: "Les Démons, de leur côté, n'ont pas disparu du front skeldarien. Des rapports, de plus en plus réguliers, font état de territoires entiers que ni Skeldara ni personne d'autre ne contrôle plus vraiment, où démons et créatures de la secousse semblent s'être installés plutôt que de repartir. La guerre entre Aldrenia et Skeldara, elle, s'est éteinte sans que personne ne l'ait jamais déclarée finie. Aucun envoyé, aucun traité, aucune parole échangée : les deux armées se sont simplement retirées chacune vers ses propres terres, parce qu'un autre ennemi leur en faisait l'obligation. Le front s'est vidé sans qu'aucun camp n'ait cédé, et nul à Caldrath ne saurait dire si cette guerre est terminée ou seulement reposée.",
				en: "The Demons, for their part, have not vanished from the Skeldarian front. Increasingly regular reports speak of whole territories that neither Skeldara nor anyone else truly controls anymore, where demons and creatures of the tremor seem to have settled rather than moved on. The war between Aldrenia and Skeldara, meanwhile, has gone out without anyone ever declaring it over. No envoy, no treaty, not a word exchanged: both armies simply withdrew, each to its own lands, because another enemy left them no choice. The front emptied without either side yielding, and no one in Caldrath could say whether this war is over or merely resting.",
			},
			{
				fr: "D'autres créatures, nées de la même secousse, continuent d'apparaître, sans qu'aucune règle ne permette d'en prévoir le lieu ni la forme, exactement comme au premier jour. Certaines ont été chassées ou tuées, d'autres se sont simplement fondues dans tel recoin de forêt ou telle ruine, et personne ne sait vraiment combien en demeure.",
				en: "Other creatures, born of the same tremor, continue to appear, with no rule allowing anyone to foresee their place or shape, exactly as on the first day. Some have been driven off or killed; others have simply melted into some corner of forest or ruin, and no one truly knows how many remain.",
			},
		],
	},

	// --- Granholt et la Pliure, un an apres -----------------------------
	{
		kind: "content",
		title: { fr: "Granholt tient encore", en: "Granholt Still Holds" },
		dropcap: true,
		paragraphs: [
			{
				fr: "D'Eorthal est venue, cette année-là, la seule nouvelle que la cour ait accueillie avec quelque chose qui ressemblait à du soulagement. Granholt tient. La comtesse Ysolde Varn y est retranchée derrière ses greniers et ses murs, vivante, et c'est de sa propre main qu'est écrite la lettre réclamant à Aldrenia l'alliance qu'elle avait négociée elle-même, des années plus tôt, contre une menace qui n'était alors que skeldarienne.",
				en: "From Eorthal came, that year, the one piece of news the court received with something resembling relief. Granholt holds. Countess Ysolde Varn is entrenched there behind her granaries and walls, alive, and it is in her own hand that the letter is written, calling on Aldrenia for the alliance she herself had negotiated, years before, against a threat that was then only Skeldarian.",
			},
			{
				fr: "Le Conseil du Roi en débat depuis. Les quelques cohortes qu'Aldrenia tenait aux frontières d'Eorthal n'ont jamais eu le nombre pour tenir autre chose qu'une route, et c'est bien pour cela que la lettre réclame les légions elles-mêmes. Rappelées du nord, elles sont disponibles pour la première fois depuis des années, et c'est précisément ce qui rend la décision lourde. Les envoyer, c'est engager l'armée d'Aldrenia dans un royaume que l'on nomme déjà le Royaume des Morts. Les garder, c'est laisser mourir seule la seule alliée que ce royaume ait jamais eue. Nous ne consignons pas ce qui a été décidé, pour la raison simple que rien ne l'a encore été.",
				en: "The King's Council has debated it since. The few cohorts Aldrenia held at Eorthal's borders never had the numbers to hold anything but a road, and that is precisely why the letter calls for the legions themselves. Recalled from the north, they are available for the first time in years, and that is precisely what makes the decision so heavy. To send them is to commit Aldrenia's army to a kingdom already called the Kingdom of the Dead. To keep them is to let the one ally this kingdom has ever had die alone. We do not record what was decided, for the simple reason that nothing has been, yet.",
			},
		],
	},
	{
		kind: "content",
		title: { fr: "La Pliure, un an après", en: "The Fold, a Year On" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Quant à la Pliure, elle est toujours là. Elle n'a ni grandi ni reculé d'un pouce depuis le premier jour, et c'est peut-être ce qui trouble le plus ceux qui vivent à ses abords. Tout, autour d'elle, a changé en un an. Elle seule est restée exactement ce qu'elle était.",
				en: "As for the Fold, it is still there. It has neither grown nor retreated an inch since the first day, and that may be what troubles those living near it most. Everything around it has changed in a year. It alone has remained exactly what it was.",
			},
			{
				fr: "Les légions en interdisent l'approche, sans grande conviction et sans grand succès. Rien de ce qui en est sorti n'a jamais pu être identifié avec certitude, et rien de ce qui y est entré n'en a rapporté de récit qu'on puisse écrire ici. On a cessé d'y compter ceux qui s'y rendent encore. Nous notons seulement, pour mémoire, que ce ne sont plus les mêmes qu'il y a un an, et qu'ils n'y vont plus par curiosité.",
				en: "The legions forbid approaching it, without much conviction and with even less success. Nothing that has come out of it has ever been identified with certainty, and nothing that has gone in has brought back an account anyone could write down here. People have stopped counting those who still go there. We note only, for the record, that they are no longer the same people as a year ago, and that they no longer go out of curiosity.",
			},
		],
	},

	// --- Un mot sans origine ---------------------------------------------------
	{
		kind: "content",
		title: { fr: "Un mot sans origine", en: "A Word Without Origin" },
		dropcap: true,
		paragraphs: [
			{
				fr: "À mesure que les récits des marchands, des réfugiés et des soldats se mêlent dans les tavernes et sur les routes, un mot commence à circuler pour nommer tout ce qui est arrivé ce jour-là, remplaçant peu à peu « la grande secousse ». Wyrdane.",
				en: 'As the accounts of merchants, refugees and soldiers mingle in taverns and on the roads, a word begins to circulate to name everything that happened that day, slowly replacing "the great tremor". Wyrdane.',
			},
			{
				fr: "Personne ne sait dire avec certitude qui l'a prononcé le premier, ni où, ni dans quelle langue il aurait été forgé. Certains jurent l'avoir entendu de la bouche d'un soldat mourant revenu du front skeldarien, d'autres, d'un marchand de passage qui prétendait le tenir d'un peuple dont il ne savait plus le nom, d'autres encore affirment, sans grande conviction, l'avoir toujours connu, comme s'il avait simplement attendu son heure pour être employé.",
				en: "No one can say with certainty who spoke it first, nor where, nor in what tongue it might have been forged. Some swear they heard it from the mouth of a dying soldier returned from the Skeldarian front; others, from a passing merchant who claimed to have it from a people whose name he no longer knew; others still claim, without much conviction, to have always known it, as though it had simply been waiting its turn to be used.",
			},
			{
				fr: "Mais à l'usage, aucun autre ne s'impose avec la même force, et le mot finit par se glisser jusque dans la bouche des conseillers du roi eux-mêmes, par commodité plus que par conviction. Ce que ce mot signifiait avant ce jour, s'il signifiait quoi que ce soit, reste entier à découvrir.",
				en: "But in use, no other word asserts itself with the same force, and it eventually slips into the mouths of the king's own counsellors, out of convenience more than conviction. What this word meant before that day, if it meant anything at all, remains entirely to be discovered.",
			},
		],
	},
	{
		kind: "content-italic",
		text: {
			fr: "Un an après la secousse, nous n'avons toujours refermé ce cahier sur aucune certitude. Nous continuons de le tenir, par habitude autant que par devoir, en nous demandant si ce qui s'est passé ce jour-là est réellement terminé, ou si le monde n'a fait, depuis, qu'apprendre à vivre avec son commencement.",
			en: "A year after the tremor, we have still closed this volume on no certainty at all. We go on keeping it, out of habit as much as duty, wondering whether what happened that day is truly over, or whether the world has, since then, only learned to live with its beginning.",
		},
	},
];

const VOLUME_III_PAGES: JournalPage[] = [
	{ kind: "cover" },

	{
		kind: "content",
		title: {
			fr: "Cahier troisième",
			en: "Third Volume",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Voici le troisième cahier de ce registre, ouvert deux ans après que le second a été refermé sans conclusion. Il couvre ces deux années, puis la seconde secousse et les mois qui l'ont suivie. La charge n'a pas bougé depuis le premier jour, et la raison de la tenir non plus : ce qui s'écrit ici s'écrit pour des mains que nous ne connaîtrons pas, au cas où ce royaume ne serait plus là pour le dire lui-même.",
				en: "This is the third volume of this register, opened two years after the second was closed without a conclusion. It covers those two years, then the second tremor and the months that followed it. The charge has not shifted since the first day, nor has the reason for keeping it: what is written here is written for hands we shall never know, in case this kingdom is no longer here to say it itself.",
			},
			{
				fr: "Une chose a changé, pourtant, et nous la notons sans y insister. Les deux premiers cahiers consignaient une catastrophe, puis ses suites. Celui-ci est le premier à être tenu par des gens qui attendent la suivante.",
				en: "One thing has changed, however, and we note it without dwelling on it. The first two volumes recorded a catastrophe, then its aftermath. This one is the first to be kept by people who are expecting the next.",
			},
		],
	},

	{
		kind: "divider",
		bookNo: { fr: "Entrée IV", en: "Entry IV" },
		bookTitle: {
			fr: "Les deux années d'après",
			en: "The Two Years After",
		},
		bookSub: {
			fr: "Ce qu'Aldrenia a appris en allant voir elle-même, et ce qu'il lui a fallu deux ans pour nommer.",
			en: "What Aldrenia learned by going to see for itself, and what took it two years to name.",
		},
	},

	{
		kind: "content",
		title: {
			fr: "La lettre restée sur la table",
			en: "The Letter Left on the Table",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Le dilemme de Granholt a tenu ce Conseil onze mois. Onze mois pendant lesquels la lettre de la comtesse Ysolde Varn, écrite de sa propre main et portée jusqu'à Caldrath par un messager qui ne savait pas s'il trouverait encore un royaume à l'arrivée, est restée sur la table sans réponse. On l'a lue à voix haute plus de fois qu'aucun autre document de ce règne. On ne lui a rien répondu.",
				en: "The Granholt dilemma held this Council for eleven months. Eleven months in which Countess Ysolde Varn's letter, written in her own hand and carried to Caldrath by a messenger who did not know whether he would still find a kingdom on arrival, lay on the table unanswered. It was read aloud more times than any other document of this reign. Nothing was written back.",
			},
			{
				fr: "Le général Dorric Marn a plaidé l'envoi, et son raisonnement n'a pas varié d'une séance à l'autre : des légions rappelées du nord ne servent à rien là où elles sont, une alliance qu'on n'honore pas une seule fois cesse d'être une alliance, et une menace qui avance ne s'arrête pas d'elle-même parce qu'on a décidé de ne pas aller la voir. Sereth Vael, Haute Voix d'Aldrene, a plaidé l'inverse avec une constance égale : on n'envoie pas l'armée d'un royaume dans un pays dont on ignore si les morts y sont encore comptables.",
				en: "General Dorric Marn argued for sending them, and his reasoning never varied from one session to the next: legions recalled from the north are of no use where they stand, an alliance honoured not even once stops being an alliance, and a threat that advances does not halt of itself because one has decided not to go and look at it. Sereth Vael, High Voice of Aldrene, argued the opposite with equal constancy: one does not send a kingdom's army into a country where it is unknown whether the dead are still countable.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Trois légions sur sept",
			en: "Three Legions of Seven",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Le roi Varic Rhen a tranché la onzième fois qu'on lui a posé la question. Les légions partent. Pas toutes : trois sur les sept rappelées du front skeldarien, ce qui est assez pour rouvrir une route et tenir une place, et pas assez pour reprendre un royaume. Le reste garde les frontières, parce que personne à ce Conseil n'est prêt à parier que le nord restera vide.",
				en: "King Varic Rhen ruled the eleventh time the question was put to him. The legions go. Not all of them: three of the seven recalled from the Skeldarian front, which is enough to reopen a road and hold a place, and not enough to retake a kingdom. The rest keep the borders, because no one on this Council is willing to wager that the north will stay empty.",
			},
			{
				fr: "Le commandement nominal de la campagne est confié au prince Ilyan Rhen. La cour a compris ce que cette nomination signifiait avant que personne ne l'énonce : Dorric Marn commande réellement, chacun le sait, et l'héritier apprend. Le Vieux Roi a soixante-dix-huit ans, se déplace de moins en moins, et quitte rarement les salles basses du palais depuis l'hiver. On ne le dit pas au Conseil. On le dit partout ailleurs.",
				en: "Nominal command of the campaign is given to Prince Ilyan Rhen. The court understood what that appointment meant before anyone said it aloud: Dorric Marn commands in fact, as everyone knows, and the heir is learning. The Old King is seventy-eight, moves about less and less, and has rarely left the palace's lower halls since winter. It is not said at Council. It is said everywhere else.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce que l'armée a trouvé à l'ouest",
			en: "What the Army Found in the West",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Les trois légions franchissent la frontière d'Eorthal au printemps de la deuxième année. C'est la première fois depuis la secousse qu'Aldrenia regarde ce royaume avec ses propres yeux et en nombre, au lieu de l'écouter par la bouche des marchands et des réfugiés. Et pour la première fois en deux ans, nous cessons d'écrire « on rapporte que » pour écrire « on a vu ».",
				en: "The three legions cross Eorthal's border in the spring of the second year. It is the first time since the tremor that Aldrenia looks at that kingdom with its own eyes and in numbers, instead of hearing it through the mouths of merchants and refugees. And for the first time in two years, we stop writing “it is reported that” and start writing “we have seen”.",
			},
			{
				fr: "Ce qu'on a vu ne corrige presque rien des rumeurs, et c'est précisément ce qui frappe les officiers : tout ce qu'on racontait était vrai, et insuffisant. Les plaines les plus riches de Mydaria sont encore là, les blés poussent encore, personne ne les coupe. Les hameaux sont debout, les portes ouvertes, les tables dressées dans certaines maisons. Ce ne sont pas des ruines. C'est un royaume entier qui a continué de fonctionner quelques jours de trop après que ses habitants ont cessé de l'habiter.",
				en: "What was seen corrects almost nothing of the rumours, and that is precisely what strikes the officers: everything that was told was true, and insufficient. The richest plains of Mydaria are still there, the wheat still grows, no one cuts it. The hamlets stand, the doors open, the tables laid in some houses. These are not ruins. It is a whole kingdom that went on working a few days too long after its inhabitants stopped living in it.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Un couloir, pas une reconquête",
			en: "A Corridor, Not a Reconquest",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Les morts-vivants ne constituent pas une armée, et les légions l'écrivent dans leurs rapports avec une insistance qui trahit leur gêne : il n'y a pas de ligne de bataille, pas de flanc, pas d'arrière, pas de camp. Il y a des morts, partout, qui marchent et qui ne fuient pas. Un officier de la Deuxième légion consigne la phrase que nous recopierons ensuite dans trois documents différents : on peut gagner chaque engagement et ne jamais avancer d'une lieue, parce que l'ennemi n'a pas besoin de tenir le terrain, il lui suffit d'y rester.",
				en: "The undead do not make up an army, and the legions write it in their reports with an insistence that betrays their discomfort: there is no line of battle, no flank, no rear, no camp. There are dead, everywhere, walking, and they do not flee. An officer of the Second legion records the sentence we will copy into three different documents afterwards: one can win every engagement and never advance a league, because the enemy has no need to hold the ground, it is enough for him to remain on it.",
			},
			{
				fr: "Granholt tient. C'est la seule nouvelle franchement bonne de ces deux années. La comtesse Ysolde Varn est vivante, a vieilli de dix ans en deux, et accueille les légions sans une parole de reproche pour les onze mois d'attente, ce que plusieurs officiers trouvent plus difficile à supporter qu'un reproche. Elle tient sa capitale, ses greniers et quatre places fortifiées autour d'elle ; le reste du royaume ne lui appartient plus, et elle est la première à l'écrire. Au terme de la deuxième année, la route entre Caldrath et Granholt est rouverte et gardée. Le Conseil appelle cela un succès. Dorric Marn, dans ses rapports, appelle cela un couloir.",
				en: "Granholt holds. It is the only frankly good news of these two years. Countess Ysolde Varn is alive, has aged ten years in two, and receives the legions without a word of reproach for the eleven months of waiting, which several officers find harder to bear than a reproach. She holds her capital, her granaries and four fortified places around her; the rest of the kingdom is no longer hers, and she is the first to write it. By the end of the second year, the road between Caldrath and Granholt is reopened and guarded. The Council calls that a success. Dorric Marn, in his reports, calls it a corridor.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Edrin Fenn, de première main",
			en: "Edrin Fenn, Firsthand",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "C'est pendant cette campagne qu'un détachement aldrenien voit Edrin Fenn. Nous tenons à ce que la chose soit consignée exactement comme elle s'est produite, parce que c'est la première information de première main qu'Aldrenia obtient sur lui en trois ans. Une patrouille de reconnaissance croise, sur une route de campagne, quatre silhouettes qui marchent. Un homme devant, trois derrière. L'homme parle, sans s'adresser à personne de visible, d'un ton ordinaire, comme on parle en marchant à côté des siens.",
				en: "It is during this campaign that an Aldrenian detachment sees Edrin Fenn. We insist that the thing be recorded exactly as it happened, because it is the first firsthand information Aldrenia has obtained about him in three years. A reconnaissance patrol crosses, on a country road, four figures walking. One man in front, three behind. The man is speaking, addressing no one visible, in an ordinary tone, the way one speaks while walking beside one's own.",
			},
			{
				fr: "Les soldats sont à portée de trait. Ils ne tirent pas, et aucun de ceux qui en sont revenus n'a jamais été capable d'expliquer clairement pourquoi. Il ne les attaque pas. Il ne les évite pas non plus. Il passe, continue de parler, et les soldats comprennent en l'entendant qu'il raconte sa journée à sa femme. Les descriptions concordent sur un point que nous relevons deux fois : son corps est visiblement détruit. Il ne se tient pas comme un homme valide, il ne tient pas comme un homme qui devrait tenir du tout. Et il marche, et il parle, et derrière lui trois silhouettes suivent sans jamais répondre.",
				en: "The soldiers are within bowshot. They do not shoot, and none of those who came back was ever able to explain clearly why. He does not attack them. He does not avoid them either. He passes, goes on speaking, and the soldiers understand as they listen that he is telling his day to his wife. The descriptions agree on one point we note twice: his body is visibly destroyed. He does not stand like a sound man; he does not hold together like a man who should hold together at all. And he walks, and he speaks, and behind him three figures follow without ever answering.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce que la cour en a fait",
			en: "What the Court Made of It",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Le détachement rentre et rapporte. Nous consignons, et retirons pour la première fois de ce registre la mention « rumeur non vérifiée » qui accompagnait ce nom depuis le retour du premier éclaireur. Nous n'y substituons rien d'autre. Nous n'avons rien d'autre.",
				en: "The detachment returns and reports. We record it, and for the first time remove from this register the note “unverified rumour” that had accompanied that name since the first scout's return. We substitute nothing for it. We have nothing else.",
			},
			{
				fr: "Ce que la cour en fait est révélateur de son embarras. Personne, au Conseil, ne sait quoi décider d'un ennemi qu'on a vu passer à vingt pas d'une patrouille sans qu'il lève la main. Sereth Vael y voit une raison supplémentaire de ne pas s'enfoncer plus loin dans Eorthal. Dorric Marn fait remarquer, sèchement, qu'un homme qui ne vous attaque pas n'est pas forcément un homme qui vous épargne : peut-être qu'il ne vous a tout simplement pas vus.",
				en: "What the court makes of it reveals its embarrassment. No one at Council knows what to decide about an enemy seen passing twenty paces from a patrol without raising a hand. Sereth Vael sees in it one more reason not to push deeper into Eorthal. Dorric Marn observes, drily, that a man who does not attack you is not necessarily a man who spares you: perhaps he simply did not see you.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Le mot qu'il a fallu deux ans pour choisir",
			en: "The Word That Took Two Years",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Pendant que l'armée tient son couloir à l'ouest, nous réglons une affaire qui traîne depuis le premier jour et qui n'a l'air de rien : les créatures nées de la secousse n'ont toujours pas de nom. Celles qu'on avait vues se relever dans les champs avec des membres de trop et des corps mal recousus, les témoins les appellent les fondus, les mélangés, les sans-forme, selon la province et selon ce qu'ils avaient eu sous les yeux. Les rapports militaires emploient les trois, parfois dans la même phrase.",
				en: "While the army holds its corridor in the west, we settle a matter that has dragged since the first day and looks like nothing: the creatures born of the tremor still have no name. Those seen rising in the fields with too many limbs and badly sewn bodies, witnesses call the melted, the mingled, the shapeless, according to the province and to what they had before their eyes. Military reports use all three, sometimes in the same sentence.",
			},
			{
				fr: "Trois d'entre nous passent plus d'un an à recoudre des rapports qui parlent de la même chose sans employer le même mot. Nous tranchons au cours de la deuxième année, pour la seule raison qui nous fait trancher quoi que ce soit : on ne peut pas tenir un registre avec trois mots pour une chose. Nous retenons Abomination, qui n'est pas le plus descriptif des trois mais le seul qu'aucune province ne revendique comme sien.",
				en: "Three of us spend more than a year stitching together reports that speak of the same thing without using the same word. We settle the matter during the second year, for the only reason that ever makes us settle anything: one cannot keep a register with three words for one thing. We retain Abomination, which is not the most descriptive of the three but the only one no province claims as its own.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce qui arrive en même temps",
			en: "What Happens at the Same Time",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Ce que nous consignons sous cette rubrique, en deux ans, ne dessine aucune règle. Les Abominations continuent d'apparaître sans qu'on sache où ni sous quelle forme, exactement comme au premier jour. Certaines ont été tuées, et les rapports de ces combats sont les seuls documents dont nous disposions vraiment. D'autres se sont installées, dans un bois, dans une carrière abandonnée, dans un village vidé, et n'en bougent plus.",
				en: "What we record under that heading, over two years, draws no rule at all. Abominations go on appearing without anyone knowing where or in what shape, exactly as on the first day. Some have been killed, and the reports of those fights are the only documents we truly have. Others have settled, in a wood, in an abandoned quarry, in an emptied village, and move no more.",
			},
			{
				fr: "Un fait, pourtant, revient assez souvent pour que nous finissions par le noter à part, sans oser en tirer de conclusion : il arrive que des Abominations qui n'ont aucun moyen de se voir agissent en même temps. Deux attaques à deux jours de marche l'une de l'autre, à la même heure. Un bois qui se vide la nuit où un autre se remplit. Les officiers qui l'ont remarqué le signalent prudemment, conscients de ce que cela aurait l'air de prétendre. Nous nous contentons de l'inscrire et de ne pas l'expliquer.",
				en: "One fact, however, recurs often enough that we end up noting it apart, without daring to draw a conclusion from it: Abominations with no means of seeing one another sometimes act at the same time. Two attacks two days' march apart, at the same hour. A wood that empties on the night another fills. The officers who noticed it report it cautiously, aware of what it would sound like to claim. We merely write it down and do not explain it.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Le nord qui ne redevient pas un front",
			en: "The North That Does Not Become a Front Again",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "De Skeldara, en deux ans, Aldrenia n'a reçu ni un envoyé, ni une lettre, ni une menace. La guerre n'a toujours pas été déclarée terminée, et personne à Caldrath n'ose employer le mot paix pour une chose dont aucun des deux camps n'a jamais rien signé. Le front est vide. Les frontières sont gardées des deux côtés par des garnisons qui s'observent sans se battre, ce qui, après des années de guerre ouverte, met les officiers aldreniens plus mal à l'aise que les combats.",
				en: "From Skeldara, in two years, Aldrenia has received neither an envoy, nor a letter, nor a threat. The war has still not been declared over, and no one in Caldrath dares use the word peace for a thing neither side has ever signed anything about. The front is empty. The borders are guarded on both sides by garrisons that watch each other without fighting, which, after years of open war, unsettles Aldrenian officers more than the fighting did.",
			},
			{
				fr: "Ce qui franchit la frontière, en revanche, ce sont des Skeldariens. Pas des soldats : des familles, des bergers, des villages entiers par morceaux, qui descendent des hautes terres et demandent à passer. Les premiers mois, les garnisons les refoulent, faute d'ordres. Puis le Conseil du Roi, après un débat que les comptes rendus décrivent comme particulièrement amer, autorise le passage au cas par cas, et dans les faits on cesse assez vite de compter.",
				en: "What does cross the border are Skeldarians. Not soldiers: families, shepherds, whole villages in pieces, coming down from the high lands and asking to pass. For the first months the garrisons turn them back, for want of orders. Then the King's Council, after a debate the minutes describe as particularly bitter, allows passage case by case, and in practice one soon stops counting.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce que racontent les réfugiés",
			en: "What the Refugees Tell",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Ce que ces réfugiés racontent est la seule source d'Aldrenia sur le nord, et c'est une source dont nous nous méfions, parce que des gens qui demandent asile ont des raisons de noircir ce qu'ils fuient. Ils décrivent des vallées entières qu'aucun Skeldarien ne traverse plus, où les Démons ne se contentent plus de passer mais se sont installés, ont bâti, et paraissent attendre quelque chose. Ils décrivent des villages qui payent un tribut à des Démons plutôt que de les combattre, ce qu'aucun Aldrenien ne croit tout à fait et qu'aucun ne parvient à écarter complètement.",
				en: "What these refugees tell is Aldrenia's only source on the north, and a source we distrust, because people asking for asylum have reasons to blacken what they flee. They describe whole valleys no Skeldarian crosses any more, where the Demons no longer merely pass through but have settled, have built, and appear to be waiting for something. They describe villages paying tribute to Demons rather than fighting them, which no Aldrenian quite believes and none manages to dismiss entirely.",
			},
			{
				fr: "Du roi Gorath Thorne, aucun réfugié ne sait rien dire de certain. Les uns le disent mort, les autres retranché à Dunmarr, les autres parti au nord avec ce qui lui restait de troupes. Que le royaume le plus militaire de Mydaria ne soit plus capable de dire publiquement où se trouve son roi est, pour ce Conseil, la nouvelle la plus lourde de ces deux années. Et personne, à Caldrath, ne trouve de réconfort dans la faiblesse d'un ennemi qui a cessé d'être le pire.",
				en: "Of King Gorath Thorne, no refugee can say anything certain. Some say he is dead, others entrenched at Dunmarr, others gone north with what troops he had left. That the most military kingdom in Mydaria can no longer say publicly where its king is, is for this Council the heaviest news of these two years. And no one in Caldrath finds comfort in the weakness of an enemy who has stopped being the worst one.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce qui n'a toujours rien dit",
			en: "What Has Still Said Nothing",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "De Dreamar, rien. Deux éclaireurs ont été envoyés vers les forêts au cours de ces deux ans. Le premier est revenu au bout de quatre jours sans avoir réussi à y entrer, décrivant une lisière qu'il n'a pas pu franchir sans perdre immédiatement sa route. Le second n'est pas revenu. De Thelmere, rien non plus : le pont est toujours absent, la route maritime toujours praticable jusqu'à l'endroit où il n'est plus, et aucune voile n'a été aperçue depuis l'autre rive en trois ans. Les marchands aldreniens ont cessé d'en parler, ce qui est une manière de l'enterrer.",
				en: "From Dreamar, nothing. Two scouts were sent toward the forests over these two years. The first came back after four days without managing to get in, describing an edge he could not cross without immediately losing his way. The second did not come back. From Thelmere, nothing either: the bridge is still absent, the sea route still passable as far as the place where it no longer is, and no sail has been sighted from the far shore in three years. Aldrenian merchants have stopped mentioning it, which is one way of burying it.",
			},
			{
				fr: "D'Ostrane, rien. Aldrenia n'a pas renvoyé d'éclaireur vers le sud. Le Conseil a été consulté deux fois sur ce point et a choisi deux fois de ne pas insister, pour une raison que les comptes rendus formulent sans détour : on n'a jamais su ce qui est arrivé au premier, et on n'a pas de raison de croire qu'un second apprendrait autre chose. Quant à la Pliure, elle n'a pas bougé. Trois ans, pas un pouce. Les légions en interdisent toujours l'approche, et les gens continuent d'y aller. Nous notons, avec une régularité presque administrative, qu'elle est la seule chose de ce monde qui n'ait rien changé depuis le premier jour.",
				en: "From Ostrane, nothing. Aldrenia has not sent another scout south. The Council was consulted twice on the point and twice chose not to insist, for a reason the minutes state bluntly: we never knew what became of the first, and we have no reason to believe a second would learn anything else. As for the Fold, it has not moved. Three years, not an inch. The legions still forbid approaching it, and people still go. We note, with an almost administrative regularity, that it is the only thing in this world that has changed nothing since the first day.",
			},
		],
	},

	{
		kind: "divider",
		bookNo: { fr: "Entrée V", en: "Entry V" },
		bookTitle: {
			fr: "La deuxième secousse",
			en: "The Second Tremor",
		},
		bookSub: {
			fr: "Ce que la terre a rendu, ce qu'elle a ouvert, et ceux qu'elle a déposés chez nous.",
			en: "What the earth gave back, what it opened, and those it set down among us.",
		},
	},

	{
		kind: "content",
		title: {
			fr: "La terre, de nouveau",
			en: "The Earth, Again",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Puis, au cours de la troisième année, la terre tremble à nouveau. Il n'y a pas davantage d'avertissement que la première fois. Pas de signe, pas de présage, aucune de ces visions dont Dreamar se faisait autrefois gloire et dont plus personne ne reçoit rien. Le ciel ne change pas de couleur. Les bêtes hurlent dans les étables. Les lampes s'éteignent toutes ensemble, et ceux qui étaient en vie trois ans plus tôt reconnaissent immédiatement ce qu'ils sont en train de vivre, ce qui est une épreuve que la première secousse ne leur avait pas infligée.",
				en: "Then, during the third year, the earth shakes again. There is no more warning than the first time. No sign, no omen, none of those visions Dreamar once boasted of and from which no one receives anything any more. The sky does not change colour. The beasts howl in their stalls. The lamps go out all together, and those who were alive three years earlier recognise at once what they are living through, which is an ordeal the first tremor had not inflicted on them.",
			},
			{
				fr: "Quelques minutes. Pas plus que la première fois. Ce qu'Aldrenia constate ensuite, elle le constate dans l'ordre où ses messagers l'apprennent, et nous le consignons dans cet ordre-là plutôt que dans celui qui aurait du sens.",
				en: "A few minutes. No more than the first time. What Aldrenia then establishes, it establishes in the order its messengers learn it, and we record it in that order rather than in the one that would make sense.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce que la terre a rendu",
			en: "What the Earth Gave Back",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "D'abord : la Pliure a bougé. Pour la première fois en trois ans. Elle ne s'est pas étendue, elle ne s'est pas refermée. Elle s'est déplacée, de quelques centaines de pas vers l'est, et là où elle se trouvait auparavant le sol est redevenu du sol aldrenien, nu, labourable, sans une pierre étrangère. Les deux cohortes qui en gardaient l'approche se sont retrouvées à l'intérieur de ce qu'elles gardaient. Quarante et un hommes manquent à l'appel. Les autres n'ont rien à raconter, sinon qu'ils ont cligné des yeux.",
				en: "First: the Fold has moved. For the first time in three years. It did not spread, it did not close. It shifted, by a few hundred paces eastward, and where it stood before, the ground has become Aldrenian ground again, bare, ploughable, without a single foreign stone. The two cohorts guarding its approach found themselves inside what they were guarding. Forty-one men are missing at the roll. The others have nothing to tell, except that they blinked.",
			},
			{
				fr: "Ensuite : d'autres lieux. Nous en dénombrons neuf pour le seul territoire d'Aldrenia dans les semaines qui suivent, et renonçons assez vite à compter ceux qu'on nous rapporte d'ailleurs. Des reliefs qui n'étaient pas là. Un bois dont les arbres sont tous de la même espèce et dont aucun botaniste de Caldrath ne connaît cette espèce. Une structure de pierre sèche, au nord-est, qui ne ressemble à rien et qui est manifestement habitée, sans que personne n'ait vu qui l'habite.",
				en: "Then: other places. We count nine for Aldrenia's territory alone in the weeks that follow, and soon give up counting those reported to us from elsewhere. Landforms that were not there. A wood whose trees are all of one species, and of which no botanist in Caldrath knows that species. A dry-stone structure, in the north-east, that resembles nothing and is plainly inhabited, without anyone having seen who inhabits it.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Dix-neuf jours sans nouvelles",
			en: "Nineteen Days Without News",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Ensuite : une crevasse, à trois jours de Caldrath, et il y a une ville au fond. C'est elle qui occupera le reste de ce cahier.",
				en: "Then: a crevasse, three days from Caldrath, and there is a town at the bottom. It is that town which will occupy the rest of this volume.",
			},
			{
				fr: "Et enfin, ce que la cour met plusieurs jours à réaliser et qui change tout le reste : trois légions d'Aldrenia, et l'héritier du trône, se trouvaient en Eorthal quand la terre a tremblé. La route du couloir n'a plus de nouvelles à donner pendant dix-neuf jours. Nous n'avons rien à inscrire pour ces dix-neuf jours, et l'ordre nous a été donné de laisser le feuillet vide plutôt que d'y porter des suppositions.",
				en: "And finally, what the court takes several days to realise and which changes everything else: three of Aldrenia's legions, and the heir to the throne, were in Eorthal when the earth shook. The corridor road has no news to give for nineteen days. We have nothing to enter for those nineteen days, and we were ordered to leave the leaf blank rather than fill it with suppositions.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "La Crevasse",
			en: "The Crevasse",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Elle s'est ouverte dans les terres hautes de l'est d'Aldrenia, à trois jours de Caldrath, en plein pays de pâture, là où personne n'avait jamais rien cherché parce qu'il n'y avait jamais rien eu. Elle court sur près de deux lieues et elle est profonde au point que les premiers bergers venus en regarder le fond n'ont pas vu de fond.",
				en: "It opened in the high lands of eastern Aldrenia, three days from Caldrath, in the middle of pasture country, where no one had ever looked for anything because there had never been anything. It runs for nearly two leagues and is deep enough that the first shepherds who came to look at its bottom saw no bottom.",
			},
			{
				fr: "Les parois sont ce que les érudits remarquent en premier, et ce détail aura son importance : ce sont des couches de sol bien dessinées, régulières, intactes, celles qu'on retrouve dans les carrières et que rien n'a remuées depuis bien plus longtemps que la mémoire des royaumes. La secousse n'a pas comblé ni retourné cette terre. Elle l'a ouverte en deux, proprement, comme on ouvre un livre.",
				en: "The walls are what the scholars notice first, and that detail will matter: they are well-drawn layers of soil, regular, intact, the kind found in quarries and that nothing has stirred for far longer than the memory of kingdoms. The tremor did not fill this earth in, nor turn it over. It opened it in two, cleanly, the way one opens a book.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Il y a une ville en bas",
			en: "There Is a Town Below",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Il faut onze jours pour organiser une descente, et ce que les hommes qui descendent rapportent change, en une seule journée, ce qu'Aldrenia croyait savoir de ce qui est arrivé à son monde. Les premiers rapports sont presque inutilisables, et nous les recopions quand même intégralement, parce que leur désordre est lui-même une information.",
				en: "It takes eleven days to organise a descent, and what the men who go down report changes, in a single day, what Aldrenia believed it knew about what has happened to its world. The first reports are almost unusable, and we copy them out in full all the same, because their disorder is itself a piece of information.",
			},
			{
				fr: "Il y a une ville, et elle n'est pas en ruine. Des rues. Des places. Des escaliers taillés dans la roche et des escaliers bâtis. Des façades, des seuils, des encadrements de porte. Des canalisations qui courent sous les dalles et qui, aux endroits où on les a sondées, portent encore de l'eau. Rien ne s'est effondré, ou plus exactement : ce qui s'est effondré a été relevé. Nous l'appelons la Cité Basse, parce qu'il faut bien l'appeler quelque chose et que nous n'avons rien d'autre à dire d'elle que l'endroit où elle se trouve.",
				en: "There is a town, and it is not in ruins. Streets. Squares. Stairs cut into the rock and stairs built. Façades, thresholds, door frames. Conduits running under the flagstones which, where they have been sounded, still carry water. Nothing has collapsed, or more exactly: what collapsed has been raised again. We call it the Low City, because it must be called something and we have nothing else to say of it than where it lies.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Les choses qui tiennent la ville",
			en: "The Things That Keep the Town",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Il y a des choses qui l'entretiennent, et elles bougent. Des silhouettes de pierre à peu près hautes comme un homme, debout, qui tournent la tête quand on passe devant. Une forme bien plus grande, affaissée contre une paroi, dont un seul bras se lève et se rabaisse sans fin, et qui n'a plus d'autre bras à lever. Une masse de métal sans visage et sans membres qui se déplace de quelques pouces par heure, dans une direction qu'elle ne change jamais. Un assemblage manifestement brisé, en morceaux séparés de plusieurs pas, et dont tous les morceaux bougent ensemble.",
				en: "There are things that keep it, and they move. Stone figures about as tall as a man, standing, which turn their heads when one walks past. A far larger shape, slumped against a wall, whose single arm rises and falls without end, and which has no other arm left to raise. A faceless, limbless mass of metal that travels a few inches an hour, in a direction it never changes. An assembly plainly broken, its pieces separated by several paces, and all of whose pieces move together.",
			},
			{
				fr: "Et il n'y a personne. C'est la troisième chose, et c'est celle qui empêche les descendus de dormir une fois remontés. Pas un habitant. Pas une dépouille. Pas un ossement, pas une sépulture, pas une pierre gravée d'un nom de mort. Une ville entière, debout, entretenue, et dont nul n'a jamais retrouvé le moindre occupant, vivant ou mort.",
				en: "And there is no one. That is the third thing, and the one that keeps those who went down from sleeping once they are back up. Not an inhabitant. Not a corpse. Not a bone, not a grave, not a stone carved with a dead name. A whole town, standing, maintained, and of which no one has ever found a single occupant, living or dead.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Celles qui travaillent",
			en: "The Ones That Work",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Elles ne sont pas toutes occupées de la même manière, et c'est une des rares choses qu'Aldrenia parvient à établir proprement en trois mois de descentes. Certaines ne font rien, ou rien qui se comprenne : elles restent immobiles des semaines puis avancent de trois pas, elles répètent un geste qui n'a plus d'objet depuis longtemps, elles réagissent au passage d'un homme ou à rien du tout.",
				en: "They are not all busy in the same way, and that is one of the few things Aldrenia manages to establish properly in three months of descents. Some do nothing, or nothing that can be understood: they stay motionless for weeks then advance three paces, they repeat a gesture that has had no object for a long time, they react to a man passing or to nothing at all.",
			},
			{
				fr: "D'autres travaillent. Elles rescellent les pierres qu'on a descellées, dégagent les conduits, balaient les dalles. Elles ne s'arrêtent pas quand on les regarde, ne protestent pas quand on défait leur ouvrage, et le refont derrière. Un sergent de l'escorte note qu'il a vu l'une d'elles remettre en place, trois jours de suite, la même pierre que son détachement déplaçait trois jours de suite pour voir ce qu'elle ferait. Le quatrième jour, c'est le détachement qui a renoncé.",
				en: "Others work. They reseal the stones one has unsealed, clear the conduits, sweep the flagstones. They do not stop when watched, do not protest when their work is undone, and do it again behind you. A sergeant of the escort notes that he saw one of them put back, three days running, the same stone his detachment shifted three days running to see what it would do. On the fourth day, it was the detachment that gave up.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce qui n'a pas de dedans",
			en: "What Has No Inside",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Toutes portent des runes. Gravées, incrustées, parfois en relief sous la pierre comme si elles avaient poussé dedans. Et les runes ne sont pas des ornements : elles s'éclairent et se ternissent, par moments, sans qu'on ait rien fait pour cela. Les deux premiers hommes à en toucher une sont remontés sans blessure et sans explication. Aucun érudit de Caldrath ne sait lire une seule de ces marques, et aucun ne veut l'écrire dans ces termes-là.",
				en: "All of them bear runes. Carved, inlaid, sometimes in relief beneath the stone as though they had grown into it. And the runes are not ornaments: they brighten and dim, at moments, without anything having been done to make them. The first two men to touch one came back up unhurt and unexplained. No scholar in Caldrath can read a single one of these marks, and none of them wishes to write it in those terms.",
			},
			{
				fr: "Ce qui tient les descendus éveillés, pourtant, ce n'est pas ce que ces choses font. C'est qu'il n'y a rien pour les faire fonctionner. Pas de mécanisme, pas de contrepoids, pas de servant, pas d'attelage, pas de feu. Rien qui ressemble à un dedans. On en ouvre une, à coups de masse, et il n'y a pas de dedans : c'est de la pierre jusqu'au bout, et les morceaux continuent de remuer sur le sol. Elles ne sont pas vivantes comme une bête est vivante. Elles ne sont pas mortes comme un mort-vivant l'est, puisqu'elles n'ont jamais vécu. Elles fonctionnent.",
				en: "What keeps those who went down awake, however, is not what these things do. It is that there is nothing to make them work. No mechanism, no counterweight, no attendant, no team, no fire. Nothing resembling an inside. One of them is opened, with mallets, and there is no inside: it is stone all the way through, and the pieces go on stirring on the ground. They are not alive as a beast is alive. They are not dead as an undead is, since they have never lived. They function.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Le mot et celui des gens",
			en: "The Word, and the People's Word",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Nous devons malgré tout les ranger quelque part. Nous empruntons, faute de mieux, le mot dont les érudits de Caldrath se servaient déjà sans y attacher d'importance pour désigner les choses anciennes qu'on sort de terre sans savoir à qui elles ont appartenu : un artefact. Le mot n'explique rien. Il range, et c'est tout ce qu'on lui demande.",
				en: "We must file them somewhere all the same. For want of better, we borrow the word the scholars of Caldrath already used without attaching importance to it, for ancient things pulled out of the ground without knowing whose they were: an artefact. The word explains nothing. It files, and that is all that is asked of it.",
			},
			{
				fr: "Dans le royaume, personne ne dit artefact. Ce qui circule, des tavernes de Caldrath aux garnisons de l'est, et ce qui finira par circuler bien plus loin que ce registre, c'est l'expression qu'un homme redescendu de la Crevasse a lâchée devant témoins sans chercher à faire une formule : les vestiges vivants.",
				en: "In the kingdom, no one says artefact. What circulates, from the taverns of Caldrath to the eastern garrisons, and what will end up circulating far further than this register, is the phrase a man come back up from the Crevasse let slip in front of witnesses without trying to coin anything: the living remnants.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Les temples",
			en: "The Temples",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Au cœur de la Cité Basse, il y a des temples. Le mot n'est pas une facilité de plume, et nous prenons la peine de justifier son emploi : ce sont des bâtiments plus hauts que les autres, au bout de voies qui ne mènent qu'à eux, avec des seuils marqués, de longues salles, des autels, et sur ces autels des choses déposées là par quelqu'un et que personne n'a reprises. On ne construit pas cela pour y habiter. Reste à savoir pour qui.",
				en: "At the heart of the Low City, there are temples. The word is not a convenience of our pen, and we take the trouble to justify using it: they are buildings taller than the others, at the end of ways that lead only to them, with marked thresholds, long halls, altars, and on those altars things laid down by someone and that no one has taken back. One does not build that to live in. It remains to be known for whom.",
			},
			{
				fr: "Et c'est là qu'Aldrenia se heurte à une question qu'elle ne s'était jamais posée. Les figures représentées dans ces temples, sculptées aux seuils et sur les parois, ne ressemblent à rien. Pas à Aldrene. Pas à Mydare. Pas aux divinités que les royaumes voisins honorent et dont les prêtres de Caldrath connaissent au moins les formes, quitte à les mépriser. À rien.",
				en: "And it is here that Aldrenia runs into a question it had never asked itself. The figures represented in these temples, carved at the thresholds and on the walls, resemble nothing. Not Aldrene. Not Mydare. Not the divinities the neighbouring kingdoms honour, whose shapes the priests of Caldrath know at least well enough to despise. Nothing.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ils priaient qui ?",
			en: "Praying to Whom?",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Les premiers prêtres descendus remontent sans se prononcer, ce qui, pour des prêtres, est en soi un événement. Sereth Vael interdit assez vite qu'on reproduise ces figures en dessin hors du registre officiel, mesure que la cour interprète comme elle veut.",
				en: "The first priests to go down come back up without pronouncing, which, for priests, is an event in itself. Sereth Vael soon forbids reproducing these figures in drawing outside the official register, a measure the court interprets as it pleases.",
			},
			{
				fr: "Et dans la capitale, la question qui court n'est pas celle des érudits. Elle est plus simple et personne ne l'écrit : si des gens priaient là-dessous, ils priaient qui ? Nous, nous ne tranchons rien. Nous consignons que des temples existent, qu'ils sont consacrés à des figures inconnues, et que nul ne sait qui les a bâtis.",
				en: "And in the capital, the question going round is not the scholars'. It is simpler, and no one writes it down: if people prayed down there, who were they praying to? We settle nothing. We record that temples exist, that they are consecrated to unknown figures, and that no one knows who built them.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Les gardiens",
			en: "The Guardians",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Car on n'entre pas dans les temples. C'est aux seuils que les artefacts cessent d'être indifférents, et c'est la seule chose qu'ils fassent qui ressemble à une intention. Il y en a devant chaque temple de la Cité Basse. Ils ne bougent pas. Ils laissent approcher. Ils laissent regarder, aussi longtemps qu'on veut, depuis l'extérieur du seuil. Ils laissent repartir.",
				en: "For one does not enter the temples. It is at the thresholds that the artefacts stop being indifferent, and it is the only thing they do that resembles an intention. There is one before each temple of the Low City. They do not move. They let you approach. They let you look, as long as you like, from outside the threshold. They let you leave.",
			},
			{
				fr: "Et ils arrêtent quiconque tente de passer. Pas par menace, pas par avertissement, pas par un geste qu'on puisse lire comme un refus : ils arrêtent, c'est tout, et ils ont la masse pour le faire. Le premier homme à avoir forcé le passage a été tenu contre le montant du seuil jusqu'à ce qu'on vienne le dégager, et il s'en est tiré avec une épaule brisée. Trois autres, ailleurs, dans les mois qui suivent, ne s'en sont pas tirés.",
				en: "And they stop whoever tries to pass. Not by threat, not by warning, not by any gesture that could be read as a refusal: they stop you, that is all, and they have the mass to do it. The first man to force the passage was held against the door jamb until he was freed, and got away with a broken shoulder. Three others, elsewhere, in the months that follow, did not get away.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "La seule décision claire",
			en: "The One Clear Decision",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Dorric Marn, consulté par écrit depuis l'Eorthal, fait remarquer que l'armée d'Aldrenia pourrait très probablement abattre un gardien si elle y mettait les moyens, et qu'il ne voit pas une seule bonne raison d'essayer avant de savoir ce qu'on garde, ni ce qui se passe quand ce n'est plus gardé. Le Conseil l'approuve, pour une fois sans débat.",
				en: "Dorric Marn, consulted in writing from Eorthal, observes that Aldrenia's army could very probably bring a guardian down if it put the means to it, and that he does not see one good reason to try before knowing what is being guarded, nor what happens once it no longer is. The Council approves, for once without debate.",
			},
			{
				fr: "L'interdiction est donc portée à ce cahier, et c'est la seule décision claire qu'Aldrenia prenne au sujet de la Crevasse cette année-là : on parcourt la Cité Basse, on ne franchit pas les seuils. Ce qu'il y a derrière, personne ne l'a vu.",
				en: "The ban is therefore entered in this volume, and it is the only clear decision Aldrenia takes concerning the Crevasse that year: one walks the Low City, one does not cross the thresholds. What lies behind them, no one has seen.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Les deux camps dans le même trou",
			en: "Both Camps in the Same Hole",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Une fois la rubrique ouverte, un désaccord s'installe parmi les érudits de la capitale, qui n'est toujours pas tranché quand nous refermons ce cahier. Pour les uns, tout cela était déjà là : des vestiges de la magie ancienne, ou de l'un de ces royaumes disparus dont les archives de Caldrath ne conservent plus que trois noms à demi effacés, Ith-Caldra, Oren-Thal et Vaskyr. Et c'est la Crevasse elle-même qui plaide pour eux : ses parois intactes disent qu'aucune main n'a touché cette terre depuis des siècles, et qu'une ville entière dormait dessous avant que quiconque n'ait eu de mot pour la nommer.",
				en: "Once the heading was opened, a disagreement settled in among the scholars of the capital, and it is still unsettled as we close this volume. For some, all of it was already there: remnants of the ancient magic, or of one of those vanished kingdoms of which the archives of Caldrath keep only three half-effaced names, Ith-Caldra, Oren-Thal and Vaskyr. And it is the Crevasse itself that pleads for them: its intact walls say that no hand has touched this earth for centuries, and that a whole town slept beneath it before anyone had a word to name it with.",
			},
			{
				fr: "Pour les autres, tout cela est arrivé avec les secousses. Et ceux-là ont leur preuve aussi : plusieurs des suites de runes relevées en bas ressemblent, d'assez près pour que trois d'entre nous s'en disputent, à des marques qu'on avait déjà copiées sur les pierres de la Pliure. Or la Pliure n'appartient manifestement pas à ce monde.",
				en: "For the others, all of it arrived with the tremors. And those have their proof too: several of the rune sequences recorded below resemble, closely enough for three of us to quarrel over it, marks already copied from the stones of the Fold. And the Fold plainly does not belong to this world.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ancienne où ?",
			en: "Ancient Where?",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Le pire est que la Cité Basse ne départage personne. Elle est bâtie, entretenue, ancienne, ce qui devrait suffire. Mais aucune de ses pierres ne ressemble aux pierres de Mydaria, aucune de ses figures ne ressemble à ce que ce monde a jamais vénéré, et son plan ne ressemble à aucune ville humaine connue. Une cité ancienne, donc. Ancienne où ?",
				en: "The worst of it is that the Low City settles nothing for anyone. It is built, maintained, ancient, which ought to be enough. But none of its stones resembles the stones of Mydaria, none of its figures resembles anything this world has ever venerated, and its plan resembles no known human town. An ancient city, then. Ancient where?",
			},
			{
				fr: "Il y a enfin un fait que les descendus signalent et que personne ne sait où ranger. Certains artefacts sont identiques. Pas semblables : identiques, jusqu'aux runes, jusqu'aux fêlures, à des centaines de pas les uns des autres dans la cité. Et une équipe rapporte avoir vu l'un d'eux lever le bras chaque fois que son jumeau le levait, puis cesser de le faire le jour où l'on a déplacé le jumeau. Nous les appelons des échos, parce qu'il faut bien les appeler quelque chose, et notons en marge que nous n'avons aucune idée de ce que ce mot est censé signifier.",
				en: "There is finally a fact those who went down report and that no one knows where to file. Some artefacts are identical. Not alike: identical, down to the runes, down to the cracks, hundreds of paces apart within the city. And one team reports having seen one of them raise its arm each time its twin raised his, then stop doing so the day the twin was moved. We call them echoes, because they must be called something, and note in the margin that we have no idea what the word is supposed to mean.",
			},
		],
	},

	{
		kind: "content-italic",
		text: {
			fr: "Nous ne savons pas si notre monde a été envahi, ou simplement réveillé.",
			en: "We do not know whether our world has been invaded, or merely woken.",
		},
	},

	{
		kind: "content",
		title: {
			fr: "Ceux qui avaient plus peur que nous",
			en: "Those More Afraid Than We Were",
		},
		dropcap: true,
		bookmark: true,
		paragraphs: [
			{
				fr: "Pendant que les premières équipes descendent dans la crevasse, les rapports de province commencent à signaler autre chose, et nous tenons cette partie bien plus mal, parce qu'elle ne ressemble à rien de ce que trois ans nous ont appris à consigner. On voit des gens. Pas des Démons. Pas des morts-vivants. Pas des Abominations. Des gens, et les premiers témoins insistent sur ce mot avant même de décrire quoi que ce soit d'autre : ils marchent sur les routes comme on marche sur une route, ils s'arrêtent pour boire, ils dorment près de leurs feux et éteignent leurs feux en partant.",
				en: "While the first teams go down into the crevasse, the provincial reports begin to signal something else, and we keep that part far worse, because it resembles nothing three years have taught us to record. People are being seen. Not Demons. Not undead. Not Abominations. People, and the first witnesses insist on the word before describing anything else at all: they walk the roads as one walks a road, they stop to drink, they sleep by their fires and put their fires out when they leave.",
			},
			{
				fr: "Ils ne sont pas d'ici. Les uns sont plus hauts qu'un Aldrenien, trop minces pour leur taille, et se déplacent dans les bois sans qu'on les entende venir. Les autres sont plus petits, larges d'épaules, et se tiennent près des roches et des hauteurs. Les premiers rapports les confondent, puis cessent de les confondre, et nous finissons par en tenir deux comptes séparés.",
				en: "They are not from here. Some are taller than an Aldrenian, too thin for their height, and move through the woods without being heard coming. The others are shorter, broad-shouldered, and keep to the rocks and the heights. The first reports confuse the two, then stop confusing them, and we end up keeping two separate counts.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Et ils ont peur",
			en: "And They Are Afraid",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "C'est l'observation qui revient dans tous les témoignages, du berger comme de l'officier, et c'est celle qui désarçonne le plus la cour : ces gens-là ont manifestement plus peur d'Aldrenia qu'Aldrenia n'a peur d'eux. Ils fuient à vue. Ils abandonnent leur feu, leurs affaires, parfois leur nourriture. Plusieurs ont été trouvés terrés dans des granges, des fossés, des carrières abandonnées, sans arme, sans rien, incapables de dire un mot qu'un Aldrenien comprenne.",
				en: "It is the observation that recurs in every testimony, the shepherd's as much as the officer's, and the one that most disconcerts the court: these people are plainly more afraid of Aldrenia than Aldrenia is of them. They flee on sight. They abandon their fire, their belongings, sometimes their food. Several have been found holed up in barns, ditches, abandoned quarries, without a weapon, without anything, unable to say a word an Aldrenian understands.",
			},
			{
				fr: "Parce qu'ils ne parlent pas l'Averan. Ils n'en comprennent pas un mot, et c'est réciproque. Trois ans de secousses n'avaient encore jamais confronté Aldrenia à ce problème-là : tout ce qui était arrivé jusque-là n'avait rien à dire.",
				en: "Because they do not speak the Averan. They do not understand a word of it, and it is mutual. Three years of tremors had never yet confronted Aldrenia with that problem: everything that had arrived until then had nothing to say.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Les incidents",
			en: "The Incidents",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Ils commencent très vite. Un groupe, surpris au matin dans une bergerie de l'est, blesse grièvement deux hommes venus voir qui dormait là. Un autre, encerclé dans une carrière par une milice de village qui croyait bien faire, en tue un. Ailleurs, un seul homme acculé dans une grange se bat contre six et en estropie trois avant qu'on ne le maîtrise.",
				en: "They begin very quickly. A group, surprised at morning in a sheepfold in the east, gravely wounds two men come to see who was sleeping there. Another, surrounded in a quarry by a village militia that meant well, kills one of them. Elsewhere, a single man cornered in a barn fights six and maims three before being subdued.",
			},
			{
				fr: "Les rapports militaires, à mesure qu'ils s'accumulent, finissent par dire tous la même chose, et les officiers qui les rédigent n'ont pas l'air à l'aise de l'écrire : dans presque tous les cas, ce sont les Aldreniens qui sont arrivés les premiers, et ceux d'en face se sont battus comme on se bat quand on est certain qu'on va mourir. La cour, elle, ne lit pas des rapports. Elle lit des morts aldreniens.",
				en: "The military reports, as they pile up, all end up saying the same thing, and the officers who write them do not seem comfortable writing it: in almost every case, it was the Aldrenians who arrived first, and those opposite fought the way one fights when certain of dying. The court, for its part, does not read reports. It reads Aldrenian dead.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce qu'on a enfermé",
			en: "What Was Locked Up",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Le Conseil du Roi ordonne l'arrestation et l'enfermement de tout individu de ces deux sortes impliqué dans un incident violent. L'ordre est exécuté sans difficulté particulière, parce que des gens qui se cachent dans des fossés ne résistent pas longtemps à une cohorte. Plusieurs dizaines sont conduits à Caldrath et dans les places de l'est, et placés en détention sans qu'aucun chef d'accusation ne puisse leur être lu dans une langue qu'ils entendent.",
				en: "The King's Council orders the arrest and confinement of any individual of these two sorts involved in a violent incident. The order is carried out without particular difficulty, because people hiding in ditches do not resist a cohort for long. Several dozen are taken to Caldrath and to the eastern strongholds, and held in detention without any charge being readable to them in a language they hear.",
			},
			{
				fr: "Sereth Vael soutient la mesure. Dorric Marn, qui n'est pas là pour voter puisqu'il tient un couloir en Eorthal, fait savoir par écrit qu'il la trouve prématurée, dans une lettre que nous conservons et dont une phrase circule bientôt dans toute la capitale : nous enfermons les premiers êtres venus de Wyrdane à qui nous aurions pu poser une question.",
				en: "Sereth Vael supports the measure. Dorric Marn, who is not there to vote since he is holding a corridor in Eorthal, lets it be known in writing that he finds it premature, in a letter we keep and one sentence of which soon circulates through the whole capital: we are locking up the first beings come out of Wyrdane whom we might have asked a question.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Deux mots qui finissent par passer",
			en: "Two Words That Finally Pass",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Et c'est en détention que tout bascule, lentement, par l'ennui. Les mois passent. Des geôliers, quelques-uns d'entre nous envoyés pour prendre des notes, un prêtre d'Aldrene venu par curiosité, et des prisonniers qui n'ont rien d'autre à faire : au bout de quelques mois, des mots commencent à passer. D'abord des choses à manger, des parties du corps, le nom du jour et celui de la nuit.",
				en: "And it is in detention that everything shifts, slowly, out of boredom. The months pass. Jailers, a few of us sent to take notes, a priest of Aldrene come out of curiosity, and prisoners with nothing else to do: after a few months, words begin to pass. First things to eat, parts of the body, the name of the day and that of the night.",
			},
			{
				fr: "Puis, d'un prisonnier des hauts et minces, qui s'avère avoir une patience que ses geôliers n'ont pas, les deux mots que ces peuples emploient pour se désigner eux-mêmes. Nous les écrivons en Averan comme nous les entendons, et c'est sous ces deux mots qu'ils entrent dans les archives d'Aldrenia : un Elfe, un Nain.",
				en: "Then, from one of the tall thin prisoners, who turns out to have a patience his jailers lack, the two words these peoples use for themselves. We write them in the Averan as we hear them, and it is under those two words that they enter the archives of Aldrenia: an Elf, a Dwarf.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce qu'on sait d'eux",
			en: "What Is Known of Them",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Ce qui est su d'eux, à la fin de cette troisième année, tient en très peu de lignes, et nous sommes les premiers à le souligner. Ils viennent d'ailleurs, ils le savent, et ils savaient déjà avant d'arriver que leur monde était le leur. Ils n'ont pas choisi de venir. Ils ne savent pas comment repartir.",
				en: "What is known of them, at the end of this third year, takes very few lines, and we are the first to point it out. They come from elsewhere, they know it, and they already knew before arriving that their world was theirs. They did not choose to come. They do not know how to leave.",
			},
			{
				fr: "Aucun des deux peuples n'était attendu par l'autre : ils ont été séparés les uns des autres aussi brutalement que du reste, et les premiers entretiens laissent entendre qu'ils se connaissaient déjà avant Mydaria, sans que personne à Caldrath ne parvienne à en tirer davantage.",
				en: "Neither of the two peoples was expected by the other: they were separated from one another as brutally as from everything else, and the first interviews suggest they already knew each other before Mydaria, without anyone in Caldrath managing to draw out more than that.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Le dessin du seuil",
			en: "The Drawing of the Threshold",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Un seul épisode est noté à part, dans un feuillet que nous refusons de classer sous une rubrique existante. L'un de nous, venu dans une cellule avec ses relevés de la Cité Basse pour occuper une séance, montre à un prisonnier elfe une copie des runes, puis le dessin d'un seuil de temple et de la figure sculptée au-dessus.",
				en: "A single episode is noted apart, on a leaf we refuse to file under any existing heading. One of us, come into a cell with his surveys of the Low City to fill a session, shows an elven prisoner a copy of the runes, then the drawing of a temple threshold and of the figure carved above it.",
			},
			{
				fr: "L'Elfe cesse de parler. Il regarde les runes sans réagir. C'est le dessin du seuil qu'il regarde un long moment. Puis il repousse la feuille et ne répond plus à aucune question ce jour-là, ni les jours suivants sur ce sujet précis. Il note ce qu'il a vu, l'heure, et une seule phrase de commentaire : il a reconnu quelque chose, et il a choisi de ne pas me le dire.",
				en: "The Elf stops speaking. He looks at the runes without reacting. It is the drawing of the threshold he looks at for a long moment. Then he pushes the sheet away and answers no further question that day, nor on the days after on that particular subject. He notes what he saw, the hour, and a single line of comment: he recognised something, and he chose not to tell me.",
			},
		],
	},

	{
		kind: "content",
		title: {
			fr: "Ce que nous ne savons pas encore",
			en: "What We Do Not Yet Know",
		},
		dropcap: true,
		paragraphs: [
			{
				fr: "Au moment où nous refermons ce cahier sur cette troisième année, voilà ce que la cour de Caldrath tient pour établi : Wyrdane fonctionne par vagues, il y en a eu deux, il peut donc y en avoir d'autres, et rien de ce qu'Aldrenia a appris en trois ans ne permet de prévoir la suivante. C'est peu, pour trois ans. C'est aussi, à notre propre avis, la première chose vraie que nous y ayons écrite sur Wyrdane lui-même, et non sur ses conséquences.",
				en: "As we close this volume upon this third year, here is what the court of Caldrath holds as established: Wyrdane works in waves, there have been two, there can therefore be others, and nothing Aldrenia has learned in three years allows the next to be foreseen. That is little, for three years. It is also, in our own opinion, the first true thing we have written in it about Wyrdane itself, rather than about its consequences.",
			},
			{
				fr: "Le reste est en suspens. Nous ne savons pas si les trois légions existent encore. Nous ne savons pas qui a bâti une ville sous les pâtures de l'est, ni où sont passés ceux qui y vivaient, ni pourquoi des choses de pierre continuent de la balayer pour eux. Nous ne savons pas lire une seule rune. Nous ne savons pas à qui sont consacrés des temples qu'on peut regarder et pas franchir. Nous ne savons pas où la Pliure s'arrêtera la prochaine fois. Nous ne savons pas ce qu'un Elfe a reconnu sur le dessin d'un seuil, ni pourquoi il s'est tu. Et nous ne savons pas si le Vieux Roi verra la quatrième année, phrase que personne à la cour n'ose écrire ailleurs que dans sa tête.",
				en: "The rest is suspended. We do not know whether the three legions still exist. We do not know who built a town beneath the eastern pastures, nor where those who lived in it went, nor why things of stone go on sweeping it for them. We cannot read a single rune. We do not know to whom temples one may look at and not cross are consecrated. We do not know where the Fold will stop next time. We do not know what an Elf recognised on the drawing of a threshold, nor why he fell silent. And we do not know whether the Old King will see the fourth year, a sentence no one at court dares write anywhere but in their own head.",
			},
		],
	},

	{
		kind: "content-italic",
		text: {
			fr: "Trois ans après la première secousse, Aldrenia a enfin compris la seule règle qui lui sera jamais utile, et c'est la pire de toutes : ce n'était pas une catastrophe. C'est un rythme.",
			en: "Three years after the first tremor, Aldrenia has finally understood the only rule that will ever be of use to it, and it is the worst of them all: it was not a catastrophe. It is a rhythm.",
		},
	},

	{
		kind: "sealed",
		bookNo: { fr: "À venir", en: "To Come" },
		bookTitle: {
			fr: "D'autres cahiers suivront",
			en: "More Volumes Will Follow",
		},
		bookSub: {
			fr: "Ce qui n'a pas encore été écrit.",
			en: "What has not yet been written down.",
		},
		waxList: ["?", "?", "?"],
		note: {
			fr: "Nous n'avons pas encore rédigé la suite de ce registre.",
			en: "We have not yet written the continuation of this register.",
		},
	},
	{
		kind: "colophon",
		title: { fr: "Colophon", en: "Colophon" },
		paragraphs: [
			{
				fr: "Ce registre s'enrichira à mesure qu'il y aura matière à y consigner, et pas avant. Referme-le, et reviens-y quand une main plus avisée que la nôtre y aura ajouté quelque chose qui mérite d'être lu.",
				en: "This register will grow only as there is matter to record in it, and not before. Close it, and return when a wiser hand than ours has added something worth reading.",
			},
		],
	},
];

// Un tome par epoque, et c'est la regle a tenir pour la suite : tout ce qui
// decrit le monde tel qu'il etait reste dans le tome I, chaque secousse ouvre
// un tome neuf qui court jusqu'a la suivante (donc la Deuxieme Vague et les
// annees qui la suivent iront dans un tome III, et ainsi de suite). Chaque
// tome commence par sa propre page kind:"cover" (react-pageflip est monte avec
// showCover et startPage 0, voir Lore.tsx) et renumerote ses folios depuis 1.
export const JOURNAL_BOOKS: JournalBook[] = [
	{
		id: "mydaria",
		label: {
			fr: "Journal d'Aldrenia I — Mydaria",
			en: "Journal of Aldrenia I — Mydaria",
		},
		shelfLeft: "59.55%",
		pages: VOLUME_I_PAGES,
	},
	{
		id: "premiere-vague",
		label: {
			fr: "Journal d'Aldrenia II — La grande secousse",
			en: "Journal of Aldrenia II — The Great Tremor",
		},
		shelfLeft: "60.6%",
		pages: VOLUME_II_PAGES,
	},
	{
		id: "deuxieme-vague",
		label: {
			fr: "Journal d'Aldrenia III — La Deuxième Vague",
			en: "Journal of Aldrenia III — The Second Wave",
		},
		shelfLeft: "62%",
		pages: VOLUME_III_PAGES,
	},
];
