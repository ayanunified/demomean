//////////////////////////////////////////
/////////TEMPORARY OBJECT TO EXPORT//////
////////////////////////////////////////
var PublicVar = {};

//////////////////////////////////////////
/////////REQUIRING ALL FILES/////////////
////////////////////////////////////////
var models = require('../../config/modelsConfig');
var crypto = require('crypto');
var nodemailer = require("nodemailer");
var moment = require('moment');
//////////////////////////////////////////
/////////CALLING ALL MODELS//////////////
////////////////////////////////////////
var userModel = models.USER;
var forgotPasswordModel = models.forgot_password_link;
var user_device_model = models.user_device;
var user_session_model = models.user_session;
//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var userlogin = userModel.loginQuery;
var userinsert = userModel.insertQuery;
var isExists = userModel.countQuery;
var userupdate = userModel.updateQuery;
var join = userModel.userJoinedQuery;

var insertLink = forgotPasswordModel.insertQuery;
var selectLink = forgotPasswordModel.selectQuery;
var linkupdate = forgotPasswordModel.updateQuery;

var selectForuserDevice = user_device_model.selectForuserDevice;
var insertForUserDevice = user_device_model.insertForUserDevice;
var updateForuserDevice = user_device_model.updateForuserDevice;

var insertForUserSession = user_session_model.insertForUserSession;
var updateForuserSession = user_session_model.updateForuserSession;

////////////////////////////////////////
///////////TEMPORARY FUNCTION//////////
//////////////////////////////////////
var uniqueId = function() {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var token = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return token;
}

////////////////////////////////////////////////////
/////////////FOR SMTP TRANSPORT/////////////////////
///////////////////////////////////////////////////
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "jit.unified@gmail.com",
        pass: "jit212016"
    }
});

////////////////////////////////////////
///////////SERVICE FOR LOGIN///////////
//////////////////////////////////////
PublicVar.postLogin = function(req, res, next) {

        var email = req.body.email.trim();
        var password = req.body.password.trim();
        var searchdata = {};
        searchdata.email = email;
        searchdata.password = password;
        userlogin(res, searchdata, function(user) {
            console.log("User Table Data" + JSON.stringify(user));
            var user_id = parseInt(user[0]._id);
            var device_type = req.body.device_type.trim();
            var unique_id = uniqueId();
            var timeStamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            if (device_type == '2') {
                var mob_type = req.body.mob_type.trim();
                var device_id = req.body.device_id.trim();
                login_details_user(req, res, email, unique_id, device_type, device_id, mob_type, timeStamp, user_id, user);
            } else {
                login_details_user(req, res, email, unique_id, device_type, "", "", timeStamp, user_id, user);
            }
            //return res.send({ status: 1, msg: "Login Successfully", user_id: user[0]._id });
        });
    }
    //////////////////////////////////
    ///////SERVICE FOR LOGIN DETAILS
    //
    //////////////////////////////////
var login_details_user = function(req, res, email, unique_id, device_type, device_id, mob_type, timeStamp, user_id, user) {

    var where = {};
    where.email = email;
    where.device_type = device_type;
    where.userId = user_id;
    //  where.device_id = device_id;
    if (device_id != "") {
        where.device_id = device_id;
        where.mob_type = mob_type;
    }

    selectForuserDevice(res, where, function(data) {
        //console.log(JSON.stringify(data));
        if (data.length == 0 || device_type == "1") {

            // var delete_user = {};
            // if (device_id != "") {
            //     delete_user.device_id = device_id;
            // } else {
            //     delete_user.unique_id = unique_id;
            //     delete_user.device_type = device_type;
            // }
            // deleteForUser(delete_user, function(deleted_user) {
            //     if (deleted_user == 'err') {
            //         var msg = "Internal Error Occurred ! for deletion";
            //         var result = "";
            //         return sendApidata(res, deleted_user, msg, result);
            //     }
            // });
            var insertdata = {};
            insertdata.email = email;
            insertdata.device_id = device_id;
            insertdata.mob_type = mob_type;
            insertdata.unique_id = unique_id;
            insertdata.device_type = device_type;
            insertdata.status = 1;
            insertdata.userId = user_id;
            insertdata.timeStamp = timeStamp;
            insertForUserDevice(res, insertdata, function(returned_status) {
                user_sessionInsertdata = {};
                user_sessionInsertdata.user_device_id = returned_status._id;
                user_sessionInsertdata.login_timestamp = timeStamp;
                insertForUserSession(res, user_sessionInsertdata, function(ret_data) {

                    var status = {};
                    status.status = 1;
                    status.User_type = user[0].user_type;
                    status.auth_token = returned_status.unique_id;

                    // return res.send({
                    //     status: status,
                    //     msg: "Login Successfully",
                    //     result:user
                    // });


                    var msg = "Logged in ";
                    //var result = "";
                    return sendApidata(res, status, msg, "");
                });
            });
        } else if (data.length != 0) { /*if exists*/

            var where = {};
            where.email = email;
            where.device_type = device_type;
            where.userId = user_id;
            //where.unique_id = unique_id;
            where.device_id = device_id;
            where.mob_type = mob_type;

            var set = {};
            tokenizing(res, data[0].unique_id, function(tokenized) {
                if (tokenized.status == 1) {
                    set.status = 1;
                    set.unique_id = tokenized.unique_id;
                    set.timeStamp = timeStamp;

                } else {
                    set.status = 1;
                }


                updateForuserDevice(res, where, set, function(update_status) {
                    where_condition = {};
                    where_condition.user_device_id = update_status._id;
                    var set_condition = {};
                    set_condition.login_timestamp = timeStamp;
                    updateForuserSession(res, where_condition, set_condition, function(user_ses_update_status) {
                        //console.log("update status of user_session table :::" + JSON.stringify(user_ses_update_status));

                        var status = {};
                        status.status = 1;
                        status.User_type = user[0].user_type;
                        status.auth_token = update_status.unique_id;
                        var msg = "Logged in ";
                        // var result = "";
                        return sendApidata(res, status, msg, "");
                    });
                });
            });
        }
    })
}



