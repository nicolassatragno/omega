# Helper module to generate names (mythological)
#
# Copyright (C) 2012-2013 Mohammed Morsi <mo@morsi.org>
# Licensed under the AGPLv3+ http://www.gnu.org/licenses/agpl.txt

module Omega

# The names module provides mechanisms to generate random names
# from a fixed list of well known names
module Names

MAX_SUFFIX=5

GREEK_NAMES = ["Acacius", "Achaikos", "Aeschylus", "Aesop", "Agape", "Agapetos", "Agapetus", "Agapios", "Agatha", "Agathe", "Agathon", "Agnes", "Aikaterine", "Akakios", "Alcaeus", "Alexander", "Alexandra", "Alexandros", "Alexios", "Alexis", "Alexius", "Ambrosia", "Ambrosios", "Ambrosius", "Ampelios", "Ampelius", "Amyntas", "Anacletus", "Anakletos", "Anastasia", "Anastasios", "Anastasius", "Anatolios", "Anatolius", "Anaxagoras", "Andreas", "Androcles", "Andronikos", "Anicetus", "Aniketos", "Anthousa", "Antigonus", "Antipater", "Aphrodisia", "Aphrodisios", "Apollinaris", "Apollodoros", "Apollonia", "Apollonios", "Arcadius", "Archelaos", "Archelaus", "Archimedes", "Archippos", "Argyros", "Aristarchos", "Aristarchus", "Aristeides", "Aristides", "Aristocles", "Aristodemos", "Aristokles", "Aristomache", "Ariston", "Aristophanes", "Aristoteles", "Aristotle", "Arkadios", "Arsenios", "Arsenius", "Artemidoros", "Artemisia", "Artemisios", "Asklepiades", "Aspasia", "Athanas", "Athanasia", "Athanasios", "Athanasius", "Athenais", "Basileios", "Basilius", "Berenice", "Berenike", "Bion", "Callias", "Charis", "Chariton", "Charmion", "Chloe", "Chrysanthe", "Chrysanthos", "Cleisthenes", "Cleitus", "Cleon", "Cleopatra", "Clitus", "Corinna", "Cosmas", "Cyrillus", "Cyrus", "Damianos", "Damianus", "Dareios", "Demetria", "Demetrios", "Demetrius", "Democritus", "Demon", "Demosthenes", "Demostrate", "Diodoros", "Diodorus", "Diodotos", "Diodotus", "Diogenes", "Diokles", "Dion", "Dionysios", "Dionysius", "Dionysodoros", "Doris", "Draco", "Eirenaios", "Eirene", "Elpis", "Epaphras", "Epaphroditos", "Epiktetos", "Erasmos", "Erastos", "Euanthe", "Euaristos", "Euclid", "Eudocia", "Eudokia", "Eudoxia", "Eugeneia", "Eugenia", "Eugenios", "Eugenius", "Eukleides", "Eulalia", "Eumelia", "Eunice", "Eunike", "Euphemia", "Euphemios", "Euphranor", "Euphrasia", "Eupraxia", "Euripides", "Eusebios", "Eusebius", "Eustachius", "Eustachus", "Eustathios", "Eustorgios", "Eustorgius", "Euthalia", "Euthymia", "Euthymios", "Euthymius", "Eutropia", "Eutropios", "Eutropius", "Eutychios", "Eutychius", "Eutychos", "Evaristus", "Gaiana", "Gaiane", "Galene", "Galenos", "Gennadios", "Gennadius", "Georgios", "Georgius", "Hagne", "Helena", "Helene", "Heliodoros", "Heracleitus", "Heraclius", "Herakleides", "Herakleios", "Herakleitos", "Hermes", "Hermogenes", "Hermokrates", "Hermolaos", "Hero", "Herodes", "Herodion", "Herodotus", "Heron", "Hesiod", "Hesperos", "Hieronymos", "Hieronymus", "Hilarion", "Hippocrates", "Hippokrates", "Hippolytos", "Homer", "Homeros", "Hyacinthus", "Hyakinthos", "Hyginos", "Hyginus", "Hypatia", "Hypatos", "Iason", "Irenaeus", "Irene", "Ireneus", "Isidora", "Isidoros", "Isocrates", "Kallias", "Kallikrates", "Kallisto", "Kallistos", "Kallistrate", "Karpos", "Kleisthenes", "Kleitos", "Kleon", "Kleopatra", "Kleopatros", "Korinna", "Kosmas", "Kyriakos", "Kyrillos", "Kyros", "Leon", "Leonidas", "Leontios", "Leontius", "Ligeia", "Linos", "Linus", "Loukianos", "Lycurgus", "Lycus", "Lykos", "Lykourgos", "Lysander", "Lysandra", "Lysandros", "Lysimachus", "Lysistrata", "Melissa", "Melitta", "Methodios", "Methodius", "Metrodora", "Metrophanes", "Miltiades", "Mnason", "Myron", "Myrrine", "Neophytos", "Nereus", "Nicanor", "Nicolaus", "Nicomedes", "Nicostratus", "Nikandros", "Nikanor", "Nike", "Nikephoros", "Niketas", "Nikias", "Nikodemos", "Nikolaos", "Nikomachos", "Nikomedes", "Nikon", "Nikostratos", "Olympias", "Olympiodoros", "Olympos", "Onesimos", "Onesiphoros", "Origenes", "Pamphilos", "Pancratius", "Pankratios", "Pantaleon", "Panther", "Pantheras", "Paramonos", "Pelagia", "Pelagios", "Pelagius", "Pericles", "Phaedrus", "Pherenike", "Philandros", "Phile", "Philippos", "Philo", "Philokrates", "Philon", "Philotheos", "Phocas", "Phoibe", "Phoibos", "Phokas", "Photina", "Photine", "Photios", "Plato", "Platon", "Ploutarchos", "Polycarp", "Porphyrios", "Praxiteles", "Prochoros", "Prokopios", "Ptolemaios", "Ptolemais", "Pyrrhos", "Pyrrhus", "Pythagoras", "Rhode", "Roxana", "Roxane", "Sappho", "Seleucus", "Simonides", "Socrates", "Sokrates", "Solon", "Sophia", "Sophocles", "Sophus", "Sosigenes", "Sostrate", "Stephanos", "Straton", "Syntyche", "Telesphoros", "Telesphorus", "Thais", "Thales", "Themistocles", "Theocritus", "Theodora", "Theodoros", "Theodorus", "Theodosia", "Theodosios", "Theodosius", "Theodotos", "Theodotus", "Theodoulos", "Theodulus", "Theokleia", "Theokritos", "Theophanes", "Theophania", "Theophila", "Theophilos", "Theophilus", "Theophylaktos", "Theron", "Thucydides", "Timaeus", "Timaios", "Timo", "Timon", "Timoteus", "Timothea", "Timotheos", "Tryphaina", "Tryphon", "Tryphosa", "Tycho", "Tychon", "Xanthe", "Xanthippe", "Xenia", "Xeno", "Xenocrates", "Xenon", "Xenophon", "Zenais", "Zeno", "Zenobia", "Zenobios", "Zenon", "Zephyros", "Zoe", "Zopyros", "Zosime", "Zosimos", "Zosimus", "Zoticus", "Zotikos"]

