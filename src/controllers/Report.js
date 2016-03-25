"use strict";

angular.module('app.controllers.Report', [])
  .controller('ReportCtrl', ($scope, ReportService) => {

    $scope.startDate = new Date(moment().startOf('month').utc().format());
    $scope.endDate = new Date(moment().endOf('month').utc().format());

    $scope.getReport = () => {

      $scope.isLoading = true;
      let _start = moment($scope.startDate).format('YYYY-MM-DD');
      let _end = moment($scope.endDate).format('YYYY-MM-DD');

      ReportService.getReport(_start, _end)
        .then(data => {
          $scope.ckds = data.ckds;
          $scope.cvds = data.cvds;
          $scope.isLoading = false;
        }, err => {
          $scope.isLoading = false;
          console.log(err);
        });
    };

    $scope.getReport();

    $scope.exportExcel = () => {
      let _start = moment($scope.startDate).format('YYYY-MM-DD');
      let _end = moment($scope.endDate).format('YYYY-MM-DD');
      
      window.open('/api/reports/excel/' + _start + '/' + _end);
    }
  });
