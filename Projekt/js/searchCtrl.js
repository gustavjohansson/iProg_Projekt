
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

  $scope.favItemAlreadyInList = function(item){
    return Carbon.favItemAlreadyInList(item);
  }


  // -------------GETTERS-------------
  // -------------GETTERS-------------

  $scope.checkList =Carbon.getCheckList();

  $scope.completeList =Carbon.getCompleteList();

    $scope.favList =Carbon.getFavouriteList();

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


  $scope.removeItemFromFavouriteList = function(item){
    Carbon.removeItemFromFavouriteList(item);
  }

  $scope.addFavItemToCheck = function(item){
    var favAddedToChecklist = Carbon.updateList(item);
  }


  $scope.addAllFavs = function(){
    Carbon.addAllFavsToChecklist();
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

  var statusText = document.getElementById('statusText');

  var correctSearch = Carbon.checkIfCorrectSearch(searchword);

  if (!correctSearch) {
    $scope.status = 'Ogiltig sökning. Din vara kan endast bestå av bokstäver.';
    statusText.style.background = "#f14129";
  }

  else {
    $scope.status = 'Söker efter "' + searchword + '"...';
    statusText.style.background = "#bcbcbc";

    var statusPromise = Carbon.executeSearch(searchword, amount, unit, $location.url());

    statusPromise.then(function() {
      statusMsg = statusPromise.$$state.value;
      statusText.style.background = statusMsg.color;
      $scope.status = statusMsg.msg;
    })

  }
}


});
