
carbonListApp.controller('SpecificCtrl', function ($scope, $http, $timeout, $routeParams, $firebaseObject, $firebaseAuth, Carbon) {

  Carbon.setCurrentItem($routeParams.itemId);

  $scope.itemAlreadyInFav = function(item){
    return Carbon.itemAlreadyInFav(item);
  }


  $scope.addOrRemoveItemFromFav = function(item){
    $scope.removed = "";
    $scope.added = "";

    var alreadyInFavList = Carbon.addOrRemoveItemFromFav(item);

    if (alreadyInFavList) {
      $scope.removed = item.name + " togs bort som favorit!";
      $timeout(function() {
        $scope.removed = "";
      }, 2000);
    }
    else {
      $scope.added = item.name + " lades till som favorit";
      $timeout(function() {
        $scope.added = "";
      }, 2000);
    }
  }

  $scope.uid = Carbon.getFirebaseUserUID();
  $scope.specificItem = Carbon.getCurrentItem();
  $scope.completeList = Carbon.getCompleteList();
  $scope.checkList = Carbon.getCheckList();

  $scope.totCarbon = function(){
    return Carbon.getTotalCarbon($scope.specificItem.id);
  }

  $scope.percentCarbon = function(){
    return Carbon.getPercentCarbon($scope.specificItem);
  }


  $scope.updateItemForUser = function(amount, unit) {
    $scope.errorChange = "";
    $scope.succesfulChange = "";
    if (amount == "" || unit == "" || typeof unit == "undefined" || typeof amount == "undefined") {
      $scope.errorChange = "Ingen ändring gjordes! Du måste fylla i både mängd och enhet för att ändra.";
    }
    else {
      var itemChanged = Carbon.updateItemForUser(amount, unit, $scope.specificItem)
      itemChanged.then(function() {
        $scope.succesfulChange = "Uppdateringen genomförd!";
        $scope.specificItem = Carbon.getCurrentItem();
        $scope.doughnutChart();
      }, function(reason) {
        $scope.errorChange = "Ingen ändring gjordes! Du måste fylla i både mängd och enhet för att ändra.";
      })
    }
  }

  $scope.doughnutChart = function() {
    var ctx = angular.element(document).find("#myChart");
    Carbon.createChart(ctx, "doughnut", false, "specific");

  }

  $timeout(function() {
    $scope.doughnutChart();
  }, 1000);


});
