//////////////////////////////////////////
/////////TEMPORARY OBJECT TO EXPORT//////
////////////////////////////////////////
var PublicVar = {};

//////////////////////////////////////////
/////////REQUIRING ALL FILES/////////////
////////////////////////////////////////
var models = require('../../config/modelsConfig');
var fs = require('fs');
var Thumbnail = require('thumbnail');
var moment = require('moment');
//////////////////////////////////////////
/////////CALLING ALL MODELS//////////////
////////////////////////////////////////
var accomodation = models.accomodation;
var accomodation_category = models.accomodation_category;
var roles = models.roles;
var roles_to_privileges = models.roles_to_privileges;
var accomodation_to_rooms = models.accomodation_to_rooms;
var room_book = models.room_book;
//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var accomodation_info = accomodation.selectQuery;
var accomodation_update = accomodation.updateQuery;
var accomodation_insert = accomodation.insertQuery;
var accomodation_filtered_search = accomodation.filteredselectQuery;


var accomodation_category_info = accomodation_category.selectQuery;
var accomodation_category_info_insert = accomodation_category.insertQuery;

var accomodation_to_rooms_insert = accomodation_to_rooms.insertQuery;
var accomodation_to_rooms_update = accomodation_to_rooms.updateQuery;
var accomodation_to_rooms_select = accomodation_to_rooms.selectQuery;

var roles_insert = roles.insertQuery;
var roles_info = roles.selectQuery;
//var roles_parent_child_join = roles.joinSelfQuery;
var roles_to_privileges_insert = roles_to_privileges.insertQuery;

var room_book_insert = room_book.insertQuery;
///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR EMAIL TEMPLATE INSERT//////////
/////////////////////////////////////////////////////////////
PublicVar.postAccomodationInsert = function(req, res, next) {

    // console.log(req['body']['category_type']);
    var insertdata = {};
    if (typeof req['body']['category_type'] != "undefined")
        insertdata.category_type = req['body']['category_type'].trim();
    if (typeof req['body']['company_id'] != "undefined")
        insertdata.company_id = parseInt(req['body']['company_id'].trim());
    if (typeof req['body']['name'] != "undefined")
        insertdata.name = req['body']['name'].trim();
    if (typeof req['body']['total_rating'] != "undefined")
        insertdata.total_rating = parseInt(req['body']['total_rating'].trim());
    if (typeof req['body']['number_of_reviews'] != "undefined")
        insertdata.number_of_reviews = parseInt(req['body']['number_of_reviews'].trim());
    if (typeof req['body']['exact_location'] != "undefined")
        insertdata.exact_location = req['body']['exact_location'].trim();
    if (typeof req['body']['breakfast'] != "undefined")
        insertdata.breakfast = req['body']['breakfast'].trim();
    if (typeof req['body']['dinner'] != "undefined")
        insertdata.dinner = req['body']['dinner'].trim();
    if (typeof req['body']['lunch'] != "undefined")
        insertdata.lunch = req['body']['lunch'].trim();
    if (typeof req['body']['total_number_of_rooms'] != "undefined")
        insertdata.total_number_of_rooms = parseInt(req['body']['total_number_of_rooms'].trim());
    if (typeof req['body']['price_unit'] != "undefined")
        insertdata.price_unit = req['body']['price_unit'].trim();
    insertdata.created_on = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    insertdata.status = 1;

    if (req.file) {
        ///////////////////IF FILE EXISTS//////////////////////////////////////
        var fn_arr = req.file.mimetype.split('/');
        var fntype = fn_arr[0];
        if (fntype != 'image') {
            //////////////////IF TYPE IS NOT IMAGE//////////////////////////////////////////
            fs.unlink(req.file.path);
            return res.send({
                status: 0,
                msg: "please upload an image"
            });
        } else {
            //////////////////IF TYPE IS IMAGE MAKE THUMBNAIL(100X100)//////////////////////////////////////////
            var thumbnail = new Thumbnail('./uploads/images', './uploads/thumbnail');
            thumbnail.ensureThumbnail(req.file.filename, 100, 100, function(err, filename) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("THUMBNAIL  :::" + filename);
                }
            });

            insertdata.image = req.file.filename;
        }
    }
    //else {
    //     return res.send({
    //         status: 0,
    //         msg: "Image field cant be left blank !"
    //     });

    // }

    accomodation_insert(res, insertdata, function(accomodation_row) {
        console.log(JSON.stringify(accomodation_row));

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        return res.send({
            status: 1,
            msg: "Information Inserted Successfully"
        });

    });
}

