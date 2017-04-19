
dinnerPlannerApp.controller('FavouriteCtrl', function ($scope, $http, $routeParams, Dinner, UserItemAdd, Download, UserItemModify) {


// $controller("FirebaseCtrl", {$scope: $scope});


  // -------------GETTERS-------------
  // -------------GETTERS-------------

  $scope.checkList =Dinner.getCheckList();

  $scope.completeList =Dinner.getCompleteList();

  $scope.favList =Dinner.getFavouriteList();


  $scope.getCO2representation = function(){
    return Dinner.getCO2constant();
  }

  $scope.getCO2unit = function(){
    return Dinner.getCO2unit();
  }

  $scope.getCurrentCO2representation = function(){
    return Dinner.getCurrentCO2representation();
  }


  $scope.removeItemFromFavouriteList = function(item){
    Dinner.removeItemFromFavouriteList(item);
  }

  $scope.addFavItemToCheck = function(item){
    $scope.favAddedToCheck = "";
    var favAddedToChecklist = Dinner.updateList(item);
    if (favAddedToChecklist) {
      $scope.favAddedToCheck = item.name + " lades till i din inköpslista!";
    }
  }

  $scope.favItemAlreadyInList = function(item){
    return Dinner.favItemAlreadyInList(item);
  }

  $scope.addAllFavs = function(){
    Dinner.addAllFavsToChecklist();
  }


});
