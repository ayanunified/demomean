document.getElementById("files").onchange = function() {
    var reader = new FileReader();

    reader.onload = function(e) {
        // get loaded data and render thumbnail.
        document.getElementById("image").src = e.target.result;
    };

    // read the image file as a data URL.
    reader.readAsDataURL(this.files[0]);



};



var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

function Validate(oForm) {
    var arrInputs = oForm.getElementsByTagName("input");
    for (var i = 0; i < arrInputs.length; i++) {
        var oInput = arrInputs[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }

                if (!blnValid) {


                    // document.getElementById("file_check").value = "";
                    alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));

                }


            }
        }
    }

    //document.getElementById("file_check").value = 1;
}

// ///////////////////////////MAP FUNCTION//////////////////////////////////////////////////////////

// var map;

// function initialize() {
//     var myLatlng = new google.maps.LatLng(40.713956, -74.006653);

//     var myOptions = {
//         zoom: 8,
//         center: myLatlng,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

//     var marker = new google.maps.Marker({
//         draggable: true,
//         //anchorPoint: new google.maps.Point(0, -29),
//         position: myLatlng,
//         map: map,
//         title: "Your location"
//     });

//     // console.log("location field " + document.getElementById('exact_location'));
//     var autocomplete = new google.maps.places.Autocomplete(document.getElementById('exact_location'));

//     autocomplete.bindTo('bounds', map);

//     var infowindow = new google.maps.InfoWindow();
//     autocomplete.addListener('place_changed', function() {
//         infowindow.close();
//         marker.setVisible(false);
//         var place = autocomplete.getPlace();
//         if (!place.geometry) {
//             window.alert("Autocomplete's returned place contains no geometry");
//             return;
//         }
//         // If the place has a geometry, then present it on a map.
//         if (place.geometry.viewport) {
//             map.fitBounds(place.geometry.viewport);
//         } else {
//             map.setCenter(place.geometry.location);
//             map.setZoom(17); // Why 17? Because it looks good.
//         }
//         marker.setIcon( /** @type {google.maps.Icon} */ ({
//             url: place.icon,
//             size: new google.maps.Size(71, 71),
//             origin: new google.maps.Point(0, 0),
//             anchor: new google.maps.Point(17, 34),
//             scaledSize: new google.maps.Size(35, 35)
//         }));
//         marker.setPosition(place.geometry.location);
//         marker.setVisible(true);

//         var address = '';
//         if (place.address_components) {
//             address = [
//                 (place.address_components[0] && place.address_components[0].short_name || ''),
//                 (place.address_components[1] && place.address_components[1].short_name || ''),
//                 (place.address_components[2] && place.address_components[2].short_name || '')
//             ].join(' ');
//         }

//         infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//         infowindow.open(map, marker);
//     });

//     google.maps.event.addListener(marker, 'dragend', function(event) {


//         // document.getElementById("lat").value = event.latLng.lat();
//         // document.getElementById("long").value = event.latLng.lng();

//         //  var lat = parseFloat(document.getElementById("lat").value);
//         // var lng = parseFloat(document.getElementById("long").value);
//         // var latlng = new google.maps.LatLng(lat, lng);
//         // var geocoder = geocoder = new google.maps.Geocoder();
//         new google.maps.Geocoder().geocode({
//             'latLng': new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
//         }, function(results, status) {
//             if (status == google.maps.GeocoderStatus.OK) {
//                 if (results[1]) {
//                     console.log(results);
//                     // document.getElementById("exact_location").value = results[1].formatted_address;
//                     //localStorage.setItem("F_address", results[1].formatted_address);

//                     //angular.element($("#exact_location")).scope().accomodation_insert_obj.exact_location = results[1].formatted_address;
//                     // angular.element(document.getElementById("exact_location")).scope().accomodation_insert_obj.exact_location = results[1].formatted_address;


//                     angular.element(document.querySelector('#exact_location')).scope().accomodation_insert_obj.exact_location = results[1].formatted_address;
//                     console.log(angular.element(document.querySelector('#exact_location')).scope().accomodation_insert_obj.exact_location);


//                     //alert("Location: " + results[1].formatted_address);
//                 }
//             }
//         });


//     });
// }

//google.maps.event.addDomListener(window, "load", initialize());
