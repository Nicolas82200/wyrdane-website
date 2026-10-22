// Contenu du "Journal d'Aldrenia". Voir lore/eras/*.md et
// lore/Wyrdane_LORE_complet.md côté card-game pour la source canonique :
// toute donnée factuelle ajoutée ici (souverains, capitales, puissance
// militaire/économique d'un royaume) doit y rester cohérente. Pas de nom de
// version ni de calendrier dans le texte (aucune mention d'époque codée) :
// le journal est écrit du point de vue d'Aldrenia, qui ne connaît aucun de
// ces repères.
//
// Pages groupées à 2 paragraphes (calibré à l'oeil + check-overflow.cjs,
// hors dépôt, contre le gabarit réel du livre une fois la taille corrigée) :
// pas de défilement interne (voir Lore.css), donc un groupe qui déborde se
// scinde, mais inutile de descendre à un paragraphe par page partout.

export type JournalPage =
	| { kind: "cover" }
	| { kind: "divider"; bookNo: string; bookTitle: string; bookSub: string }
	| {
			kind: "sealed";
			bookNo: string;
			bookTitle: string;
			bookSub: string;
			waxList: string[];
			note: string;
	  }
	| { kind: "colophon"; title: string; paragraphs: string[] }
	| {
			kind: "content";
			title?: string;
			dropcap?: boolean;
			// Marque dans la navigation laterale (voir BOOKMARKS, Lore.tsx) : un
			// "point important" (chapitre/royaume), jamais une sous-section d'un
			// chapitre deja marque (demande explicite, 2026-10 — garder la liste
			// courte : un marque-page par sujet, pas un par page).
			bookmark?: boolean;
			paragraphs: string[];
			// Coin déchiré en variante de texture (voir parchment2-*.webp) :
			// marquer DEUX pages consécutives (un recto et son verso, la même
			// feuille physique) avec la même valeur suffit, le CSS choisit tout
			// seul l'image br/bl (bottom) ou tr/tl (top) selon le côté
			// --left/--right que react-pageflip assigne à chacune.
			torn?: "bottom" | "top";
	  }
	| { kind: "content-italic"; text: string }
	| { kind: "map"; caption?: string };

