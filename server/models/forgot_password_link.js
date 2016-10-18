var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var forgotLinkModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var forgot_password_link = new Schema({
    email: String,
    token: String,
    created_on: String,
    updated_at: String,
    status: Number
}, {
    versionKey: false
});
////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
forgot_password_link.plugin(autoIncrement.plugin, {
    model: 'forgot_password_link',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('forgot_password_link', forgot_password_link, 'forgot_password_link');

///////////////////////////////////////////////
////////////SELECT QUERY FOR LOGIN////////////
///////////////////////////////////////////////
forgotLinkModel.selectQuery = function(res, data, next) {
    query.find(data, function(err, row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else if (row.length == 0) {
            return res.send({ status: 0, msg: "invalid data" });
        } else {
            next(row);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
forgotLinkModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (row.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(row);
        }
    });
}

///////////////////////////////////////////////
//////////////////COUNT QUERY/////////////////
///////////////////////////////////////////////
forgotLinkModel.countQuery = function(res, data, next) {
    query.count(data, function(err, count) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in counting data" });
        } else {
            next(count);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE STATUS/////////////////////////////
///////////////////////////////////////////////
forgotLinkModel.updateQuery = function(res, where, data, next) {
    forgotLinkModel.selectQuery(res, where, function(link) {
        link = link[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            link[i] = data[i];
        }
        forgotLinkModel.insertQuery(res, link, function(link) {
            next();
        });
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = forgotLinkModel;
