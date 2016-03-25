'use strict';

angular.module('app.services.Report', [])
.factory('ReportService', ($q, $http) => {
  
  return {
    getReport(start, end) {
      let q = $q.defer();
      $http.post('/api/reports', {start: start, end: end})
        .success(data => {
          if (data.ok) {
            q.resolve(data)
          } else {
            q.reject(data.msg)
          }
        })
        .error(() => {
          q.reject('Connection failed.')
        });
      
      return q.promise;
    }
  }
  
});