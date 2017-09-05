/**
 * Created by Ram on 05-Sep-17.
 */
angular.module('app', [])
  // .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //   $routeProvider.when('/users', {
  //     templateUrl: 'users.html',
  //     controller: 'UserCtrl'
  //   });
  //
  //   $routeProvider.when('/users/:id', {
  //     templateUrl: 'user.html',
  //     controller: 'UserCtrl'
  //   });
  //
  //   $routeProvider.otherwise({redirectTo: '/users'});
  // }]);

angular.module('app')
  .controller('UserCtrl', ["$http", "$scope", function($http, $scope) {

    var id = null;
    apiRoot = "https://jsonplaceholder.typicode.com";

    $http({
      method: 'GET',
      url: "https://dnbapistore.com/hackathon/banks/1.0/bank/atm/zip/0367",
      headers: {'Authorization': 'Bearer 67e6636a-75d1-3c01-8742-617f7a32ce3d'},
    })
      .then((response) => {
      console.log(response);
  })
    .catch((response) => {
      console.log(response);
  })

    if (id) {
      // Load only one User with specific User.
      $http.get(apiRoot + "/users/" + id)
        .then((response) => {
        $scope.user = response.data;
    });
    } else {
      //Load all user list
      $http.get(apiRoot + "/users")
        .then((response) => {
        $scope.users = response.data;
    });
    }

    $scope.delete = function (id) {
      $http.delete(apiRoot + "/users/" + id)
        .then((response) => {
        alert("User -" + id + " deleted.");
    });
    };

    $scope.save = function () {
      $http.post(apiRoot + "/users/" + id, { name : $scope.user.name})
        .then((response) => {
        alert("User updated.");
    });
    };

  }]);
