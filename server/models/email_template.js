var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var emailTemplateModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var template = new Schema({
    name: String,
    subject: String,
    email_body: String,
    updated_at: String,
    status: Number,
    parameters: Array
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
template.plugin(autoIncrement.plugin, {
    model: 'email_template',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('email_template', template, 'email_template');
emailTemplateModel.schema = template;


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
emailTemplateModel.selectQuery = function(res, data, next) {
    query.find(data, function(err, email_template_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else if (email_template_row.length == 0) {
            return res.send({ status: 0, msg: "cannot find any data" });
        } else {
            next(email_template_row);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
emailTemplateModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, email_template_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (email_template_row.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(email_template_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
emailTemplateModel.updateQuery = function(res, where, data, next) {
    emailTemplateModel.selectQuery(res, where, function(template) {
        template = template[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            template[i] = data[i];
        }
        emailTemplateModel.insertQuery(res, template, function(template_upd) {
            next();
        });
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = emailTemplateModel;
