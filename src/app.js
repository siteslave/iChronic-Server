"use strict";

angular.module('app', [
  'ngMaterial', 
  'ui.router', 
  'md.data.table',
  'app.controllers.Report',
  'app.services.Report',
  'app.controllers.Log'
])
  .config(($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/templates/main.html'
      })
      .state('report', {
        url: '/report',
        templateUrl: '/templates/report.html',
        controller: 'ReportCtrl'
      })
      .state('log', {
        url: '/log',
        templateUrl: '/templates/upload-status.html',
        controller: 'LogCtrl'
      });
  })
  .controller('NavCtrl', ($scope, $mdSidenav) => {
    $scope.toggleLeft = () => {
      $mdSidenav('left')
        .toggle()
    };

    $scope.logout = () => {

      window.location.href = '/users/logout';

    }
  })
  .controller('AppCtrl', ($scope, $state, $mdSidenav) => {
    $scope.toggleLeft = () => {
      $mdSidenav('left')
        .toggle()
    };

    $scope.go = (state) => {
      $state.go(state);
    }
  });
