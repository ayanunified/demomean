var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var autoIncrement = require('mongoose-auto-increment');

var User_Session_Model = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var User_Session = new Schema({
    user_device_id: Number,
    login_timestamp: String,
    logout_timestamp: String
}, {
    versionKey: false
});
////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
User_Session.plugin(autoIncrement.plugin, {
    model: 'user_session',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('user_session', User_Session, 'user_session');


///////////////////////////////////////////////
/////UPDATE QUERY /////////////////////////////
///////////////////////////////////////////////
User_Session_Model.updateForuserSession = function(res, where, data, next) {
    User_Session_Model.selectForuserSession(res, where, function(ret_user_session) {
        var ret_user_session = ret_user_session[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            ret_user_session[i] = data[i];
        }
        User_Session_Model.insertForUserSession(res, ret_user_session, function(link) {
            next(link);
        });
    });
}


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
User_Session_Model.selectForuserSession = function(res, where, next) {
    query.find(where, function(err, return_user_ses) {
        console.log("User Session Table Data" + JSON.stringify(return_user_ses));
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 0, msg: "internal error in searching user_session data", error: err });
        }
        //else if (user.length == 0) {
        //     return res.send({ status: 0, msg: "Your email is inncorrect" });
        // } 
        else {
            next(return_user_ses);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
User_Session_Model.insertForUserSession = function(res, data, next) {
    query.create(data, function(err, user) {
        console.log("User Session Table Inserted Data" + JSON.stringify(user));
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 0, msg: "internal error in inserting/updating user session data", error: err });
        } else if (user.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 0, msg: "no user session data inserted/updated" });
        } else {
            next(user);
        }
    });
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = User_Session_Model;
