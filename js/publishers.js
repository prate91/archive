const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";


document.addEventListener('DOMContentLoaded', function () {
   // var json = []
   // console.log(data);


let headers = new Headers();
//headers.append('X-CSRFToken', csrf);
headers.append('X-Requested-With', 'XMLHttpRequest');
 

var get_works = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
"PREFIX : <https://imagoarchive.it/ontology/>" +
"SELECT DISTINCT ?place ?coord ?placeName " +
"FROM <"+named_graph+">" +
"WHERE {" +
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
"                  " +
"                 ?print_creation  ecrm:P7_took_place_at ?place ." +
"?place :is_identified_by_toponym ?toponym ;" +
"ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
"?toponym ecrm:P190_has_symbolic_content ?placeName ." +
"}";
                  
                 
var query = url + encodeURIComponent(get_works);
console.log(query);

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
         data = context.results.bindings;
         console.log(data);
          //init leaflet  map
      var map = new L.Map('map');  
      
      map.addControl(new L.Control.Fullscreen());                     
             
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
         maxZoom: 18
      }).addTo(map);
      var italy = new L.LatLng(42.504154,15.646361); 
      map.setView(italy, 4);
     
     
     
     
     var mcg = L.markerClusterGroup();
     
     // Position markers
     for(let key in data){
         
         // var occurrences = data[key].n_occ.value;
         // if(data[key].occDeVulgari != 0 && data[key].work.name == "De Vulgari Eloquentia") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occDeVulgari	+ "</br>"
         // }
         // if(data[key].occEgloge != 0 && data[key].work.name == "Egloge") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occEgloge + "</br>"	
         // }
         // if(data[key].occEpistole != 0 && data[key].work.name == "Epistole") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occEpistole + "</br>"	
         // }
         // if(data[key].occMonarchia != 0 && data[key].work.name == "Monarchia") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occMonarchia + "</br>"	
         // }
         // if(data[key].occQuestio != 0 && data[key].work.name == "Questio de Aqua et Terra") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occQuestio + "</br>"	
         // }

         // console.log(data[key])
         if(data[key].coord.value!=""){
            // if(data[key].coord.value!="POINT(null null)"){
              console.log(data[key].coord.value);
                 
               //   if(data[key].pleiades != null ){
               //       var pleiades= "<br/> <a target='a_blank' href='"+data[key].pleiades.value+"'>Pleiades</a>"
               //   } else {
               //       var pleiades=""
               //   }
                 
                 
               //   context = data[key].text.value;
               //   var tempDiv = document.createElement('div');
               //   tempDiv.innerHTML = context;
               //   el = tempDiv.getElementsByTagName("i");
               //   var form = "";
               //   if(el.length>1){

               //    form = el[0].textContent + " " + el[1].textContent;
               //   }else{
               //   form = el[0].textContent;
               //   }

                 
                 //color marker (from repository ghit. Colored if a region, else is blue
                 
               //   if(data[key].label.value== "Europa" || data[key].label.value== "Ystria" || data[key].label.value== "Tuscia" || data[key].label.value== "Asya" || data[key].label.value== "Ausonia" || data[key].label.value== "Hesperia" || data[key].label.value== "Ytalia" || data[key].label.value== "Ytali" || data[key].label.value== "Latini" || data[key].label.value== "Emilis" || data[key].label.value== "Sardinia" || data[key].label.value== "Latium" || data[key].label.value== "Apulia" || data[key].label.value== "Sicilia" || data[key].label.value== "Trinacria" || data[key].label.value== "Trinacris" || data[key].label.value== "Marchia Ianuensis" || data[key].label.value== "Egiptus" || data[key].label.value== "Lybia" || data[key].label.value== "Libies" || data[key].label.value== "Affrica" || data[key].label.value== "Anglia" || data[key].label.value== "Lombardia" || data[key].label.value== "Marchia Trivisiana" || data[key].label.value== "Marchia (Trivisiana)"){
                 
                     var greenIcon = new L.Icon({
                       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                       iconSize: [25, 41],
                       iconAnchor: [12, 41],
                       popupAnchor: [1, -34],
                       shadowSize: [41, 41]
                     
                     });
               //   } else {
                 
               //         var greenIcon = new L.Icon({
               //         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
               //         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
               //         iconSize: [25, 41],
               //         iconAnchor: [12, 41],
               //         popupAnchor: [1, -34],
               //         shadowSize: [41, 41]
               //        }); 
 
                 
                 
               //   }
         
               // console.log(data[key].coord.value) 
               var coord = parseWKT(data[key].coord.value);
               
               
                var mark= L.marker([coord[2],coord[1]], {icon: greenIcon}).bindPopup("<div style='font-size:14px;'><br />Luogo: <b>"+ data[key].placeName.value +"</b><br/><br/>"+ "<button type='button' class='btn btn-sm btn-primary show-manuscript' data-iri='"+data[key].place.value+"' onclick='showManuscripts(this)'>Mostra opere</button> </div> ").addTo(mcg) // Add into the MCG instead of directly to the map.
                
               

               
                
              
 
         
         }
         
     
   }
     mcg.addTo(map);
        
          // Get the array of citations accordion buttons
          var btn_show_manuscripts = document.getElementsByClassName("show-manuscript"); 
          console.log(btn_show_manuscripts);
             
          // Add the onclick event to citations accordion that show or hide the citations
          for (var i = 0; i < btn_show_manuscripts.length; i++) {
             console.log(data_iri)
             
             btn_show_manuscripts[i].addEventListener("click", showManuscripts(data_iri));
             console.log(data_iri);
             console.log(btn_show_manuscripts[i]);
          }

      })
      .catch((error) => {
         console.error('Error:', error);
      });
    });

    function parseWKT(string){
      // let text = '27 months';
      let regex = /Point\((?<longitude>-?\d+\.\d+) (?<latitude>-?\d+\.\d+)\)/;
      return [longitude, latitudeunit] = regex.exec(string) || [];
    
  }

  function onEachFeature(feature, layer) {
   // does this feature have a property named popupContent?
   // console.log(feature.properties)
   if (feature.properties) {
       layer.bindPopup(feature.properties.LAU_NAME);
   }
}


