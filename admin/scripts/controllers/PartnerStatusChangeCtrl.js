'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */
angular.module('tripoAsiaApp')
    .controller('PartnerStatusChangeCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location, $routeParams) {

        $scope.user_type = $routeParams.user_type;
        $scope.id = $routeParams.id;
        $scope.status = $routeParams.status;
        console.log("From controller" + $scope.id + ',' + $scope.status + ',' + $scope.user_type);
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

            $http.post(configService.getEnvConfig().serverURL + 'userStatusChange', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);

                        $location.path('/partner-Details/' + $scope.user_type);


                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                    });



        }
        $scope.change_status();






    });
