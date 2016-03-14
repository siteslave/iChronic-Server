((window, angular) => {
  "use strict";

  angular.module('app', ['ngMaterial', 'ui.router', 'md.data.table'])
    .config(($stateProvider, $urlRouterProvider) => {
      $urlRouterProvider.otherwise('/');

      $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/templates/main.html'
      })
      .state('report', {
        url: '/report',
        templateUrl: '/templates/report.html'
      });
    })
  .controller('NavCtrl', ($scope, $mdSidenav) => {
    $scope.toggleLeft = function() {
      $mdSidenav('left')
        .toggle()
    };
  })
  .controller('AppCtrl', ($scope, $state, $mdSidenav) => {
    $scope.toggleLeft = function() {
      $mdSidenav('left')
        .toggle()
    };

    $scope.go = function(state) {
      $state.go(state);
    }
  });

})(window, window.angular);