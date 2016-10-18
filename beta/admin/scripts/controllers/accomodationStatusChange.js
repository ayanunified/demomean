'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */
angular.module('tripoAsiaApp')
    .controller('AccomodationStatusChangeCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location, $routeParams) {

        $scope.category = $routeParams.category;
        $scope.id = $routeParams.id;
        $scope.status = $routeParams.status;
        // console.log("From controller" + $scope.id + ',' + $scope.status + ',' + $scope.category);
        //alert("from hotelController" + $scope.category);


        $scope.change_status = function() {

            var data = $.param({
                id: $scope.id,
                status: $scope.status

            });


            var config = {

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },

            }

            $http.post(configService.getEnvConfig().serverURL + 'accomodation/change_status', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);

                        $location.path('/accomodations-list/' + $scope.category);


                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                    });



        }
        $scope.change_status();






    });