EGYPTIAN_NAMES = ["Aah", "Aken", "Aker", "Amaunet", "Amenhotep", "Ament", "Am-Heh", "Ammut", "Amun", "Anhur", "Anta", "Andjety", "Anti", "Anubis", "Anuket", "Apedemak", "Apep", "Apis", "Arensnuphis", "Ash", "Astarte", "Aten", "Atum", "Auf", "Ba Neb Tetet", "Baal", "Baalat", "Babi", "Ba-Pef", "Bastet", "Bat", "Benu", "Bes", "Dedwen", "Denwen", "Duamutef", "Fetket", "Ha", "Hapi", "Hapy", "Hathor", "Hatmehyt", "Haurun", "Heket", "Heret-Kau", "Heryshaf", "Hesat", "Hetepes-Sekhus", "Horus", "Ihy", "Imhotep", "Khepra", "Kherty", "Khnum", "Khons", "Maahes", "Ma'at", "Mafdet", "Mahaf", "Mandulis", "Mehen", "Mehet-Weret", "Mertseger", "Meskhenet", "Mesta", "Mihos", "Min", "Mnevis", "Mont", "Mut", "Nebethetepet", "Nefertem", "Nehebkau", "Neheh", "Neith", "Nekhebet", "Neper", "Orion", "Pakhet", " Panebtawy", "Pelican", "Peteese and Pihor", "Ptah", "Ptah-Seker-Osiris", "Qebhsnuf", "Qetesh", "Saa", "Satet", "Sebek", "Sebiumeker", "Sefkhet-Abwy", "Seker", "Sekhmet", "Selket", "Sepa", "Septu", "Serapis", "Serqet", "Seshat", "Souls of Pe and Nekhen", "Ta-Bitjet", "Tasenetnofret", "Tatenen", "Taueret", "Tayet", "Uajyt", "Wadj Wer", "Weneg", "Wepwawet", "Wosret", "Yah", "Yamm"]

