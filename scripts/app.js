'use strict';

/**
 * @ngdoc overview
 * @name psnApp
 * @description
 * # psnApp
 *
 * Main module of the application.
 */
var app = angular
    .module(
        'tripoAsiaApp', [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngMessages',
            'validation.match',
            'angular-loading-bar',
            'app.config',
            'oc.lazyLoad',
            'config.service',
            'ngMaterial',
            'angularjs-dropdown-multiselect',
            'hljs',
            'ui.bootstrap',
            'angularPayments',
            'ngIdle',
            'tableSort',
            'angularValidator',
            'oitozero.ngSweetAlert',
            '720kb.datepicker'

        ])




.config(function($routeProvider, $locationProvider, IdleProvider, KeepaliveProvider) {

        $routeProvider

            .when('/', {

            templateUrl: 'views/home-page.html',
            controller: 'MainCtrl',

        })

        .otherwise({

            redirectTo: '/'

        });

    })
    .run(function($rootScope, $location) {
        $rootScope.title = 'Tripoasia';

    });


app.controller('indexcontroller', function(Idle, $compile, $interval, $rootScope, $location, $http, SweetAlert, configService, $mdDialog, $scope, $filter, $timeout) {
    $scope.login = {};
    $scope.login_check_obj = {};
    $scope.login.err = "";
    $scope.login_check_obj.device_type = 1;



    $scope.login_check = function() {

        //alert("Form submitted");
        var posted_data = {};
        posted_data = $scope.login_check_obj;
        console.log(posted_data);
        var data = $.param({
            email: posted_data.email,
            password: posted_data.password,
            device_type: posted_data.device_type,
        });


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
                        if (data.user_type == 1) {
                            localStorage.setItem("auth_token", data.auth_token);
                            window.location.href = configService.getEnvConfig().apiURL + '/admin';
                        }

                    } else {
                        $scope.login.err = data.msg;
                    }

                    //  $location.path('/accomodations-list/' + posted_data.category);

                }).error(
                function(data, status, header, config) {
                    console.log(status);

                    // to prevent interaction outside of dialog



                });


    };

    $rootScope.gotourl = function(ui_url, params) {
        // alert(ui_url + "  " + params);
        var redirect_string = ui_url;

        for (var i in params) {
            redirect_string += "/" + params[i];
        }
        //alert(redirect_string);
        $location.path(redirect_string);

    }

});
