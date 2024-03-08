const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {
    

    // document.getElementById("A").addEventListener("click", myFunction);
    let paginator = document.getElementsByClassName("page-link");
    for (var i = 0; i < paginator.length; i++) {
        let letter = paginator[i].textContent;
        // console.log(paginator[i])
		paginator[i].addEventListener("click", function () {
            // Declare variables
                var filter, table, tr, td, i, txtValue;
                filter = letter.toUpperCase();
                table = document.getElementById("myTable");
                tr = table.getElementsByTagName("tr");
            
                // Loop through all table rows, and hide those who don't match the search query
                for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[1];
                if (td) {
                    // txtValue = td.textContent || td.innerText;
                    txtValue = td.textContent.trim().charAt(0).toUpperCase();
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    } else {
                    tr[i].style.display = "none";
                    }
                }
                }

        });
    }
    

// document.getElementById("fauthor").addEventListener("keyup", searchLemmas);

// document.getElementById("ftitle").addEventListener("keyup", searchLemmas);
let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var search_query =  "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?libraryName ?library ?placeName " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"" +
	"   ?library a :Library ;" +
	"            ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"} ORDER BY ?libraryName ?placeName ";
   
      
    
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

            var list = document.getElementById("results-list-genres");

            var table = document.getElementById("myTableBody");

            // var pagin = document.getElementById("myPager");
          
            // pagin.innerHTML = "";
            table.innerHTML = "";
         
            console.log(table);
            // console.log(list);
            // list.innerHTML = "";
            // var tr = document.createElement('tr');   

            //     var th1 = document.createElement('th');
            //     var th2 = document.createElement('th');
            //     // var th3 = document.createElement('th');
            
            //     var text1 = document.createTextNode('Autore');
            //     var text2 = document.createTextNode('Opera');

            //     th1.appendChild(text1);
            //     // th1.appendChild(addIconArrows());
            //     th2.appendChild(text2);
            //     // th2.appendChild(addIconArrows());

            //     tr.appendChild(th1);
            //     tr.appendChild(th2);
            
            //     table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                

                place_name = context.results.bindings[i].placeName.value;
                library_iri = context.results.bindings[i].library.value;
                library_name = context.results.bindings[i].libraryName.value;


                li = document.createElement('li');
                li.className = "list-group-item";
                var a = document.createElement('a'); 
                a.href = "library.html?library=" + library_iri;
                text = document.createTextNode(library_name);
                d = document.createTextNode(place_name);
                c = document.createTextNode(String(i+1));
                a.appendChild(text);
               

                
                tr = document.createElement('tr');
                td_count = document.createElement('td');
                td_name = document.createElement('td');
                td_date = document.createElement('td');
                td_count.appendChild(c);
                td_name.appendChild(a);
                td_date.appendChild(d);
                tr.appendChild(td_count);
                tr.appendChild(td_name);
                tr.appendChild(td_date);
                table.appendChild(tr);

                
    
            }
        
            // $('#myTableBody').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:40,maxPageNumbers:10});
        

        })
        .catch((error) => {
            console.error('Error:', error);
        });

       

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
	"SELECT ?exp_cre ?title ?authorName ?alias " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ;" +
	"     ecrm:P1_is_identified_by/:has_alias ?alias ." +
	"  ?work a ilrm:F2_Expression ;" +
	"     ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"  FILTER regex(?title, \""+y.value+"\",\"i\") " +
	"  FILTER (regex(?authorName, \""+x.value+"\", \"i\") || regex(?alias, \""+x.value+"\", \"i\")) " +
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
        console.log(context.results.bindings);
        old_iri_lemma = "";
        for (var i=0; i<context.results.bindings.length; i++) {
            title = context.results.bindings[i].title.value;
            author = context.results.bindings[i].authorName.value;
            alias = context.results.bindings[i].alias.value;
            iri_lemma = context.results.bindings[i].exp_cre.value;
            // if(old_iri_lemma == iri_lemma){
            //     listaalias

            // }
            if(old_iri_lemma != iri_lemma){
            alias_list = ""
            // r += author + " - " + title +"<br>";
            var li = document.createElement('li');   
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            var div1 = document.createElement('div');
            div1.className = 'ms-2 me-auto';
            var div2 = document.createElement('div');
            div2.className = "markcontext"
            var a = document.createElement('a'); 
            a.href = "lemma.html?lemma=" + iri_lemma;
            a.className = "markcontextwork"
            var spanAlias = document.createElement('small');   
            spanAlias.className = 'text-muted';
        
            var text1 = document.createTextNode(author);
            var text2 =  document.createTextNode(" aliases: " + alias);
            var text3 = document.createTextNode(title);
            
            
            
            spanAlias.appendChild(text2);
            a.appendChild(text3);
            div2.appendChild(text1);
            div2.appendChild(document.createElement('br'));
            div2.appendChild(spanAlias);
            div1.appendChild(div2);
            div1.appendChild(a);
            li.appendChild(div1);
        
            list.appendChild(li);

            old_iri_lemma = iri_lemma;
            }
          
           
            
           
            
         }
         var markInstance = new Mark(document.querySelectorAll(".markcontext"));
         var markInstancework = new Mark(document.querySelectorAll(".markcontextwork"));
         markInstance.mark(x.value);
         markInstancework.mark(y.value);
           
        //  document.getElementById("result").innerHTML=r ;
         

    })
    .catch((error) => {
        console.error('Error:', error);
    });


  }
  
  function filterAlphabet(letter) {
    // Declare variables
    var filter, table, tr, td, i, txtValue;
    filter = letter.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  
  