NORSE_NAMES = ["Aesir", "Alta", "Angrbotha", "Asgard", "Asynjr", "Balder", "Berserker", "Bertha", "Bor", "Bragi", "Brono", "Buri", "Bylgja", "Edda", "Eir", "Farbanti", "Fenrir", "Forseti", "Freya", "Freyr", "Frigga", "Fulla", "Garm", "Gefjon", "Gerd", "Ginnunggap", "Gioll", "Gladsheim", "Gleipnir", "Gna", "Gold-comb", "Gotterdammerung", "Gulltopr", "Gullveig", "Gungnir", "Gunlad", "Heimdall", "Hel", "Hermod", "Hlin", "Hodur", "Hoenir", "Hresvelgr", "Huldra", "Huginn", "Iduna", "Jord", "Jormungandr", "Jotunheim", "Kolga", "Lodur", "Lofn", "Loki", "Magni", "Mimir", "Modi", "Muninn", "Nanna", "Nastrand", "Nidhogg", "Niflheim", "Njord", "Norn", "Odin", "Ogres", "Outgard", "Ragnarok", "Ran", "Runes", "Runic", "Saga", "Seidr", "Sif", "Sjofn", "Skadi", "Sleipnir", "Snotra", "Surtr", "Syn", "Thiassi", "Thor", "Thrud", "Troll", "Tyr", "Ulle", "Valhalla", "Vali", "Valkyries", "Var", "Ve", "Vidar", "Vili", "Vingulf", "Vithar", "Vor", "Woden", "Yggdrasil", "Ymi"]

HAWAIIAN_NAMES = ["Akea", "Apukohai", "Haulili", "Hai", "Hiaka", "Hiiakawawahilani", "Hinakuluiau", "Kalaipahoa", "Kaluannuunohonionio", "Kamapua", "Kamohoali", "Kamooalii", "Kanaloa", "Kane", "Kapo", "Keoahikamakaua", "Kapohoikahiola", "Keuakepo", "Kiha", "Koleamoku", "Ku", "Kuahana", "Kukaoo", "Kaupe", "Kukailimoku", "Kuula", "Laamaomao", "Laka", "Lakakane", "Lie", "Lono", "Lonomakua", "Mahulu", "Manua", "Maui", "Milu", "Moaalii", "Mokualii", "Mooaleo", "Ouli", "Poliahu", "Papa", "Pele", "Puea", "Ukanipo", "Ulaulekeahi", "Uli"]

IRISH_NAMES = ["Airmid", "Artio", "Balor", "Branwen", "Camalus", "Cerunnos", "Cyhiraeth", "Druantia", "Giobhniu", "Lugh", "Llyr", "Maeve", "Manannan", "Margawse", "Mebd", "Mider", "Morrigan", "Nemain", "Aine", "Angus Og", "Anu", "Babd Catha", "Bel", "Bran", "Brighid", "Bris", "Dagda", "Danu", "Diancecht", "Flidais", "Labraid", "Macha", "Niamh", "Arawn", "Arianrhod", "Amaethon", "Blodeuwedd", "Cerridwen", "Dewi", "Don", "Dylan", "Elaine", "Gwydion", "Gwynn Ap Nudd", "Math Ap Mathowny", "Myrrdin"]

