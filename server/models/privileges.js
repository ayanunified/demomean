var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var privilegesModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var privilegeSchema = new Schema({
    name: String
}, {
    versionKey: false
});

////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
privilegeSchema.plugin(autoIncrement.plugin, {
    model: 'privileges',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('privileges', privilegeSchema, 'privileges');


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
privilegesModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, privilegeInfo) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (privilegeInfo.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next();
        }
    });
}

//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
privilegesModel.selectQuery = function(res, data, next) {
    query.find(data, function(err, privilegeInfo) {
        if (err) {
            return res.send({ status: 0, msg: JSON.stringify(err) });
        } else if (privilegeInfo.length == 0) {
            return res.send({ status: 0, msg: "do not find any data" });
        } else {
            next(privilegeInfo);
        }
    });
}



////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = privilegesModel;