///////////////////////////////////////////////////////////////////////////
//var roles_id_arr = req['body']['role'];
////    //var accomodation_last_inserted_id = accomodation_row._id;
//var sel_q = [];
//for (i in roles_id_arr) {
//    var ids = {};
//    ids._id = parseInt(roles_id_arr[i]);
//    sel_q.push(ids);
//}
//var fetchCriteria = {
//    $or: sel_q
//};
//roles_parent_child_join(fetchCriteria, function(roles) {
//    return res.send(roles);
//        var ins_q = [];
//        for (i in roles) {
//            ins_q.push({
//                roles_name: parseInt(returned_data.id),
//                parent_id: parseInt(role_privilege[i])
//            });
//
//        }
//});
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION  LIST/////
/////////////////////////////////////////////////////////////

////////////////Previous Version/////////////////////////////////////////////

// PublicVar.getAccomodationList = function(req, res, next) {
//     var fetchingData = {
//         // category_type: req.body.category_type
//         category_type: req.param('category_type')
//     };

//     console.log(req.param('category_type'));
//     accomodation_info(res, fetchingData, function(accomodation_list) {

//         res.setHeader('Access-Control-Allow-Origin', '*');
//         // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//         // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//         return res.send({
//             status: 1,
//             msg: "Information Fetched Successfully",
//             list: accomodation_list
//         });
//     });
// }

/////////////////////////////new one///////////////////////////////////////


PublicVar.getAccomodationList = function(req, res, next) {

    var fetchingData = {
        category_type: req.body.category_type
            // category_type: req.param('category_type')
    };

    console.log(req.body.category_type);

    accomodation_info(res, fetchingData, function(accomodation_list) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.send({
            status: 1,
            msg: "Information Fetched Successfully",
            list: accomodation_list
        });
    });
}



///////////////////////////////////////////////////////////////
//////////SERVICE FOR SPECIFIC ACCOMODATION SHOW////////////
/////////////////////////////////////////////////////////////
PublicVar.postAccomodation = function(req, res, next) {
    var fetchingData = {
        _id: req.body.id
    };
    accomodation_info(res, fetchingData, function(accomodation_info) {
        return res.send({
            status: 1,
            msg: "Field Fetched",
            list: accomodation_info[0]
        });
    });
}




