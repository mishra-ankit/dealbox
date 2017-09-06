/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function () {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                // Ignore
              }
            };
          }
        };
      }).catch(function (e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here
  function share() {
    navigator.share({
      title: document.title,
      text: "Great Deal",
      url: window.location.href
    })
  }

  /**
   * Created by Ram on 05-Sep-17.
   */
  angular.module('app', [])
  // .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  //   $routeProvider.when('/users', {
  //     templateUrl: 'users.html',
  //     controller: 'UserCtrl'
  //   });
  //   $routeProvider.otherwise({redirectTo: '/users'});
  // }]);

  angular.module('app')
    .controller('UserCtrl', ["$http", "$scope", "$timeout", function ($http, $scope, $timeout) {
      var snackbarContainer = document.querySelector('#demo-toast-example');
      var id = null;
      var apiRoot = "https://dnbapistore.com/hackathon";
      var userObj;
      var dialog = document.querySelector('dialog');

      var USER_DB = {
        'mukesh': {
          interestList: ['Sport', 'Restaurent']
        },
        'mai': {
          interestList: ['Kitchen / Interior', 'Electronic']
        },
        'ankit': {
          interestList: ['Flower / Gardening']
        }
      };

      $http({
        method: 'GET',
        url: apiRoot + "/banks/1.0/bank/atm/zip/0367",
        headers: {'Authorization': 'Bearer 67e6636a-75d1-3c01-8742-617f7a32ce3d'}
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (response) {
          console.log(response);
        })

      $scope.isLoggedIn = function () {
        return ($scope.userObj);
      };

      $scope.logIn = function () {
        $scope.showLoading = true;
        if ($scope.id && $scope.pin && USER_DB[$scope.id]) {
          $scope.userObj = USER_DB[$scope.id];
        }

        //Fetch relevant deals.
        $http.get("https://mockbin.org/bin/b4ae1d0e-c985-42f2-8f2f-47bbbf14cb70")
          .then(function (response) {
            // TODO : Filter only personalized deals.
            $scope.allDeals = response.data;
            $scope.deals = response.data.filter(function (deal) {
              return ($scope.userObj.interestList.indexOf(deal.category) > -1);
            });
          })
          .catch(function (response) {
            alert("Error is fetching deals.");
          });

        $timeout(function () {
          $scope.showLoading = false;
        }, 2000);
      };

      var LIST = 'list', DETAILS = 'details';
      $scope.appState = LIST;

      $scope.goTo = function (deal) {
        $scope.appState = DETAILS;
        $scope.currentDeal = deal;
        if (deal === LIST) {
          $scope.appState = LIST;
        }
      };

      $scope.favList = [];

      $scope.addToFav = function (deal) {
        deal.isFav = true;
        $scope.favList.push(deal);
        var data = {message: 'Added to favourites!'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      };

      $scope.removeFav = function (deal) {
        deal.isFav = false;
        // TODO : Actual remove from array.
        var data = {message: 'Removed from favourites!'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      };

      $scope.boughtDeals = [];

      $scope.buy = function () {
        // TODO : Remove from main list.
        dialog.showModal();
      };

      dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
      });

      dialog.querySelector('.done').addEventListener('click', function () {
        dialog.close();
        $timeout(function () {
          $scope.currentDeal.bought = true;
          // TODO : Do transaction using
          $scope.boughtDeals.push($scope.currentDeal);
        }, 1);
      });
    }]);
})();
