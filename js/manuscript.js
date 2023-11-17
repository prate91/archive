const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

// Create urlParams query string
var urlParams = new URLSearchParams(window.location.search);

// Get value of single parameter
var sectionName = urlParams.get('manuscript');

// Output value to console
console.log(sectionName);

 
    // Set request headers
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');


    
    var search_man =  "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?manuscript ?placeName ?libraryName ?signature ?folios ?s_coordinates ?l_manuscript_author ?l_title ?l_incipit_dedication ?l_explicit_dedication ?l_incipit_text ?l_explicit_text ?l_date_manuscript ?l_sources ?l_url_manuscript ?l_url_manuscript_description ?l_notes " +
	"FROM <https://imagoarchive.it/fuseki/imago/archive>" +
	"WHERE {" +
	"    BIND(<"+sectionName+"> AS ?manuscript)" +
	"    ?exp_cre ilrm:R18_created ?manuscript ." +
	"    ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"                ecrm:P50_has_current_keeper ?library ;" +
	"                ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ." +
	"    ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  	?manifestation_creation ilrm:R24_created ?manifestation ." +
	"    ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"             ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"    ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"    ?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"    ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"    OPTIONAL{" +
	"      ?m_author ecrm:P106i_forms_part_of ?manifestation ;" +
	"                ecrm:P190_has_symbolic_content ?l_manuscript_author ." +
	"    }" +
	"    OPTIONAL{" +
	"      ?manuscript ecrm:P102_has_title ?m_title ." +
	"      ?m_title ecrm:P190_has_symbolic_content ?l_title ." +
	"    }" +
	"" +
	"    OPTIONAL{" +
	"		?incipitDedication :is_incipit_dedication_of ?manifestation ;" +
	"    			ecrm:P190_has_symbolic_content ?l_incipit_dedication ." +
	"    }" +
	"  	OPTIONAL{" +
	"		?explicitDedication :is_explicit_dedication_of ?manifestation ;" +
	"    			ecrm:P190_has_symbolic_content ?l_explicit_dedication ." +
	"    }" +
	" 	OPTIONAL{" +
	"		?incipitText :is_text_incipit_of ?manifestation ;" +
	"    			ecrm:P190_has_symbolic_content ?l_incipit_text ." +
	"    }" +
	"    OPTIONAL{" +
	"          ?explicitText :is_text_explicit_of ?manifestation ;" +
	"                  ecrm:P190_has_symbolic_content ?l_explicit_text ." +
	"      }" +
	"  	OPTIONAL{" +
	"      ?manifestation_creation ecrm:P4_has_time_span ?date_manuscript .					" +
	"      ?date_manuscript ecrm:P170i_time_is_defined_by ?l_date_manuscript ." +
	"  	}" +
	"  	OPTIONAL {" +
	"	?manuscript :has_secondary_sources  ?l_sources ." +
	"    }" +
	"" +
	"    OPTIONAL {" +
	"      ?manuscript  :has_url_manuscript ?l_url_manuscript ." +
	"    }" +
	"" +
	"    OPTIONAL {" +
	"      ?manuscript :has_url_manuscript_description ?l_url_manuscript_description ." +
	"    }" +
	"" +
	"    OPTIONAL {" +
	"      ?manuscript ecrm:P3_has_note ?l_notes ." +
	"  }" +
	"}"; 

    

var query = url + encodeURIComponent(search_man);

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

        var idManuscript = document.getElementById("id-man");
        var authorSpan = document.getElementById("author");
        var workSpan = document.getElementById("work");
        var placeLibriarySpan = document.getElementById("place-libriary");
        var librarySpan = document.getElementById("library");
        var signatureSpan = document.getElementById("signature");
        var foliosSpan = document.getElementById("folios");
        var datazioneSpan = document.getElementById("datazione");
        var incipitDedSpan = document.getElementById("incipit-ded");
        var explicitDedSpan = document.getElementById("explicit-ded");
        var incipitTextSpan = document.getElementById("incipit-text");
        var explicitTextSpan = document.getElementById("explicit-text");
        var decorationSpan = document.getElementById("decoration");
        var linkManSpan = document.getElementById("link-man");
        var linkDescSpan = document.getElementById("link-desc");
        var sourcesSpan = document.getElementById("sources");
        var notesSpan = document.getElementById("notes");
        var userSpan = document.getElementById("user");
        var lastModSpan = document.getElementById("last-mod");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {

            try{title = context.results.bindings[i].l_title.value;} catch{ title = ""};
            try{author = context.results.bindings[i].l_manuscript_author.value;} catch{author = ""};
            try{placeLibriary = context.results.bindings[i].placeName.value;} catch{placeLibriary = ""};
            try{library = context.results.bindings[i].libraryName.value;} catch{library = ""};
            try{signature = context.results.bindings[i].signature.value;} catch{signature = ""};
            try{folios = context.results.bindings[i].folios.value;} catch{folios = ""};
            try{date_manuscript = context.results.bindings[i].l_date_manuscript.value;} catch{date_manuscript = ""};
            try{incipit_dedication = context.results.bindings[i].l_incipit_dedication.value;} catch{incipit_dedication = ""};
            try{explicit_dedication = context.results.bindings[i].l_explicit_dedication.value;} catch{explicit_dedication = ""};
            try{incipit_text = context.results.bindings[i].l_incipit_text.value;} catch{incipit_text = ""};
            try{explicit_text = context.results.bindings[i].l_explicit_text.value;} catch{explicit_text = ""};
            // try{decoration = context.results.bindings[i].decoration.value;} catch{decoration = ""};
            try{sources = context.results.bindings[i].l_sources.value;} catch{sources = ""};
            try{url_manuscript = context.results.bindings[i].l_url_manuscript.value;} catch{url_manuscript = ""};
            try{url_manuscript_description = context.results.bindings[i].l_url_manuscript_description.value;} catch{url_manuscript_description = ""};
            try{notes = context.results.bindings[i].l_notes.value;} catch{notes = ""};

            idManuscript.textContent = placeLibriary + ", " + library + ", " + signature;
            authorSpan.textContent = author;
            workSpan.textContent = title;
            placeLibriarySpan.textContent = placeLibriary;
            librarySpan.textContent = library;
            signatureSpan.textContent = signature;
            foliosSpan.textContent = folios;
            datazioneSpan.textContent = date_manuscript;
            incipitDedSpan.textContent = incipit_dedication;
            explicitDedSpan.textContent = explicit_dedication;
            incipitTextSpan.textContent = incipit_text;
            explicitTextSpan.textContent = explicit_text;
            // decorationSpan.textContent = decoration;
            linkManSpan.textContent = url_manuscript;
            linkDescSpan.textContent = url_manuscript_description;
            sourcesSpan.textContent = sources;
            notesSpan.textContent = notes;
            // userSpan.textContent = user;
            // lastModSpan.textContent = lastMod;
            
            
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


  
  