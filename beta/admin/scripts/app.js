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
        templateUrl: 'views/dashboard.html',
        controller: 'HomeCtrl',


    })



    .when('/accomodations-list/:category', {
        templateUrl: 'views/accomodation.html',
        controller: 'AccomodationCtrl',


    })


    .when('/accomodations-StatusChange/:id/:status/:category', {
        templateUrl: 'views/accomodation.html',
        controller: 'AccomodationStatusChangeCtrl',


    })






    //////////////////////////ADD ACCOMODATION FORM PAGE////////////////////////////////////////////////////////
    .when('/accomodations-add/:category', {
        templateUrl: 'views/add-accomodation.html',
        controller: 'AccomodationAddCtrl',


    })

    ////////////////////////PARTNER LIST //////////////////////////////////////////////////////////////////////////


    .when('/partner-Details/:user_type', {

        templateUrl: 'views/partnerList.html',
        controller: 'PartnerListCtrl',


    })

    .when('/partner-StatusChange/:id/:status/:user_type', {
        templateUrl: 'views/partnerList.html',
        controller: 'PartnerStatusChangeCtrl',


    })

    .when('/partner-Edit/:id', {
        templateUrl: 'views/partnerEdit.html',
        controller: 'PartnerEditCtrl',


    })




    .otherwise({
        redirectTo: '/'
    });
})


app.controller('indexcontroller', function(Idle, $compile, $interval, $rootScope, $location, $http, SweetAlert, configService, $mdDialog, $scope, $filter, $timeout) {

    $rootScope.sweetalert = function(ui_url, params) {

        SweetAlert.swal({
                title: "Are you sure?",
                text: "This will change the status of the user!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Change Status!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    SweetAlert.swal("Status Changed!", "Partner's Status Changed Succesfully.", "success");
                    $rootScope.gotourl(ui_url, params);
                } else {
                    SweetAlert.swal("Cancelled", "Status Not changed.", "error");
                    $location.path('/partner-Details/' + params[2]);
                }
            });

    }



    $rootScope.sweetConfirm = function(ui_url, params) {

        SweetAlert.swal({
                title: "Are you sure?",
                text: "This will change the status of the Accomodation!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Change Status!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    SweetAlert.swal("Status Changed!", "Accomodation's Status Changed Succesfully.", "success");
                    $rootScope.gotourl(ui_url, params);
                } else {
                    SweetAlert.swal("Cancelled", "Status Not changed.", "error");
                    $location.path('/accomodations-list/' + params[2]);
                }
            });

    }


    $rootScope.gotourl = function(ui_url, params) {
        // alert(ui_url + "  " + params);
        var redirect_string = ui_url;

        for (var i in params) {
            redirect_string += "/" + params[i];
        }
        //alert(redirect_string);
        $location.path(redirect_string);

    }



    // $scope.moveto_Hotellist = function(val) {
    //     // body...
    //     // alert("app.js alert" + val);
    //     $location.path('/hotel_list/' + val);
    //     // $location.path('/propertylist-criteria/'+location_id+'/'+criteria_id);

    // }


    // $scope.moveto_Resortslist = function(val) {

    //     // alert("app.js alert" + val);
    //     $location.path('/resort_list/' + val);

    // }


    // $scope.moveto_Villaslist = function(val) {

    //     //alert("app.js alert" + val);
    //     $location.path('/villa_list/' + val);

    // }



    // $scope.hotel_statusChange = function(val1, val2, val3) {

    //     // alert("app.js alert " + val1 + " " + val2);
    //     $location.path('/hotelStatusChange/' + val1 + "/" + val2 + "/" + val3);

    // }
    // $scope.resort_statusChange = function(val1, val2, val3) {

    //     // alert("app.js alert " + val1 + " " + val2);
    //     $location.path('/resortStatusChange/' + val1 + "/" + val2 + "/" + val3);

    // }
    // $scope.villa_statusChange = function(val1, val2, val3) {

    //     // alert("app.js alert " + val1 + " " + val2);
    //     $location.path('/villaStatusChange/' + val1 + "/" + val2 + "/" + val3);

    // }


    // /////////////////////////////////////////////ADD ACCOMODATION FORM PAGE/////////////////////////////////////////////////////
    // $scope.moveto_HotelAdd = function() {

    //     //alert("app.js alert");
    //     $location.path('/hotel_add');

    // }

    // $scope.moveto_ResortAdd = function() {

    //     //alert("app.js alert");
    //     $location.path('/resort_add');

    // }



    // $scope.moveto_VillaAdd = function() {

    //     //alert("app.js alert");
    //     $location.path('/villa_add');

    // }





});
