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
	"SELECT ?authorName ?date_author (group_concat(distinct ?alias;separator=\", \") as ?aliases) " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?author)" +
	"" +
	"  ?author a :Author ;" +
	"  ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ;" +
	"  ecrm:P1_is_identified_by/:has_alias ?alias ." +
    " OPTIONAL {" +
    "  ?author ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?date_author ." +
	"}" +
	"} GROUP BY ?authorName ?date_author";

    

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
        var authorNameSpan = document.getElementById("author");
        var datazioneSpan = document.getElementById("datazione");
        var aliasesSpan = document.getElementById("aliases");
       

        
        // var r = ""
        // var table = document.getElementById("results-table");
        // table.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {
            author = context.results.bindings[i].authorName.value;
            try{
            datazione = context.results.bindings[i].date_author.value;} catch { datazione = "-" }
            try{name_aliases = context.results.bindings[i].aliases.value;} catch{ name_aliases = "-"}

            idLemmaBread.textContent = author;
            authorNameSpan.textContent = author;
            datazioneSpan.textContent = datazione;
            aliasesSpan.textContent = name_aliases;
            
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
	"SELECT ?exp_cre ?title " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+sectionName+"> AS ?author)" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  :has_abstract ?abstract ;" +
	"  ilrm:R17_created ?work ;" +
	"  ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"  ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"" +
	"} ";

    

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
            iri_work = context.results.bindings[i].exp_cre.value;
            title = context.results.bindings[i].title.value;
            // places = context.results.bindings[i].places.value;


            li = document.createElement('li');
            li.className = "list-group-item";
            var a = document.createElement('a'); 
            a.href = "lemma.html?iri=" + iri_work;
            text = document.createTextNode(title);
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


  
  