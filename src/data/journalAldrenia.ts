// Contenu du "Journal d'Aldrenia", copié tel quel depuis l'artifact de
// prototypage (feuille simple + physique de page, validés séparément) —
// voir lore/eras/*.md et lore/Wyrdane_LORE_complet.md côté card-game pour
// la source canonique. Toute nouvelle époque s'ajoute ici comme un nouveau
// "tome" (voir TOME_TABS plus bas) sans toucher au reste.

export type JournalPage =
	| { kind: "cover" }
	| { kind: "divider"; sectionId?: string; bookNo: string; bookTitle: string; bookSub: string }
	| { kind: "sealed"; sectionId?: string; bookNo: string; bookTitle: string; bookSub: string; waxList: string[]; note: string }
	| { kind: "colophon"; title: string; paragraphs: string[] }
	| { kind: "content"; sectionId?: string; title?: string; dropcap?: boolean; paragraphs: string[] }
	| { kind: "content-italic"; text: string };

// Un marque-page par section nommée (data-id des pages ci-dessous). L'ordre
// ici est l'ordre de lecture, pas l'ordre alphabétique.
export const TOME_TABS: { id: string; label: string; quiet?: boolean; isCover?: boolean }[] = [
	{ id: "cover", label: "Couverture", isCover: true },
	{ id: "avant", label: "Avant Wyrdane" },
	{ id: "aldrenia", label: "Aldrenia" },
	{ id: "eorthal", label: "Eorthal" },
	{ id: "skeldara", label: "Skeldara" },
	{ id: "dreamar", label: "Dreamar" },
	{ id: "thelmere", label: "Thelmere" },
	{ id: "ostrane", label: "Ostrane" },
	{ id: "premiere", label: "0 AW" },
	{ id: "cataclysme", label: "Le cataclysme" },
	{ id: "aldrenia0aw", label: "Aldrenia, ce jour-là" },
	{ id: "temoignages", label: "Témoignages" },
	{ id: "eclaireurs", label: "Les éclaireurs" },
	{ id: "scelles", label: "Scellés", quiet: true },
];

