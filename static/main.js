$(document).ready(function () {

var words = new Array();

words['OKO'] = ["ledelse", "kroner", "lønn", "finans",
               "bedrift", "børs", "industri", "prosent",
               "virksomhet", "selskapet", "inntekt",
               "brutto", "netto", "underskudd", "kvartalet",
               "resultat", "konsern", "næringsliv",
               "bank", "pris", "handel", "selskap", "transaksjon",
           "konkurs", "ASA", "holding", "hovedindeksen", "kursfall"]
words['SPO'] = ["fortball", "skåring", "keeper", "omgang", "skade",
                "trener", "kamp", "laget", "skår", "mesterskap", "ball",
                "landslag", "poeng", "teknikk", "stadion", "serie", "opprykk",
            "divisjon", "finale"] // mål
words['KULT'] = ["revy", "film", "plate", "konsert", "scene", "kultur", "band",
                 "festival", "publikum", "galleri", "kunst", "utstilling",
                 "show", "billett", "terningkast", "musik", "vokal", "jazz", "humor",
                 "litteratur", "roman", "Strykekvartett", "grøsser", "teater", "teatre",
                 "maleri", "forestilling", "fotografi", "litterær", "forfatter", "komik",
                 "diktsamling", "forlag", "album", "nasjonaldagen", "17mai"]
words['HVER'] = ["trafikk", "samliv", "oppussing", "interiør", "turist",
                 "trening", "hobby", "fritid", "strikk", "kjæledyr", "turlag",
                 "forbruker", "religion", "barn", "familie", "oppdargelse",
                 "motor", "mat", "gourmet", "leiehus", "ferie", "reisemål",
                 "hytte", "båt", "reise", "turområde", "middagsbord"] // bil, vin, tur
words['POL'] = ["minister", "kommunestyre", "regjering", "nasjonalbudsjett",
                "arbeiderpartiet", "partiprogram", "AUF", "departement",
                "statsbudsjettet", "statsråd", "storting", "partikollega",
                "frp", "krf", "fremskrittspartiet", "lovforslag", "kommunevalg",
                "fylkeskommune", "senterparti", "lokalpolitik", "politikk",
                "lokalvalg", "parlamentaris", "ordfører", "politiker",
                "politiske", "gruppeleder", "bystyre", "statssekret",
                "ministre", "partiene", "minist", "fylkesting", "valgdebatt",
                "partileder", "partiet", "folkeparti", "valgdeltakelse",
                "forhåndsstemmer", "rødgrønne", "borgerlige", "mandate",
                "valglokal", "valgdel", "stemmerett"]
words['KRIM'] = ["politiet", "blålys", "narko", "svindle", "svindel",
                 "skimming", "skyldig", "naske", "stjålet", "tyveri",
                "fengsel", "rettssak", "saksomkostning", "amfetamin",
                "etterforskning", "varetekt", "pågripels", "beslagla",
                "etterforske", "voldsavsnittet", "etterlyst", "vitnet",
                "advokat", "lagmannsrett", "tingrett", "PST", "straffesak",
                "overgrep", "tyven", "justismord", "drapsvåpen", "retten",
                "påtale", "kripos", "vitne", "tiltale", "stjele", "tyver",
                "kriminelle", "kriminell", "dommen", "politianmel",
                "høyesterett", "smugling", "ulovlig", "loven", "politidistrikt",
                "politim", "politij", "politia", "rettssystem", "voldtekt",
                "uaktsomhet", "bedrag", "drap", "politis", "krimin"]

$('.body p').each(function(){
    var ord = $(this).text();
    ord = ord.split(" ");
    // console.log(ord)
    for (var i = 0; i < ord.length; i++) {
        // http://stackoverflow.com/questions/7948689/using-js-jquery-to-do-string-search-fuzzy-matching
        for (k in words) {
            // console.log(k)
            fuzzymatches = $(words[k]).map(
                function(ii,v){
                    if(ord[i].toLowerCase().indexOf(v.toLowerCase())!=-1){
                        return v}}).get()
            // mark highlight words
            if ($.inArray(ord[i].toLowerCase(), words[k]) > -1) {
                ord[i] = '<span class="'+k.toLowerCase()+'">'+ord[i]+'</span>';
            } else if ($.isEmptyObject(fuzzymatches) == false && ord[i].length > 2) {
                console.log(fuzzymatches, ord[i], k)
                ord[i] = '<span class="'+k.toLowerCase()+'">'+ord[i]+'</span>';
            }
        }


        if (ord[i] == 'ođđasat' || ord[i].indexOf("š") > -1 || ord[i].indexOf("č") > -1
        || ord[i].indexOf("á") > -1 || ord[i].indexOf("đ") > -1|| ord[i].indexOf("ž") > -1) {
            ord[i] = '<span class="marker_sami">'+ord[i]+'</span>';
        }

    }
    $(this).html(ord.join(" "));
})

}); // end doc ready
