//////////////////////////////////////////
/////////TEMPORARY OBJECT TO EXPORT//////
////////////////////////////////////////
var PublicVar = {};

//////////////////////////////////////////
/////////REQUIRING ALL FILES/////////////
////////////////////////////////////////
var models = require('../../config/modelsConfig');
var moment = require('moment');
var fs = require('fs');
var Thumbnail = require('thumbnail');
//////////////////////////////////////////
/////////CALLING ALL MODELS//////////////
////////////////////////////////////////
var accomodation = models.accomodation;
var accomodation_category = models.accomodation_category;
var roles = models.roles;
var roles_to_privileges = models.roles_to_privileges;
var partner_accomodation = models.partner_accomodation;
var partner_accomodation_description = models.partner_accomodation_description;
//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var accomodation_info = partner_accomodation.selectQuery;
var accomodation_joineddata = partner_accomodation.partnerAccomodationJoinedQuery;
var accomodation_update = partner_accomodation.updateQuery;
var accomodation_insert = partner_accomodation.insertQuery;


var accomodation_description_insert = partner_accomodation_description.insertQuery;
///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR EMAIL TEMPLATE INSERT//////////
/////////////////////////////////////////////////////////////
PublicVar.postPartnerAccomodationInsert = function(req, res, next) {





    var insertdata = {};
    insertdata.partner_id = parseInt(req['body']['partner_id'].trim());
    insertdata.accomodation_type = req['body']['accomodation_type'].trim();
    insertdata.property_type = req['body']['property_type'].trim();
    insertdata.number_of_bedrooms = parseInt(req['body']['number_of_bedrooms'].trim());
    insertdata.number_of_guests = parseInt(req['body']['number_of_guests'].trim());
    insertdata.number_of_beds = parseInt(req['body']['number_of_beds'].trim());
    insertdata.number_of_bathroom = parseInt(req['body']['number_of_bathroom'].trim());

    insertdata.country = req['body']['country'].trim();
    insertdata.location = req['body']['location'];

    insertdata.amenities = req['body']['amenities'];
    if (req['body']['amenities'].length == 0) {
        return res.send({
            status: 0,
            msg: "You Must Select At Least One Amenity"
        });
    }

    insertdata.spaces_for_guests = req['body']['spaces_for_guests'];
    if (typeof req['body']['created_on'] == 'undefined') {
        insertdata.created_on = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    } else {
        insertdata.created_on = req['body']['created_on'].trim();
    }

    insertdata.status = 1;

    accomodation_info(res, { partner_id: parseInt(req['body']['partner_id'].trim()) }, function(accomodation_list) {
        if (accomodation_list.length == 0) {


            accomodation_insert(res, insertdata, function(accomodation_row) {
                return res.send({
                    status: 1,
                    msg: "Information Inserted Successfully"
                });

            });
        } else {
            //////////////////UPDATE QUERY////////////////////////////////

            var searchInfo = {
                partner_id: parseInt(req['body']['partner_id'].trim())
            };


            accomodation_update(res, searchInfo, insertdata, function() {
                return res.send({
                    status: 1,
                    msg: "Information Edited Successfully"
                });
            });


        }

    });
}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR PARTNER ACCOMODATION  LIST/////
/////////////////////////////////////////////////////////////
PublicVar.getPartnerAccomodationList = function(req, res, next) {
    accomodation_info(res, {}, function(accomodation_list) {
        return res.send({
            status: 1,
            msg: "Information Fetched Successfully",
            accomodation_list: accomodation_list
        });
    });
}

///////////////////////////////////////////////////////////////
//////////SERVICE FOR SPECIFIC EMAIL TEMPLATE SHOW////////////
/////////////////////////////////////////////////////////////
PublicVar.postPartnerAccomodation = function(req, res, next) {
    var fetchingData = {
        partner_id: parseInt(req['body']['partner_id'].trim())
    };
    accomodation_joineddata(res, fetchingData, function(accomodation_info) {
        return res.send({
            status: 1,
            msg: "Field Fetched",
            accomodation_data: accomodation_info[0]
        });
    });
}



///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION UPDATE///////////
/////////////////////////////////////////////////////////////
PublicVar.postPartnerAccomodationUpdate = function(req, res, next) {
    var searchInfo = {
        partner_id: parseInt(req['body']['partner_id'].trim())
    };
    var insertdata = {};
    insertdata.accomodation_type = req['body']['accomodation_type'].trim();
    insertdata.property_type = req['body']['property_type'].trim();
    insertdata.number_of_bedrooms = parseInt(req['body']['number_of_bedrooms'].trim());
    insertdata.number_of_guests = parseInt(req['body']['number_of_guests'].trim());
    insertdata.number_of_beds = parseInt(req['body']['number_of_beds'].trim());
    insertdata.number_of_bathroom = parseInt(req['body']['number_of_bathroom'].trim());

    insertdata.country = req['body']['country'].trim();
    insertdata.location = req['body']['location'];

    insertdata.amenities = req['body']['amenities'];
    if (req['body']['amenities'].length == 0) {
        return res.send({
            status: 0,
            msg: "You Must Select At Least One Amenity"
        });
    }

    insertdata.spaces_for_guests = req['body']['spaces_for_guests'];

    insertdata.updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");




    accomodation_update(res, searchInfo, insertdata, function() {
        return res.send({
            status: 1,
            msg: "Information Edited Successfully"
        });
    });

}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION STATUS CHANGE///////////
/////////////////////////////////////////////////////////////
PublicVar.postPartnerAccomodationStatusChange = function(req, res, next) {
        var searchInfo = {
            partner_id: parseInt(req['body']['partner_id'].trim())
        };

        var updateAccomodationInfo = [];
        updateAccomodationInfo['status'] = parseInt(req['body']['status'].trim());
        accomodation_update(res, searchInfo, updateAccomodationInfo, function() {
            return res.send({
                status: 1,
                msg: "Status  Changed Successfully"
            });
        });
    }
    //////////////////////////////////////////////
    ///////////ACCOMODATION DESCRIPTION INSERT////
    /////////////////////////////////////////////
PublicVar.postAccomodationDescriptionInsert = function(req, res, next) {

    console.log(req['body']);
    var insertdata = {};
    insertdata.partner_id = parseInt(req['body']['partner_id'].trim());
    insertdata.description = req['body']['description'].trim();
    insertdata.title = req['body']['title'].trim();
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
    } else {
        return res.send({
            status: 0,
            msg: "Image field cant be left blank !"
        });

    }

    accomodation_description_insert(res, insertdata, function(accomodation_description_row) {

        var insertdescription = [];
        var searchInfo = {};
        searchInfo = accomodation_description_row.partner_id;
        insertdescription['short_description'] = accomodation_description_row._id;
        accomodation_update(res, searchInfo, insertdescription, function(accomodation_row) {

            return res.send({
                status: 1,
                msg: "Information Inserted Successfully"
            });

        });
    });
}

////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