export const JOURNAL_PAGES: JournalPage[] = [
	{ kind: "cover" },
	{
		kind: "content",
		title: "Ex-libris",
		dropcap: true,
		paragraphs: [
			"Ce grimoire appartient aux archives de la Couronne d'Aldrenia. Il raconte ce que le royaume a vu de ses propres yeux, ce que des générations d'échanges lui ont appris, et ce qui, malgré tout cela, demeure un mystère entier.",
			"Que le lecteur tourne ces pages comme on tourne celles d'une chronique véritable, lentement, et en se souvenant qu'un royaume ne connaît jamais tout du monde qui l'entoure.",
		],
	},
	{
		kind: "divider",
		sectionId: "avant",
		bookNo: "Livre premier",
		bookTitle: "Avant Wyrdane",
		bookSub: "Ce que les royaumes savaient d'eux-mêmes, avant que le monde ne change.",
	},
	{
		kind: "content",
		title: "Le Mydarique",
		dropcap: true,
		paragraphs: [
			"Une langue commune à tout Mydaria, le Mydarique, permet le commerce et la diplomatie entre les six royaumes. Sans elle, un marchand d'Eorthal ne pourrait pas négocier à Dunmarr, ni un diplomate aldrenien se faire comprendre à Thelbridge.",
			"Mais le Mydarique n'efface aucune des langues propres à chaque royaume : l'aldrenien, l'eorthalien, le skeldarien, le dreamarien, le thelmérien et l'ostranais restent la langue du foyer, celle qu'on parle entre soi, et qu'un étranger ne maîtrise jamais vraiment, même après des années passées à commercer sur place.",
		],
	},
	{
		kind: "content",
		sectionId: "aldrenia",
		dropcap: true,
		paragraphs: [
			"Aldrenia est le royaume ancien. Sa capitale, Caldrath, se dresse à l'est des forêts de Dreamar, tournée vers la Mer de l'Est, au croisement de routes commerciales si anciennes que personne ne se souvient de les avoir tracées. D'autres royaumes humains ont existé avant lui, mais ont disparu au fil de l'histoire de Mydaria, et Aldrenia est le plus ancien qui ait survécu jusqu'à aujourd'hui.",
			"Sa puissance ne vient pas de l'abondance de ses terres, modestes comparées aux plaines d'Eorthal, mais de cette ancienneté, de la discipline de ses légions, et de sa position au cœur des échanges. Elle est gouvernée par le roi Varic Rhen, qu'on surnomme déjà le Vieux Roi, qui s'appuie sur un Conseil du Roi où siègent ses plus hauts généraux et les prêtres les plus influents d'Aldrene.",
		],
	},
	{
		kind: "content",
		paragraphs: [
			"La majorité des Aldreniens vénèrent Aldrene, qu'ils considèrent comme une déesse salvatrice et protectrice. Dans leur tradition, c'est Mydare, et non Aldrene, qui est à l'origine d'une grande partie des souffrances du monde : maladie, guerre, souffrance, catastrophes.",
			"Personne à Aldrenia ne sait si les deux déesses sont sœurs, rivales, ennemies, ou deux aspects d'une même force. Toutes deux semblent cependant liées à de véritables bénédictions, dont la nature profonde n'est pas comprise.",
		],
	},
	{
		kind: "content",
		paragraphs: [
			"À la veille de la catastrophe, Aldrenia est en guerre avec Skeldara, un conflit qu'elle vit au jour le jour : ses soldats y meurent, ses frontières y sont menacées.",
			"Elle entretient aussi une alliance avec Eorthal : des troupes aldreniennes protègent ses terres contre les raids skeldariens, en échange de conditions commerciales favorables. Cette alliance ne fait pas d'Aldrenia le maître d'Eorthal, qui reste un royaume indépendant.",
		],
	},
	{
		kind: "content",
		sectionId: "eorthal",
		title: "Eorthal",
		dropcap: true,
		paragraphs: [
			"Eorthal, étendue de plaines fertiles à l'ouest d'Aldrenia, face à l'Océan Occidental, doit sa richesse à des terres si généreuses qu'elles nourrissent à elles seules une bonne part de Mydaria. Sa capitale, Granholt, s'élève au milieu de ces terres. Le comté est gouverné par la comtesse Ysolde Varn, qui a personnellement négocié l'alliance avec Aldrenia pour protéger ses terres des appétits de Skeldara.",
			"Dépourvu d'une puissance militaire comparable à celle de ses deux puissants voisins, le royaume vit sous la menace constante des raids. Les Eorthaliens expliquent la fertilité de leurs terres par une bénédiction que Mydare leur aurait elle-même accordée, voilà si longtemps que plus personne, à Eorthal, ne songe à en douter.",
		],
	},
	{
		kind: "content",
		sectionId: "skeldara",
		title: "Skeldara",
		dropcap: true,
		paragraphs: [
			"Skeldara, accrochée aux pics et aux cols des hautes terres du nord, est une société où les guerriers, les vétérans et les raiders occupent une place centrale, et dont la culture tout entière semble façonnée par la guerre. Sa capitale, Dunmarr, est une forteresse autant qu'une ville. Elle est dirigée par le roi Gorath Thorne, dont la lignée règne sans partage depuis plusieurs générations, et que les soldats aldreniens qui l'ont affronté décrivent comme un chef aussi redouté par ses propres troupes que par ses ennemis.",
			"Le royaume est dévoué à Mydare et rejette avec mépris le culte d'Aldrene, une hostilité nourrie par des générations de guerre. Ce qui se vit réellement derrière ces frontières, Aldrenia ne le connaît que par ce que ses soldats en rapportent du champ de bataille.",
		],
	},
	{
		kind: "content",
		sectionId: "dreamar",
		title: "Dreamar",
		dropcap: true,
		paragraphs: [
			"Dreamar, nichée dans les forêts profondes qui couvrent le cœur du continent, est depuis toujours le principal foyer de la magie connue à Mydaria. Sa capitale, Nyrelle, se dissimule si bien parmi les arbres que les rares visiteurs aldreniens peinent à décrire où elle commence vraiment.",
			"Le royaume ne connaît pas de roi au sens où Aldrenia l'entend : un conseil de visionnaires le dirige, mais ce conseil reste volontairement secret, sans nom connu hors de Dreamar. La Haute Augure Mirelle Senn en est le visage public, mais même cela, Aldrenia ne peut l'affirmer avec certitude : personne ne sait si c'est bien elle qui décide, ou si elle n'est que la porte-parole d'un conseil qui préfère rester dans l'ombre.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ces augures prétendent recevoir des visions d'événements à venir, un pouvoir que nul, même à Dreamar, ne sait expliquer avec certitude. Aucun Aldrenien n'a jamais assisté lui-même à l'une d'elles pour trancher entre prophétie et charlatanisme.",
		],
	},
	{
		kind: "content",
		sectionId: "thelmere",
		title: "Thelmere",
		dropcap: true,
		paragraphs: [
			"Thelmere, seule puissance insulaire parmi les six royaumes, doit sa force à la flotte la plus développée du monde connu et à son quasi-monopole sur le commerce des métaux, des tissus, du bois et des denrées rares. Le royaume est gouverné par la Haute Amirale Corwin Dray, dont l'autorité repose autant sur le commandement de la flotte que sur un quelconque droit héréditaire.",
			"On y accède par une route maritime qui mène à son île, où se dresse Thelbridge, sa capitale, reliée au continent par un pont si vaste qu'il est devenu une merveille dont on parle jusqu'à Aldrenia. Au-delà de ses ports, la vie intérieure de Thelmere reste assez mal connue des marchands aldreniens, trop occupés à compter leurs cargaisons pour s'y attarder.",
		],
	},
	{
		kind: "content",
		sectionId: "ostrane",
		title: "Ostrane",
		dropcap: true,
		paragraphs: [
			"Ostrane, repliée sur les terres méridionales du continent, rompt avec tout ce schéma. Seul des six royaumes à s'être toujours tenu à l'écart du commerce, des guerres et des alliances des cinq autres, il n'a jamais laissé le temps construire sur lui le même savoir accumulé. Même le nom de sa capitale, Farwatch, n'est connu que par ouï-dire.",
			"On sait seulement que ses dirigeants, quels qu'ils soient, cherchent avant tout la paix sur leur territoire : aucun diplomate, aucun marchand n'a jamais pu en rapporter de nom de souverain, de conseil ou de dynastie, et certains à Aldrenia doutent même qu'il ait un dirigeant unique.",
		],
	},
	{
		kind: "content-italic",
		text: "Quelque part dans les terres fertiles d'Eorthal, un fermier parmi des milliers d'autres cultive ses champs sans savoir qu'il est sur le point de changer le monde. Personne n'a encore entendu parler de lui.",
	},
	{
		kind: "divider",
		sectionId: "premiere",
		bookNo: "Livre second",
		bookTitle: "0 AW\nLa Première Vague",
		bookSub: "Le jour où le monde a changé, et où personne n'a compris pourquoi.",
	},
	{
		kind: "content",
		sectionId: "cataclysme",
		dropcap: true,
		paragraphs: [
			"Sans aucun signe annonciateur, Mydaria est frappée par un cataclysme d'une ampleur inconnue jusque-là. Le ciel, pourtant, ne change pas de couleur. Aucun astre ne tombe, aucune trompette ne sonne. Ce sont la terre elle-même qui se met à trembler sous les pieds de tous à la fois, les bêtes qui se mettent à hurler sans raison dans les étables, et dans certaines maisons les lampes qui s'éteignent toutes ensemble sans qu'aucun souffle ne les ait touchées.",
			"Ce n'est qu'après coup, dans les heures et les jours qui suivent, une fois les premiers récits recoupés entre eux, que l'on comprend qu'il ne s'agit pas d'un simple tremblement de terre isolé, mais de quelque chose qui a frappé bien plus loin que les frontières d'Aldrenia, peut-être le monde tout entier.",
			"L'événement n'a pas de nom. Dans les jours qui suivent, personne ne sait comment le désigner autrement qu'en le décrivant à sa manière : « le jour où tout a changé », « la grande secousse », ou simplement « cela ».",
		],
	},
	{
		kind: "content",
		sectionId: "aldrenia0aw",
		title: "Ce jour-là, à Aldrenia",
		dropcap: true,
		paragraphs: [
			"À Aldrenia même, la terre tremble comme partout ailleurs. Mais au-delà du tremblement, quelque chose de plus profond se produit : sur plusieurs lieues de son propre territoire, le sol semble se plier sur lui-même, et à l'endroit où il se redresse, ce n'est plus tout à fait la même terre qui reprend sa place.",
			"Des pierres inconnues, des reliefs que nul Aldrenien n'a jamais vus, des bâtiments dont l'architecture n'appartient à aucun style connu se trouvent soudain là, comme si un fragment entier d'un autre monde venait simplement de se poser sur le sien, sans prévenir.",
		],
	},
	{
		kind: "content",
		sectionId: "temoignages",
		title: "Les premiers témoignages",
		dropcap: true,
		paragraphs: [
			"Dans les heures qui suivent la secousse, les récits affluent, d'abord timides, puis de plus en plus pressants. Un soldat posté sur les remparts orientaux jure avoir vu, au loin, un arbre se redresser avec un torse d'homme greffé à son tronc, ses branches se tordant comme des bras désarticulés.",
			"Un fermier affirme avoir trouvé dans son champ une masse de chair et de pierre qui respirait encore. Une marchande, revenue en larmes du marché aux bestiaux, raconte avoir vu deux de ses bêtes se confondre sous ses yeux en une seule créature, avant de s'enfuir en boitant vers la forêt la plus proche.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Aucun de ces récits ne ressemble tout à fait à un autre, et pourtant tous décrivent, sous des formes différentes, la même chose : des fusions impossibles de chair, d'os, d'écorce, de pierre ou de métal, nées de rien et de tout à la fois. Personne, à ce stade, ne sait leur donner un nom.",
			"Les prêtres n'y reconnaissent aucune création connue de Mydare ni d'Aldrene. Les érudits de la cour n'y trouvent ni logique, ni motif, ni la moindre règle.",
		],
	},
	{
		kind: "content",
		dropcap: true,
		paragraphs: [
			"Ce que l'on sait, en revanche, c'est la peur qu'elles inspirent. Ceux qui les croisent en reviennent rarement capables d'en parler calmement ; certains n'en reviennent pas du tout.",
			"Dans les tavernes et sur les marchés, chacun leur invente déjà un nom de fortune, « les fondus », « les mélangés », « les sans-forme », sans qu'aucun ne s'impose encore sur les autres.",
		],
	},
	{
		kind: "content",
		title: "Entre Aldrene et Mydare",
		dropcap: true,
		paragraphs: [
			"La cour et les temples d'Aldrenia s'emplissent aussitôt de questions auxquelles personne ne sait répondre. Pour certains prêtres d'Aldrene, c'est elle qui se manifeste, à sa manière, impossible à comprendre. D'autres y voient au contraire la main de Mydare, enfin déchaînée. Aucune des deux explications ne peut être vérifiée.",
			"Personne, à Aldrenia, ne sait si Eorthal, Skeldara, Dreamar, Thelmere et Ostrane subissent la même chose au même instant. Dans les tavernes comme dans les couloirs du palais, la même question circule : est-ce fini, ou cela ne fait-il que commencer ?",
		],
	},
	{
		kind: "content",
		sectionId: "eclaireurs",
		title: "Les éclaireurs",
		dropcap: true,
		paragraphs: [
			"Face à ce silence et à ces questions sans réponse, le roi Varic Rhen ne peut se permettre d'attendre que les réponses viennent d'elles-mêmes. Dans les jours qui suivent, des éclaireurs sont choisis parmi les plus endurants et les plus discrets de ses armées, puis envoyés dans toutes les directions à la fois.",
			"Le voyage est long. Il faut compter environ cinq jours pour atteindre les terres skeldariennes et autant pour en revenir : aucune réponse n'est donc attendue avant une bonne dizaine de jours. En attendant, le peuple d'Aldrenia n'a d'autre choix que d'apprendre à vivre avec l'inconnu.",
		],
	},
	{
		kind: "sealed",
		sectionId: "scelles",
		bookNo: "À venir",
		bookTitle: "Chapitres scellés",
		bookSub: "1 AW · 3 AW · 4 AW",
		waxList: ["1 AW", "3 AW", "4 AW"],
		note: "Les archivistes n'ont pas encore couché ces époques par écrit.",
	},
	{
		kind: "colophon",
		title: "Colophon",
		paragraphs: [
			"Ce journal s'enrichira au fil des prochaines chroniques d'Aldrenia. Referme-le, et reviens-y quand une nouvelle page aura été écrite.",
		],
	},
];
