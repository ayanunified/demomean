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
var site_settings = models.siteSetting;

//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var site_info = site_settings.selectQuery;
var site_info_update = site_settings.updateQuery;
var site_info_insert = site_settings.insertQuery;

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR SITE SETTINGS INSERT///////////
/////////////////////////////////////////////////////////////
PublicVar.postSiteSettingsInsert = function(req, res, next) {
    var insertdata = {};

    if (req['body']['field_name'].trim().length == 0) {
        return res.send({ status: 0, msg: "nothing to be inserted" });
    } else {
        insertdata.field_name = req['body']['field_name'].trim();
        insertdata.value = (typeof req['body']['field_value'].trim().length != 0 ? req['body']['field_value'].trim() : "");
    }
    site_info_insert(res, insertdata, function(siteInfo) {
        return res.send({ status: 1, msg: "Information Saved Successfully" });
    });

}

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR SITE SETTINGS LIST/////////////
/////////////////////////////////////////////////////////////
PublicVar.getSiteSettingsList = function(req, res, next) {
    site_info(res, {}, function(site_list) {
        return res.send({ status: 1, msg: "Information Fetched Successfully", site_list: site_list });
    });
}

///////////////////////////////////////////////////////////////
//////////SERVICE FOR SPECIFIC SITE SETTINGS SHOW/////////////
/////////////////////////////////////////////////////////////
PublicVar.postSiteSetting = function(req, res, next) {
    var siteFetchingData = { _id: req.body.id };
    site_info(res, siteFetchingData, function(site_info) {
        return res.send({ status: 1, msg: "Field Fetched", site_data: site_info[0] });
    });
}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR SITE SETTINGS UPDATE///////////
/////////////////////////////////////////////////////////////
PublicVar.postSiteSettingsUpdate = function(req, res, next) {
    var searchInfo = { _id: parseInt(req['body']['id']) };

    var updateSiteSettingsInfo = [];

    updateSiteSettingsInfo['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    if (req.file) {
        ///////////////////IF FILE EXISTS//////////////////////////////////////
        var fn_arr = req.file.mimetype.split('/');
        var fntype = fn_arr[0];
        if (fntype != 'image') {
            //////////////////IF TYPE IS NOT IMAGE//////////////////////////////////////////
            fs.unlink(req.file.path);
            return res.send({ status: 0, msg: "please upload an image" });
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

            updateSiteSettingsInfo['value'] = req.file.filename;

            site_info(res, searchInfo, function(site_info) {

                previous_image_path = site_info[0]['value'];
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

                site_info_update(res, searchInfo, updateSiteSettingsInfo, function() {
                    return res.send({ status: 1, msg: "Information Edited Successfully" });
                });
            });
        }
    } else {
        updateSiteSettingsInfo['value'] = req['body']['field_value'].trim();
        site_info_update(res, searchInfo, updateSiteSettingsInfo, function() {
            return res.send({ status: 1, msg: "Information Edited Successfully" });
        });
    }
}


////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
