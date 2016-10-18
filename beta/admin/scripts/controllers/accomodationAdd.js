'use strict';

/**
 * @ngdoc function
 * @name psnApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the psnApp
 */
angular.module('tripoAsiaApp')
    .controller('AccomodationAddCtrl', function($scope, $timeout, $ocLazyLoad, $http, configService, $rootScope, $location, $routeParams) {
        $scope.accomodation_insert_obj = {};
        $scope.category = $routeParams.category;
        console.log($scope.category);

        //alert("from hotelController" + $scope.category);


        ///////////////////////////////////////////////// get function for company list ///////////////////////////////////////////////////
        $scope.list = function() {



            var config = {

                headers: {
                    'Content-Type': 'application/json',

                },


            }

            $http.get(configService.getEnvConfig().serverURL + 'company/listActive', config)

            .success(
                function(data, status, headers, config) {
                    console.log(data);
                    $scope.list = data.list;
                    $scope.category = $routeParams.category;
                    $scope.accomodation_insert_obj.category = $routeParams.category;


                }).error(
                function(data, status, header, config) {
                    console.log(status);

                    // to prevent interaction outside of dialog


                });


        }


        //////////////////////////MAP FUNCTION//////////////////////////////////////////////////////////

        var map;

        function initialize() {
            var myLatlng = new google.maps.LatLng(40.713956, -74.006653);

            var myOptions = {
                zoom: 8,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            var marker = new google.maps.Marker({
                draggable: true,
                //anchorPoint: new google.maps.Point(0, -29),
                position: myLatlng,
                map: map,
                title: "Your location"
            });

            // console.log("location field " + document.getElementById('exact_location'));
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById('exact_location'));

            autocomplete.bindTo('bounds', map);

            var infowindow = new google.maps.InfoWindow();
            autocomplete.addListener('place_changed', function() {
                infowindow.close();
                marker.setVisible(false);
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }
                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17); // Why 17? Because it looks good.
                }
                marker.setIcon( /** @type {google.maps.Icon} */ ({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }

                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                infowindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'dragend', function(event) {


                // document.getElementById("lat").value = event.latLng.lat();
                // document.getElementById("long").value = event.latLng.lng();

                //  var lat = parseFloat(document.getElementById("lat").value);
                // var lng = parseFloat(document.getElementById("long").value);
                // var latlng = new google.maps.LatLng(lat, lng);
                // var geocoder = geocoder = new google.maps.Geocoder();
                new google.maps.Geocoder().geocode({
                    'latLng': new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //console.log(results);
                            $scope.accomodation_insert_obj.exact_location = results[1].formatted_address;
                            $scope.$digest();
                            // document.getElementById("exact_location").value = results[1].formatted_address;
                            //localStorage.setItem("F_address", results[1].formatted_address);

                            // angular.element(document.getElementById("exact_location")).scope().accomodation_insert_obj.exact_location = results[1].formatted_address;


                            // angular.element(document.querySelector('#exact_location')).scope().accomodation_insert_obj.exact_location = results[1].formatted_address;






                        }
                    }
                });


            });
        }


        initialize();
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


        $scope.insert_accomodation = function() {

            alert("Form submitted");
            var posted_data = {};
            posted_data = $scope.accomodation_insert_obj;
            console.log(posted_data);
            var data = $.param({
                category_type: posted_data.category,
                company_id: posted_data.company_id,
                name: posted_data.accomodation_name,
                exact_location: posted_data.exact_location,
                //image: posted_data.image
            });


            // var data = "category_type=" + posted_data.category + "&company_id=" + posted_data.company_id;


            var config = {

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },

            }

            $http.post(configService.getEnvConfig().serverURL + 'accomodation/insert', data, config)
                .success(
                    function(data, status, headers, config) {
                        console.log(data);

                        $location.path('/accomodations-list/' + posted_data.category);

                    }).error(
                    function(data, status, header, config) {
                        console.log(status);

                        // to prevent interaction outside of dialog



                    });




        }



        /////// initializes the controller /////


        var initialize_controller = function() {
            $scope.list();
        }


        initialize_controller();


        //////////////////////////////////////



    });
