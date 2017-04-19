carbonListApp.controller('FirebaseCtrl', function ($scope, $http, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {

// $controller("SearchCtrl", {$scope: $scope});
$scope.auth = FirebaseAccount.Auth();


  $scope.signOut = function () {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    window.location = '#!/login';

  }, function(error) {
    console.error('Sign Out Error', error);
  });
}

$scope.signInWithFacebook = function () {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithRedirect(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

}


  $scope.signIn = function() {
    $scope.firebaseUser = null;
    $scope.error = null;

    $scope.auth.$signInAnonymously().then(function(firebaseUser) {
      $scope.firebaseUser = firebaseUser;

    }).catch(function(error) {
      $scope.error = error;
    });
  };


  $scope.createUser = function(email, password, passwordCheck) {
       $scope.message = null;
       $scope.error = null;
      //  $scope.sweAPIinfoError = null;

       // Create a new user
       if (password !== passwordCheck) {
         $scope.error = "Error: The passwords were not identical.";
       }
       else{

       $scope.auth.$createUserWithEmailAndPassword(email, password)
         .then(function(firebaseUser) {

           $scope.message = "User created with uid: " + firebaseUser.uid;
         }).catch(function(error) {

           $scope.error = error;
          //  $scope.sweAPIinfoError = "Oj, något gick fel! Kontrollera dina uppgifter.";
         });
       }
     };

     $scope.signInWithEmail = function(email, password) {
          $scope.message = null;
          $scope.error = null;
          // $scope.sweAPIinfoError = null;

          // Create a new user
          $scope.auth.$signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {

              $scope.message = "User created with uid: " + firebaseUser.uid;
            }).catch(function(error) {

              $scope.error = error;
              // $scope.sweAPIinfoError = "Oj, något gick fel! Kontrollera dina uppgifter.";
            });
        };


     // any time auth state changes, add the user data to scope
     $scope.auth.$onAuthStateChanged(function(firebaseUser) {
      //  Preventing the Firebase bug, that onAuthState runs twice.
      console.log("firebaseUser")
      console.log(firebaseUser)
       var referenceUserID = Carbon.getFirebaseUserUID();
       if (firebaseUser == null || referenceUserID != firebaseUser.uid) {
          $scope.firebaseUser = firebaseUser;
          Carbon.setFirebaseUser(firebaseUser);
          Carbon.init();
          if(firebaseUser) {
            // window.location = '#!/login'; //After successful login, user will be redirected to home.html
            window.location = '#!/search';
          }
          // else{
          // OMG HÄR KAN DU HA if $location != login or register, window.location = "login"!! SHIIITT
          // }
        }
        });

});






































// RELIKER
// RELIKER




          // Profile("hehe").$bindTo($scope, "profile");



          // $scope.test = function() {
          //   console.log("testfunktionen")
          //   console.log($scope.firebaseUser)signIn
          //   console.log($scope.specificItem)
          //   Profile("physicsmarie").$bindTo($scope, "profile");
          //   console.log("testfunktionen")
          //
          //   };




//           // DENNA FUNKAR FINT, FAST MED LITE FEL SOM VANLIGT
          // var triggered = false;
          // $scope.test = function() {
          //   console.log("////// ABRAKADABRA!");
          //
          //   Profile($scope.firebaseUser.uid, $scope.specificItem).$bindTo($scope, "item");
          //   console.log("testfunktionen");
          //   console.log($scope.firebaseUser);
          //   console.log($scope.specificItem);
          //   console.log("testfunktionen");
          //   triggered = true;
          //   };
          //
          //   $scope.triggerTest = function(){
          //     console.log("////// HERUREKA!");
          //
          //     if(!triggered){
          //       $scope.test();
          //     }
          //   }

// $scope.test();
// window.onload = function(e) {
//   $scope.test();
// }
