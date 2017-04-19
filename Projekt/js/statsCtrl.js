
carbonListApp.controller('StatsCtrl', function ($scope, $http, $timeout, $routeParams, $firebaseObject, $firebaseAuth, Carbon, FirebaseAccount) {


  $scope.uid = Carbon.getFirebaseUserUID();
  $scope.specificItem = Carbon.getCurrentItem();
  $scope.completeList = Carbon.getCompleteList();
  $scope.checkList = Carbon.getCheckList();
  $scope.testItter = Carbon.itemsHistory();

  $scope.totCarbon = function(){
    return Carbon.getTotalCarbon($scope.specificItem.id);
  }


  $scope.doughnutChart = function() {
    var ctx = angular.element(document).find("#statChart1");
    Carbon.createChart(ctx, "doughnut", false, "general");
  }

  $scope.lineChart = function() {
    var userData = FirebaseAccount.Download(Carbon.getFirebaseUserUID(), "saved lists");
    userData.$loaded().then(function() {
      var ctx = angular.element(document).find("#statChart2");
      Carbon.createChart(ctx, "line", userData);
    });

  }


  $scope.barChart = function() {
    var userData = FirebaseAccount.Download(Carbon.getFirebaseUserUID(), "saved lists");
    userData.$loaded().then(function() {
      var ctx = angular.element(document).find("#statChart3");
      Carbon.createChart(ctx, "bar", userData);

    });

  }


  $timeout(function() {
    $scope.doughnutChart();
    $scope.lineChart();
    $scope.barChart();

  }, 1000);

});
