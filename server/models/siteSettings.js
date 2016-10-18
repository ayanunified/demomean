var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var siteSettingsmodel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var SiteSettings = new Schema({
    field_name: String,
    value: String,
    created_at: String,
    updated_at: String
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
SiteSettings.plugin(autoIncrement.plugin, {
    model: 'siteSettings',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('siteSettings', SiteSettings, 'site_setting');

//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
siteSettingsmodel.selectQuery = function(res, data, next) {
    query.find(data, function(err, siteInfo) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else if (siteInfo.length == 0) {
            return res.send({ status: 0, msg: "no data found" });
        } else {
            next(siteInfo);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
siteSettingsmodel.updateQuery = function(res, where, data, next) {
    siteSettingsmodel.selectQuery(res, where, function(siteInfo) {
        siteInfo = siteInfo[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            siteInfo[i] = data[i];
        }
        siteSettingsmodel.insertQuery(res, siteInfo, function(link) {
            next();
        });
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
siteSettingsmodel.insertQuery = function(res, data, next) {
    query.create(data, function(err, siteInfo) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (siteInfo.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(siteInfo);
        }
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = siteSettingsmodel;
