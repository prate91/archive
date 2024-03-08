const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

// Create urlParams query string
var urlParams = new URLSearchParams(window.location.search);

// Get value of single parameter
var sectionName = urlParams.get('printEdition');

// Output value to console
console.log(sectionName);

 
    // Set request headers
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');


    
    var search_prin =  "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT DISTINCT ?printEditionCreation ?printEdition ?exp_cre ?authorName ?titleWork ?l_author ?l_title ?l_curator ?l_place_print_edition ?l_coordinates ?l_place_name_as_appear ?l_date_print_edition ?l_publisher ?l_format ?l_pages ?l_figure ?l_notes ?l_prefatore ?l_edition ?l_date_edition ?l_primary_sources ?l_ecdotic ?l_sources ?l_other_contents ?annotator ?timestamp " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?printEdition) ." +
    "  ?printEdition ilrm:R4_embodies ?work ." +
    "  ?exp_cre ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author ." +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?titleWork ." +
	" ?printEdition :compiled_form ?annotator ;" +
	"               :last_mod_form ?timestamp ." +
	"  ?printEditionCreation ilrm:R24_created ?printEdition ." +
	"   OPTIONAL{ ?printEdition ecrm:P106_is_composed_of/ecrm:P190_has_symbolic_content ?l_author . }" +
	"   OPTIONAL{ ?printEdition ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?l_title . }" +
	"   OPTIONAL{ ?printEditionCreation :has_curator/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?l_curator . }" +
	"   OPTIONAL{ ?printEditionCreation ecrm:P7_took_place_at ?r_place_print_edition . }" +
	"   OPTIONAL{ ?r_place_print_edition :is_identified_by_toponym/ecrm:P190_has_symbolic_content ?l_place_print_edition . } " +
	"   OPTIONAL{ ?r_place_print_edition :P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?l_coordinates . }" +
	"   OPTIONAL{ ?printEdition :is_identified_in_the_printed_edition_by/ecrm:P190_has_symbolic_content ?l_place_name_as_appear . }" +
	"   OPTIONAL{ ?printEditionCreation ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?l_date_print_edition . }" +
	"   OPTIONAL{ ?printEditionCreation :has_publisher/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?l_publisher . }" +
	"   OPTIONAL{ ?printEdition ilrm:R69_has_physical_form/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?l_format . }" +
	"   OPTIONAL{ ?printEdition ecrm:P106_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?l_pages . }" +
	"   OPTIONAL{ ?printEdition :has_figure_note ?l_figure . }" +
	"   OPTIONAL{ ?printEdition ecrm:P3_has_note ?l_notes . }" +
	"   OPTIONAL{ ?printEdition :has_introduction_note ?l_prefatore . }" +
	"   OPTIONAL{ ?printEdition ecrm:P2_has_type/ecrm:P190_has_symbolic_content ?l_edition . }" +
	"   OPTIONAL{ ?printEdition :has_reprint_date ?l_date_edition . }" +
	"   OPTIONAL{ ?printEdition :has_primary_source ?l_primary_sources . }" +
	"   OPTIONAL{ ?printEdition :has_ecdotic_type/ecrm:P190_has_symbolic_content ?l_ecdotic . }" +
	"   OPTIONAL{ ?printEdition :has_secondary_source ?l_sources . }" +
	"   OPTIONAL{ ?printEdition :has_other_contents ?l_other_contents . }" +
	"}";

    

var query = url + encodeURIComponent(search_prin);

