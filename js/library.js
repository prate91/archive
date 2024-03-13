const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

// Create urlParams query string
var urlParams = new URLSearchParams(window.location.search);

// Get value of single parameter
var sectionName = urlParams.get('iri');

// Output value to console
console.log(sectionName);

 
    // Set request headers
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');


    var search_query = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?libraryName ?libraryPlace ?placeName " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?library)" +
	"" +
	"   ?library a :Library ;" +
	"            ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"}";

    

var query = url + encodeURIComponent(search_query);

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
        // document.getElementById("result").innerHTML=context.results;
        var idLemmaBread = document.getElementById("id-lemma-bread");
        var placeNameSpan = document.getElementById("place");
        var librarySpan = document.getElementById("library");
        var placeA = document.getElementById("placeUrl");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {
            place_name = context.results.bindings[i].placeName.value;
            libraryPlace_iri = context.results.bindings[i].libraryPlace.value;
            library_name = context.results.bindings[i].libraryName.value;

            idLemmaBread.textContent = library_name;
            placeNameSpan.textContent = place_name;
            librarySpan.textContent = library_name;
            placeA.href = "place.html?iri=" + libraryPlace_iri;
            
            // r += author + " - " + title +"<br>";
            // var tr = document.createElement('tr');   

            // var td1 = document.createElement('td');
            // var td2 = document.createElement('td');
        
            // var text1 = document.createTextNode(author);
            // var text2 = document.createTextNode(title);
        
            // td1.appendChild(text1);
            // td2.appendChild(text2);
            // tr.appendChild(td1);
            // tr.appendChild(td2);
        
            // table.appendChild(tr);
           
            
         }
         
        //  document.getElementById("result").innerHTML=r ;
         

    })
    .catch((error) => {
        console.error('Error:', error);
    });


    

    var search_man = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?manuscript ?placeName ?libraryName ?signature ?folios ?s_coordinates ?l_manuscript_author ?l_m_title " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?library)" +
	"  ?exp_cre ilrm:R18_created ?manuscript ." +
	"  ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"              ecrm:P50_has_current_keeper ?library ;" +
	"              ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ." +
	"  ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"  OPTIONAL{" +
	"  ?m_author ecrm:P106i_forms_part_of ?manifestation ;" +
	"				ecrm:P190_has_symbolic_content ?l_manuscript_author ." +
	"  }" +
	"  OPTIONAL{" +
	"  ?manuscript ecrm:P102_has_title ?m_title ." +
	"  ?m_title ecrm:P190_has_symbolic_content ?l_m_title ." +
	"  }" +
	"  " +
	"} ORDER BY ?placeName ?libraryName ?signature" ;

    

var query_man = url + encodeURIComponent(search_man);

// Fetch current annotation
fetch(query_man,
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
        // document.getElementById("result").innerHTML=context.results;
        var manList = document.getElementById("manuscript-list");
        // var work = document.getElementById("work");
        // var genresP = document.getElementById("genres");
        // var placesP = document.getElementById("places");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        if(context.results.bindings.length==0){
            text = document.createTextNode("nessuna opera");
            manList.appendChild(text);
         }
        for (var i=0; i<context.results.bindings.length; i++) {
            iri_manuscript = context.results.bindings[i].manuscript.value;
            place = context.results.bindings[i].placeName.value;
            library = context.results.bindings[i].libraryName.value;
            signatureName = context.results.bindings[i].signature.value;
            foliosName = context.results.bindings[i].folios.value;


            li = document.createElement('li');
            li.className = "list-group-item";
            var a = document.createElement('a'); 
            a.href = "manuscript.html?iri=" + iri_manuscript;
            if(foliosName!=""){
                text = document.createTextNode(place + ", " + library + ", " + signatureName + ", " + foliosName);
            } else {
                text = document.createTextNode(place + ", " + library + ", " + signatureName);
            }
            a.appendChild(text);
            li.appendChild(a);

            manList.appendChild(li);

            // authorName.textContent = author;
            // work.textContent = title;
            // genresP.textContent = genres;
            // placesP.textContent = places;
            // r += author + " - " + title +"<br>";
            // var tr = document.createElement('tr');   

            // var td1 = document.createElement('td');
            // var td2 = document.createElement('td');
        
            // var text1 = document.createTextNode(author);
            // var text2 = document.createTextNode(title);
        
            // td1.appendChild(text1);
            // td2.appendChild(text2);
            // tr.appendChild(td1);
            // tr.appendChild(td2);
        
            // table.appendChild(tr);
           
            
         }

         
         
        //  document.getElementById("result").innerHTML=r ;
         

    })
    .catch((error) => {
        console.error('Error:', error);
    });


// document.getElementById("fauthor").addEventListener("keyup", searchLemmas);

// document.getElementById("ftitle").addEventListener("keyup", searchLemmas);


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


  
  