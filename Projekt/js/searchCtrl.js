
carbonListApp.controller('SearchCtrl', function ($scope, $location, $http, $routeParams, Carbon) {


  // $controller("FirebaseCtrl", {$scope: $scope});

  // -------------SETTERS-------------
  // -------------SETTERS-------------

  $scope.removeItemFromCheckList = function(item){
    Carbon.removeItemFromList(item);
  }


  $scope.emptyChecklist = function(){
    Carbon.emptyChecklist();
    $scope.checkList = Carbon.getCheckList();
  }

  $scope.emptyCompletelist = function(){
    Carbon.emptyCompletelist();
    $scope.completeList = Carbon.getCompleteList();
  }


  $scope.removeItemFromCompleteList = function(item){
    Carbon.removeItemFromCompleteList(item);
  }

  $scope.checkItem = function(item){
    Carbon.foundItem(item);
  }

  $scope.uncheckItem = function(item){
    Carbon.undoItem(item);
  }

  $scope.setCO2representation = function(CO2value){
    Carbon.setCO2constant(CO2value);
  }


  // -------------GETTERS-------------
  // -------------GETTERS-------------

  $scope.checkList =Carbon.getCheckList();

  $scope.completeList =Carbon.getCompleteList();

  // $scope.specificItem = Carbon.setCurrentItem($routeParams.itemId);

  $scope.getCO2representation = function(){
    return Carbon.getCO2constant();
  }

  $scope.getCurrentCO2representation = function(){
    return Carbon.getCurrentCO2representation();
  }

  $scope.getCO2unit = function(){
    return Carbon.getCO2unit();
  }

  $scope.getNormCO2 = function(){
    return Carbon.getTotalCO2();
  }


  // -------------API-------------
  // -------------API-------------

  $scope.autoSearch = function(searchText) {
    return $http
    .get("http://lcafdb.org/api/ingredients?search=" + searchText)
    .then(function(data) {
      return data.data.ingredients;
    }

    , function(data) {
      console.log("Du måste fylla i alla fält för att kunna lägga in en vara i listan!")
      return data;
    }
  )
};


$scope.search = function(searchword, amount, unit) {

  $scope.searchText = "";
  $scope.amountH = "";
  $scope.unitH = "";

  var correctSearch = Carbon.checkIfCorrectSearch(searchword);

  if (!correctSearch) {
    $scope.status = 'Ogiltig sökning. Din vara kan endast bestå av bokstäver.';
  }

  else {
    $scope.status = 'Söker efter "' + searchword + '"...';

    var statusPromise = Carbon.executeSearch(searchword, amount, unit, $location.url());

    statusPromise.then(function() {
      statusMsg = statusPromise.$$state.value;
      $scope.status = statusMsg;
    })

  }
}


});


















// FUNGERAR SKITBRA, NÄR MAN HAR DE I KONTROLLERN, TA FAN INTE BORT ASSå,
// KOLLA SPECIELLT HUR JA FICK UT STATUSMEDDELANDENA!


// userData.$loaded().then(function() {
//   var inFirebaseUpdatelist = false;
//   for (item in userData) {
//     if (typeof userData[item].itemInfo != "undefined") {
//       if ((userData[item].itemInfo).id == ingredient && !ownAmountAndUnitChosen) {
//         var statusCheck = Carbon.updateList(userData[item].itemInfo);
//         inFirebaseUpdatelist = true;
//
//         if (statusCheck) {
//           statusText.style.background = "#5cbc3a";
//           $scope.status = '"' + userData[item].itemInfo.name + '" lades till i listan!'
//           $("#statusText").delay(2000).fadeOut("fast");
//         }
//         else {
//           statusText.style.background = "#f14129";
//           $scope.status = '"' + userData[item].itemInfo.name + '" ligger redan i listan!'
//         }
//       }
//     }
//   }
//
//   if (!inFirebaseUpdatelist) {
//     Carbon.APIinfo.get({ingredient:ingredient,amount:amount,unit:unit},function(data){
//       var statusCheck = Carbon.updateList(data);
//
//       if (statusCheck) {
//         statusText.style.background = "#5cbc3a";
//         $scope.status = '"' + data.name + '" lades till i listan!'
//         $("#statusText").delay(2000).fadeOut("fast");
//         if (ownAmountAndUnitChosen) {
//           UserItemModify(Carbon.getFirebaseUserUID(), Carbon.cutNameOfItem(data));
//         }
//       }
//       else {
//         statusText.style.background = "#f14129";
//         $scope.status = '"' + data.name + '" ligger redan i listan!'
//       }
//
//     }, function(data) {
//       console.log("Du måste fylla i alla fält för att kunna lägga in en vara i listan!")
//     })
//
//   }
// })
