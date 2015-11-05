$(document).ready(function () {

var words = new Array();

words['OKO'] = ["ledelse", "kroner", "lønn", "finans",
               "bedrift", "børs", "industri", "prosent",
               "virksomhet", "selskapet", "inntekt",
               "brutto", "netto", "underskudd", "kvartalet",
               "resultat", "konsern", "næringsliv", "rik",
               "bank", "pris", "handel", "selskap", "transaksjon",
           "konkurs", "ASA", "Holding", "hovedindeksen", "kursfall"]

words['SPO'] = ["fortball", "mål", "skåring", "keeper", "omgang", "skade",
                "trener", "kamp", "laget", "skår", "EM", "VM", "OL", "ball"]

$('.body p').each(function(){
    var ord = $(this).text();
    ord = ord.split(" ");
    // console.log(ord)
    for (var i = 0; i < ord.length; i++) {
        // http://stackoverflow.com/questions/7948689/using-js-jquery-to-do-string-search-fuzzy-matching
        for (k in words) {
            console.log(k)
            fuzzymatches = $(words[k]).map(
                function(ii,v){
                    if(ord[i].toLowerCase().indexOf(v.toLowerCase())!=-1){
                        return v}}).get()
            // mark highlight words
            if ($.inArray(ord[i].toLowerCase(), words[k]) > -1) {
                ord[i] = '<span class="'+k.toLowerCase()+'">'+ord[i]+'</span>';
            } else if ($.isEmptyObject(fuzzymatches) == false && ord[i].length > 2) {
                console.log(fuzzymatches, ord[i])
                ord[i] = '<span class="'+k.toLowerCase()+'">'+ord[i]+'</span>';
            }
        }
        // Sport


        if (ord[i] == 'ođđasat' || ord[i].indexOf("š") > -1 || ord[i].indexOf("č") > -1
        || ord[i].indexOf("á") > -1 || ord[i].indexOf("đ") > -1|| ord[i].indexOf("ž") > -1) {
            ord[i] = '<span class="marker_sami">'+ord[i]+'</span>';
        }

    }
    $(this).html(ord.join(" "));
})

}); // end doc ready