export const JOURNAL_PAGES: JournalPage[] = [
	{ kind: "cover" },

	// --- Ex-libris : ce qu'est ce journal, pourquoi il existe, qui le tient ---
	{
		kind: "content",
		title: "Ex-libris",
		dropcap: true,

		paragraphs: [
			"Ce registre a été ouvert au lendemain de la catastrophe, par les scribes de la Chancellerie, sur ordre du Conseil du Roi. Sa charge est simple à énoncer et incertaine à tenir, consigner le déroulement des événements, sans rien y ajouter qu'ils ne tiennent de première main, à mesure qu'ils se produisent, et pour aussi longtemps qu'il y aura quelque chose à y consigner.",
			"Les scribes qui en tiennent la plume espèrent, en vérité, ne pas avoir grand-chose à y écrire. Un registre qui s'épaissit est rarement le signe d'un royaume qui se porte bien, et nul parmi eux ne souhaite voir celui-ci grossir d'année en année.",
			"Mais le vœu d'un scribe n'arrête ni une secousse ni ce qu'elle réveille, et ce premier volume s'ouvre déjà plus lourd qu'aucun n'aurait su le prédire la veille encore. Qu'il reste, pour l'heure, le témoin de ce que le royaume savait de lui-même avant que tout ne bascule.",
		],
	},

	{
		kind: "divider",
		bookNo: "Entrée I",
		bookTitle: "Le monde tel qu'il était",
		bookSub:
			"Ce que Aldrenia savait des 6 Royaumes, avant que la terre ne se mette à trembler.",
	},

	{
		kind: "map",
		caption: "Mydaria, telle qu'on la trouve reproduite dans les archives d'Aldrenia.",
	},

	{
		kind: "content",
		title: "Les mers sans retour",
		dropcap: true,
		paragraphs: [
			"Au-delà de ces trois mers, personne n'est jamais revenu. Les quelques expéditions tentées au fil des siècles par la flotte de Thelmere, la plus développée du monde connu, n'ont jamais rapporté la moindre terre nouvelle : certains navires ne sont simplement jamais revenus, d'autres sont rentrés au port des mois plus tard, l'équipage incapable de dire où il était passé, sinon qu'il n'avait jamais cessé de voir la tempête.",
			"On raconte, dans les tavernes comme dans les temples, que c'est Mydare elle-même qui retient ainsi les mers déchaînées au-delà des côtes connues, non par malveillance mais pour protéger les peuples de ce continent de ce qui se trouve plus loin. D'autres n'y voient que la nature la plus hostile des mers du large, sans intervention divine d'aucune sorte. Aucune des deux explications n'a jamais pu être vérifiée : ce qui s'étend par-delà ces eaux reste entièrement inexploré.",
		],
	},

	// --- La langue commune --------------------------------------------------
	{
		kind: "content",
		title: "L'Averan",
		dropcap: true,
		bookmark: true,
		paragraphs: [
			"Des siècles de caravanes, de traités et de mariages de raison ont fini par faire naître, entre les six royaumes, l'Averan, une langue de personne et de tout le monde à la fois, qu'on dit née sur les routes marchandes bien avant qu'aucun scribe n'ait songé à la coucher par écrit, et que plus personne ne sait attribuer à un seul royaume d'origine.",
			"Sans lui, un marchand d'Eorthal ne saurait pas négocier à Dunmarr, ni un diplomate aldrenien se faire comprendre sur les quais de Thelbridge. C'est la langue des comptoirs, des traités scellés à la hâte et des campements où se croisent des soldats de trois royaumes à la fois.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Mais l'Averan n'efface aucune des langues du foyer. L'aldrenien, l'eorthalien, le skeldarien, le dreamarien, le thelmérien et l'ostranais restent celles qu'on parle entre soi, au coin du feu, et qu'un étranger ne maîtrise jamais vraiment, même après des années passées à commercer sur place. Un marchand peut conclure une vente entière dans l'Averan sans jamais en apprendre davantage sur celui qu'il a en face de lui.",
			"C'est une langue de passage, pas une langue de confidence. Ce que chaque royaume pense réellement de ses voisins, il continue de le dire dans sa propre langue, et c'est précisément ce qu'Aldrenia ne peut jamais tout à fait entendre.",
		],
	},

	// --- Aldrenia : géographie, pouvoir, religion, armée, économie ---------
	{
		kind: "content",
		title: "Aldrenia",
		dropcap: true,
		bookmark: true,
		paragraphs: [
			"Aldrenia est le royaume ancien, celui dont les autres racontent qu'il était déjà vieux quand le leur n'était encore qu'un campement. Sa capitale, Caldrath, se dresse à l'est des forêts de Dreamar, les pieds tournés vers la Mer de l'Est, bâtie au croisement de routes commerciales.",

			"D'autres royaumes humains ont existé avant lui sur ces mêmes terres, dont il ne reste que des noms à moitié oubliés dans de vieux parchemins. Les archives de Caldrath en gardent trois, écrits d'une main si ancienne que les scribes ne s'accordent plus sur leur prononciation, Ith-Caldra, Oren-Thal et Vaskyr.",
			"Du premier, certains érudits soutiennent que Caldrath n'est qu'une corruption, du dernier, on ne sait même pas dans quelle langue il fut écrit. Aldrenia est le seul de cette lignée à avoir traversé les âges sans jamais s'éteindre, et c'est de cette endurance, plus que de toute conquête, qu'elle tire sa fierté.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		torn: "bottom",
		paragraphs: [
			"Ses terres ne sont pas les plus riches de Mydaria, loin derrière les plaines généreuses d'Eorthal, mais son sol porte des forêts de chêne séculaires, des mines de fer dans les collines de l'est et des vignes sur les coteaux qui descendent vers la mer. Caldrath elle-même s'étend en terrasses de pierre pâle, ses toits de tuile rousse serrés autour d'un palais royal qui domine le port depuis des générations.",
			"C'est une capitale qui sent la pierre chaude et le sel, où les cloches des temples d'Aldrene répondent aux cornes des navires marchands, et où l'on croise, sur les mêmes marchés, des armuriers skeldariens de passage et des négociants venus d'Eorthal pour vendre leur grain. Peu de villes de Mydaria mêlent autant de langues en un seul après-midi de marché.",
		],
	},
	{
		kind: "content",
		title: "La couronne et le culte",
		dropcap: true,
		paragraphs: [
			"Aldrenia est gouvernée par le roi Varic Rhen, qu'on surnomme déjà, à mi-voix et avec un respect prudent, le Vieux Roi. Il ne décide jamais seul. Un Conseil siège à ses côtés, composé de ses plus hauts généraux et des prêtres les plus influents d'Aldrene, et aucune décision de poids ne se prend sans que cette assemblée n'ait été consultée. Deux voix y pèsent plus que les autres, celle du général Dorric Marn et celle de Sereth Vael, Haute Voix d'Aldrene.",

			"La majorité des Aldreniens vénèrent Aldrene, qu'ils tiennent pour une déesse salvatrice et protectrice. Dans leur tradition, c'est Mydare, qui porte la responsabilité d'une grande part des souffrances du monde, maladie, guerre, famine, catastrophe.",

			"Personne ne sait avec certitude si les deux déesses sont sœurs, rivales, ou deux visages d'une même force plus ancienne qu'elles, toutes deux, pourtant, semblent liées à de véritables bénédictions dont la nature profonde échappe encore aux plus savants théologiens d'Aldrene.",
		],
	},

	{
		kind: "content",
		title: "La question de la suite",
		dropcap: true,
		paragraphs: [
			"Varic Rhen règne depuis assez longtemps pour que la plupart de ses sujets n'aient jamais connu d'autre roi, et c'est précisément ce qui inquiète. On l'appelle le Vieux Roi avec affection, mais on compte aussi, en silence, les années qu'il lui reste.",

			"Son fils, le prince Ilyan Rhen, est tenu pour un homme capable et mesuré, qui n'a toutefois jamais eu à décider seul de quoi que ce soit d'important. Le Conseil se partage entre ceux qui voient en lui la continuité du royaume et ceux qui redoutent qu'un règne neuf n'arrive au plus mauvais moment. Un scribe n'a pas à écrire davantage sur la succession d'un roi vivant, et celui qui tient cette plume s'en tiendra là.",
		],
	},
	{
		kind: "content",
		title: "Les légions",
		dropcap: true,
		paragraphs: [
			"La force d'Aldrenia ne tient ni au nombre ni à l'abondance de ses terres, mais à la discipline de ses légions et à l'ancienneté de leur doctrine. Des générations entières d'officiers ont affiné la même formation en coin, les mêmes manœuvres de rempart, jusqu'à en faire une armée que ses ennemis redoutent moins pour sa taille que pour sa constance.",

			"Aux dernières nouvelles parvenues à la cour, ces légions sont engagées dans une guerre de frontière avec Skeldara, un conflit qu'Aldrenia vit au jour le jour. Des soldats y meurent chaque saison, des avant-postes y changent de main, sans qu'aucun des deux royaumes ne paraisse en mesure de l'emporter tout à fait. C'est une guerre d'usure plus que de conquête, et elle façonne depuis des années l'humeur de toute la frontière septentrionale.",
		],
	},
	{
		kind: "content",
		title: "Le commerce et l'alliance",
		dropcap: true,
		paragraphs: [
			"La richesse d'Aldrenia vient moins de ce qu'elle produit que de ce qu'elle fait transiter. Sa position au carrefour des routes maritimes et terrestres en fait un passage obligé pour qui commerce entre le nord et l'ouest de Mydaria, et chaque convoi qui traverse ses terres y laisse des taxes qui remplissent lentement les coffres de la Couronne.",

			"Elle entretient surtout une alliance de longue date avec Eorthal. Des troupes aldreniennes protègent les plaines eorthaliennes contre les raids venus de Skeldara, en échange de conditions commerciales très favorables sur le grain qui nourrit une bonne part de sa propre population. Cette alliance ne fait pas d'Aldrenia la maîtresse d'Eorthal, qui demeure un royaume pleinement indépendant.",
		],
	},

	// --- Eorthal --------------------------------------------------------
	{
		kind: "content",
		title: "Eorthal",
		dropcap: true,
		bookmark: true,
		paragraphs: [
			"À l'ouest d'Aldrenia s'étend Eorthal, une mer de plaines fertiles qui court jusqu'à l'Océan Occidental sans qu'une seule colline n'en rompe l'horizon. Les voyageurs aldreniens qui s'y aventurent au printemps décrivent des champs de blé si vastes que le vent y dessine des vagues, et des fermes isolées qui semblent flotter, seules, au milieu de l'or des récoltes.",
			"Sa capitale, Granholt, s'élève au cœur de ces terres comme une île de pierre dans un océan de céréales, des greniers hauts comme des tours, des marchés aux grains qui débordent jusque dans les rues, et un fleuve navigable qui charrie, chaque automne, des barges trop chargées pour sembler sûres. Le comté est gouverné par la comtesse Ysolde Varn, qui a elle-même négocié, de sa propre voix, l'alliance avec Aldrenia destinée à protéger ses terres des appétits de Skeldara.",
		],
	},
	{
		kind: "content",
		title: "Une puissance sans armée",
		dropcap: true,
		paragraphs: [
			"Dépourvu d'une puissance militaire comparable à celle de ses deux puissants voisins, Eorthal ne lève que des milices de récolte, des paysans armés de faux et de piques capables de tenir un instant mais non une bataille. Aux dernières nouvelles, le gros de sa défense repose entièrement sur les légions aldreniennes postées à ses frontières, sans lesquelles le royaume aurait sans doute déjà cédé, au moins en partie, aux raids skeldariens.",

			"Ce déséquilibre n'échappe à personne à Eorthal, et il nourrit une méfiance ancienne envers l'idée même d'une armée permanente. Certains, à Granholt, murmurent qu'une terre trop occupée à nourrir le monde n'a jamais le temps d'apprendre à se défendre elle-même, et que c'est précisément ce que Skeldara attend depuis des générations.",
		],
	},
	{
		kind: "content",
		title: "Le grenier de Mydaria",
		dropcap: true,
		torn: "top",
		paragraphs: [
			"Ce que le royaume perd en force militaire, il le regagne cent fois en puissance économique. La fertilité de ses terres nourrit à elle seule une bonne part de Mydaria, et aucun royaume, pas même Aldrenia, ne pourrait aujourd'hui se passer longtemps de ses exportations de grain sans en ressentir la faim.",

			"Les Eorthaliens expliquent cette abondance par une bénédiction que Mydare leur aurait elle-même accordée, voilà si longtemps que plus personne, à Eorthal, ne songe à en douter. Que la cause en soit divine ou simplement le fruit d'une terre généreuse, le résultat est le même. C'est le blé d'Eorthal qui, plus que n'importe quelle légion, tient aujourd'hui l'équilibre entre les royaumes.",
		],
	},

	// --- Skeldara --------------------------------------------------------
	{
		kind: "content",
		title: "Skeldara",
		dropcap: true,
		bookmark: true,
		torn: "top",
		paragraphs: [
			"Au nord, au-delà des contreforts que les éclaireurs aldreniens n'osent franchir qu'en groupe, s'accrochent les pics et les cols de Skeldara. C'est une terre de pierre nue et de vent constant, où les villages se blottissent dans les failles des montagnes et où, dit-on, un enfant apprend à tenir une lame avant de savoir lire. Les soldats aldreniens qui en reviennent décrivent un pays sans tendresse apparente, mais dont chaque pierre semble taillée pour la guerre.",

			"Sa capitale, Dunmarr, est une forteresse autant qu'une ville, cernée de remparts de pierre grise encerclant des halls de pierre plus grise encore, construits à flanc de montagne de telle sorte qu'aucune armée ne pourrait l'approcher sans être vue des heures à l'avance. Elle est dirigée par le roi Gorath Thorne, dont la lignée règne sans partage depuis plusieurs générations, et que les officiers aldreniens qui l'ont affronté décrivent comme un chef aussi redouté par ses propres troupes que par ses ennemis.",
		],
	},
	{
		kind: "content",
		title: "Une culture de guerriers",
		dropcap: true,
		paragraphs: [
			"La société skeldarienne tout entière semble façonnée par la guerre. Les vétérans y occupent le rang le plus haut après la couronne, les raiders y sont des figures respectées plutôt que des hors-la-loi, et l'on y mesure, dit-on, la valeur d'un homme à la taille de son armure plus qu'à celle de ses terres. Le royaume est dévoué à Mydare et rejette avec un mépris ouvert le culte d'Aldrene, une hostilité nourrie par des générations de guerre frontalière avec Aldrenia.",

			"Ce qui se vit réellement derrière ces frontières, Aldrenia ne le connaît que par ce que ses soldats en rapportent du champ de bataille, et ce qu'ils en rapportent suffit à inspirer un respect prudent, une discipline de fer, une tolérance à la souffrance que les officiers aldreniens eux-mêmes jugent inhabituelle, et une capacité à se reformer après une défaite que bien peu de royaumes pourraient égaler.",
		],
	},
	{
		kind: "content",
		title: "Une terre pauvre, une guerre riche",
		dropcap: true,
		paragraphs: [
			"Les hautes terres skeldariennes n'offrent presque rien à cultiver. Quelques vallées abritées suffisent à peine à nourrir la population, et c'est dans les entrailles des montagnes, au fer et à l'argent qu'on en extrait, que le royaume trouve l'essentiel de sa richesse. Ses mines sont profondes, dit-on, au point que certains tunnels courent sous la montagne depuis plusieurs générations sans en avoir encore atteint le fond.",

			"Le reste de son économie, Skeldara le tire de la guerre elle-même, butin de raid, tribut arraché aux villages frontaliers d'Eorthal, armes et armures vendues à prix d'or à qui peut se le permettre. C'est une richesse de conquête plus que de récolte, et elle explique, mieux qu'aucun traité, pourquoi la paix avec ce royaume n'a jamais tout à fait tenu.",
		],
	},

	// --- Dreamar --------------------------------------------------------
	{
		kind: "content",
		title: "Dreamar",
		dropcap: true,
		bookmark: true,
		paragraphs: [
			"Entre Aldrenia et le reste du continent s'étendent les forêts profondes de Dreamar, un royaume que les voyageurs aldreniens décrivent moins qu'ils ne le devinent. La canopée y est si dense, disent-ils, que le jour y prend la couleur du crépuscule même à midi, et les sentiers qu'on y trace une saison ont souvent disparu sous la mousse à la suivante.",

			"Sa capitale, Nyrelle, se dissimule si bien parmi les arbres que les rares visiteurs aldreniens peinent à dire où elle commence vraiment. On raconte que ses toits sont tressés de branches vivantes, et que certains quartiers entiers changent de place au fil des saisons, selon une logique que nul étranger n'a jamais su suivre.",
		],
	},
	{
		kind: "content",
		title: "Un conseil sans visage",
		dropcap: true,
		paragraphs: [
			"Dreamar ne connaît pas de roi au sens où Aldrenia l'entend. Un conseil de visionnaires le dirige, mais ce conseil reste volontairement secret, sans nom connu hors de ses propres forêts. La Haute Augure Mirelle Senn en est le visage public, mais même cela, Aldrenia ne peut l'affirmer avec certitude. Nul ne sait si c'est bien elle qui décide, ou si elle n'est que la porte-parole d'une assemblée qui préfère rester dans l'ombre.",

			"Ces augures prétendent recevoir des visions d'événements à venir, un pouvoir que nul, même à Dreamar, ne sait expliquer avec certitude. Aucun Aldrenien n'a jamais assisté lui-même à l'une d'elles pour trancher entre don véritable et mise en scène savamment entretenue, et c'est peut-être précisément ainsi que Dreamar l'entend.",
		],
	},
	{
		kind: "content",
		title: "Une force qu'on ne voit jamais",
		dropcap: true,
		paragraphs: [
			"De la puissance militaire de Dreamar, Aldrenia sait étonnamment peu de choses, et ce peu suffit à décourager toute velléité d'invasion. Aucune armée n'a jamais pénétré bien loin dans ses forêts sans en ressortir désorientée, affaiblie, ou pas du tout. Les éclaireurs qui en reviennent parlent de chemins qui se referment derrière eux et de bruits qu'ils ne savent attribuer ni à une bête ni à un homme.",

			"Son économie reste tout aussi discrète, du bois qu'aucune hache ordinaire ne semble pouvoir fendre, des teintures dont la couleur ne pâlit jamais, et des services que la Haute Augure rend, dit-on, à qui peut s'offrir une audience. C'est une richesse qui se négocie à voix basse, loin des marchés publics où se comptent les fortunes des autres royaumes.",
		],
	},

	// --- Thelmere --------------------------------------------------------
	{
		kind: "content",
		title: "Thelmere",
		dropcap: true,
		bookmark: true,
		paragraphs: [
			"Seule puissance insulaire parmi les six royaumes, Thelmere se dresse au large, séparée du continent par un bras de mer que seuls ses propres navires franchissent avec assurance. On y accède par une route maritime balisée de phares, et l'on dit que nul capitaine étranger ne s'y aventure sans un pilote thelmérien à son bord, tant les courants y sont réputés traîtres.",

			"Sa capitale, Thelbridge, se dresse sur cette île comme une ville de mâts et de toits d'ardoise, reliée au continent par un pont si vaste qu'il est devenu, à lui seul, une merveille dont on parle jusqu'à Aldrenia. Les marins l'appellent le Pas-de-Mer, et aucun Thelmérien n'a jamais jugé utile de lui chercher un nom plus savant. Au-delà de ses ports, la vie intérieure de Thelmere reste mal connue des marchands aldreniens, trop occupés à compter leurs cargaisons pour s'y attarder.",
		],
	},
	{
		kind: "content",
		title: "La flotte avant tout",
		dropcap: true,
		paragraphs: [
			"Le royaume est gouverné par la Haute Amirale Corwin Dray, dont l'autorité repose autant sur le commandement de la flotte que sur un quelconque droit héréditaire. À Thelmere, on ne commande pas d'abord des terres mais des navires, et c'est là, plus que dans aucun palais, que se décide réellement qui dirige.",

			"Sa puissance militaire tient presque entièrement à cette flotte, la plus développée du monde connu aux dernières nouvelles parvenues à la cour d'Aldrenia. Aucun royaume ne peut aujourd'hui lui disputer les mers sans risquer d'y perdre jusqu'au dernier de ses navires. Son armée de terre, en revanche, reste modeste, car Thelmere n'a jamais eu besoin de défendre ses côtes autrement qu'en mer.",
		],
	},
	{
		kind: "content",
		title: "Le monopole des quais",
		dropcap: true,
		paragraphs: [
			"Cette même flotte assure à Thelmere un quasi-monopole sur le commerce des métaux, des tissus, du bois précieux et des denrées rares qui circulent entre les royaumes. Presque rien ne traverse les mers de Mydaria sans passer, d'une manière ou d'une autre, par un port thelmérien ou par un navire battant son pavillon.",

			"C'est une richesse qui se compte en cargaisons plus qu'en terres, et qui donne à ce petit royaume insulaire un poids économique sans commune mesure avec sa taille. Les marchands d'Aldrenia le savent bien. Négocier avec Thelmere, c'est toujours négocier en position de faiblesse, car le royaume peut, d'un mot, fermer ses ports à qui lui déplaît.",
		],
	},

	// --- Ostrane : ce qu'on ne sait pas -----------------------------------
	{
		kind: "content",
		title: "Ostrane",
		dropcap: true,
		bookmark: true,
		torn: "bottom",
		paragraphs: [
			"Repliée sur les terres méridionales du continent, Ostrane rompt avec tout ce schéma. Seul des six royaumes à s'être toujours tenu à l'écart du commerce, des guerres et des alliances des cinq autres, il n'a jamais laissé le temps construire sur lui le même savoir accumulé que sur ses voisins. Les voyageurs aldreniens qui s'y aventurent en reviennent avec des récits qui se contredisent presque tous, terres arides pour les uns, collines verdoyantes pour les autres.",

			"Même le nom de sa capitale, Farwatch, n'est connu que par ouï-dire, rapporté de bouche en bouche par des marchands qui n'y ont jamais mis les pieds eux-mêmes. Aucune carte dressée à Aldrenia ne s'accorde tout à fait avec une autre sur l'emplacement exact de ses frontières.",
		],
	},
	{
		kind: "content",
		title: "Une puissance qu'on ignore",
		dropcap: true,
		paragraphs: [
			"De la force militaire d'Ostrane, Aldrenia ne sait rigoureusement rien. Aucun soldat aldrenien ne s'y est jamais heurté, aucun espion n'en est revenu avec un chiffre crédible à rapporter. Certains, à la cour, supposent une armée réduite, faute d'ennemis déclarés, d'autres y voient au contraire la preuve d'une force qu'on préfère ne jamais montrer.",

			"Son poids économique reste tout aussi incertain. Nul marchand aldrenien ne tient de comptoir sur ses terres, nulle caravane n'en rapporte de marchandise qu'on puisse attribuer avec certitude à son origine. Ce que l'on sait seulement, c'est que ses dirigeants, quels qu'ils soient, semblent chercher avant tout la paix sur leur propre territoire. Aucun diplomate n'a jamais pu en rapporter de nom de souverain, de conseil ou de dynastie, et certains à Aldrenia doutent même qu'il existe un dirigeant unique.",
		],
	},

	{
		kind: "divider",
		bookNo: "Entrée II",
		bookTitle: "Le jour où tout changea",
		bookSub:
			"Ce que l'on sait, ce que l'on raconte, et ce que personne, pour l'instant, n'ose encore nommer.",
	},

	// --- Le cataclysme -----------------------------------------------------
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Sans aucun signe annonciateur, Mydaria tout entière est frappée par un cataclysme d'une ampleur inconnue jusque-là. Le ciel, pourtant, ne change pas de couleur. Aucun astre ne tombe, aucune trompette ne sonne. Ce sont la terre elle-même qui se met à trembler sous les pieds de tous à la fois, les bêtes qui se mettent à hurler sans raison dans les étables, et dans certaines maisons les lampes qui s'éteignent toutes ensemble sans qu'aucun souffle ne les ait touchées.",

			"Ce n'est qu'après coup, dans les heures et les jours qui suivent, une fois les premiers récits recoupés entre eux, que l'on comprend qu'il ne s'agit pas d'un simple tremblement de terre isolé, mais de quelque chose qui a frappé bien plus loin que les frontières d'Aldrenia, peut-être le monde tout entier.",
			"L'événement n'a pas de nom. Dans les jours qui suivent, personne ne sait comment le désigner autrement qu'en le décrivant à sa manière, par « la grande secousse », prononcé à voix basse, comme si lui donner un nom trop précis risquait de lui donner aussi une raison. ",
		],
	},

	// --- Aldrenia, ce jour-là -----------------------------------------------
	{
		kind: "content",
		title: "Aldrenia, ce jour-là",
		dropcap: true,
		paragraphs: [
			"À Aldrenia même, la terre tremble. Mais au-delà du tremblement, quelque chose de plus profond se produit. Sur plusieurs lieues de son propre territoire, le sol semble se plier sur lui-même, et à l'endroit où il se redresse, ce n'est plus tout à fait la même terre qui reprend sa place.",

			"Des pierres inconnues, des reliefs que nul Aldrenien n'a jamais vus, des bâtiments dont l'architecture n'appartient à aucun style connu se trouvent soudain là, comme si un fragment entier d'un autre monde venait simplement de se poser sur le sien.",

			"Les paysans qui découvrent ces lieux au petit matin en parlent avec une prudence presque religieuse, comme s'ils craignaient qu'approcher de trop près ne les y attache à leur tour. Certains plus curieux ou plus désespérés, s'y rendent déjà pour y chercher on ne sait quoi. Faute de mieux, on parle bientôt de la Pliure, du nom de ce que les premiers témoins ont cru voir, la terre se pliant sur elle-même.",
		],
	},

	// --- Les premiers témoignages --------------------------------------------
	{
		kind: "content",
		title: "Les premiers témoignages",
		dropcap: true,
		paragraphs: [
			"Dans les heures qui suivent la secousse, les récits affluent, d'abord timides, puis de plus en plus pressants. Un soldat posté sur les remparts orientaux jure avoir vu, au loin, un arbre se redresser avec un torse d'homme greffé à son tronc, ses branches se tordant comme des bras désarticulés, avant de s'immobiliser pour de bon.",

			"Un fermier affirme avoir trouvé dans son champ une masse de chair et de pierre qui respirait encore, lourdement, comme un animal pris au piège. Une marchande, revenue en larmes du marché aux bestiaux, raconte avoir vu deux de ses bêtes se confondre sous ses yeux en une seule créature, avant de s'enfuir en boitant vers la forêt la plus proche.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Aucun de ces récits ne ressemble tout à fait à un autre, et pourtant tous décrivent, sous des formes différentes, la même chose, des fusions impossibles de chair, d'os, d'écorce, de pierre ou de métal, nées de rien et de tout à la fois. Personne, à ce stade, ne sait leur donner un nom qui tienne au-delà d'une rue ou d'un village.",

			"Les prêtres n'y reconnaissent aucune création connue de Mydare ni d'Aldrene. Les érudits de la cour n'y trouvent ni logique, ni motif, ni la moindre règle qu'on puisse coucher sur le papier avec quelque assurance.",

			"Ce que l'on sait, en revanche, c'est la peur qu'elles inspirent. Ceux qui les croisent en reviennent rarement capables d'en parler calmement, certains n'en reviennent pas du tout, et leurs familles continuent de les attendre, debout sur le pas de leur porte, plus longtemps qu'il ne serait raisonnable d'espérer. Dans les tavernes et sur les marchés, chacun leur invente déjà un nom de fortune, sans qu'aucun ne s'impose encore sur les autres.",
		],
	},

	// --- Entre Aldrene et Mydare ---------------------------------------------
	{
		kind: "content",
		title: "Entre Aldrene et Mydare",
		dropcap: true,
		paragraphs: [
			"La cour et les temples d'Aldrenia s'emplissent aussitôt de questions auxquelles personne ne sait répondre. Pour certains prêtres d'Aldrene, c'est elle qui se manifeste, à sa manière, impossible à comprendre, peut-être pour avertir, peut-être pour protéger. D'autres y voient au contraire la main de Mydare, enfin déchaînée après des siècles de patience divine. Aucune des deux explications ne peut être vérifiée, et les deux camps se gardent, pour l'instant, de l'affirmer trop haut.",

			"Personne, à Aldrenia, ne sait si Eorthal, Skeldara, Dreamar, Thelmere et Ostrane subissent la même chose au même instant. Dans les tavernes comme dans les couloirs du palais, la même question circule, murmurée plus qu'elle n'est posée franchement. Est-ce fini, ou cela ne fait-il que commencer ?",
		],
	},

	// --- Les éclaireurs -------------------------------------------------------
	{
		kind: "content",
		title: "Les éclaireurs",
		dropcap: true,
		torn: "top",
		paragraphs: [
			"Face à ce silence et à ces questions sans réponse, le roi Varic Rhen ne peut se permettre d'attendre que les réponses viennent d'elles-mêmes. Dans les jours qui suivent, des éclaireurs sont choisis parmi les plus endurants et les plus discrets de ses armées, puis envoyés dans toutes les directions à la fois, vers chacun des royaumes voisins, avec pour seule instruction de voir, d'écouter, et de revenir.",

			"Le voyage est long. Il faut compter environ sept à huit jours pour atteindre les terres skeldariennes et autant pour en revenir, un peu moins vers Eorthal, et sans doute bien davantage vers les royaumes les plus reculés. Vers Ostrane, seule exception, la route elle-même est courte, à peine plus longue que celle d'Eorthal. En attendant, le peuple d'Aldrenia n'a d'autre choix que d'apprendre à vivre avec l'inconnu, un jour après l'autre.",
		],
	},

	{
		kind: "divider",
		bookNo: "Entrée III",
		bookTitle: "Ce que les éclaireurs ont rapporté",
		bookSub:
			"Le retour, royaume par royaume, et ce que le monde est devenu un an après la secousse.",
	},

	// --- Ostrane ---------------------------------------------------------
	{
		kind: "content",
		title: "Ce qu'Ostrane n'a pas laissé dire",
		dropcap: true,
		paragraphs: [
			"Le premier éclaireur à rentrer, de tous, n'est pas celui qu'on attendait en premier. C'est Kerrow Vane, envoyé vers Ostrane, et son retour, aussi rapide qu'inattendu, ne ressemble à aucun des récits qui suivront. La route elle-même n'a rien d'épuisant : quelques jours à peine, des chemins carrossables, un pays qui ressemble, de loin, à n'importe quel autre.",
			"Mais à la frontière, il trouve des sentinelles postées en silence, qui ne le laissent pas passer, ne répondent à aucune question, et le reconduisent sans un geste de violence ni le moindre mot d'explication jusqu'à ce qu'il ait rebroussé chemin de lui-même. Il n'a vu ni ville, ni village, ni le moindre Ostranais disposé à lui parler. Ce registre consigne ce retour avec un embarras qu'il peine à cacher : il n'y avait, pour une fois, presque rien à démêler. Juste un royaume qui a choisi, une fois de plus, de ne rien laisser savoir de lui.",
		],
	},

	// --- Retour d'Eorthal ---------------------------------------------------
	{
		kind: "content",
		title: "Le retour d'Eorthal",
		dropcap: true,
		paragraphs: [
			"Le premier éclaireur à rentrer est Halder Crenn, celui qu'on avait envoyé vers Eorthal. Il revient les traits tirés, avec moins de certitudes qu'il n'en espérait, et un récit que les scribes mettent plusieurs jours à démêler des rumeurs qui l'accompagnent déjà.",
			"Dans quelques hameaux isolés du comté, des morts ne sont pas restés morts. Pas une armée, pas une invasion, des cas épars, signalés ici et là par des paysans qui préfèrent encore ne pas en parler trop fort, de peur qu'en parler ne fasse revenir autre chose. Ceux qui en ont vu décrivent des proches enterrés depuis des jours, parfois des années, qui se relèvent sans un mot, le regard vide, sans reconnaître ni leur maison ni ceux qui les pleurent. Le mot que les habitants eux-mêmes emploient pour les désigner, un mort-vivant, voyage avec l'éclaireur jusqu'à Caldrath, et c'est sous ce nom, faute d'un meilleur, qu'il entre dans ce registre.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"C'est en recueillant ces mêmes récits que l'éclaireur entend parler, pour la première fois, d'un certain Edrin Fenn, du hameau d'Ellerwick. Un fermier, disent les villageois des environs, mort le jour de la secousse, et que l'on aurait vu depuis marcher les routes aux abords de sa ferme avec, derrière lui, trois silhouettes qu'il appelle encore sa femme et ses enfants. Il les nomme même, à qui veut l'entendre, Maren, Joren et Liss. Nul à Eorthal ne sait dire avec certitude s'il est à l'origine de ce qui se passe dans le comté ou s'il n'en est qu'un cas parmi d'autres, le premier simplement à avoir un nom.",
			"Ce retour ne provoque ni panique ni soulagement. Il remplace une peur sans visage par une peur qui commence, timidement, à en avoir un.",
		],
	},

	// --- Retour de Skeldara ---------------------------------------------------
	{
		kind: "content",
		title: "Le retour de Skeldara",
		dropcap: true,
		paragraphs: [
			"Le second éclaireur, Orvin Drach, rentre quelques jours plus tard, du côté des contreforts du nord où se tient toujours le front. Ce qu'il rapporte est d'une tout autre nature. Des créatures sont apparues sur les lignes skeldariennes, venues de nulle part que quiconque puisse désigner, et assez organisées pour qu'on ne les prenne pas, d'emblée, pour de simples bêtes égarées. Les soldats skeldariens qui les ont affrontées en parlent comme d'un ennemi à part entière, hostile, conscient. Le mot qui circule désormais sur le front, rapporté tel quel par l'éclaireur, est démon, et c'est ce mot qui s'impose dans ce registre à partir de ce jour.",
			"Les officiers aldreniens restent prudents sur ce que cela change à la guerre elle-même. Rien, pour l'instant, n'indique que Skeldara envisage une trêve, même face à cette menace commune : les deux camps semblent se contenter de se battre sur deux fronts à la fois plutôt que d'en fermer un seul. Certains, à la cour, se demandent déjà combien de temps un royaume peut tenir ainsi.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"L'éclaireur ne rapporte pas que cela. Avant même d'atteindre le front, son escorte a traversé à deux reprises des lieues de terrain que rien n'explique : une colline entière dont la pierre semblait avoir poussé comme une plante, un bosquet aux troncs tordus en formes trop régulières pour être naturelles. Dans l'un de ces endroits, l'escorte a croisé l'une de ces créatures nées de la secousse, mi-bête mi-pierre, qui a chargé sans un bruit avant d'être repoussée, deux chevaux n'en sont pas revenus. L'éclaireur n'a plus voulu s'arrêter avant d'avoir quitté ces terres.",
		],
	},

	// --- Silence de Dreamar ---------------------------------------------------
	{
		kind: "content",
		title: "Le silence de Dreamar",
		dropcap: true,
		paragraphs: [
			"Ewen Thalm, l'éclaireur envoyé vers Dreamar, atteint la lisière des forêts en quelques jours, comme prévu. Il ne revient que bien plus tard que tous les autres, seul, les vêtements déchirés par des branches qu'il ne sait plus situer, incapable de dire avec certitude combien de jours il a réellement passés sous le couvert des arbres.",
			"Son récit ne se laisse pas coucher proprement dans ce registre : des sentiers qui ne menaient nulle part deux fois de suite, des arbres aux formes qu'il ne reconnaît plus, des bruits qu'il n'attribue ni à une bête ni à un homme. Une nuit, dit-il, quelque chose l'a suivi entre les arbres sans jamais se montrer complètement, une silhouette trop grande, faite de bois et d'autre chose encore, qu'il n'a pas cherché à affronter.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		torn: "bottom",
		paragraphs: [
			"Il n'a rencontré aucun Dreamarien, n'a aperçu ni Nyrelle ni la moindre âme vivante. Les scribes se résolvent à écrire, simplement, que la forêt semble avoir avalé plus de temps qu'elle n'a laissé de réponses.",
		],
	},

	// --- Thelmere ---------------------------------------------------------
	{
		kind: "content",
		title: "Ce que Thelmere n'a plus",
		dropcap: true,
		torn: "top",
		paragraphs: [
			"Berec Morth, parti vers Thelmere, est l'un des derniers à rentrer, près d'un mois après son départ. Ce qu'il rapporte n'est pas une nouvelle de Thelmere : c'est l'absence de toute possibilité d'en avoir une. Arrivé à l'endroit où la route maritime menait autrefois au Pas-de-Mer, il n'a trouvé que la mer. Pas de ruines, pas de pierres éparses, pas la moindre pile engloutie que la marée aurait pu découvrir, rien, comme si le pont n'avait jamais existé.",
			"Le Pas-de-Mer a disparu. De Thelmere elle-même, depuis, aucune nouvelle n'est jamais parvenue à Caldrath, par aucune voie.",
		],
	},

	// --- Un an plus tard ---------------------------------------------------
	{
		kind: "content",
		title: "Un an plus tard",
		dropcap: true,
		paragraphs: [
			"Depuis ces premiers retours, les mois ont passé, et le monde que la cour d'Aldrenia observe aujourd'hui ne ressemble déjà plus à celui que les éclaireurs avaient décrit à leur arrivée. À Eorthal, ce qui n'était que des cas isolés ne l'est plus. Les morts-vivants s'y sont multipliés mois après mois, assez pour que les marchands aldreniens hésitent désormais à s'aventurer au-delà de certaines routes, et assez pour que le comté tout entier porte maintenant un nom que personne n'emploierait à la légère : le Royaume des Morts.",
			"On raconte, de bouche en bouche plus que par rapport officiel, qu'Edrin Fenn n'est plus le simple fermier dont on parlait il y a un an. Qu'il a perdu, peu à peu, ce qui lui restait de raison. Qu'il considère toujours sa femme et ses enfants comme vivants, malgré ce qu'en voient tous ceux qui les croisent. Et que des pouvoirs qu'aucun Aldrenien ne saurait nommer avec certitude semblent s'éveiller en lui à mesure que le monde change. Rien de tout cela n'est vérifié de première main.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Les Démons, de leur côté, n'ont pas disparu du front skeldarien. Des rapports, de plus en plus réguliers, font état de territoires entiers que ni Skeldara ni personne d'autre ne contrôle plus vraiment, où démons et créatures de la secousse semblent s'être installés plutôt que de repartir. La guerre entre Aldrenia et Skeldara, elle, s'est éteinte sans que personne ne l'ait jamais déclarée finie. Aucun envoyé, aucun traité, aucune parole échangée : les deux armées se sont simplement retirées chacune vers ses propres terres, parce qu'un autre ennemi leur en faisait l'obligation. Le front s'est vidé sans qu'aucun camp n'ait cédé, et nul à Caldrath ne saurait dire si cette guerre est terminée ou seulement reposée.",
			"D'autres créatures, nées de la même secousse, continuent d'apparaître, sans qu'aucune règle ne permette d'en prévoir le lieu ni la forme, exactement comme au premier jour. Certaines ont été chassées ou tuées, d'autres se sont simplement fondues dans tel recoin de forêt ou telle ruine, et personne ne sait vraiment combien en demeure.",
		],
	},

	// --- Granholt et la Pliure, un an apres -----------------------------
	{
		kind: "content",
		title: "Granholt tient encore",
		dropcap: true,
		paragraphs: [
			"D'Eorthal est venue, cette année-là, la seule nouvelle que la cour ait accueillie avec quelque chose qui ressemblait à du soulagement. Granholt tient. La comtesse Ysolde Varn y est retranchée derrière ses greniers et ses murs, vivante, et c'est de sa propre main qu'est écrite la lettre réclamant à Aldrenia l'alliance qu'elle avait négociée elle-même, des années plus tôt, contre une menace qui n'était alors que skeldarienne.",

			"Le Conseil du Roi en débat depuis. Les légions rappelées du nord sont disponibles pour la première fois depuis des années, et c'est précisément ce qui rend la décision lourde. Les envoyer, c'est engager l'armée d'Aldrenia dans un comté que l'on nomme déjà le Royaume des Morts. Les garder, c'est laisser mourir seule la seule alliée que ce royaume ait jamais eue. Ce registre ne consigne pas ce qui a été décidé, pour la raison simple que rien ne l'a encore été.",
		],
	},
	{
		kind: "content",
		title: "La Pliure, un an après",
		dropcap: true,
		paragraphs: [
			"Quant à la Pliure, elle est toujours là. Elle n'a ni grandi ni reculé d'un pouce depuis le premier jour, et c'est peut-être ce qui trouble le plus ceux qui vivent à ses abords. Tout, autour d'elle, a changé en un an. Elle seule est restée exactement ce qu'elle était.",

			"Les légions en interdisent l'approche, sans grande conviction et sans grand succès. Rien de ce qui en est sorti n'a jamais pu être identifié avec certitude, et rien de ce qui y est entré n'en a rapporté de récit qu'on puisse coucher ici. On a cessé d'y compter ceux qui s'y rendent encore. Ce registre note seulement, pour mémoire, que ce ne sont plus les mêmes qu'il y a un an, et qu'ils n'y vont plus par curiosité.",
		],
	},

	// --- Un mot sans origine ---------------------------------------------------
	{
		kind: "content",
		title: "Un mot sans origine",
		dropcap: true,
		paragraphs: [
			"À mesure que les récits des marchands, des réfugiés et des soldats se mêlent dans les tavernes et sur les routes, un mot commence à circuler pour nommer tout ce qui est arrivé ce jour-là, remplaçant peu à peu « la grande secousse ». Wyrdane.",
			"Personne, ne sait dire avec certitude qui l'a prononcé le premier, ni où, ni dans quelle langue il aurait été forgé. Certains jurent l'avoir entendu de la bouche d'un soldat mourant revenu du front skeldarien, d'autres, d'un marchand de passage qui prétendait le tenir d'un peuple dont il ne savait plus le nom, d'autres encore affirment, sans grande conviction, l'avoir toujours connu, comme s'il avait simplement attendu son heure pour être employé.",
			"Mais à l'usage, aucun autre ne s'impose avec la même force, et le mot finit par se glisser jusque dans la bouche des conseillers du roi eux-mêmes, par commodité plus que par conviction. Ce que ce mot signifiait avant ce jour, s'il signifiait quoi que ce soit, reste entier à découvrir.",
		],
	},
	{
		kind: "content-italic",
		text: "Un an après la secousse, ce registre n'a toujours été refermé sur aucune certitude. On continue de le tenir, par habitude autant que par devoir, en se demandant si ce qui s'est passé ce jour-là est réellement terminé, ou si le monde n'a fait, depuis, qu'apprendre à vivre avec son commencement.",
	},
	{
		kind: "sealed",
		bookNo: "À venir",
		bookTitle: "D'autres cahiers suivront",
		bookSub: "Ce qui n'a pas encore été couché par écrit.",
		waxList: ["?", "?", "?"],
		note: "Les archivistes n'ont pas encore rédigé la suite de ce registre.",
	},
	{
		kind: "colophon",
		title: "Colophon",
		paragraphs: [
			"Ce registre s'enrichira à mesure qu'il y aura matière à y consigner, et pas avant. Referme-le, et reviens-y quand une main plus avisée que la nôtre y aura ajouté quelque chose qui mérite d'être lu.",
		],
	},
];