CELTIC_NAMES = []
#CELTIC_NAMES = ["Abandinus", "Abellio", "Alaunus", "Alisanos", "Ambisagrus", "Anextiomarus", "Atepomarus", "Arvernus", "Arausio", "Babdah", "Barinthus", "Belatu", "Borvo", "Buxenus", "Camulos", "Canetonnessis", "Cernunnos", "Cicolluis", "Cimbrianus", "Cissonius", "Cnabetius", "Cocidius", "Condatis", "Contrebis", "Dii", "Dis", "Esus", "Fagus", "Genii", "Grannos", "Icaunus", "Intarabus", "Iovantucarus", "Joehaynus", "Lenus", "Leucetios", "Lugus", "Luxovius", "Maponos", "Mogons", "Moritasgus", "Mullo", "Nemausus", "Nerius", "Nodens", "Ogmios", "Robur", "Rudianos", "Segomo", "Smertrios", "Sucellos", "Taranis", "Toutatis", "Veteris", "Virotutis", "Visucius", "Vindonnus", "Vinotonus", "Vosegus", "Zacharus", "Abnoba", "Adsullata", "Aericura", "Agrona", "Ancamna", "Andarta", "Andraste", "Arduinna", "Aufaniae", "Arnemetia", "Artio", "Aventia", "Aveta", "Belisama", "Brigantia", "Britannia", "Camma", "Campestres", "Clota", "Coventina", "Damara", "Damona", "Dea Matrona", "Dea Sequana", "Debranua", "Epona", "Erecura", "Icovellauna", "Litavis", "Mairiae", "Nantosuelta", "Nemetona", "Ritona", "Rosmerta", "Sabrina", "Senua", "Sequana", "Sirona", "Suleviae", "Sulis", "Tamesis", "Verbeia", "Amaethon", "Avalloc", "Beli", "Caswallawn", "Culhwch", "Dwyfan", "Dylan Eil Ton", "Eurosswydd", "Govannon", "Gwydion", "Gwyddno", "Gwyn ap Nudd", "Hafgan", "Lleu Llaw Gyffes", "Lludd", "Llyr", "Mabon_ap_Modron", "Manawydan", "Math ap Mathonwy", "Myrddin Wyllt", "Nisien and Efnisien", "Pryderi", "Pwyll", "Taliesin", "Ysbaddaden", "Arianrhod", "Blodeuwedd", "Branwen", "Ceridwen", "Cigva", "Creiddylad", "Cyhiraeth", "Dôn", "Elen", "Gwenn Teir Bronn", "Modron", "Olwen", "Penarddun", "Rhiannon", "Abartach", "Abhean", "Áengus Mac ind Óc", "Ai", "Balor", "Bodb Dearg", "Bres", "Brian, Iuchar and Iucharba", "Cian, Cu and Cethen", "Creidhne", "Cú Roí", "The Dagda", "Dian Cecht", "Elatha", "The fianna: Fionn, Goll, & Diarmuid", "Goibniu", "Lir", "Luchtaine", "Lugh", "Mac Cuill, Mac Cecht and Mac Gréine", "Manannan Mac Lir", "Miach", "Midir", "Mug Ruith", "Neit", "Nuada", "Oghma", "Tethra", "Aibell", "Aimend", "Áine", "Airmed", "Anann", "Badb", "Banba", "Bébinn", "Bé Chuille", "Birog", "Boann", "Brigid", "Caer", "Canola", "Carmun", "Cessair", "Cethlenn", "Cliodhna", "Danu", "Ériu", "Étaín", "Ethlinn", "Ethne", "Fand", "Fionnuala", "Fodla", "Lí Ban", "Macha", "Morrígan", "Nemain", "Niamh", "Plor na mBan", "Sheela na Gig", "Tailtiu", "Alastir", "Beira", "Cailleach", "Dia Griene", "Inghean Bhuidhe", "Lasair", "Latiaran", "Oisin", "Shoney"]