//////////////////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION  SEARCH  WITH FILTER//////////
/////////////////////////////////////////////////////////////////////////
PublicVar.postAccomodationListByfilter = function(req, res, next) {
    var fetchingData = {};
    fetchingData.check_in = req['body']['check_in'].trim();
    fetchingData.check_out = req['body']['check_out'].trim();
    //var location = req['body']['location']
    // fetchingData.name = req['body']['name'].trim();
    // fetchingData.total_rating = parseInt(req['body']['total_rating'].trim());


    accomodation_filtered_search(res, fetchingData, function(accomodation_list) {
        return res.send({
            status: 1,
            msg: "Information Fetched Successfully",
            list: accomodation_list
        });
    });
}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION UPDATE///////////
/////////////////////////////////////////////////////////////
PublicVar.postAccomodationUpdate = function(req, res, next) {
    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };

    var updateAccomodationInfo = [];

    updateAccomodationInfo['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    updateAccomodationInfo['category_type'] = req['body']['category_type'].trim();
    updateAccomodationInfo['company_id'] = req['body']['company_id'].trim();
    updateAccomodationInfo['name'] = req['body']['name'].trim();
    updateAccomodationInfo['total_rating'] = parseInt(req['body']['total_rating'].trim());
    updateAccomodationInfo['number_of_reviews'] = parseInt(req['body']['number_of_reviews'].trim());
    updateAccomodationInfo['exact_location'] = req['body']['exact_location'].trim();
    updateAccomodationInfo['breakfast'] = req['body']['breakfast'].trim();
    updateAccomodationInfo['lunch'] = req['body']['lunch'].trim();
    updateAccomodationInfo['dinner'] = req['body']['dinner'].trim();
    updateAccomodationInfo['total_number_of_rooms'] = parseInt(req['body']['total_number_of_rooms'].trim());
    updateAccomodationInfo['price_per_night'] = parseInt(req['body']['price_per_night'].trim());
    updateAccomodationInfo['price_unit'] = req['body']['price_unit'].trim();
    if (req.file) {
        ///////////////////IF FILE EXISTS//////////////////////////////////////
        var fn_arr = req.file.mimetype.split('/');
        var fntype = fn_arr[0];
        if (fntype != 'image') {
            //////////////////IF TYPE IS NOT IMAGE//////////////////////////////////////////
            fs.unlink(req.file.path);
            return res.send({
                status: 0,
                msg: "please upload an image"
            });
        } else {
            //////////////////IF TYPE IS IMAGE MAKE THUMBNAIL(100X100)//////////////////////////////////////////
            var thumbnail = new Thumbnail('./uploads/images', './uploads/thumbnail');
            thumbnail.ensureThumbnail(req.file.filename, 100, 100, function(err, filename) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(filename);
                }
            });

            updateAccomodationInfo['image'] = req.file.filename;

            accomodation_info(res, searchInfo, function(accomodation_info) {

                previous_image_path = accomodation_info[0]['image'];
                if (previous_image_path.length != 0) {
                    //////////////////////unlinking previous image/////////////////////////
                    path_to_unlink = './uploads/images/' + previous_image_path;
                    console.log(path_to_unlink);
                    fs.unlink(path_to_unlink);

                    //////////////////////unlinking previous image-thumnail/////////////////////////
                    var index = previous_image_path.indexOf('.');
                    var value = "-100x100";
                    var previous_thumbnail_path = previous_image_path.substr(0, index) + value + previous_image_path.substr(index);
                    path_to_unlink = './uploads/thumbnail/' + previous_thumbnail_path;
                    console.log(path_to_unlink);
                    fs.unlink(path_to_unlink);
                }

                accomodation_update(res, searchInfo, updateAccomodationInfo, function() {
                    return res.send({
                        status: 1,
                        msg: "Information Edited Successfully"
                    });
                });
            });
        }
    } else {

        accomodation_update(res, searchInfo, updateAccomodationInfo, function() {
            return res.send({
                status: 1,
                msg: "Information Edited Successfully"
            });
        });
    }
}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION STATUS CHANGE///////////
/////////////////////////////////////////////////////////////
PublicVar.postAccomodationStatusChange = function(req, res, next) {
    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };

    var updateAccomodationInfo = [];
    updateAccomodationInfo['status'] = parseInt(req['body']['status'].trim());
    accomodation_update(res, searchInfo, updateAccomodationInfo, function() {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.send({
            status: 1,
            msg: "Status  Changed Successfully"
        });
    });
}

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION CATEGORY LIST/////
/////////////////////////////////////////////////////////////
PublicVar.getAccomodationCategoryList = function(req, res, next) {
    accomodation_category_info(res, {}, function(accomodation_list) {
        return res.send({
            status: 1,
            msg: "Information Fetched Successfully",
            accomodation_category_list: accomodation_list
        });
    });
}


///////////////////////////////////////////////////////////////
////////////SERVICE FOR ACCOMODATION CATEGORY LIST INSERT/////
/////////////////////////////////////////////////////////////
PublicVar.postAccomodationCategoryInsert = function(req, res, next) {
    var insertdata = {
        category_name: req['body']['category_name'].trim()
    };
    accomodation_category_info_insert(res, insertdata, function() {
        return res.send({
            status: 1,
            msg: "Information Inserted Successfully"
        });
    });
}

///////////////////////ROOM INSERT  FOR ACCOMODATION/////////////////////////////////////////////////

