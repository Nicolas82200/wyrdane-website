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
	// Position horizontale de la tranche sur l'etagere d'archives.jpg, en % de
	// l'image source (1344x768), passee en style inline a .lore-archive-book.
	// Les boites cliquables font 3.5% de large (Lore.css) : espacer les tomes
	// de 3.5% exactement les rend jointives sans jamais se recouvrir, sinon la
	// boite du suivant mangerait la tranche du precedent. L'etagere libre
	// documentee va de 61% a 71%, avec un livret deja peint vers 65% : au-dela
	// de deux tomes, prendre les rangees libres notees dans Lore.tsx plutot que
	// d'empiler ici au risque de tomber sur ce livret.
	shelfLeft: string;
	pages: JournalPage[];
};

const VOLUME_I_PAGES: JournalPage[] = [
	{ kind: "cover" },

	// --- Ex-libris : ce qu'est ce journal, pourquoi il existe, qui le tient ---
	{
		kind: "content",
		title: { fr: "Ex-libris", en: "Ex-libris" },
		dropcap: true,
		paragraphs: [
			{
				fr: "Ce registre a été ouvert au lendemain de la catastrophe, par les scribes de la Chancellerie, sur ordre du Conseil du Roi. Sa charge est simple à énoncer et incertaine à tenir, consigner le déroulement des événements, sans rien y ajouter qu'ils ne tiennent de première main, à mesure qu'ils se produisent, et pour aussi longtemps qu'il y aura quelque chose à y consigner.",
				en: "This register was opened the day after the catastrophe, by the scribes of the Chancellery, on the order of the King's Council. Its charge is simple to state and uncertain to keep: to record the unfolding of events, adding nothing they do not hold firsthand, as they occur, and for as long as there remains something to record.",
			},
			{
				fr: "Les scribes qui en tiennent la plume espèrent, en vérité, ne pas avoir grand-chose à y écrire. Un registre qui s'épaissit est rarement le signe d'un royaume qui se porte bien, et nul parmi eux ne souhaite voir celui-ci grossir d'année en année.",
				en: "The scribes who hold its pen hope, in truth, to have little to write in it. A register that thickens is rarely the sign of a kingdom in good health, and none among them wishes to see this one swell year after year.",
			},
			{
				fr: "Mais le vœu d'un scribe n'arrête ni une secousse ni ce qu'elle réveille, et ce premier volume s'ouvre déjà plus lourd qu'aucun n'aurait su le prédire la veille encore. Qu'il reste, pour l'heure, le témoin de ce que le royaume savait de lui-même avant que tout ne bascule.",
				en: "But a scribe's wish stops neither a tremor nor what it wakes, and this first volume opens already heavier than any of them could have foreseen the day before. Let it stand, for now, as witness to what the kingdom knew of itself before everything tipped over.",
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
				fr: "D'autres royaumes humains ont existé avant lui sur ces mêmes terres, dont il ne reste que des noms à moitié oubliés dans de vieux parchemins. Les archives de Caldrath en gardent trois, écrits d'une main si ancienne que les scribes ne s'accordent plus sur leur prononciation, Ith-Caldra, Oren-Thal et Vaskyr.",
				en: "Other human kingdoms existed before it on these same lands, of which only half-forgotten names remain in old parchments. The archives of Caldrath keep three such names, written in a hand so ancient that the scribes no longer agree on their pronunciation: Ith-Caldra, Oren-Thal, and Vaskyr.",
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
				fr: "Son fils, le prince Ilyan Rhen, est tenu pour un homme capable et mesuré, qui n'a toutefois jamais eu à décider seul de quoi que ce soit d'important. Le Conseil se partage entre ceux qui voient en lui la continuité du royaume et ceux qui redoutent qu'un règne neuf n'arrive au plus mauvais moment. Nul ne dit ces choses à voix haute tant que le roi est vivant. Ce registre note seulement qu'elles se disent.",
				en: "His son, Prince Ilyan Rhen, is held to be a capable and measured man, who has nonetheless never had to decide anything of import alone. The Council is split between those who see in him the kingdom's continuity and those who fear a new reign arriving at the worst possible time. No one says such things aloud while the king still lives. This register notes only that they are being said.",
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
			fr: "Ainsi se referme le premier de ces cahiers. Les scribes y ont consigné le monde tel qu'il tenait encore, pendant que le suivant, déjà commencé sur la même table, s'ouvrait sur le jour où il a cessé de tenir.",
			en: "Thus closes the first of these volumes. In it the scribes recorded the world as it still stood, while the next one, already begun on the same table, opened on the day it ceased to stand.",
		},
	},
];

const VOLUME_II_PAGES: JournalPage[] = [
	{ kind: "cover" },

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
				fr: "Le premier éclaireur à rentrer est Halder Crenn, celui qu'on avait envoyé vers Eorthal. Il revient les traits tirés, avec moins de certitudes qu'il n'en espérait, et un récit que les scribes mettent plusieurs jours à démêler des rumeurs qui l'accompagnent déjà.",
				en: "The first scout to return is Halder Crenn, the one sent toward Eorthal. He comes back drawn and weary, with fewer certainties than he had hoped for, and an account the scribes take several days to untangle from the rumours already surrounding it.",
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
				fr: "Il n'a rencontré aucun Dreamarien, n'a aperçu ni Nyrelle ni la moindre âme vivante. Les scribes se résolvent à écrire, simplement, que la forêt semble avoir avalé plus de temps qu'elle n'a laissé de réponses.",
				en: "He met no Dreamarian, glimpsed neither Nyrelle nor a single living soul. The scribes settle for writing, simply, that the forest seems to have swallowed more time than it left answers.",
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
				fr: "Aldrenia ne sait donc même pas ce qui l'a arrêté, une frontière gardée qui l'aurait refoulé, un refus, une mauvaise rencontre sur la route, ou rien de tout cela. D'Ostrane, aucune nouvelle n'est venue, pas même celle d'un homme renvoyé chez lui. Ce registre consigne ce blanc avec un embarras qu'il peine à cacher, car pour une fois il n'y avait rien à démêler, et c'est précisément ce qui inquiète. Un royaume qui se tait, on sait le lire. Un royaume d'où ne revient pas même le silence, non.",
				en: "Aldrenia does not even know what stopped him: a guarded border turning him away, a refusal, a bad encounter on the road, or none of these. From Ostrane, no word has come, not even that of a man sent home. This register records the blank with an embarrassment it can hardly hide, for once there was nothing to untangle, and that is precisely what unsettles it. A kingdom that keeps silent can be read. A kingdom from which not even the silence returns cannot.",
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
				fr: "Le Conseil du Roi en débat depuis. Les quelques cohortes qu'Aldrenia tenait aux frontières d'Eorthal n'ont jamais eu le nombre pour tenir autre chose qu'une route, et c'est bien pour cela que la lettre réclame les légions elles-mêmes. Rappelées du nord, elles sont disponibles pour la première fois depuis des années, et c'est précisément ce qui rend la décision lourde. Les envoyer, c'est engager l'armée d'Aldrenia dans un royaume que l'on nomme déjà le Royaume des Morts. Les garder, c'est laisser mourir seule la seule alliée que ce royaume ait jamais eue. Ce registre ne consigne pas ce qui a été décidé, pour la raison simple que rien ne l'a encore été.",
				en: "The King's Council has debated it since. The few cohorts Aldrenia held at Eorthal's borders never had the numbers to hold anything but a road, and that is precisely why the letter calls for the legions themselves. Recalled from the north, they are available for the first time in years, and that is precisely what makes the decision so heavy. To send them is to commit Aldrenia's army to a kingdom already called the Kingdom of the Dead. To keep them is to let the one ally this kingdom has ever had die alone. This register does not record what was decided, for the simple reason that nothing has been, yet.",
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
				fr: "Les légions en interdisent l'approche, sans grande conviction et sans grand succès. Rien de ce qui en est sorti n'a jamais pu être identifié avec certitude, et rien de ce qui y est entré n'en a rapporté de récit qu'on puisse écrire ici. On a cessé d'y compter ceux qui s'y rendent encore. Ce registre note seulement, pour mémoire, que ce ne sont plus les mêmes qu'il y a un an, et qu'ils n'y vont plus par curiosité.",
				en: "The legions forbid approaching it, without much conviction and with even less success. Nothing that has come out of it has ever been identified with certainty, and nothing that has gone in has brought back an account anyone could write down here. People have stopped counting those who still go there. This register notes only, for the record, that they are no longer the same people as a year ago, and that they no longer go out of curiosity.",
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
			fr: "Un an après la secousse, ce registre n'a toujours été refermé sur aucune certitude. On continue de le tenir, par habitude autant que par devoir, en se demandant si ce qui s'est passé ce jour-là est réellement terminé, ou si le monde n'a fait, depuis, qu'apprendre à vivre avec son commencement.",
			en: "A year after the tremor, this register has still been closed on no certainty at all. It continues to be kept, out of habit as much as duty, while wondering whether what happened that day is truly over, or whether the world has, since then, only learned to live with its beginning.",
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
			fr: "Les archivistes n'ont pas encore rédigé la suite de ce registre.",
			en: "The archivists have not yet written the continuation of this register.",
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
		shelfLeft: "58.5%",
		pages: VOLUME_I_PAGES,
	},
	{
		id: "premiere-vague",
		label: {
			fr: "Journal d'Aldrenia II — La grande secousse",
			en: "Journal of Aldrenia II — The Great Tremor",
		},
		shelfLeft: "62%",
		pages: VOLUME_II_PAGES,
	},
];
