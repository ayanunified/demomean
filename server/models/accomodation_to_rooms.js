var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var accomodation_to_roomsModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var accomodation_to_roomsSchema = new Schema({
    _id: Number,
    rooms_category: String,
    facilities_included: Array,
    capacity: Number,
    number_booked: Number,
    max_people: Number,
    price_per_night: Number,
    number_of_bathroom: Number,
    number_of_beds: Number,
    status: Number,
    created_on: String,
    updated_at: String,
    room_booked_id: [{
        type: Number,
        ref: 'room_book'
    }]
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
accomodation_to_roomsSchema.plugin(autoIncrement.plugin, {
    model: 'accomodation_to_rooms',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('accomodation_to_rooms', accomodation_to_roomsSchema, 'accomodation_to_rooms');


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
accomodation_to_roomsModel.selectQuery = function(res, data, next) {

    query.find(data, function(err, accomodation_to_rooms_row) {

        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in searching data"
            });
        } else if (accomodation_to_rooms_row.length == 0) {
            return res.send({
                status: 0,
                msg: "cannot find any data"
            });
        } else {
            next(accomodation_to_rooms_row);
        }
    });
}




///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
accomodation_to_roomsModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, accomodation_to_rooms_row) {
        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in inserting data"
            });
        } else if (accomodation_to_rooms_row.length == 0) {
            return res.send({
                status: 0,
                msg: "no such data inserted"
            });
        } else {
            next(accomodation_to_rooms_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
accomodation_to_roomsModel.updateQuery = function(res, where, data, next) {
    accomodation_to_roomsModel.selectQuery(res, where, function(accomodation_to_rooms) {
        accomodation_to_rooms = accomodation_to_rooms[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            accomodation_to_rooms[i] = data[i];
        }
        accomodation_to_roomsModel.insertQuery(res, accomodation_to_rooms, function(accomodation_to_rooms_upd) {
            console.log(JSON.stringify(accomodation_to_rooms_upd));
            next();
        });
    });
}

//////////////////////////////////////////////////////////////////////////////
////////////JOINNING QUERY FOR SELECTING accomodation_to_rooms+SUB accomodation_to_rooms+PRIVILEGES//////////
////////////////////////////////////////////////////////////////////////////
accomodation_to_roomsModel.accomodation_to_roomsJoinedQuery = function(res, fetchCriteria, next) {
        query.find(fetchCriteria).populate('role_privilege').exec(function(err, joinnedaccomodation_to_rooms) {
            if (err) {
                return res.send({
                    status: 0,
                    msg: "err in searching"
                });
            } else if (joinnedaccomodation_to_rooms.length == 0) {
                return res.send({
                    status: 0,
                    msg: "no such data found"
                });
            } else {
                next(joinnedaccomodation_to_rooms);
            }
        });
    }
    ////////////////////////////////////////////////
    ////////////EXPORT MODEL///////////////////////
    ///////////////////////////////////////////////
module.exports = accomodation_to_roomsModel;
