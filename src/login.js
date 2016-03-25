'use strict';

angular.module('app', ['ngMaterial'])
  .controller('LoginCtrl', ($scope, $window, LoginService) => {
    
    $scope.doLogin = () => {
      LoginService.doLogin($scope.username, $scope.password)
        .then(data => {
          $window.sessionStorage.setItem('username', $scope.username);
          window.location.href = '/admin';
        }, (err) => {
          alert('เกิดข้อผิดพลาด : ' + JSON.stringify(err));
        })
    };
    
  })
  .factory('LoginService', ($q, $http) => {
    return {
      doLogin(username, password) {
        let q = $q.defer();

        $http.post('/users/staff-login', {username: username, password: password})
          .success(data => {
            if (data.ok) {
              q.resolve()
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
  });