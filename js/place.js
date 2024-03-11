const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

// Create urlParams query string
var urlParams = new URLSearchParams(window.location.search);

// Get value of single parameter
var sectionName = urlParams.get('place');

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
	"SELECT ?placeName ?s_coordinates " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?place)" +
	"   ?place :is_identified_by_toponym ?toponym ;" +
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
        var coordinatesSpan = document.getElementById("coordinates");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {
            place_name = context.results.bindings[i].placeName.value;
            try{
            coordinates = context.results.bindings[i].s_coordinates.value;
            }catch{ coordinates = "-"}

            idLemmaBread.textContent = place_name;
            placeNameSpan.textContent = place_name;
            coordinatesSpan.textContent = coordinates;
            
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
	"SELECT ?libraryName ?library " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?libraryPlace)" +
	"   ?library a :Library ;" +
	"            ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"} ORDER BY ?libraryName ";

    

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
        var manList = document.getElementById("libraries-list");
        // var work = document.getElementById("work");
        // var genresP = document.getElementById("genres");
        // var placesP = document.getElementById("places");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        if(context.results.bindings.length==0){
            text = document.createTextNode("nessuna biblioteca");
            manList.appendChild(text);
         }
        for (var i=0; i<context.results.bindings.length; i++) {
            library_iri = context.results.bindings[i].library.value;
            library_name = context.results.bindings[i].libraryName.value;


            li = document.createElement('li');
            li.className = "list-group-item";
            var a = document.createElement('a'); 
            a.href = "library.html?library=" + library_iri;
            text = document.createTextNode(library_name);
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



var search_work = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
"PREFIX : <https://imagoarchive.it/ontology/>" +
"SELECT ?exp_cre ?title ?authorName " +
"FROM <"+named_graph+">" +
"WHERE {" +
"  BIND(<"+sectionName+"> AS ?place)" +
"?exp_cre a ilrm:F28_Expression_Creation ;" +
"            :has_abstract ?abstract ;" +
"	  		 ilrm:R17_created ?work ;" +
"	  		 ecrm:P14_carried_out_by ?author .	" +
"	  ?author a :Author ;" +
"	     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
"	  ?work a ilrm:F2_Expression ;" +
"	  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
"    ?work ecrm:P106_is_composed_of ?toponym ." +
"    ?place :is_identified_by_toponym ?toponym ;" +
"           ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
"    ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
"	} GROUP BY ?exp_cre ?title ?author ?authorName ?abstract";



var query_man = url + encodeURIComponent(search_work);

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
    var workList = document.getElementById("toponyms-list");
    // var work = document.getElementById("work");
    // var genresP = document.getElementById("genres");
    // var placesP = document.getElementById("places");
   

    
    // var r = ""
    // var table = document.getElementById("results-table");
    // table.innerHTML="";
    if(context.results.bindings.length==0){
        text = document.createTextNode("questo luogo non è citato in nessuna opera");
        workList.appendChild(text);
     }
    for (var i=0; i<context.results.bindings.length; i++) {
        title = context.results.bindings[i].title.value;
        name_author = context.results.bindings[i].authorName.value;
        iri_work = context.results.bindings[i].exp_cre.value;


        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "lemma.html?lemma=" + iri_work;
        text = document.createTextNode(name_author + ", " + title);
        a.appendChild(text);
        li.appendChild(a);

        workList.appendChild(li);

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

var search_print = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?print_author ?print_edition ?print_title ?l_datazione ?placeName ?publisher " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?toponym)" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
   "  ?printEditionCreation ilrm:R24_created ?print_edition  ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"  ?print_edition ilrm:R4_embodies ?work ;" +
	" 				 ecrm:P106_is_composed_of/ecrm:P190_has_symbolic_content ?print_author ;" +
	"   				 ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?print_title ." +
	"  ?print_creation ilrm:R24_created ?print_edition ." +
   "  OPTIONAL{ ?printEditionCreation ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?l_datazione . }" +
	"                  OPTIONAL{" +
	"                 ?print_creation  :has_curator/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?curator ." +
	"  }" +
	"                     " +
	"                 ?print_creation  ecrm:P7_took_place_at ?toponym ." +
	"        ?toponym :is_identified_by_toponym/ecrm:P190_has_symbolic_content ?placeName ." +
	"  " +
	"                OPTIONAL{" +
	"                 ?print_creation :has_publisher/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?publisher ." +
	"  }" +
	"}";



var query_prin = url + encodeURIComponent(search_print);

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
    var printList = document.getElementById("print-list");
    // var work = document.getElementById("work");
    // var genresP = document.getElementById("genres");
    // var placesP = document.getElementById("places");
   

    
    // var r = ""
    // var table = document.getElementById("results-table");
    // table.innerHTML="";
    if(context.results.bindings.length==0){
        text = document.createTextNode("questo luogo non è il luogo di edizione di nessuna edizione a stampa");
        workList.appendChild(text);
     }
    for (var i=0; i<context.results.bindings.length; i++) {
        title = context.results.bindings[i].title.value;
        name_author = context.results.bindings[i].authorName.value;
        iri_work = context.results.bindings[i].exp_cre.value;


        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "lemma.html?lemma=" + iri_work;
        text = document.createTextNode(name_author + ", " + title);
        a.appendChild(text);
        li.appendChild(a);

        printList.appendChild(li);

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




  
  