PublicVar.postAccomodationRoomInsert = function(req, res, next) {


    var insertdata = {};
    var accomodation_id = req['body']['accomodation_id'].trim();
    insertdata.rooms_category = req['body']['rooms_category'].trim();
    insertdata.facilities_included = req['body']['facilities_included'];
    insertdata.max_people = parseInt(req['body']['max_people'].trim());
    insertdata.capacity = parseInt(req['body']['capacity'].trim());
    insertdata.number_booked = 0;
    insertdata.price_per_night = parseInt(req['body']['price_per_night'].trim());
    insertdata.number_of_beds = parseInt(req['body']['number_of_beds'].trim());
    insertdata.number_of_bathroom = parseInt(req['body']['number_of_bathroom'].trim());
    insertdata.created_on = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    insertdata.status = 1;

    accomodation_to_rooms_insert(res, insertdata, function(accomodationRooms_row) {
        // console.log(JSON.stringify(accomodationRooms_row));
        accomodation_info(res, { _id: accomodation_id }, function(accomodation_list) {


            var searchInfo = {
                _id: accomodation_id
            };
            var temp_arr = [];
            temp_arr = accomodation_list[0].rooms;
            temp_arr.push(accomodationRooms_row._id);
            var updateAccomodationInfo = [];
            updateAccomodationInfo['rooms'] = temp_arr;

            // console.log(JSON.stringify(updateAccomodationInfo['rooms']));
            accomodation_update(res, searchInfo, updateAccomodationInfo, function() {

                return res.send({
                    status: 1,
                    msg: "Information Inserted Successfully"
                });

            });


        });

    });
}


///////////////////////ROOM UPDATE  FOR ACCOMODATION/////////////////////////////////////////////////

PublicVar.postAccomodationRoomUpdate = function(req, res, next) {

    var updatedata = {};
    updateId = parseInt(req['body']['id'].trim());
    var updateInfo = {
        _id: updateId
    };
    updatedata.rooms_category = req['body']['rooms_category'].trim();
    updatedata.facilities_included = req['body']['facilities_included'];
    updatedata.max_people = parseInt(req['body']['max_people'].trim());
    updatedata.capacity = parseInt(req['body']['capacity'].trim());
    updatedata.price_per_night = parseInt(req['body']['price_per_night'].trim());
    updatedata.number_of_beds = parseInt(req['body']['number_of_beds'].trim());
    updatedata.number_of_bathroom = parseInt(req['body']['number_of_bathroom'].trim());
    updatedata.updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    accomodation_to_rooms_update(res, updateInfo, updatedata, function() {


        return res.send({
            status: 1,
            msg: "Information Edited Successfully"
        });


    });
}

///////////////////////ROOM STATUS CHANGE   FOR ACCOMODATION/////////////////////////////////////////////////

PublicVar.postAccomodationRoomStatusUpdate = function(req, res, next) {

    var updatedata = {};
    updateId = parseInt(req['body']['id'].trim());
    var updateInfo = {
        _id: updateId
    };
    updatedata.status = req['body']['status'].trim();


    accomodation_to_rooms_update(res, updateInfo, updatedata, function() {


        return res.send({
            status: 1,
            msg: "Status Edited Successfully"
        });


    });
}


///////////////////////ROOM BOOK/////////////////////////////////////////////////

PublicVar.postRoomBook = function(req, res, next) {

    var insertdata = {};
    var accomodation_to_rooms_id = parseInt(req['body']['accomodation_to_rooms_id'].trim());
    insertdata.check_in = req['body']['check_in'].trim();
    insertdata.check_out = req['body']['check_out'].trim();
    insertdata.number_of_rooms = parseInt(req['body']['number_of_rooms'].trim());
    insertdata.user_id = parseInt(req['body']['user_id'].trim());
    insertdata.status = 1;
    accomodation_to_rooms_select(res, { _id: accomodation_to_rooms_id }, function(accomodation_to_room_list) {
        var total_number_booked = accomodation_to_room_list[0].number_booked + parseInt(req['body']['number_of_rooms'].trim());
        var capacity = accomodation_to_room_list[0].capacity;
        if (total_number_booked > capacity) {
            return res.send({
                status: 0,
                msg: "This quantity of rooms is not available!"
            });

        }
        room_book_insert(res, insertdata, function(bookedRooms_row) {

            var updatedata = {};
            var updateId = accomodation_to_rooms_id;
            var updateInfo = {
                _id: updateId
            };

            updatedata.number_booked = total_number_booked;
            var temp_arr = [];
            temp_arr = accomodation_to_room_list[0].room_booked_id;
            temp_arr.push(bookedRooms_row._id);

            updatedata.room_booked_id = temp_arr;
            accomodation_to_rooms_update(res, updateInfo, updatedata, function() {

                return res.send({
                    status: 1,
                    msg: "Information Inserted Successfully"
                });

            });
        });
    });
}


///////////////////////ROOM BOOK LIST/////////////////////////////////////////////////



////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
