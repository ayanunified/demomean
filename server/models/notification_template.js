var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var notificationTemplateModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var template = new Schema({
    title: String,
    subject: String,
    template_body: String,
    updated_at: String,
    status: Number,
    parameter: Array
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
template.plugin(autoIncrement.plugin, {
    model: 'notification_template',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('notification_template', template, 'notification_template');
notificationTemplateModel.schema = template;


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
notificationTemplateModel.selectQuery = function(res, data, next) {
    query.find(data, function(err, notification_template_row) {
        console.log(notification_template_row);
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else if (notification_template_row.length == 0) {
            return res.send({ status: 0, msg: "cannot find any data" });
        } else {
            next(notification_template_row);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
notificationTemplateModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, notification_template_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (notification_template_row.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(notification_template_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
notificationTemplateModel.updateQuery = function(res, where, data, next) {
    notificationTemplateModel.selectQuery(res, where, function(template) {
        template = template[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            template[i] = data[i];
        }
        notificationTemplateModel.insertQuery(res, template, function(template_upd) {
            next();
        });
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = notificationTemplateModel;