JAPANESE_NAMES = ["Aizen-Myoo", "Aji-Suki-Taka-Hi-Kone", "Ama-No-Minaka-Nushi", "Amaterasu", "Amatsu", "Amatsu-Kami", "Ama-Tsu-Mara", "Ame-No-Mi-Kumari", "Ame-No-Wakahiko", "Amida", "Am-No-Tanabata-Hime", "Baku", "Benten", "Benzai-Ten", "Bimbogami", "Binzuru-Sonja", "Bishamon", "Bosatsu", "Butsu", "Chien-shin", "Chimata-no-kami", "Chup-Kamui", "Daibosatsu", "Daikoku", "Dainichi", "Dosojin", "Dozoku-shin", "Ebisu", "Ekibiogami", "Emma-o", "Fudo", "Fujin", "Fukurokuju", "Funadama", "Futsu-Nushi-no-Kami", "Gama", "Gekka-o", "Hachiman", "Haniyasu-hiko", "Haniyasu-hime", "Haya-Ji", "Hiruko", "Hoso-no-Kami", "Hotei", "Ida-Ten", "Ika-Zuchi-no-Kami", "Iki-Ryo", "Inari", "Isora", "Izanagi", "Izanami", "Jinushigami", "Jizo", "Juichimen", "Jurojin", "Kagutsuchi", "Kamado-gami", "Kami-kaze", "Kaminari", "Kanayama-hiko", "Kanayama-hime", "Kawa-no-Kami", "Kenro-Ji-Jin", "Kishi-Bojin", "Kishijoten", "Kishimo-jin", "Kojin", "Ko-no-Hana", "Koshin", "Koya-no-Myoin", "Kukunochi-no-Kami", "Kuni-Toko-tachi", "Kura-Okami", "Marisha-Ten", "Mawaya-no-kami", "Miro", "Miyazu-Hime", "Monju-Bosatsu", "Musubi-no-Kami", "Nai-no-Kami", "Naka-Yama-Tsu-Mi", "Nikko-Bosatsu", "Ninigi-no-mikoto", "Nominosukune", "Nyorai", "Oanomochi", "Ohonamochi", "Oho-Yama", "Okuni-Nushi", "Owatatsumi", "Oyamatsumi", "Raiden", "Ryo-Wo", "Sae-no-Kami", "Sambo-kojin", "Sarutahiko", "Sengen", "Shaka", "Shichi", "Shinda", "Shine-Tsu-Hiko", "Shoden", "Shoki", "Suijin", "Suitengu", "Sukuna-Biko", "Susanowa", "Takami-Musubi", "Takemikadzuchi", "Taki-Tsu-Hiko", "Tatsuta-hime", "Tenjin", "Toyo-Uke-Bime", "Toyouke-Omikami", "Tsuki-Yumi", "Uba", "Uga-Jin", "Uga-no-Mitama", "Ukemochi", "Uzume", "Wakahiru-me", "Wata-tsu-mi", "Yabune", "Yama-no-kami", "Yamato", "Yuki-Onna"]

POLYNESIAN_NAMES = ["Afa", "Ao", "Ara Tiotio", "Atea", "Atua Fafine", "Atua I Kafika", "Atutahi", "Auraka", "Awha", "Daramulum", "Dhakhan", "Jar'Edo Wens", "Julana", "Karora", "Kidili", "Mangar-kunjer-kunja", "Njirana", "Nogomain", "Numakulla", "Pundjel", "Ungud", "Wollunqua", "Wuluwaid", "Anjea", "Birrahgnooloo", "Dilga", "Eingana", "Gnowee", "Julunggul", "Kunapipi", "Ungud", "Wala", "Wuriupranili", "Yhi"]

