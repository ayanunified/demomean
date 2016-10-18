var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var role_privilegesModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var role_privilegesSchema = new Schema({
    roles_id: Number,
    privilege_id: Number
}, {
    versionKey: false
});

////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
role_privilegesSchema.plugin(autoIncrement.plugin, {
    model: 'role_privileges',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('role_privileges', role_privilegesSchema, 'role_privileges');


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
role_privilegesModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, role_privilegesInfo) {
        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in inserting data"
            });
        } else if (role_privilegesInfo.length == 0) {
            return res.send({
                status: 0,
                msg: "no such data inserted"
            });
        } else {
            next();
        }
    });
}

//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
role_privilegesModel.selectQuery = function(res, data, next) {
    query.find(data, function(err, role_privilegesInfo) {
        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in searching data"
            });
        } else if (role_privilegesInfo.length == 0) {
            return res.send({
                status: 0,
                msg: "could not find any data"
            });
        } else {
            next(role_privilegesInfo);
        }
    });
}



////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = role_privilegesModel;