// Fetch current annotation
fetch(query,
    {
        method: 'GET',
        headers: headers,
        mode: 'cors' // questo forse va tolto se non si usa HTTPS?
    })
    .then((response) => {
        return response.json();
    })
    .then((context) => {
        /*
            Qui riceviamo il context in JSON, quindi possiamo
            prendere la variabile "data" e aggiornarla. Volendo si
            può fare la stessa cosa anche per la variabile "json"
            che contiene il JSON formattato
        */
        console.log(context.results);

        var idPrintEdition = document.getElementById("id-prin");
        var idPrintEditionBread = document.getElementById("id-prin-bread");
        var idLemmaBread = document.getElementById("id-lemma-bread");
        var authorSpan = document.getElementById("author");
        var workSpan = document.getElementById("work");
        var curatorSpan = document.getElementById("curator");
        var placeSpan = document.getElementById("place");
        var placeAsAppearSpan = document.getElementById("place-as-appear");
        var dataSpan = document.getElementById("datazione");
        var publisherSpan = document.getElementById("publisher");
        var formatSpan = document.getElementById("format");
        var pagesSpan = document.getElementById("pages");
        var illustrationSpan = document.getElementById("illustration");
        var notesSpan = document.getElementById("notes");
        var prefatorSpan = document.getElementById("prefator");
        var otherContentsSpan = document.getElementById("other-contents");
        var edition = document.getElementById("edition");
        var dateEdition = document.getElementById("date-edition");
        var primarySourcesSpan = document.getElementById("primary-sources");
        var ecdoticSpan = document.getElementById("ecdotic");
        var sourcesSpan = document.getElementById("sources");
        var userSpan = document.getElementById("user");
        var lastModSpan = document.getElementById("last-mod");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {
            try{titleOfWork = context.results.bindings[i].titleWork.value;} catch{ titleOfWork = "-"};
            try{authorOfWork = context.results.bindings[i].authorName.value;} catch{authorOfWork = "-"};
            try{expressionCreation = context.results.bindings[i].exp_cre.value;} catch{expressionCreation = "-"};
            title = context.results.bindings[i].l_title.value;
            author = context.results.bindings[i].l_author.value;
            curator = context.results.bindings[i].l_curator.value;
            place = context.results.bindings[i].l_place_print_edition.value;
            // coordinates = context.results.bindings[i].l_coordinates.value;
            placeAsAppear = context.results.bindings[i].l_place_name_as_appear.value;
            datazione = context.results.bindings[i].l_date_print_edition.value;
            publisher = context.results.bindings[i].l_publisher.value;
            format = context.results.bindings[i].l_format.value;
            pages = context.results.bindings[i].l_pages.value;
            figure = context.results.bindings[i].l_figure.value;
            notes = context.results.bindings[i].l_notes.value;

            prefatore = context.results.bindings[i].l_prefatore.value;
            otherContents = context.results.bindings[i].l_other_contents.value;
            edition_text = context.results.bindings[i].l_edition.value;
            console.log(edition);
            dateEdition_text = context.results.bindings[i].l_date_edition.value;
            primarySources = context.results.bindings[i].l_primary_sources.value;
            ecdotic = context.results.bindings[i].l_ecdotic.value;
            
            sources = context.results.bindings[i].l_sources.value;
            var ulSources = document.createElement('ul');
            ulSources = linkifySources(sources);
            sources = ulSources;
                
            user = context.results.bindings[i].annotator.value;
            lastMod = context.results.bindings[i].timestamp.value;

            idPrintEdition.textContent = place + ", " + publisher + ", " + datazione;
            idPrintEditionBread.textContent = place + ", " + publisher + ", " + datazione;
            idLemmaBread.textContent = authorOfWork + ", " + titleOfWork;
            idLemmaBread.href = "lemma.html?lemma="+expressionCreation;
            authorSpan.textContent = (author == "" || author == " ") ? "-" : author ;
            workSpan.textContent = (title == "" || title == " ") ? "-" : title ;
            curatorSpan.textContent = (curator == "" || curator == " ") ? "-" : curator ;
            placeSpan.textContent =(place == "" || place == " ") ? "-" : place ;
            // signatureSpan.textContent = coordinates;
            placeAsAppearSpan.textContent =(placeAsAppear == "" || placeAsAppear == " ") ? "-" : placeAsAppear ;
            dataSpan.textContent =(datazione == "" || datazione == " ") ? "-" : datazione ;
            publisherSpan.textContent =(publisher == "" || publisher == " ") ? "-" : publisher ;
            formatSpan.textContent =(format == "" || format == " ") ? "-" : format ;
            pagesSpan.textContent = (pages == "" || pages == " ") ? "-" : pages ;
            illustrationSpan.textContent = (figure == "" || figure == " ") ? "-" : figure ;
            notesSpan.textContent = (notes == "" || notes == " ") ? "-" : notes ;
            prefatorSpan.textContent = (prefatore == "" || prefatore == " ") ? "-" : prefatore ;
            otherContentsSpan.textContent =(otherContents == "" || otherContents == " ") ? "-" : otherContents ;
            edition.textContent = (edition_text == "" || edition_text == " ") ? "-" : edition_text ;
            dateEdition.textContent = (dateEdition_text == "" || dateEdition_text == " ") ? "-" : dateEdition_text ;
            primarySourcesSpan.textContent =(primarySources == "" || primarySources == " ") ? "-" : primarySources ;
            ecdoticSpan.textContent =(ecdotic == "" || ecdotic == " ") ? "-" : ecdotic ;
            if(sources == "-"){
                sourcesSpan.textContent = sources;
            }else{
                sourcesSpan.append(sources);
            }
            userSpan.textContent = user;
            const date = new Date(lastMod).toLocaleDateString('en-GB');
            lastModSpan.textContent = date;
            
            
         }
         
        //  document.getElementById("result").innerHTML=r ;
         

    })
    .catch((error) => {
        console.error('Error:', error);
    });


    

 

});

// function searchLemmas() {
//     document.getElementById("result").innerHTML="" ;
//     // document.getElementById("fname").style.backgroundColor = "red";
//     var x = document.getElementById("fauthor");
//     // x.value = x.value.toUpperCase();
//     console.log(x.value);

//     var y = document.getElementById("ftitle");
//     console.log(y.value);
//     // y.value = x.value.toUpperCase();
   

//   }


  
  