//----------------------------------------token change---------------------------------------------------
var tokenizing = function(res, unique_id, next) {
    //console.log("unique_id at tokenizing function" + unique_id);
    var token = {};
    var where = {};
    where.unique_id = unique_id;
    selectForuserDevice(res, where, function(token_tS) {
        console.log("tokenizing function got returned from select query :" + JSON.stringify(token_tS));
        if (token_tS.length != 0) {
            var tS = token_tS[0].timeStamp;
            console.log("tS:" + tS)
            var now_tS = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

            var ms = moment(now_tS, "YYYY-MM-DD HH:mm:ss").diff(moment(tS, "YYYY-MM-DD HH:mm:ss"));

            var diff = moment.duration(ms);
            var diff_minute = Math.floor(diff.asMinutes());
            console.log("diff_minute:" + diff_minute);
            if (diff_minute >= 3) {
                var unique_id = uniqueId();
                token.status = 1;
                token.unique_id = unique_id;
            } else {
                token.status = 0;
            }
            console.log("token changed:" + JSON.stringify(token));
            next(token);
        } else {
            return res.send({
                status: 0,
                msg: "Not a valid token!"
            });
        }
    });
}


////////////////////////////////////////
///////////SERVICE FOR LOGOUT///////////
//////////////////////////////////////
PublicVar.Logout = function(req, res, next) {

    var auth_token = req.body.auth_token.trim();
    var where = {};
    where.unique_id = auth_token;
    var set = {};
    set.status = 0;
    updateForuserDevice(res, where, set, function(update_status) {
        where_condition = {};
        where_condition.user_device_id = update_status._id;
        var set_condition = {};
        set_condition.logout_timestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        updateForuserSession(res, where_condition, set_condition, function(user_ses_update_status) {
            //console.log("update status of user_session table :::" + JSON.stringify(user_ses_update_status));
            return res.send({
                status: 1,
                msg: "Logout Successful"
            });
        });

    });

}

////////////////////////////////////////
///////////SERVICE FOR REGISTER////////
//////////////////////////////////////
PublicVar.postRegister = function(req, res, next) {
    var insertdata = {};
    insertdata.first_name = req.body.first_name.trim();
    insertdata.last_name = req.body.last_name.trim();
    insertdata.email = req.body.email.trim();
    insertdata.password = req.body.password.trim();
    insertdata.birthday = req.body.birthday.trim();
    insertdata.user_type = parseInt(req.body.user_type.trim());
    insertdata.created_on = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    insertdata.status = 1;
    userinsert(res, insertdata, function(user) {
        return res.send({
            status: 1,
            msg: "User inserted Successfully"
        });
    });
}

