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





        var initialize_module = function() {

            siteneccesities.init();
            siteneccesities.loadflesslider('belong-anywhere');
            siteneccesities.loadisotope();
        };

        setTimeout(function() { initialize_module(); }, 800);




    });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