NATIVE_AMERICAN_NAMES = ["A'akuluujjusi", "Aakuluujjusi", "Abaangui", "Achi", "Achiyalabopa", "Achomawi", "Adekagagwaa", "Adlivun", "Aguara", "Ahayuta", "Ahayuta Achi", "Ahe'a", "Ahea", "Ahmeto Lela Okya", "Aholi", "Ahsonnutli", "Airsekui", "Aisoyimstan", "Akba Atatdia", "Akna", "Aleut", "Alignak", "Alk'umta'm", "Alk'unta'um", "Alkuntam", "Allowat Sakima", "Alowatsakima", "Amala", "Amitolane", "Amotken", "Anarkusuga", "Anaye", "Angak' Chin Mana", "Angalkuq", "Angokoq", "Anguta", "Aningan", "Apikunni", "Apisirahts", "Apotamkin", "Apoyan Tachi", "Aqas Xena Xenas", "Arnakua'gsak", "Arnakuagsak", "Arnarquagsag", "Asagaya Gigaei", "Asgaya Gigagei", "Ataensic", "Ataentsic", "Atahensic", "Atius Tirawa", "Awanawilonais", "Awitelin Tsta", "Awonawilona", "Badger", "Bakbakwalanooksiwae", "Baxbakualanuchsiwae", "Beaver", "Begocidi", "Bikeh Hozho", "Binaye Ahani", "Bokwus", "Bototo", "Capa", "Chacomat", "Chacopa", "Chakekenapok", "Chehooit", "Chibiabos", "Chinigchinich", "Chipiapoos", "Chulyen", "Dajoji", "Dawn", "Dayunsi", "Dohkwibuhch", "Doquebuth", "Dzelarhons", "Dzoavits", "Eeyeekalduk", "Ehlaumel", "Eithinoha", "Enumclaw", "Eototo", "Esaugetuh Emissee", "Estanatlehi", "Estasanatlehi", "Estsanatlehi", "Ewah", "a'an", "Ga Gaah", "Ga Oh", "Gaan", "Gahe", "Gaoh", "Gendenwitha", "Gendewitha", "Gitche Manito", "Gitche Manitou", "Gitchi Manitou", "Gitchie Manitou", "Gitsche Manitou", "Glooscap", "Glooskap", "Gluscabe", "Gluscabi", "Gluskab", "Gluskabe", "Gluskap", "Gudratrigakwitl", "Guguyni", "Gunnodayak", "Gyhldeptis", "Hahgwehdaetgah", "Hahgwehdiyu", "Haokah", "Hastseoltoi", "Hastshehogan", "Hayicanako", "Hemaskas", "Hino", "Hinu", "Hisagita Imisi", "Hisagitaimisi", "Hisakitaimisi", "Huruing Wuhti", "Ibofanga", "Ictinike", "Igaluk", "Ignirtoq", "Ikto", "Iktomi", "Inktomi", "Ioi", "Ioskeha", "Irdlirvirisissong", "Isitoq", "Issitoq", "Iya", "Iyatiku", "Kachinas", "Kaiti", "Kananeski Anayehi", "Kanati", "Kapoonis", "Karwan", "Kat'sinas", "Kioskurber", "Kitche Manitou", "Kitchi Manitou", "Kitshi Manitou", "Kivati", "Kloskurbeh", "Koko", "Kokopelli", "Koshere", "Koyangwuti", "Koyemsi", "Kumokum", "Kumush", "Kushapatshikan", "Kutnahin", "Kwa Kwakalanooksiwae", "Kwatee", "Kwatyat", "Kwekwaxa'we", "Kwekwaxawe", "Kwikumat", "Kwikwilyaqa", "Logobola", "Maheo", "Malsum", "Malsumis", "Malsun", "Mana", "Manabozho", "Manabozo", "Manabush", "Manetto", "Manibozho", "Manisar", "Manit", "Manito", "Manitoa", "Manitoo", "Manitou", "Manitu", "Marten", "Michabo", "Mising", "Moar", "Momo", "Na'pi", "Nagaitcho", "Nanabozho", "Nanabozo", "Nankil'slas", "Nanook", "Napi", "Nataska", "Nayanezgani", "Negafook", "Nerivik", "Nerrivik", "Nipinoukhe", "Nocoma", "Nokomis", "Nokomos", "Nootaikok", "Nukatem", "Nuliajuk", "Nunuso", "Ocasta", "Odzihozo", "Olelbis", "Ololowishkya", "Onatah", "Oshadagea", "Owiot", "Pah", "Palhik Mana", "Pamit", "Payatamu", "Pipinoukhe", "Poia", "Poshaiyankayo", "Pukkeenegak", "Qa'wadliliquala", "Qamaits", "Qawadliliquala", "Quaayayp", "Quaoar", "Raven", "Rhpisunt", "Sanopi", "Sedna", "Selu", "Senx", "Shakaru", "Shakuru", "Siarnaq", "Sint Holo", "Sisiutl", "Skan", "Skili", "Snoqalm", "Sosondowah", "Sotuknang", "Sussistanako", "Szeukha", "Tabaldak", "Taiowa", "Tamit", "Tarhuhyiawahku", "Tawiskara", "Tekkeitserktock", "Tewi'xilak", "Tewixilak", "Theelgeth", "Thelgeth", "Tihtipihin", "Tirawa", "Tirawa Atius", "Tobadzistsini", "Tolmalok", "Tonenili", "Tornarsuk", "Torngarsak", "Torngasak", "Torngasoak", "Tsohanoai", "Tukupar Itar", "Txamsem", "Umai Hulhlya Wit", "Umai Hulhya Wit", "Uncegila", "Unelanuki", "Unktehi", "Unktome", "Untunktahe", "Utset", "Wabasso", "Wakan Tanka", "Wakanda", "Wakinyan", "Wakonda", "Waukheon", "Wenabozho", "Wendego", "Wendigo", "Wetiko", "Weywot", "Wheemeemeowah", "Wheememeowah", "Winabozho", "Windago", "Windego", "Windikouk", "Wisaaka", "Wishpoosh", "Wonomi", "Xelas"]