////////////////////////////////////////
////SERVICE FOR FORGOT PASSWORD////////
//////////////////////////////////////
PublicVar.postForgotPwd = function(req, res, next) {

    var email = req.body.email;

    var is_exists = {
        email: email
    };
    console.log(is_exists);
    isExists(res, is_exists, function(count) {

        if (count > 0) {
            var unique_id = uniqueId();
            var link = req.body.link.replace("[TOKEN]", unique_id);
            var storeLink = {};
            storeLink.email = email;
            storeLink.token = unique_id;
            storeLink.created_on = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            storeLink.status = 1;
            console.log(storeLink);

            smtpTransport.sendMail({
                from: "jit.unified@gmail.com",
                // sender address
                to: email,
                // comma separated list of receivers
                subject: "Forgot Password",
                // Subject line
                text: link // plaintext body
            }, function(error, response) {
                if (error) {
                    console.log(error);
                    return res.send({
                        status: 0,
                        msg: "failure in sending mail."
                    });
                } else {
                    console.log(response.message);
                    insertLink(res, storeLink, function(row) {
                        return res.send({
                            status: 1,
                            msg: "please go and check your mail."
                        });
                    });
                }
            });
        } else {
            return res.send({
                status: 0,
                msg: "no user with this email."
            });
        }
    });
};

////////////////////////////////////////
////SERVICE FOR RESET PASSWORD////////
//////////////////////////////////////
PublicVar.postResetPwd = function(req, res, next) {
    is_exists = {};
    is_exists.email = req.body.email;
    is_exists.token = req.headers.token;

    selectLink(res, is_exists, function(link_row) {
        console.log(link_row);
        if (link_row[0].status == 1) {
            var where = {
                email: req.body.email
            };
            var data = [];
            data['password'] = req.body.password;
            data['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            userupdate(res, where, data, function() {
                var status = [];
                status['status'] = 0;
                status['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                linkupdate(res, is_exists, status, function() {
                    return res.send({
                        status: 1,
                        msg: "Password Successfully updated."
                    });
                });
            });
        } else {
            return res.send({
                status: 0,
                msg: "Link has been used and cant be used again!"
            });
        }
    });
}

////////////////////////////////////////
///SERVICE FOR USER_ROLES_ACCOMODATION/
//////////////////////////////////////
PublicVar.partnerDetails = function(req, res, next) {

    fetchCriteria = {
        user_type: parseInt(req.body.user_type)

    };
    join(res, fetchCriteria, function(ret) {
        var status = 1;
        var msg = "Information Fetched Successfully";
        var result = ret;
        return sendApidata(res, status, msg, result);


    });
}


////////////////////////////////////////
///PARTNER DETAILS FOR EDIT////////////
//////////////////////////////////////
PublicVar.specific_partnerDetails = function(req, res, next) {

    fetchCriteria = {
        _id: parseInt(req['body']['id'])

    };
    join(res, fetchCriteria, function(ret) {
        var status = 1;
        var msg = "Information Fetched Successfully";
        var result = ret;
        return sendApidata(res, status, msg, result);


    });
}



////////////////////////////////////////
///SERVICE FOR USER_STATUS_CHANGE//////
//////////////////////////////////////

PublicVar.postUserStatusChange = function(req, res, next) {

    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };

    var updateUserInfo = [];
    updateUserInfo['status'] = parseInt(req['body']['status'].trim());

    userupdate(res, searchInfo, updateUserInfo, function() {

        var status = 1;
        var msg = "Status Changed Successfully";
        var result = "";
        return sendApidata(res, status, msg, result);

    });

}


////////////////////////////////////////
///SERVICE FOR USER DETAILS UPDATE//////
////////////////////////////////////////

PublicVar.postUserUpdate = function(req, res, next) {

    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };

    var updateUserInfo = [];
    updateUserInfo['fname'] = req['body']['fname'].trim();
    updateUserInfo['lname'] = req['body']['lname'].trim();
    updateUserInfo['email'] = req['body']['email'].trim();
    updateUserInfo['birthday'] = req['body']['birthday'].trim();
    updateUserInfo['company_id'] = parseInt(req['body']['company_id'].trim());
    updateUserInfo['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    userupdate(res, searchInfo, updateUserInfo, function() {

        var status = 1;
        var msg = "Information Updated Successfully";
        var result = "";
        return sendApidata(res, status, msg, result);

    });

}


////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;

//////////////////////SEND API////////////////////////////////////////

var sendApidata = function(res, status, msg, result) {
    var sendables = {};


    if (typeof(status) == 'object') {
        sendables.status = status.status;
        sendables.auth_token = status.auth_token;
        sendables.user_type = status.User_type;
    } else {
        sendables.status = status;
    }


    sendables.msg = msg;
    if (result != "")
        sendables.list = result;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(sendables);
    /*main sendapi data function*/
}
