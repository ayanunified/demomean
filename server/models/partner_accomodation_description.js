var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var accomodationDescriptionModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var AccomodationDescriptionSchema = new Schema({
    partner_id: Number,
    image: String,
    description: String,
    title: String,
    created_on: String,
    updated_at: String,
    status: Number
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
AccomodationDescriptionSchema.plugin(autoIncrement.plugin, {
    model: 'partner_accomodation_description',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('partner_accomodation_description', AccomodationDescriptionSchema, 'partner_accomodation_description');


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
accomodationDescriptionModel.selectQuery = function(res, data, next) {

    query.find(data, function(err, description_accomodation_row) {
        console.log(query);
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else if (description_accomodation_row.length == 0) {
            return res.send({ status: 0, msg: "cannot find any data" });
        } else {
            next(description_accomodation_row);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
accomodationDescriptionModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, description_accomodation_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (description_accomodation_row.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(description_accomodation_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
accomodationDescriptionModel.updateQuery = function(res, where, data, next) {
    accomodationDescriptionModel.selectQuery(res, where, function(accomodation) {
        accomodation = accomodation[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            accomodation[i] = data[i];
        }
        accomodationDescriptionModel.insertQuery(res, accomodation, function(accomodation_upd) {
            next();
        });
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = accomodationDescriptionModel;
