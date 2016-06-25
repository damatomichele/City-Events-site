//Test file javascript

//Collegamento al database e impostazione per salvataggio dati
var myDataRef= new Firebase('https://city-events.firebaseio.com/')
eventsRef= myDataRef.child("evento")			//Ramo child per gli eventi
commentsRef = myDataRef.child("commento")		//Ramo child per i commenti

//Funzioni per far scomparire gli alert dopo 3 secondi
function makeerrorhidden(){
	document.getElementById("msgerrore").style.visibility = "hidden";
}
function makesuccesshidden(){
	document.getElementById("msgsuccesso").style.visibility = "hidden";
}

function successloginhidden(){
	document.getElementById("successlogin").style.visibility = "hidden";
}

//Funzioni barra di ricerca
// 1) Creazione oggetto "ricerca"
function getSearch(){
	var searchObj = document.getElementById("barraricerca").value;
	//Cambia titolo del box
	titolobox = document.getElementById("pannellotitolo");
	titolobox.innerHTML = "Risultati della ricerca" ;

	  //Cancella contenuto barra di ricerca
	document.getElementById("barraricerca").value= ""
	
	//Cancella box esistenti
	$('#lastevents').text('');
	
	//console.log("Sono dentro la funzione")
	//console.log("Hai inserito: " + searchObj)
	
	//Se la città che ho cercato risulta in uno degli eventi del database, esegui la funzione per visualizzarli
	eventsRef.orderByChild("luogo").on("child_added", function(snapshot) {
	//Creo oggetti dei risultati
	var resobj = snapshot.val();
	resobj.key = snapshot.key();

	//Verifica acquisizione record da DB via console e avvio seeResults()
	if (resobj.luogo.toLowerCase() == searchObj.toLowerCase()) {
	  seeResults(resobj);
	  //Rendi cliccabili anche i risultati
	  updateTailList(resobj.key);

	  //console.log("Titolo ricerca: " + resobj.titolo);
	  //console.log("Luogo ricerca: " + resobj.luogo);
	  //console.log("Data ricerca: " + resobj.data);
	  //console.log("Descrizione ricerca: "+ resobj.descrizione);
	}
	});
}
// 2) Funzione che fa visualizzare i box di risultato
function seeResults(citta){
		$('#lastevents').append('<ul class="media-list"> <div id="'+citta.key+'" class="tailBox panel panel-danger text-center date evento"> <div class="panel-heading"> <p>'+citta.titolo+'</p> </div> <div class="panel-body media text-danger"> <li type="square">'+"Dove: " +citta.luogo+'</li> <li type="square">'+"Quando: " + citta.data +'</li> <li type="square">'+"Descrizione evento: " + citta.descrizione +'</li> </div> </div> </ul>' )

}

//Funzione che salva l'evento nel database
function savedata(oggetto){
	//Aggiungiamo evento al database (file JSON)
	eventsRef.push(oggetto)

	//Messaggio conferma
	document.getElementById("msgsuccesso").style.visibility = "visible";
	window.setTimeout("makesuccesshidden()", 3000);
}

//Funzione che legge il database e fa visualizzare gli eventi
function displayEvents(){
	//Cancella box esistenti
	$('#lastevents').text('');
	
	eventsRef.on("child_added", function(snapshot) {
	var newPost = snapshot.val();
	newPost.key = snapshot.key();
	
	//Chiamata alla funzione di stampa degli eventi
	addEvent(newPost)
	updateTailList(newPost.key);
	
	//Verifica acquisizione record da DB via console
	//console.log("Titolo: " + newPost.titolo);
	//console.log("Luogo: " + newPost.luogo);
	//console.log("Data: " + newPost.data);
	//console.log("Descrizione: "+ newPost.descrizione);
});
}

//Funzione che aggiunge l'evento al form "ultimi inseriti" (solo stampa)
function addEvent(snapshot){

	$('#lastevents').append('<ul class="media-list"> <div id="'+snapshot.key+'" class="tailBox panel panel-danger text-center date evento"> <div class="panel-heading"> <p>'+snapshot.titolo+'</p> </div> <div class="panel-body media text-danger"> <li type="square">'+"Dove: " +snapshot.luogo+'</li> <li type="square">'+"Quando: " + snapshot.data +'</li> <li type="square">'+"Descrizione evento: " + snapshot.descrizione +'</li> </div> </div> </ul>' )
}


//Controllo che tutti i campi del form siano compilati
function checkform(){
	var titolo=document.getElementById("titolo").value; //prendi il valore presente in titolo e salvalo nella variabile
	var luogo= document.getElementById("luogo").value;
	var data= document.getElementById("data").value;
	var descrizione=document.getElementById("descrizione").value;

	//Controllo acquisizione dati via console
	//console.log(titolo);
	//console.log(luogo);
	//console.log(data);
	//console.log(descrizione);
	
	//Controllo campi
	if ( titolo && luogo && data && descrizione ){
		//Creo una variabile/oggetto che contiene tutti i campi
		var obj = {
	    'titolo': titolo,
	    'luogo': luogo,
	    'data': data,
	    'descrizione': descrizione
	  }
	  //Passo l'oggetto alla funzione savedata()
		savedata(obj) ;

	} else{
		document.getElementById("msgerrore").style.visibility = "visible";
		window.setTimeout("makeerrorhidden()", 3000);
	}
}

