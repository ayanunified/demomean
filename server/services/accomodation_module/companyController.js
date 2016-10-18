//////////////////////////////////////////
/////////TEMPORARY OBJECT TO EXPORT//////
////////////////////////////////////////
var PublicVar = {};

//////////////////////////////////////////
/////////REQUIRING ALL FILES/////////////
////////////////////////////////////////
var models = require('../../config/modelsConfig');
var moment = require('moment');
var Thumbnail = require('thumbnail');
var fs = require('fs');
//////////////////////////////////////////
/////////CALLING ALL MODELS//////////////
////////////////////////////////////////
var company_model = models.company;
//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var compinsert = company_model.insertQuery;
var compupdate = company_model.updateQuery;
var compList = company_model.selectQuery;

///////////////////////////////////////////////
///////////SERVICE FOR COMPANY REGISTER///////
/////////////////////////////////////////////
PublicVar.postCompanyRegister = function(req, res, next) {
    var insertdata = {};
    insertdata.name = req['body']['name'].trim();
    insertdata.contact_person_name = req['body']['contact_person_name'].trim();
    insertdata.contact_number = req['body']['contact_number'].trim();
    insertdata.email = req['body']['email'].trim();
    insertdata.caption = req['body']['caption'].trim();
    insertdata.head_office_address = req['body']['head_office_address'].trim();
    insertdata.user_type = 2;
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

            insertdata.comp_logo = req.file.filename;
        }
    } else {
        insertdata.comp_logo = "";
    }


    compinsert(res, insertdata, function(user) {
        return res.send({
            status: 1,
            msg: "Company inserted Successfully"
        });
    });
}

///////////////////////////////////////////////
///////////SERVICE FOR COMPANY REGISTER///////
/////////////////////////////////////////////
PublicVar.postCompanyChangeStatus = function(req, res, next) {
    var statusInfo = [];
    var searchInfo = {
        _id: parseInt(req['body']['id'].trim())
    };
    statusInfo['status'] = parseInt(req['body']['status'].trim());
    compupdate(res, searchInfo, statusInfo, function() {
        return res.send({
            status: 1,
            msg: "Status Changed Successfully"
        });
    });
}

///////////////////////////////////////////////
///////////SERVICE FOR COMPANY LISTING-ALL////
/////////////////////////////////////////////
PublicVar.getCompanylistAll = function(req, res, next) {
    compList(res, {}, function(company_rows) {
        return res.send({
            status: 1,
            msg: "List Fetched Successfully",
            list: company_rows
        });
    });
}

///////////////////////////////////////////////
////SERVICE FOR COMPANY LISTING-ACTIVE////////
/////////////////////////////////////////////
PublicVar.getCompanylistActive = function(req, res, next) {
    var searchInfo = {
        status: 1
    };
    compList(res, searchInfo, function(company_rows) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.send({
            status: 1,
            msg: "List Fetched Successfully",
            list: company_rows
        });
    });
}

///////////////////////////////////////////////
////SERVICE FOR COMPANY LISTING-ACTIVE////////
/////////////////////////////////////////////
PublicVar.postCompanyShow = function(req, res, next) {
    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };
    compList(res, searchInfo, function(company_rows) {
        return res.send({
            status: 1,
            msg: "List Fetched Successfully",
            company: company_rows
        });
    });
}

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR COMPANY DETAILS UPDATE/////////
/////////////////////////////////////////////////////////////
PublicVar.postCompanyUpdate = function(req, res, next) {
    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };

    var updateCompanyInfo = [];

    updateCompanyInfo['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    updateCompanyInfo['name'] = req['body']['name'].trim();
    updateCompanyInfo['contact_person_name'] = req['body']['contact_person_name'].trim();
    updateCompanyInfo['contact_number'] = req['body']['contact_number'].trim();
    updateCompanyInfo['email'] = req['body']['email'].trim();
    updateCompanyInfo['caption'] = req['body']['caption'].trim();
    updateCompanyInfo['head_office_address'] = req['body']['head_office_address'].trim();
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

            updateCompanyInfo['comp_logo'] = req.file.filename;

            compList(res, searchInfo, function(company_info) {

                previous_image_path = company_info[0]['comp_logo'];

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

                compupdate(res, searchInfo, updateCompanyInfo, function() {
                    return res.send({
                        status: 1,
                        msg: "Information Edited Successfully"
                    });
                });
            });
        }
    } else {

        compupdate(res, searchInfo, updateCompanyInfo, function() {
            return res.send({
                status: 1,
                msg: "Information Edited Successfully"
            });
        });
    }
}

////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
