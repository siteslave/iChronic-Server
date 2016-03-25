"use strict";

angular.module('app', ['ngMaterial', 'ui.router', 'md.data.table', 'app.controllers.Report', 'app.services.Report', 'app.controllers.Log']).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('main', {
    url: '/',
    templateUrl: '/templates/main.html'
  }).state('report', {
    url: '/report',
    templateUrl: '/templates/report.html',
    controller: 'ReportCtrl'
  }).state('log', {
    url: '/log',
    templateUrl: '/templates/upload-status.html',
    controller: 'LogCtrl'
  });
}).controller('NavCtrl', function ($scope, $mdSidenav) {
  $scope.toggleLeft = function () {
    $mdSidenav('left').toggle();
  };

  $scope.logout = function () {

    window.location.href = '/users/logout';
  };
}).controller('AppCtrl', function ($scope, $state, $mdSidenav) {
  $scope.toggleLeft = function () {
    $mdSidenav('left').toggle();
  };

  $scope.go = function (state) {
    $state.go(state);
  };
});