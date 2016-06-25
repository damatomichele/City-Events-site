//Js per SDK Facebook
 // This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {

  // Il response object ritorna uno stato che ci dice lo stato stesso dell'utente, con le sue informazioni
  if (response.status === 'connected') {
    console.log('Recupero informazioni dopo richiesta login... ');
    FB.api('/me', function(response) {
      console.log('Login effettuato con successo da: ' + response.name);
      //document.getElementById('status').innerHTML =
        //'Congratulazioni, ' + response.name + ' hai effettuato correttamente il login!';

      facebookProfileInfo();
      sessionStorage.fbConnected = true;

        document.getElementById("successlogin").style.visibility = "visible";
    });
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Effettua il login ' + 'qui.';
  } else {
    // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
    //Caso in cui l'utente si è disconnesso da Facebook o non ha mai effettuato il login
    document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    sessionStorage.fbAN = "Anonimo";
    console.log("Attualmente sei un utente anonimo: "+ sessionStorage.fbAN);

    //Faccio sparire div "login success" se visibile
    successloginhidden();
  }

}

// Verifico lo stato di accesso
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function facebookIsLogged() {
  if(sessionStorage.fbConnected == "true") {
    return true;
  }
}

function myFacebookLogin() {
  var connected = false;
  FB.login(function(response){
    if(response.status == "connected") {
      facebookProfileInfo();
      sessionStorage.fbConnected = true;
    };
  }, {scope: 'publish_actions'});
}

//Informazioni utente
function facebookProfileInfo() {
console.log("hey sono qui")

  FB.api('/me', {"fields": ['link', 'name', 'picture']},function(response) {
    if(response && !response.error) {
      sessionStorage.fbAN = response.name;
      var profile = document.getElementById("connectedAccount");
      profile.setAttribute("href", response.link);
      profile.textContent = "";
      var profilePic = document.createElement("img");
      profilePic.setAttribute("style", "float: left;margin-right: 10px;");
      profilePic.setAttribute("class", "img-thumbnail");
      profilePic.setAttribute("src", response.picture.data.url);
      var profileInfo = document.createTextNode(response.name + " [Facebook]");
      profile.appendChild(profilePic);
      profile.appendChild(profileInfo);
    }
  });
};

//Facebook Logout
function fblogout() {
      FB.logout(function(response) {
          // user is now logged out
      });
}

window.fbAsyncInit = function() {
  FB.init({
    appId : '1178816938817767',
    cookie : true, // enable cookies to allow the server to access the session
    xfbml : true, // parse social plugins on this page
    version : 'v2.6' // use version 2.6
  });

  // Now that we've initialized the JavaScript SDK, we call FB.getLoginStatus(). 
  // This function gets the state of the person visiting this page.
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/it_IT/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));