AZTEC_MAYAN_NAMES = ["Ah Kinchil", "Ah Puch", "Ahau Chamahez", "Ahmakiq", "Akhushtal", "Bacabs", "Centeotl", "Chalchiuhtlicue", "Chantico", "Chicomecoatl", "Cihuacoatl", "Cit Bolon Tum", "Ehecatl", "Ekahau", "Huitzilopochtli", "Huixtocihuatl", "Itzpapalotl", "Ix Chel", "Ixtab", "Ixtlilton", "Kan-u-Uayeyab", "Kinich Kakmo", "Kisin", "Kukucan", "Macuilxochitl", "Mayahuel", "Metztli", "Mictlan", "Mictlantecuhtli", "Mitnal", "Nacon", "Ometecuhtli", "Patecatl", "Paynal", "Quetzalcoati", "Quetzalcoatl", "Teoyaomqui", "Tlaloc", "Tlalocan", "Tlazolteotl", "Tonacatecuhtli", "Tonatiuh", "Xilonen", "Xipe Totec", "Xochipilli", "Yacatecuhtli", "Yaxche", "Yum Kaax"]


ROMAN_NAMES = ["Apollo", "Bacchus", "Bellona", "Ceres", "Cupid", "Diana", "Faunus", "Flora", "Janus", "Juno", "Jupiter", "Lares", "Libintia", "Maia", "Mars", "Mercury", "Minerva", "Mithras", "Neptune", "Ops", "Pales", "Pluto", "Pomona", "Proserpine", "Saturn", "Venus", "Vertumnus", "Vesta", "Vulcan"]

# Master list of names to select from
#
# TODO names from other mythologies
NAMES = GREEK_NAMES + EGYPTIAN_NAMES + NORSE_NAMES +
        HAWAIIAN_NAMES + IRISH_NAMES + CELTIC_NAMES +
        JAPANESE_NAMES + POLYNESIAN_NAMES + NATIVE_AMERICAN_NAMES +
        AZTEC_MAYAN_NAMES + ROMAN_NAMES + []

# Return a random name from the fixed list of {Names}
#
# @param [Hash] args optional arguments to use in name generation
# @option args [true,false] :with_suffix boolean indicating if we should append a
# random numerical suffic to the name
def self.rand_name(args = {})
 with_suffix = args[:with_suffix] || false
 # TODO used_names argument (names to ignore in selection)

 name = NAMES[rand(NAMES.length-1)]
 name += " " + (1 + rand(MAX_SUFFIX - 1)).to_s if with_suffix

 return name
end

end # module Names
end # module Omega
