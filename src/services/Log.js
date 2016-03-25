'use strict';

angular.module('app.services.Log', [])
.factory('LogService', ($q, $http) => {
  return {
    getLog() {
      let q = $q.defer();
      
      $http.post('/api/log', {})
        .success(data => {
          if (data.ok) {
            q.resolve(data.rows)
          } else {
            q.reject(data.msg)
          }
        })
        .error(() => {
          q.reject('Connection failed')
        });
      
      return q.promise;
    }
  }
})