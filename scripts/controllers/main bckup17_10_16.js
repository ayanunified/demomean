'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */




angular.module('tripoAsiaApp')
    .controller('MainCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location) {


        $scope.login.err = '';

        $scope.login_check_obj = {};


        var initialize_module = function() {
            $scope.login_check_obj.device_type = 1;
            siteneccesities.init();
            siteneccesities.loadflesslider('belong-anywhere');
            siteneccesities.loadisotope();
        };
        setTimeout(function() { initialize_module(); }, 800);


    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////


var login_check = function() {

    alert("Form submitted");
    var posted_data = {};
    posted_data = $scope.login_check_obj;
    console.log(posted_data);
    var data = $.param({
        email: posted_data.email,
        password: posted_data.password,
        device_type: posted_data.device_type,
        //image: posted_data.image
    });


    // var data = "category_type=" + posted_data.category + "&company_id=" + posted_data.company_id;


    var config = {

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },

    }

    $http.post(configService.getEnvConfig().serverURL + 'login', data, config)
        .success(
            function(data, status, headers, config) {
                console.log(data);
                if (data.status == 1) {

                    window.location.href = configService.getEnvConfig().apiURL + '/admin';
                } else {
                    $scope.login.err = data.msg;
                }

                //  $location.path('/accomodations-list/' + posted_data.category);

            }).error(
            function(data, status, header, config) {
                console.log(status);

                // to prevent interaction outside of dialog



            });




}
