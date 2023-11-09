const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

// Create urlParams query string
var urlParams = new URLSearchParams(window.location.search);

// Get value of single parameter
var sectionName = urlParams.get('lemma');

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
	"SELECT ?exp_cre ?title ?authorName (group_concat(distinct ?genreName;separator=\", \") as ?genres) (group_concat(distinct ?placeName;separator=\", \") as ?places) " +
	"FROM <https://imagoarchive.it/fuseki/imago/archive>" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?exp_cre)" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ;" +
	"  :has_genre ?genre ;" +
	"   ecrm:P106_is_composed_of ?toponym ." +
	"     ?place :is_identified_by_toponym ?toponym ;" +
	"    		 ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
	"      ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"  ?genre :has_genre_name ?genreName ." +
	"" +
	"} GROUP BY ?exp_cre ?title ?authorName";

    

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
        var authorName = document.getElementById("author");
        var work = document.getElementById("work");
        var genresP = document.getElementById("genres");
        var placesP = document.getElementById("places");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {
            title = context.results.bindings[i].title.value;
            author = context.results.bindings[i].authorName.value;
            genres = context.results.bindings[i].genres.value;
            places = context.results.bindings[i].places.value;

            authorName.textContent = author;
            work.textContent = title;
            genresP.textContent = genres;
            placesP.textContent = places;
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
	"FROM <https://imagoarchive.it/fuseki/imago/archive>" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?exp_cre)" +
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
	"}" +
	"  ";

    

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
        for (var i=0; i<context.results.bindings.length; i++) {
            place = context.results.bindings[i].placeName.value;
            library = context.results.bindings[i].libraryName.value;
            signatureName = context.results.bindings[i].signature.value;
            // places = context.results.bindings[i].places.value;

            li = document.createElement('li');
            li.className = "list-group-item";
            li.textContent = place + ", " + library + ", " + signatureName;

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


var search_prin = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
"PREFIX : <https://imagoarchive.it/ontology/>" +
"SELECT ?print_author ?print_title ?curator ?placeName ?publisher " +
"FROM <https://imagoarchive.it/fuseki/imago/archive>" +
"WHERE {" +
"  BIND(<"+sectionName+"> AS ?exp_cre)" +
"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
"  		 ilrm:R17_created ?work ;" +
"  		 ecrm:P14_carried_out_by ?author .	" +
"  ?author a :Author ;" +
"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
"  ?work a ilrm:F2_Expression ;" +
"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
"  ?print_edition ilrm:R4_embodies ?work ;" +
" 				 ecrm:P106_is_composed_of/ecrm:P190_has_symbolic_content ?print_author ;" +
"   				 ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?print_title ." +
"  ?print_creation ilrm:R24_created ?print_edition ." +
"                  OPTIONAL{" +
"                 ?print_creation  :has_curator/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?curator ." +
"  }" +
"                      OPTIONAL{" +
"                 ?print_creation  ecrm:P7_took_place_at/:is_identified_by_toponym/ecrm:P190_has_symbolic_content ?placeName ." +
"  }" +
"                OPTIONAL{" +
"                 ?print_creation :has_publisher/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?publisher ." +
"  }" +
"}";



var query_prin = url + encodeURIComponent(search_prin);

// Fetch current annotation
fetch(query_prin,
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
    var prinList = document.getElementById("print-list");
    // var work = document.getElementById("work");
    // var genresP = document.getElementById("genres");
    // var placesP = document.getElementById("places");
   

    
    // var r = ""
    // var table = document.getElementById("results-table");
    // table.innerHTML="";
    console.log(context.results.bindings);
    for (var i=0; i<context.results.bindings.length; i++) {
        try{author = context.results.bindings[i].print_author.value;} catch{ author = ""}
        try{title = context.results.bindings[i].print_title.value;} catch{ title = ""}
        try{place = context.results.bindings[i].placeName.value;} catch{ place = ""}
        try{publisherName = context.results.bindings[i].publisher.value;} catch{ publisherName = ""}
        try{curatorName = context.results.bindings[i].curator.value;} catch{ curatorName = ""}
        // places = context.results.bindings[i].places.value;

        li = document.createElement('li');
        li.className = "list-group-item";
        li.textContent = author + " . " + title + " . " + curatorName + " . " + publisherName + " . " + place    ;

        prinList.appendChild(li);

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


  
  