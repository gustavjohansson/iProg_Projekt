var dinnerPlannerApp = angular.module('dinnerPlanner', ['ngRoute','ngAnimate', 'ngResource', 'ngCookies', 'ngMaterial', 'firebase']);

dinnerPlannerApp.config(['$routeProvider',
  function($routeProvider) {
    console.log("Hejsan appen!")
    $routeProvider.

    when('/login', {
      templateUrl: 'partials/login.html'
      // controller: 'SearchCtrl'
    }).

    when('/register', {
      templateUrl: 'partials/register.html'
      // controller: 'SearchCtrl'
    }).

      when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchCtrl'
      }).

      when('/menu', {
        templateUrl: 'partials/menu.html'
        // controller: 'SearchCtrl'
      }).

      when('/stats', {
        templateUrl: 'partials/stats.html',
        controller: 'StatsCtrl'
      }).

      when('/favourites', {
        templateUrl: 'partials/favourites.html',
        controller: 'FavouriteCtrl'
      }).


      when('/specific/:itemId', {
        templateUrl: 'partials/specificInfo.html',
        controller: 'SpecificCtrl'
      }).

      // TODO in Lab 5: add more conditions for the last two screens (overview and preparation)
      otherwise({
        redirectTo: '/login'
      });
  }]);
