var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var mongoosePaginate = require('mongoose-paginate');

var accomodationModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var AccomodationSchema = new Schema({
    category_type: String,
    company_id: {
        type: Number,
        ref: 'company'
    },
    name: String,
    image: String,
    total_rating: Number,
    number_of_reviews: Number,

    exact_location: String,
    breakfast: String,
    lunch: String,
    dinner: String,
    total_number_of_rooms: Number,
    rooms: [{
        type: Number,
        ref: 'accomodation_to_rooms'
    }],
    price_unit: String,
    created_on: Date,
    updated_at: Date,
    status: Number
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////

AccomodationSchema.plugin(mongoosePaginate);

AccomodationSchema.plugin(autoIncrement.plugin, {
    model: 'accomodation',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('accomodation', AccomodationSchema, 'accomodation');

//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
accomodationModel.selectQuery = function(res, data, next) {
        query.find(data).populate({
            path: 'rooms company_id',
            match: { status: 1 },
            populate: [{
                path: 'room_booked_id',
                match: { status: 1 },
                populate: {
                    path: 'user_id',
                    select: 'first_name last_name email birthday'
                }
            }]

        }).exec(function(err, ret_accomodation_row) {
            if (err) {
                console.log(err);
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.send({ status: 0, msg: "internal error in searching data", error: err });
            } else if (ret_accomodation_row.length == 0) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.send({ status: 0, msg: "cannot find any data" });
            } else {
                next(ret_accomodation_row);
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////
    ////////////SELECT QUERY FOR FILTERED ACCOMODATION SEARCH/////////////////////
    //////////////////////////////////////////////////////////////////////////////
accomodationModel.filteredselectQuery = function(res, data, next) {
    query.find().populate({
        path: 'rooms company_id',
        match: { status: 1, number_of_bathroom: 3 },
        populate: [{
            path: 'room_booked_id',
            // match: { status: 1, check_in: { $gt: data.check_in }, check_out: { $lt: data.check_out } },
            match: { status: 1 },
            populate: {
                path: 'user_id',
                select: 'first_name last_name email birthday'
            }
        }]

    }).exec(function(err, ret_accomodation_row) {
        if (err) {
            return res.send({ status: 0, msg: "internal error in searching data", error: err });
        } else if (ret_accomodation_row.length == 0) {
            return res.send({ status: 0, msg: "cannot find any data" });
        } else {
            next(ret_accomodation_row);
        }
    });
}

///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
accomodationModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, ret_accomodation_row) {
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            return res.send({ status: 0, msg: "internal error in inserting data" });
        } else if (ret_accomodation_row.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            return res.send({ status: 0, msg: "no such data inserted" });
        } else {
            next(ret_accomodation_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
accomodationModel.updateQuery = function(res, where, data, next) {
    accomodationModel.selectQuery(res, where, function(accomodation) {
        accomodation = accomodation[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            accomodation[i] = data[i];
        }
        accomodationModel.insertQuery(res, accomodation, function(accomodation_upd) {
            next();
        });
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = accomodationModel;
