
dinnerPlannerApp.controller('StatsCtrl', function ($scope, $http, $timeout, $routeParams, $firebaseObject, $firebaseAuth, Dinner, UserItemAdd, UserItemModify, Auth, Download) {


  $scope.uid = Dinner.getFirebaseUserUID();
  $scope.specificItem = Dinner.getCurrentItem();
  $scope.completeList = Dinner.getCompleteList();
  $scope.checkList = Dinner.getCheckList();
  $scope.testItter = Dinner.itemsHistory();

  $scope.totCarbon = function(){
    return Dinner.getTotalCarbon($scope.specificItem.id);
  }


$scope.mittnamn = function() {

  var statInfo = Dinner.getStatInfoForCurrentPurchase();
  var labels = statInfo[0]; // list with only names.
  var data = statInfo[1];

    var data = {
        labels: labels,
        datasets: [
            {
                data: data,
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

    var ctx = angular.element(document).find("#statChart1");

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

$scope.lineChart = function() {
  var userData = Download(Dinner.getFirebaseUserUID(), "saved lists");
  var days = [];
  var totalCO2 = [];
  var avgCO2 = [];

  userData.$loaded().then(function() {
    for (list in userData) {
      if (userData[list].$id !== undefined) {
        // delete userData[list].$priority;
        days.push(userData[list].$id);
        totalCO2.push(userData[list].totalCO2);
        avgCO2.push(userData[list].snittCO2);
      }
    }

    // DESSA KAN DU KODREDUCERA, LÄGGA IN ALLT DETTA I EN SERVICE O SKICKA IN DÅ TEX days OCH totalCO2!
    // Så skapas allt detta o så har du bara en rad här istället!
    var data = {
      labels: days,
      datasets: [
                  {
                      label: 'Snitt',
                      backgroundColor: "darkgreen",
                      data: avgCO2,
                  },
                  {

                      label: 'Total',
                      backgroundColor: "#9BD270",
                      data: totalCO2,
                  }
              ]


      };

      var options = {
        responsive: true,
        legend: {
          position: "bottom"

        },

      };

      var ctx = angular.element(document).find("#statChart2");

      var myDoughnutChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
      });


  });

}


$scope.barChart = function() {
  var userData = Download(Dinner.getFirebaseUserUID(), "saved lists");
  var tempList = [];
  var accumulatedList = [];
  userData.$loaded().then(function() {

    for (list in userData) {
      if (userData[list].$id !== undefined) {
        // delete userData[list].$priority;
        for (item in userData[list].items) {
          tempList.push((userData[list].items)[item])
        }
      }
    }

    for (object in tempList) {
      var uniqueItem = true;
      for (item in accumulatedList) {
        if (tempList[object].id == accumulatedList[item].id) {
          uniqueItem = false;
          accumulatedList[item].amount += tempList[object].amount;
          accumulatedList[item].carbon.average += tempList[object].carbon.average;
        }
      }
      if (uniqueItem) {
        accumulatedList.push(tempList[object])
      }
    }

    accumulatedList.sort(function(a, b) {
        return b.carbon.average - a.carbon.average;
    })

    var topAccumulatedItems = accumulatedList.slice(0,6);

    var itemNames = [];
    var itemCarbon = [];
    for (editedItem in topAccumulatedItems) {
      itemNames.push(topAccumulatedItems[editedItem].name)
      itemCarbon.push(topAccumulatedItems[editedItem].carbon.average)
    }


    var data = {
      labels: itemNames,
      datasets: [
                  {
                      label: 'Koldioxid',
                      backgroundColor: "darkgreen",
                      data: itemCarbon,
                  },
              ]


      };

      var options = {
        responsive: true,
        legend: {
          position: "bottom"

        },

      };

      var ctx = angular.element(document).find("#statChart3");

      var myDoughnutChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
      });


  });

}


$timeout(function() {
  $scope.mittnamn();
  $scope.lineChart();
  $scope.barChart();

}, 800);

});
