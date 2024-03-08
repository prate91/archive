const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

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
	"SELECT ?manuscript ?exp_cre ?authorName ?titleWork ?placeName ?library ?libraryName ?signature ?folios ?s_coordinates ?l_manuscript_author ?l_title ?l_incipit_dedication ?l_explicit_dedication ?l_incipit_text ?l_explicit_text ?l_date_manuscript ?l_sources ?l_url_manuscript ?l_url_manuscript_description ?l_notes ?l_decoration ?annotator ?timestamp " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"    BIND(<"+sectionName+"> AS ?manuscript)" +
	"    ?exp_cre ilrm:R18_created ?manuscript ." +
    "    ?exp_cre ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author ." +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?titleWork ." +
	"    ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"                ecrm:P50_has_current_keeper ?library ;" +
	"                ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ;" +
	"                :compiled_form ?annotator ;" +
	"                :last_mod_form ?timestamp ." +
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
	"      ?manifestation_creation ecrm:P4_has_time-span ?date_manuscript .					" +
	"      ?date_manuscript ecrm:P170i_time_is_defined_by ?l_date_manuscript ." +
	"  	}" +
	"  	OPTIONAL {" +
	"	?manuscript :has_secondary_source  ?l_sources ." +
	"    }" +
	"" +
	"    OPTIONAL {" +
	"      ?manuscript  :has_url_manuscript ?l_url_manuscript ." +
	"    }" +
    "   OPTIONAL {" +
	"      ?manuscript  :has_decoration ?l_decoration ." +
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
        var idManuscriptBread = document.getElementById("id-man-bread");
        var idLemmaBread = document.getElementById("id-lemma-bread");
        var authorSpan = document.getElementById("author");
        var workSpan = document.getElementById("work");
        var placeLibriarySpan = document.getElementById("place-libriary");
        var librarySpan = document.getElementById("library");
        var libraryA = document.getElementById("libraryUrl");
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
            try{titleOfWork = context.results.bindings[i].titleWork.value;} catch{ titleOfWork = "-"};
            try{authorOfWork = context.results.bindings[i].authorName.value;} catch{authorOfWork = "-"};
            try{expressionCreation = context.results.bindings[i].exp_cre.value;} catch{expressionCreation = "-"};
            try{title = context.results.bindings[i].l_title.value;} catch{ title = "-"};
            try{author = context.results.bindings[i].l_manuscript_author.value;} catch{author = "-"};
            try{placeLibriary = context.results.bindings[i].placeName.value;} catch{placeLibriary = "-"};
            try{library_iri = context.results.bindings[i].library.value;} catch{library_iri = "-"};
            try{library_name = context.results.bindings[i].libraryName.value;} catch{library = "-"};
            try{signature = context.results.bindings[i].signature.value;} catch{signature = "-"};
            try{folios = context.results.bindings[i].folios.value;} catch{folios = "-"};
            try{date_manuscript = context.results.bindings[i].l_date_manuscript.value;} catch{date_manuscript = "-"};
            try{incipit_dedication = context.results.bindings[i].l_incipit_dedication.value;} catch{incipit_dedication = "-"};
            try{explicit_dedication = context.results.bindings[i].l_explicit_dedication.value;} catch{explicit_dedication = "-"};
            try{incipit_text = context.results.bindings[i].l_incipit_text.value;} catch{incipit_text = "-"};
            try{explicit_text = context.results.bindings[i].l_explicit_text.value;} catch{explicit_text = "-"};
            try{decoration = context.results.bindings[i].l_decoration.value;} catch{decoration = "-"};
            try{
                sources = context.results.bindings[i].l_sources.value;
                var ulSources = document.createElement('ul');
                ulSources = linkifySources(sources);
                sources = ulSources;
                
            } catch{sources = "-"};
            try{
                
                url_manuscript = context.results.bindings[i].l_url_manuscript.value;
                if(url_manuscript!=""){
                    var a = document.createElement('a'); 
                    a.href = url_manuscript;
                    text = document.createTextNode(url_manuscript);
                    a.appendChild(text);
                    url_manuscript = a;
                }else{
                    url_manuscript="-";
                }
            } catch{url_manuscript = "-"};
            try{
                url_manuscript_description = context.results.bindings[i].l_url_manuscript_description.value;
                var a_description = document.createElement('a'); 
                a_description.href = url_manuscript_description;
                text_description = document.createTextNode(url_manuscript_description);
                a_description.appendChild(text_description);
                url_manuscript_description = a_description;
            } catch{url_manuscript_description = "-"};
            try{notes = context.results.bindings[i].l_notes.value;} catch{notes = "-"};
            try{user = context.results.bindings[i].annotator.value;} catch{notes = "-"};
            try{lastMod = context.results.bindings[i].timestamp.value;} catch{notes = "-"};

            idManuscript.textContent = placeLibriary + ", " + library_name + ", " + signature;
            idManuscriptBread.textContent = placeLibriary + ", " + library_name + ", " + signature;
            idLemmaBread.textContent = authorOfWork + ", " + titleOfWork;
            idLemmaBread.href = "lemma.html?lemma="+expressionCreation;
            authorSpan.textContent = author;
            if(author == ""){
                authorSpan.textContent = "-";
            } else{
                authorSpan.textContent = author;
            }
            if(title == ""){
                workSpan.textContent = "-";
            } else{
                workSpan.textContent = title;
            }
            if(placeLibriary == ""){
                placeLibriarySpan.textContent = "-";
            }else{
                placeLibriarySpan.textContent = placeLibriary;
            }
            if(library_name == ""){
                librarySpan.textContent = "-";
            }else{
                librarySpan.textContent = library_name;
            }
            if(signature == ""){
                signatureSpan.textContent = "-";
            }else{
                signatureSpan.textContent = signature;
            }
            if(folios == ""){
                foliosSpan.textContent = "-";
            }else{
                foliosSpan.textContent = folios;
            }
            if(date_manuscript == ""){
                datazioneSpan.textContent = "-";
            }else{
                datazioneSpan.textContent = date_manuscript;
            }
            if(incipit_dedication == ""){
                incipitDedSpan.textContent = "-";
            }else{
                incipitDedSpan.textContent = incipit_dedication;
            }
            if(explicit_dedication == ""){
                explicitDedSpan.textContent = "-";
            }else{
                explicitDedSpan.textContent = explicit_dedication;
            }
            if(incipit_text == ""){
                incipitTextSpan.textContent = "-";
            }else{
                incipitTextSpan.textContent = incipit_text;
            }
            if(explicit_text == ""){
                explicitTextSpan.textContent = "-";
            }else{
                explicitTextSpan.textContent = explicit_text;
            }
            if(decoration == ""){
                decorationSpan.textContent = "-";
            }else{
                decorationSpan.textContent = decoration;
            }
            if(url_manuscript == "-"){
                linkManSpan.textContent = url_manuscript;
            }else{
                linkManSpan.appendChild(url_manuscript);
            }
            if(url_manuscript_description == "-"){
                linkDescSpan.textContent = url_manuscript_description;
            }else{
                linkDescSpan.appendChild(url_manuscript_description);
            }
            if(sources == "-"){
                sourcesSpan.textContent = sources;
            }else{
                sourcesSpan.append(sources);
            }
            if(notes == ""){
                notesSpan.textContent = "-";
            }else{
                notesSpan.textContent = notes;
            }
            libraryA.href="library.html?library="+library_iri;
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


  
  