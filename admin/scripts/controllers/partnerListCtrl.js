'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */
angular.module('tripoAsiaApp')
    .controller('PartnerListCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location, $routeParams) {

        // alert("hi");
        $scope.user_type = $routeParams.user_type;
        console.log($scope.user_type);
        //alert("from hotelController" + $scope.category);


        $scope.partner_list = function() {

            var data = $.param({
                user_type: $scope.user_type

            });


            var config = {

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },

            }

            $http.post(configService.getEnvConfig().serverURL + 'partnerDetails', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);

                        $scope.list = data.list;
                        $scope.partner = 'Partner';

                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                        // to prevent interaction outside of dialog



                    });



        }
        $scope.partner_list();






    });
