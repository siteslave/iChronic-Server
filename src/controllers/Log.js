'use strict';

angular.module('app.controllers.Log', ['app.services.Log'])
.controller('LogCtrl', ($scope, LogService) => {
  
  $scope.getLog = () => {
    LogService.getLog()
      .then(rows => {
        $scope.files = rows;
      }, err => {
        // error
      });
  };

  $scope.getLog();
});