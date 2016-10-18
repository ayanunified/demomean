var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var room_bookModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var room_bookSchema = new Schema({
    _id: Number,
    check_in: String,
    check_out: String,
    number_of_rooms: Number,
    user_id: {
        type: Number,
        ref: 'user'
    },
    status: Number
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
room_bookSchema.plugin(autoIncrement.plugin, {
    model: 'room_book',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('room_book', room_bookSchema, 'room_book');


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
room_bookModel.selectQuery = function(res, data, next) {

    query.find(data, function(err, room_book_row) {

        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in searching data"
            });
        } else if (room_book_row.length == 0) {
            return res.send({
                status: 0,
                msg: "cannot find any data"
            });
        } else {
            next(room_book_row);
        }
    });
}




///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
room_bookModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, room_book_row) {
        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in inserting data"
            });
        } else if (room_book_row.length == 0) {
            return res.send({
                status: 0,
                msg: "no such data inserted"
            });
        } else {
            next(room_book_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
room_bookModel.updateQuery = function(res, where, data, next) {
    room_bookModel.selectQuery(res, where, function(room_book) {
        room_book = room_book[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            room_book[i] = data[i];
        }
        room_bookModel.insertQuery(res, room_book, function(room_book_upd) {
            console.log(JSON.stringify(room_book_upd));
            next();
        });
    });
}

//////////////////////////////////////////////////////////////////////////////
////////////JOINNING QUERY FOR SELECTING room_book+SUB room_book+PRIVILEGES//////////
////////////////////////////////////////////////////////////////////////////
room_bookModel.room_bookJoinedQuery = function(res, fetchCriteria, next) {
        query.find(fetchCriteria).populate('role_privilege').exec(function(err, joinnedroom_book) {
            if (err) {
                return res.send({
                    status: 0,
                    msg: "err in searching"
                });
            } else if (joinnedroom_book.length == 0) {
                return res.send({
                    status: 0,
                    msg: "no such data found"
                });
            } else {
                next(joinnedroom_book);
            }
        });
    }
    ////////////////////////////////////////////////
    ////////////EXPORT MODEL///////////////////////
    ///////////////////////////////////////////////
module.exports = room_bookModel;
