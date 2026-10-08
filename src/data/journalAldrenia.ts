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
	| { kind: "content"; title?: string; dropcap?: boolean; paragraphs: string[] }
	| { kind: "content-italic"; text: string };

export const JOURNAL_PAGES: JournalPage[] = [
	{ kind: "cover" },

	// --- Ex-libris : ce qu'est ce journal, pourquoi il existe, qui le tient ---
	{
		kind: "content",
		title: "Ex-libris",
		dropcap: true,
		paragraphs: [
			"Ce registre a été ouvert au lendemain de la catastrophe, par les scribes de la Chancellerie, sur ordre du Conseil du Roi. Il n'existait pas avant elle, et c'est elle seule qui en justifie l'existence. On n'ouvre pas un registre pour des jours ordinaires. Sa charge est simple à énoncer et incertaine à tenir, consigner le déroulement des événements, sans rien y ajouter qu'ils ne tiennent de première main, à mesure qu'ils se produisent, et pour aussi longtemps qu'il y aura quelque chose à y consigner.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Les scribes qui en tiennent la plume espèrent, en vérité, ne pas avoir grand-chose à y écrire. Un registre qui s'épaissit est rarement le signe d'un royaume qui se porte bien, et nul à la Chancellerie ne souhaite voir celui-ci grossir d'année en année.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
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

	// --- La langue commune --------------------------------------------------
	{
		kind: "content",
		title: "L'Averan",
		dropcap: true,
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
		paragraphs: [
			"Aldrenia est le royaume ancien, celui dont les autres racontent qu'il était déjà vieux quand le leur n'était encore qu'un campement. Sa capitale, Caldrath, se dresse à l'est des forêts de Dreamar, les pieds tournés vers la Mer de l'Est, bâtie au croisement de routes commerciales si anciennes que nul ne se souvient de les avoir tracées, et que certains jurent plus vieilles que la ville elle-même.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"D'autres royaumes humains ont existé avant lui sur ces mêmes terres, dont il ne reste que des noms à moitié oubliés dans de vieux parchemins et des fondations de pierre que les laboureurs déterrent encore parfois. Aldrenia est le seul de cette lignée à avoir traversé les âges sans jamais s'éteindre, et c'est de cette endurance, plus que de toute conquête, qu'elle tire sa fierté.",
		],
	},
	{
		kind: "content",
		dropcap: true,
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
			"Aldrenia est gouvernée par le roi Varic Rhen, qu'on surnomme déjà, à mi-voix et avec un respect prudent, le Vieux Roi. Il ne décide jamais seul. Un Conseil du Roi siège à ses côtés, composé de ses plus hauts généraux et des prêtres les plus influents d'Aldrene, et aucune décision de poids, guerre, traité ou famine, ne se prend sans que cette assemblée n'ait été consultée.",

			"La majorité des Aldreniens vénèrent Aldrene, qu'ils tiennent pour une déesse salvatrice et protectrice. Dans leur tradition, c'est Mydare, et non elle, qui porte la responsabilité d'une grande part des souffrances du monde, maladie, guerre, famine, catastrophe.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Personne à Aldrenia ne sait avec certitude si les deux déesses sont sœurs, rivales, ennemies, ou deux visages d'une même force plus ancienne qu'elles ; toutes deux, pourtant, semblent liées à de véritables bénédictions dont la nature profonde échappe encore aux plus savants théologiens d'Aldrene.",
		],
	},
	{
		kind: "content",
		title: "Les légions",
		dropcap: true,
		paragraphs: [
			"La force d'Aldrenia ne tient ni au nombre ni à l'abondance de ses terres, mais à la discipline de ses légions et à l'ancienneté de leur doctrine. Des générations entières d'officiers ont affiné la même formation en coin, les mêmes manœuvres de rempart, jusqu'à en faire une armée que ses ennemis redoutent moins pour sa taille que pour sa constance.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Aux dernières nouvelles parvenues à la cour, ces légions sont engagées dans une guerre de frontière avec Skeldara, un conflit qu'Aldrenia vit au jour le jour. Des soldats y meurent chaque saison, des avant-postes y changent de main, sans qu'aucun des deux royaumes ne paraisse en mesure de l'emporter tout à fait. C'est une guerre d'usure plus que de conquête, et elle façonne depuis des années l'humeur de toute la frontière orientale.",
		],
	},
	{
		kind: "content",
		title: "Le commerce et l'alliance",
		dropcap: true,
		paragraphs: [
			"La richesse d'Aldrenia vient moins de ce qu'elle produit que de ce qu'elle fait transiter. Sa position au carrefour des routes maritimes et terrestres en fait un passage obligé pour qui commerce entre le nord et l'ouest de Mydaria, et chaque convoi qui traverse ses terres y laisse des taxes qui remplissent lentement les coffres de la Couronne.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Elle entretient surtout une alliance de longue date avec Eorthal. Des troupes aldreniennes protègent les plaines eorthaliennes contre les raids venus de Skeldara, en échange de conditions commerciales très favorables sur le grain qui nourrit une bonne part de sa propre population. Cette alliance ne fait pas d'Aldrenia la maîtresse d'Eorthal, qui demeure un royaume pleinement indépendant.",
		],
	},

	// --- Eorthal --------------------------------------------------------
	{
		kind: "content",
		title: "Eorthal",
		dropcap: true,
		paragraphs: [
			"À l'ouest d'Aldrenia s'étend Eorthal, une mer de plaines fertiles qui court jusqu'à l'Océan Occidental sans qu'une seule colline n'en rompe l'horizon. Les voyageurs aldreniens qui s'y aventurent au printemps décrivent des champs de blé si vastes que le vent y dessine des vagues, et des fermes isolées qui semblent flotter, seules, au milieu de l'or des récoltes.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Sa capitale, Granholt, s'élève au cœur de ces terres comme une île de pierre dans un océan de céréales, des greniers hauts comme des tours, des marchés aux grains qui débordent jusque dans les rues, et un fleuve navigable qui charrie, chaque automne, des barges trop chargées pour sembler sûres. Le comté est gouverné par la comtesse Ysolde Varn, qui a elle-même négocié, de sa propre voix, l'alliance avec Aldrenia destinée à protéger ses terres des appétits de Skeldara.",
		],
	},
	{
		kind: "content",
		title: "Une puissance sans armée",
		dropcap: true,
		paragraphs: [
			"Dépourvu d'une puissance militaire comparable à celle de ses deux puissants voisins, Eorthal ne lève que des milices de récolte, des paysans armés de faux et de piques capables de tenir un instant mais non une bataille. Aux dernières nouvelles, le gros de sa défense repose entièrement sur les légions aldreniennes postées à ses frontières, sans lesquelles le royaume aurait sans doute déjà cédé, au moins en partie, aux raids skeldariens.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ce déséquilibre n'échappe à personne à Eorthal, et il nourrit une méfiance ancienne envers l'idée même d'une armée permanente. Certains, à Granholt, murmurent qu'une terre trop occupée à nourrir le monde n'a jamais le temps d'apprendre à se défendre elle-même, et que c'est précisément ce que Skeldara attend depuis des générations.",
		],
	},
	{
		kind: "content",
		title: "Le grenier de Mydaria",
		dropcap: true,
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
		paragraphs: [
			"Au nord, au-delà des contreforts que les éclaireurs aldreniens n'osent franchir qu'en groupe, s'accrochent les pics et les cols de Skeldara. C'est une terre de pierre nue et de vent constant, où les villages se blottissent dans les failles des montagnes et où, dit-on, un enfant apprend à tenir une lame avant de savoir lire. Les soldats aldreniens qui en reviennent décrivent un pays sans tendresse apparente, mais dont chaque pierre semble taillée pour la guerre.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Sa capitale, Dunmarr, est une forteresse autant qu'une ville, cernée de remparts de pierre grise encerclant des halls de pierre plus grise encore, construits à flanc de montagne de telle sorte qu'aucune armée ne pourrait l'approcher sans être vue des heures à l'avance. Elle est dirigée par le roi Gorath Thorne, dont la lignée règne sans partage depuis plusieurs générations, et que les officiers aldreniens qui l'ont affronté décrivent comme un chef aussi redouté par ses propres troupes que par ses ennemis.",
		],
	},
	{
		kind: "content",
		title: "Une culture de guerriers",
		dropcap: true,
		paragraphs: [
			"La société skeldarienne tout entière semble façonnée par la guerre. Les vétérans y occupent le rang le plus haut après la couronne, les raiders y sont des figures respectées plutôt que des hors-la-loi, et l'on y mesure, dit-on, la valeur d'un homme à la taille de son armure plus qu'à celle de ses terres. Le royaume est dévoué à Mydare et rejette avec un mépris ouvert le culte d'Aldrene, une hostilité nourrie par des générations de guerre frontalière avec Aldrenia.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ce qui se vit réellement derrière ces frontières, Aldrenia ne le connaît que par ce que ses soldats en rapportent du champ de bataille, et ce qu'ils en rapportent suffit à inspirer un respect prudent, une discipline de fer, une tolérance à la souffrance que les officiers aldreniens eux-mêmes jugent inhabituelle, et une capacité à se reformer après une défaite que bien peu de royaumes pourraient égaler.",
		],
	},
	{
		kind: "content",
		title: "Une terre pauvre, une guerre riche",
		dropcap: true,
		paragraphs: [
			"Les hautes terres skeldariennes n'offrent presque rien à cultiver. Quelques vallées abritées suffisent à peine à nourrir la population, et c'est dans les entrailles des montagnes, au fer et à l'argent qu'on en extrait, que le royaume trouve l'essentiel de sa richesse. Ses mines sont profondes, dit-on, au point que certains tunnels courent sous la montagne depuis plusieurs générations sans en avoir encore atteint le fond.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Le reste de son économie, Skeldara le tire de la guerre elle-même, butin de raid, tribut arraché aux villages frontaliers d'Eorthal, armes et armures vendues à prix d'or à qui peut se le permettre. C'est une richesse de conquête plus que de récolte, et elle explique, mieux qu'aucun traité, pourquoi la paix avec ce royaume n'a jamais tout à fait tenu.",
		],
	},

	// --- Dreamar --------------------------------------------------------
	{
		kind: "content",
		title: "Dreamar",
		dropcap: true,
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
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ces augures prétendent recevoir des visions d'événements à venir, un pouvoir que nul, même à Dreamar, ne sait expliquer avec certitude. Aucun Aldrenien n'a jamais assisté lui-même à l'une d'elles pour trancher entre don véritable et mise en scène savamment entretenue, et c'est peut-être précisément ainsi que Dreamar l'entend.",
		],
	},
	{
		kind: "content",
		title: "Une force qu'on ne voit jamais",
		dropcap: true,
		paragraphs: [
			"De la puissance militaire de Dreamar, Aldrenia sait étonnamment peu de choses, et ce peu suffit à décourager toute velléité d'invasion. Aucune armée n'a jamais pénétré bien loin dans ses forêts sans en ressortir désorientée, affaiblie, ou pas du tout. Les éclaireurs qui en reviennent parlent de chemins qui se referment derrière eux et de bruits qu'ils ne savent attribuer ni à une bête ni à un homme.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Son économie reste tout aussi discrète, du bois qu'aucune hache ordinaire ne semble pouvoir fendre, des teintures dont la couleur ne pâlit jamais, et des services que la Haute Augure rend, dit-on, à qui peut s'offrir une audience. C'est une richesse qui se négocie à voix basse, loin des marchés publics où se comptent les fortunes des autres royaumes.",
		],
	},

	// --- Thelmere --------------------------------------------------------
	{
		kind: "content",
		title: "Thelmere",
		dropcap: true,
		paragraphs: [
			"Seule puissance insulaire parmi les six royaumes, Thelmere se dresse au large, séparée du continent par un bras de mer que seuls ses propres navires franchissent avec assurance. On y accède par une route maritime balisée de phares, et l'on dit que nul capitaine étranger ne s'y aventure sans un pilote thelmérien à son bord, tant les courants y sont réputés traîtres.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Sa capitale, Thelbridge, se dresse sur cette île comme une ville de mâts et de toits d'ardoise, reliée au continent par un pont si vaste qu'il est devenu, à lui seul, une merveille dont on parle jusqu'à Aldrenia. Au-delà de ses ports, la vie intérieure de Thelmere reste mal connue des marchands aldreniens, trop occupés à compter leurs cargaisons pour s'y attarder.",
		],
	},
	{
		kind: "content",
		title: "La flotte avant tout",
		dropcap: true,
		paragraphs: [
			"Le royaume est gouverné par la Haute Amirale Corwin Dray, dont l'autorité repose autant sur le commandement de la flotte que sur un quelconque droit héréditaire. À Thelmere, on ne commande pas d'abord des terres mais des navires, et c'est là, plus que dans aucun palais, que se décide réellement qui dirige.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Sa puissance militaire tient presque entièrement à cette flotte, la plus développée du monde connu aux dernières nouvelles parvenues à la cour d'Aldrenia. Aucun royaume ne peut aujourd'hui lui disputer les mers sans risquer d'y perdre jusqu'au dernier de ses navires. Son armée de terre, en revanche, reste modeste, car Thelmere n'a jamais eu besoin de défendre ses côtes autrement qu'en mer.",
		],
	},
	{
		kind: "content",
		title: "Le monopole des quais",
		dropcap: true,
		paragraphs: [
			"Cette même flotte assure à Thelmere un quasi-monopole sur le commerce des métaux, des tissus, du bois précieux et des denrées rares qui circulent entre les royaumes. Presque rien ne traverse les mers de Mydaria sans passer, d'une manière ou d'une autre, par un port thelmérien ou par un navire battant son pavillon.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"C'est une richesse qui se compte en cargaisons plus qu'en terres, et qui donne à ce petit royaume insulaire un poids économique sans commune mesure avec sa taille. Les marchands d'Aldrenia le savent bien. Négocier avec Thelmere, c'est toujours négocier en position de faiblesse, car le royaume peut, d'un mot, fermer ses ports à qui lui déplaît.",
		],
	},

	// --- Ostrane : ce qu'on ne sait pas -----------------------------------
	{
		kind: "content",
		title: "Ostrane",
		dropcap: true,
		paragraphs: [
			"Repliée sur les terres méridionales du continent, Ostrane rompt avec tout ce schéma. Seul des six royaumes à s'être toujours tenu à l'écart du commerce, des guerres et des alliances des cinq autres, il n'a jamais laissé le temps construire sur lui le même savoir accumulé que sur ses voisins. Les voyageurs aldreniens qui s'y aventurent en reviennent avec des récits qui se contredisent presque tous, terres arides pour les uns, collines verdoyantes pour les autres.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Même le nom de sa capitale, Farwatch, n'est connu que par ouï-dire, rapporté de bouche en bouche par des marchands qui n'y ont jamais mis les pieds eux-mêmes. Aucune carte dressée à Aldrenia ne s'accorde tout à fait avec une autre sur l'emplacement exact de ses frontières.",
		],
	},
	{
		kind: "content",
		title: "Une puissance qu'on ignore",
		dropcap: true,
		paragraphs: [
			"De la force militaire d'Ostrane, Aldrenia ne sait rigoureusement rien. Aucun soldat aldrenien ne s'y est jamais heurté, aucun espion n'en est revenu avec un chiffre crédible à rapporter. Certains, à la cour, supposent une armée réduite, faute d'ennemis déclarés ; d'autres y voient au contraire la preuve d'une force qu'on préfère ne jamais montrer.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
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
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ce n'est qu'après coup, dans les heures et les jours qui suivent, une fois les premiers récits recoupés entre eux, que l'on comprend qu'il ne s'agit pas d'un simple tremblement de terre isolé, mais de quelque chose qui a frappé bien plus loin que les frontières d'Aldrenia, peut-être le monde tout entier.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"L'événement n'a pas de nom. Dans les jours qui suivent, personne ne sait comment le désigner autrement qu'en le décrivant à sa manière, par « le jour où tout a changé », « la grande secousse », ou simplement « cela », prononcé à voix basse, comme si lui donner un nom trop précis risquait de lui donner aussi une raison. Les scribes de la Chancellerie eux-mêmes hésitent encore sur la formule à coucher dans ce registre. Qu'on pardonne, pour cette fois, l'absence d'un mot juste. Il n'en existe tout simplement pas encore.",
		],
	},

	// --- Aldrenia, ce jour-là -----------------------------------------------
	{
		kind: "content",
		title: "Aldrenia, ce jour-là",
		dropcap: true,
		paragraphs: [
			"À Aldrenia même, la terre tremble comme partout ailleurs. Mais au-delà du tremblement, quelque chose de plus profond se produit. Sur plusieurs lieues de son propre territoire, le sol semble se plier sur lui-même, et à l'endroit où il se redresse, ce n'est plus tout à fait la même terre qui reprend sa place.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Des pierres inconnues, des reliefs que nul Aldrenien n'a jamais vus, des bâtiments dont l'architecture n'appartient à aucun style connu se trouvent soudain là, comme si un fragment entier d'un autre monde venait simplement de se poser sur le sien, sans prévenir et sans laisser trace de son arrivée, sinon sa seule présence.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Les paysans qui découvrent ces lieux au petit matin en parlent avec une prudence presque religieuse, comme s'ils craignaient qu'approcher de trop près ne les y attache à leur tour. Certains refusent d'y mener leur bétail paître, même des semaines plus tard. D'autres, plus curieux ou plus désespérés, s'y rendent déjà pour y chercher on ne sait quoi. La Chancellerie a dépêché des hommes pour en dresser le relevé, mais aucun rapport complet n'est encore parvenu à la cour au moment où ces lignes sont écrites. Ce registre y reviendra dès que ces relevés seront achevés.",
		],
	},

	// --- Les premiers témoignages --------------------------------------------
	{
		kind: "content",
		title: "Les premiers témoignages",
		dropcap: true,
		paragraphs: [
			"Dans les heures qui suivent la secousse, les récits affluent, d'abord timides, puis de plus en plus pressants. Un soldat posté sur les remparts orientaux jure avoir vu, au loin, un arbre se redresser avec un torse d'homme greffé à son tronc, ses branches se tordant comme des bras désarticulés, avant de s'immobiliser pour de bon.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Un fermier affirme avoir trouvé dans son champ une masse de chair et de pierre qui respirait encore, lourdement, comme un animal pris au piège. Une marchande, revenue en larmes du marché aux bestiaux, raconte avoir vu deux de ses bêtes se confondre sous ses yeux en une seule créature, avant de s'enfuir en boitant vers la forêt la plus proche.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Aucun de ces récits ne ressemble tout à fait à un autre, et pourtant tous décrivent, sous des formes différentes, la même chose, des fusions impossibles de chair, d'os, d'écorce, de pierre ou de métal, nées de rien et de tout à la fois. Personne, à ce stade, ne sait leur donner un nom qui tienne au-delà d'une rue ou d'un village.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Les prêtres n'y reconnaissent aucune création connue de Mydare ni d'Aldrene. Les érudits de la cour n'y trouvent ni logique, ni motif, ni la moindre règle qu'on puisse coucher sur le papier avec quelque assurance.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ce que l'on sait, en revanche, c'est la peur qu'elles inspirent. Ceux qui les croisent en reviennent rarement capables d'en parler calmement ; certains n'en reviennent pas du tout, et leurs familles continuent de les attendre, debout sur le pas de leur porte, plus longtemps qu'il ne serait raisonnable d'espérer. Dans les tavernes et sur les marchés, chacun leur invente déjà un nom de fortune, « les fondus », « les mélangés », « les sans-forme », sans qu'aucun ne s'impose encore sur les autres. La Chancellerie, pour l'heure, se garde bien d'en choisir un à sa place.",
		],
	},

	// --- Entre Aldrene et Mydare ---------------------------------------------
	{
		kind: "content",
		title: "Entre Aldrene et Mydare",
		dropcap: true,
		paragraphs: [
			"La cour et les temples d'Aldrenia s'emplissent aussitôt de questions auxquelles personne ne sait répondre. Pour certains prêtres d'Aldrene, c'est elle qui se manifeste, à sa manière, impossible à comprendre, peut-être pour avertir, peut-être pour protéger. D'autres y voient au contraire la main de Mydare, enfin déchaînée après des siècles de patience divine. Aucune des deux explications ne peut être vérifiée, et les deux camps se gardent, pour l'instant, de l'affirmer trop haut.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Personne, à Aldrenia, ne sait si Eorthal, Skeldara, Dreamar, Thelmere et Ostrane subissent la même chose au même instant. Dans les tavernes comme dans les couloirs du palais, la même question circule, murmurée plus qu'elle n'est posée franchement. Est-ce fini, ou cela ne fait-il que commencer ?",
		],
	},

	// --- Les éclaireurs -------------------------------------------------------
	{
		kind: "content",
		title: "Les éclaireurs",
		dropcap: true,
		paragraphs: [
			"Face à ce silence et à ces questions sans réponse, le roi Varic Rhen ne peut se permettre d'attendre que les réponses viennent d'elles-mêmes. Dans les jours qui suivent, des éclaireurs sont choisis parmi les plus endurants et les plus discrets de ses armées, puis envoyés dans toutes les directions à la fois, vers chacun des royaumes voisins, avec pour seule instruction de voir, d'écouter, et de revenir.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Le voyage est long. Il faut compter environ cinq jours pour atteindre les terres skeldariennes et autant pour en revenir. Aucune réponse n'est donc attendue avant une bonne dizaine de jours, et sans doute davantage pour les royaumes plus éloignés. En attendant, le peuple d'Aldrenia n'a d'autre choix que d'apprendre à vivre avec l'inconnu, un jour après l'autre.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ce registre restera ouvert tant que ces éclaireurs n'auront pas franchi, dans un sens ou dans l'autre, les portes de Caldrath. Chaque nouvelle qui en reviendra y sera consignée telle qu'elle aura été rapportée, sans fard ni certitude ajoutée, et les scribes de la Chancellerie prient, chacun à sa manière, pour qu'il n'y ait pas trop à en dire.",
		],
	},

	{
		kind: "sealed",
		bookNo: "À venir",
		bookTitle: "D'autres cahiers suivront",
		bookSub: "Ce que la Chancellerie n'a pas encore couché par écrit.",
		waxList: ["?", "?", "?"],
		note: "Les archivistes n'ont pas encore rédigé la suite de ce registre.",
	},
	{
		kind: "colophon",
		title: "Colophon",
		paragraphs: [
			"Ce registre s'enrichira à mesure que la Chancellerie aura matière à y consigner, et pas avant. Referme-le, et reviens-y quand une main plus avisée que la nôtre y aura ajouté quelque chose qui mérite d'être lu.",
		],
	},
];
