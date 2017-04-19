var carbonListApp = angular.module('carbonListApp', ['ngRoute','ngAnimate', 'ngResource', 'ngCookies', 'ngMaterial', 'firebase']);

carbonListApp.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider.

    when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'FirebaseCtrl'
    }).

    when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'FirebaseCtrl'
    }).

      when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchCtrl'
      }).

      when('/menu', {
        templateUrl: 'partials/menu.html',
        controller: 'FirebaseCtrl'
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

      otherwise({
        redirectTo: '/login'
      });
  }]);
