'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */
angular.module('tripoAsiaApp')
    .controller('AccomodationCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location, $routeParams) {


        $scope.category = $routeParams.category;
        console.log($scope.category);
        //alert("from hotelController" + $scope.category);


        $scope.category_list = function() {

            var data = $.param({
                category_type: $scope.category

            });


            var config = {

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },

            }

            $http.post(configService.getEnvConfig().serverURL + 'accomodation/list', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);
                        //console.log("total count of data" + data.list.length);

                        $scope.list = data.list;
                        // $scope.total = data.list.length;
                        $scope.category = $routeParams.category;

                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                        // to prevent interaction outside of dialog



                    });



        }
        $scope.category_list();

    });




///////////////////////////////////////////////////previous get function ///////////////////////////////////////////////////
// $scope.list = function() {

//     var config = {

//         headers: {
//             'Content-Type': 'application/json',

//         },
//         params: { category_type: $scope.category }

//     }

//     $http.get("http://192.168.1.61:4000/accomodation/list", config)

//     .success(
//         function(data, status, headers, config) {
//             console.log(data);


//         }).error(
//         function(data, status, header, config) {
//             //console.log(data);

//             // to prevent interaction outside of dialog


//         });

//     // $http({
//     //     url: 'http://192.168.1.61:4000/accomodation/list',
//     //     method: "GET",

//     // });




// }
//  $scope.list();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//   $rootScope.naviagte_memberships = function () {

//           $rootScope.memberships = true;

//           $location.path("/myprofile");
//       }



//});
