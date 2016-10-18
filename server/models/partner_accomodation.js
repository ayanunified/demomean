var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var partner_accomodationModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var partnerAccomodationSchema = new Schema({
    partner_id: Number,
    accomodation_type: String,
    property_type: String,
    number_of_bedrooms: Number,
    number_of_guests: Number,
    number_of_beds: Number,
    number_of_bathroom: Number,
    country: String,
    location: Array,
    amenities: Array,
    spaces_for_guests: Array,
    short_description: [{
        type: Number,
        ref: 'partner_accomodation_description'
    }],
    created_on: String,
    updated_at: String,
    status: Number
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
partnerAccomodationSchema.plugin(autoIncrement.plugin, {
    model: 'partner_accomodation',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('partner_accomodation', partnerAccomodationSchema, 'partner_accomodation');


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
partner_accomodationModel.selectQuery = function(res, data, next) {

    query.find(data, function(err, partner_accomodation_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data" });
        } else {
            next(partner_accomodation_row);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
partner_accomodationModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, partner_accomodation_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (partner_accomodation_row.length == 0) {
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(partner_accomodation_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
partner_accomodationModel.updateQuery = function(res, where, data, next) {
    partner_accomodationModel.selectQuery(res, where, function(accomodation) {
        accomodation = accomodation[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            accomodation[i] = data[i];
        }
        partner_accomodationModel.insertQuery(res, accomodation, function(accomodation_upd) {
            next();
        });
    });
}


//////////////////////////////////////////////////////////////////////////////
////////////JOINNING QUERY FOR SELECTING PARTNER ACCOMODATION//////////////////////
/////////////////////////////////////////////////////////////////////////////////
partner_accomodationModel.partnerAccomodationJoinedQuery = function(res, fetchCriteria, next) {
    //console.log(fetchCriteria);
    query.find(fetchCriteria).populate('short_description').exec(function(err, joinneddata) {
        if (err) {
            return res.send({
                status: 0,
                msg: "err in searching"
            });
        } else if (joinneddata.length == 0) {
            return res.send({
                status: 0,
                msg: "no such data found"
            });
        } else {
            next(joinneddata);
        }
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = partner_accomodationModel;
