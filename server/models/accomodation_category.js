var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var accomodation_categoryModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var Accomodation_categorySchema = new Schema({
    category_name: String

}, {
    versionKey: false
});

////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
Accomodation_categorySchema.plugin(autoIncrement.plugin, {
    model: 'accomodation_category',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('accomodation_category', Accomodation_categorySchema, 'accomodation_category');


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
accomodation_categoryModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, acc_catInfo) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (acc_catInfo.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next();
        }
    });
}

//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
accomodation_categoryModel.selectQuery = function(res, data, next) {
    query.find(data, function(err, ret_data) {
        console.log(query);
        console.log(':::: ret data :::' + JSON.stringify(ret_data) + "::::data" + JSON.stringify(data));
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else if (ret_data.length == 0) {
            return res.send({ status: 0, msg: "do not find any data" });
        } else {
            next(ret_data);
        }
    });
}



////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = accomodation_categoryModel;
