var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var autoIncrement = require('mongoose-auto-increment');

var User_Device_Model = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var User_Device = new Schema({
    email: String,
    device_id: String,
    device_type: String,
    mob_type: String,
    unique_id: String,
    status: Number,
    userId: Number,
    timeStamp: String
}, {
    versionKey: false
});
////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
User_Device.plugin(autoIncrement.plugin, {
    model: 'user_device',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('user_device', User_Device, 'user_device');


///////////////////////////////////////////////
/////UPDATE QUERY /////////////////////////////
///////////////////////////////////////////////
User_Device_Model.updateForuserDevice = function(res, where, data, next) {
    User_Device_Model.selectForuserDevice(res, where, function(ret_user_device) {
        var ret_user_device = ret_user_device[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            ret_user_device[i] = data[i];
        }
        User_Device_Model.insertForUserDevice(res, ret_user_device, function(link) {
            next(link);
        });
    });
}


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
User_Device_Model.selectForuserDevice = function(res, where, next) {
    query.find(where, function(err, return_user_dev) {
        console.log("User Device Table Data" + JSON.stringify(return_user_dev));
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 0, msg: "internal error in searching user_device data", error: err });
        }
        //else if (user.length == 0) {
        //     return res.send({ status: 0, msg: "Your email is inncorrect" });
        // } 
        else {
            next(return_user_dev);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
User_Device_Model.insertForUserDevice = function(res, data, next) {
    query.create(data, function(err, user) {
        console.log("User Device Table Inserted Data" + JSON.stringify(user));
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 0, msg: "internal error in inserting/updating user device data", error: err });
        } else if (user.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 0, msg: "no user device data inserted/updated" });
        } else {
            next(user);
        }
    });
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = User_Device_Model;