function showManuscripts(btn_manuscripts) {

   var data_iri=btn_manuscripts.getAttribute('data-iri');
   console.log(data_iri);
   
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
	"SELECT ?print_author ?print_edition ?print_title ?l_datazione ?placeName ?publisher " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+data_iri+"> AS ?toponym)" +
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
       var printList = document.getElementById("print-list");
       printList.innerHTML="";

       
       for (var i=0; i<context.results.bindings.length; i++) {
         
         iri_print_edition = context.results.bindings[i].print_edition.value;
         place = context.results.bindings[i].placeName.value;
         publisher = context.results.bindings[i].publisher.value;
         datazione = context.results.bindings[i].l_datazione.value;
         // places = context.results.bindings[i].places.value;


         li = document.createElement('li');
         li.className = "list-group-item";
         var a = document.createElement('a'); 
         a.href = "printEdition.html?printEdition=" + iri_print_edition;
         text = document.createTextNode(place + ", " + publisher + ", " + datazione);
         a.appendChild(text);
         li.appendChild(a);

         printList.appendChild(li);

         //   title = context.results.bindings[i].print_title.value;
         //   author = context.results.bindings[i].print_author.value;
         //   curator = context.results.bindings[i].curator.value;
         //   publisher = context.results.bindings[i].publisher.value;
         //   placeName = context.results.bindings[i].placeName.value;
         //   // r += author + " - " + title +"<br>";
         //   var tr = document.createElement('tr');   

         //   var td1 = document.createElement('td');
         //   var td2 = document.createElement('td');
         //   var td3 = document.createElement('td');
         //   var td4 = document.createElement('td');
         //   var td5 = document.createElement('td');
       
         //   var text1 = document.createTextNode(author);
         //   var text2 = document.createTextNode(title);
         //   var text3 = document.createTextNode(curator);
         //   var text4 = document.createTextNode(publisher);
         //   var text5 = document.createTextNode(placeName);
       
         //   td1.appendChild(text1);
         //   td2.appendChild(text2);
         //   td3.appendChild(text3);
         //   td4.appendChild(text4);
         //   td5.appendChild(text5);
         //   tr.appendChild(td1);
         //   tr.appendChild(td2);
         //   tr.appendChild(td3);
         //   tr.appendChild(td4);
         //   tr.appendChild(td5);
       
         //   table.appendChild(tr);
          
           
        }
        printList.scrollIntoView();
        
       //  document.getElementById("result").innerHTML=r ;
        

   })
   .catch((error) => {
       console.error('Error:', error);
   });


 }