//===========GESTIONE COMMENTI====================

//Variabili globali per gestire la pagina e il form commenti
var mainPage = $("#mainPage");
var scrollPosition;
var formComment = $("form#addComment");
var closeComment = $("#closeComment");
var commentsList = $("#commentList");
var commentEvent = $("#commentEvent");
var referenceComment = $("#referenceComment");
var tailBox;

//=============Interazione con la pagina===========================

// inserimento nuovo commento
formComment.submit(function(e) {
	e.preventDefault();
	var comment = commentEvent.text().trim();
	if(!isNullEmpty(comment)) {
		postComment(comment);
	}
});
// chiusura comment box
$(document).keyup(function(e) {
	// il keycode del tasto escape è 27
	if (e.keyCode == 27) {
        closeCommentBox();
    }
});
closeComment.click(function() {
	closeCommentBox();
});

// social network events
$("#viewFacebook").click(function(e) {
	e.preventDefault();
	
	if(!facebookIsLogged()) {
		myFacebookLogin();
	} else {
		facebookProfileInfo();
		facebookForm.show(100);
	}
});



// gestione click sulle tailbox
function updateTailList(id) {
	tailBox = $("div#"+id+".tailBox");

	// registrazione evento click per ogni tailbox rilevato -Tailbox cliccato
	tailBox.click(function() {
                console.log('Hai cliccato su un evento! ID: ' + id);
		this.setAttribute("style", "height: auto;");
		var el = this.outerHTML;
		this.removeAttribute("style");
		//var id = this.id;
		formComment.data("id", id);
		referenceComment.append(el);
		showCommentBox();
		getComments(id);
		commentEvent.focus();
	});
}

// creazione del box per i commenti
function createCommentBox(object, social) {
	var box = document.createElement("p");
	var comment = document.createElement("span");
	var b = document.createElement("b");
	var ret = document.createElement("br");
	if(isNullEmpty(object.sender)) object.sender = "Anonymous";
	if(isNullEmpty(object.message)) object.message = "Empty comment"; 
	var sender = document.createTextNode(object.sender);
	var message = document.createTextNode(object.message);
	b.appendChild(sender);
	comment.appendChild(b);
	comment.appendChild(ret);
	comment.appendChild(message);
	box.appendChild(comment);

	return box;
}

//pulizia della lista commenti
function clearCommentsList() {
	commentsList.text("");
}

// controllo se un dato è nullo o la stringa è vuota
function isNullEmpty(v) {
	return (!v || v == "");
}

// visualizzo div per visualizzazione/inserimento commenti
function showCommentBox() {
	scrollPosition = $(window).scrollTop();
	mainPage.addClass("displayNoneImportant");	
	$("#commentBox").removeClass("displayNoneImportant");
	$("body").scrollTop(0);
}
// nascondo div per visualizzazione/inserimento commenti
function closeCommentBox() {
	mainPage.removeClass("displayNoneImportant");
	$("#commentBox").addClass("displayNoneImportant");
	$("body").scrollTop(scrollPosition);
	formComment.data("id", 0);
	clearCommentsList();
	referenceComment.text("");
}

//postare un commento
function postComment(commentoevento) {
	var utente = null;
	//Controllo lo stato dell'utente, se Facebook o Anonimo
	if(facebookIsLogged()) {
		utente = sessionStorage.fbAN;
	} else{
		utente= "Anonimo";
	}
	//Creo l'oggetto del commento
	objcommento= {
		'idref': formComment.data("id"),
		'Utente': utente,
		'Commento': commentoevento,
	}
	//Controllo funzione
	console.log("Sto salvando il commento...");
	//Salvo nel database
	commentsRef.push(objcommento);
	//Pulisco il form d'inserimento dei commenti
	clearForm("addComment");
}

//Ricerca commenti relativi all'evento selezionato
function getComments(eventId){
	//Cancella box esistenti
	clearCommentsList();
	//test
	//console.log("sono dentro getComments");
	console.log("ID evento di cui devo cercare i commenti: " + eventId);

	commentsRef.orderByChild("idref").on("child_added", function(snapshot){
		var newComment = snapshot.val();
		//Controllo acquisizione oggetto
		console.log(newComment);
		//Condizione: se l'ID dell'evento corrisponde a quello del campo "idref", allora visualizzalo
		if(newComment.idref == eventId){

		showComments(newComment);

		}
	})
}

//Stampa i commenti
function showComments(comments){
	//console.log("sono dentro showComments ");

	$('#commentList').append('<div class="alert alert-info" role="alert"> <p><b>'+comments.Utente+'</b>' + " : " + comments.Commento+'</p> </div>')
}

// Eventi tasto Facebook
$("#viewFacebook").click(function(e) {
	e.preventDefault(); //Se il metodo viene chiamato, l'azione predefinita dell'evento non viene attivata
	if(!facebookIsLogged()) {
		myFacebookLogin();
	}
});

//Funzione per pulire
function clearForm(id) {
	var form = document.getElementById(id);
	var input = form.getElementsByTagName("input");
	var div = form.getElementsByClassName("description");
	for(var i = 0; i < input.length; i++) {
		input[i].value = "";
	}
	for(var i = 0; i < div.length; i++) {
		div[i].textContent = "";
	}
}

//Carica displayEvents al caricamento della pagina
window.onload = displayEvents();
