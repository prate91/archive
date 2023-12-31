const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {
    
    

document.getElementById("fauthor").addEventListener("keyup", searchLemmas);

document.getElementById("ftitle").addEventListener("keyup", searchLemmas);

});

function searchLemmas() {
    // document.getElementById("results-list").innerHTML="" ;
    // document.getElementById("fname").style.backgroundColor = "red";
    var x = document.getElementById("fauthor");
    // x.value = x.value.toUpperCase();
    console.log(x.value);

    var y = document.getElementById("ftitle");
    console.log(y.value);
    // y.value = x.value.toUpperCase();
    
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
	"SELECT ?exp_cre ?title ?authorName " +
	"FROM <https://imagoarchive.it/fuseki/imago/archive>" +
	"WHERE {" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"     ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"  FILTER regex(?title, \""+y.value+"\",\"i\") " +
	"  FILTER regex(?authorName, \""+x.value+"\", \"i\") " +
	"} ORDER BY ?authorName ?title ";

    

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

        var r = ""
        var list = document.getElementById("results-list");
        list.innerHTML="";
        for (var i=0; i<context.results.bindings.length; i++) {
            title = context.results.bindings[i].title.value;
            author = context.results.bindings[i].authorName.value;
            iri_lemma = context.results.bindings[i].exp_cre.value;
            // r += author + " - " + title +"<br>";
            var li = document.createElement('li');   
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            var div1 = document.createElement('div');
            div1.className = 'ms-2 me-auto';
            var div2 = document.createElement('div');
            var a = document.createElement('a'); 
            a.href = "lemma.html?lemma=" + iri_lemma;
        
            var text1 = document.createTextNode(author);
            var text2 = document.createTextNode(title);
        
            a.appendChild(text2);
            div2.appendChild(text1);
            div1.appendChild(div2);
            div1.appendChild(a);
            li.appendChild(div1);
        
            list.appendChild(li);
           
            
         }
         
        //  document.getElementById("result").innerHTML=r ;
         

    })
    .catch((error) => {
        console.error('Error:', error);
    });


  }


  
  