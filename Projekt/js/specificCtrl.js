
dinnerPlannerApp.controller('SpecificCtrl', function ($scope, $http, $timeout, $routeParams, $firebaseObject, $firebaseAuth, Dinner, UserItemAdd, UserItemModify, Auth, Download) {

  Dinner.setCurrentItem($routeParams.itemId);

$scope.itemAlreadyInFav = function(item){
  return Dinner.itemAlreadyInFav(item);
}


$scope.addOrRemoveItemFromFav = function(item){
  $scope.removed = "";
  $scope.added = "";

  var alreadyInFavList = Dinner.addOrRemoveItemFromFav(item);

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

  $scope.uid = Dinner.getFirebaseUserUID();
  $scope.specificItem = Dinner.getCurrentItem();
  $scope.completeList = Dinner.getCompleteList();
  $scope.checkList = Dinner.getCheckList();

  $scope.totCarbon = function(){
    return Dinner.getTotalCarbon($scope.specificItem.id);
  }

  $scope.percentCarbon = function(){
    return Dinner.getPercentCarbon($scope.specificItem);
  }


  $scope.updateItemForUser = function(amount, unit) {
    $scope.errorChange = "";
    $scope.succesfulChange = "";
    if (amount == "" || unit == "" || typeof unit == "undefined" || typeof amount == "undefined") {
      $scope.errorChange = "Ingen ändring gjordes! Du måste fylla i både mängd och enhet för att ändra.";
    }
    else {
    var itemChanged = Dinner.updateItemForUser(amount, unit, $scope.specificItem)
    itemChanged.then(function() {
      $scope.succesfulChange = "Uppdateringen genomförd!";
        $scope.specificItem = Dinner.getCurrentItem();
        $scope.mittnamn();
    }, function(reason) {
      $scope.errorChange = "Ingen ändring gjordes! Du måste fylla i både mängd och enhet för att ändra.";
    })
  }
  }

$scope.mittnamn = function() {

  var curItem_name = ($scope.specificItem).name;
  var curItem_carbon = ($scope.specificItem).carbon.average;

    var data = {
        labels: [
          curItem_name,
          "Resterande varor"
        ],
        datasets: [
            {
                data: [curItem_carbon, Dinner.getTotalCarbon($scope.specificItem.id)],
                backgroundColor: [
                    "#9BD270",
                    "#006400"
                ],
                hoverBackgroundColor: [
                    "#9BD270",
                    "#006400"
                ]
            }],
    };

    var options = {
      responsive: true,
      cutoutPercentage: 60,
      legend: {
        position: "bottom"

      },

    };

    var ctx = angular.element(document).find("#myChart");

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

$timeout(function() {
  $scope.mittnamn();
}, 800);


});
