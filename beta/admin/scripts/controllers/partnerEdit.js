'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */
angular.module('tripoAsiaApp')
    .controller('PartnerEditCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location, $routeParams) {
        $scope.partner_edit_obj = {};
        $scope.id = $routeParams.id;
        // console.log($scope.id);

        //alert("from hotelController" + $scope.category);


        ///////////////////////////////////////////////// get function for company list ///////////////////////////////////////////////////
        $scope.userlist = function() {

            var data = $.param({
                id: $scope.id

            });


            var config = {

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',

                },


            }


            $http.post(configService.getEnvConfig().serverURL + 'specific_partnerList', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);
                        //console.log(data.list[0].company_id.name);

                        //$scope.list = data.list;
                        $scope.partner_edit_obj.id = data.list[0]._id;
                        $scope.partner_edit_obj.fname = data.list[0].first_name;
                        $scope.partner_edit_obj.lname = data.list[0].last_name;
                        $scope.partner_edit_obj.email = data.list[0].email;
                        $scope.partner_edit_obj.birthday = data.list[0].birthday;
                        $scope.partner_edit_obj.company_id = data.list[0].company_id._id;
                        $scope.partner = 'Partner';
                        $scope.currentDate = new Date().toString();

                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                        // to prevent interaction outside of dialog



                    });


        }

        //////////////////////////COMPANY LIST ////////////////////////////////////////////////////////////////////////



        $scope.company_list = function() {



            var config = {

                headers: {
                    'Content-Type': 'application/json',

                },


            }

            $http.get(configService.getEnvConfig().serverURL + 'company/listActive', config)

            .success(
                function(data, status, headers, config) {
                    console.log(data);
                    $scope.company_list = data.list;



                }).error(
                function(data, status, header, config) {
                    console.log(status);

                    // to prevent interaction outside of dialog


                });


        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


        $scope.edit_partner = function() {

            //alert("Form submitted");
            var posted_data = {};
            posted_data = $scope.partner_edit_obj;
            console.log(posted_data);
            var data = $.param({
                id: posted_data.id,
                fname: posted_data.fname,
                lname: posted_data.lname,
                email: posted_data.email,
                birthday: posted_data.birthday,
                company_id: posted_data.company_id

                //image: posted_data.image
            });


            // var data = "category_type=" + posted_data.category + "&company_id=" + posted_data.company_id;


            var config = {

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },

            }

            $http.post(configService.getEnvConfig().serverURL + 'user_update', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);

                        $location.path('/partner-Details/' + 2);

                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                        // to prevent interaction outside of dialog



                    });




        }



        /////// initializes the controller /////


        var initialize_controller = function() {
            $scope.userlist();
            $scope.company_list();
        }


        initialize_controller();


        //////////////////////////////////////



    });
