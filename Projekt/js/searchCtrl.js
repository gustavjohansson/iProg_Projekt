
dinnerPlannerApp.controller('SearchCtrl', function ($scope, $location, $http, $routeParams, Dinner, UserItemAdd, Download, UserItemModify) {


  // $controller("FirebaseCtrl", {$scope: $scope});

  // -------------SETTERS-------------
  // -------------SETTERS-------------

  $scope.removeItemFromCheckList = function(item){
    Dinner.removeItemFromList(item);
  }


  $scope.emptyChecklist = function(){
    Dinner.emptyChecklist();
    $scope.checkList = Dinner.getCheckList();
  }

  $scope.emptyCompletelist = function(){
    Dinner.emptyCompletelist();
    $scope.completeList = Dinner.getCompleteList();
  }


  $scope.removeItemFromCompleteList = function(item){
    Dinner.removeItemFromCompleteList(item);
  }

  $scope.checkItem = function(item){
    Dinner.foundItem(item);
  }

  $scope.uncheckItem = function(item){
    Dinner.undoItem(item);
  }

  $scope.setCO2representation = function(CO2value){
    Dinner.setCO2constant(CO2value);
  }


  // -------------GETTERS-------------
  // -------------GETTERS-------------

  $scope.checkList =Dinner.getCheckList();

  $scope.completeList =Dinner.getCompleteList();

  // $scope.specificItem = Dinner.setCurrentItem($routeParams.itemId);

  $scope.getCO2representation = function(){
    return Dinner.getCO2constant();
  }

  $scope.getCurrentCO2representation = function(){
    return Dinner.getCurrentCO2representation();
  }

  $scope.getCO2unit = function(){
    return Dinner.getCO2unit();
  }

  $scope.getNormCO2 = function(){
    return Dinner.getTotalCO2();
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

  var correctSearch = Dinner.checkIfCorrectSearch(searchword);

  if (!correctSearch) {
    $scope.status = 'Ogiltig sökning. Din vara kan endast bestå av bokstäver.';
  }

  else {
    $scope.status = 'Söker efter "' + searchword + '"...';

    var statusPromise = Dinner.executeSearch(searchword, amount, unit, $location.url());

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
//         var statusCheck = Dinner.updateList(userData[item].itemInfo);
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
//     Dinner.Dish.get({ingredient:ingredient,amount:amount,unit:unit},function(data){
//       var statusCheck = Dinner.updateList(data);
//
//       if (statusCheck) {
//         statusText.style.background = "#5cbc3a";
//         $scope.status = '"' + data.name + '" lades till i listan!'
//         $("#statusText").delay(2000).fadeOut("fast");
//         if (ownAmountAndUnitChosen) {
//           UserItemModify(Dinner.getFirebaseUserUID(), Dinner.cutNameOfItem(data));
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
