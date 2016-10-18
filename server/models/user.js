var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var autoIncrement = require('mongoose-auto-increment');

var usermodel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var User = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    user_type: Number,
    birthday: String,
    company_id: {
        type: Number,
        ref: 'company'
    },
    roles_id: [{
        type: Number,
        ref: 'roles'
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
User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('user', User, 'user');

////////////////////////////////////////////////
////////////PRE SAVE///////////////////////////
///////////////////////////////////////////////
User.pre("save", function(next) {
    var user = this;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    next();
});

///////////////////////////////////////////////
////////////SELECT QUERY FOR LOGIN////////////
///////////////////////////////////////////////
usermodel.loginQuery = function(res, data, next) {
    var email_check = {};
    email_check.email = data.email;
    query.find(email_check, function(err, user) {
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "internal error in searching data",
                error: err
            });
        } else if (user.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "Your email is inncorrect"
            });
        } else {
            var database_pwd = user[0].password;
            var compare = bcrypt.compareSync(data.password, database_pwd);
            if (compare == true) next(user);
            else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.send({
                    status: 0,
                    msg: "Your password is inncorrect"
                });
            }
        }
    });
}

//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
usermodel.selectQuery = function(res, data, next) {
    query.find(data, function(err, user) {
        console.log(user);
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "internal error in searching data"
            });
        } else if (user.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "Your Credential is inncorrect"
            });
        } else {
            next(user);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
usermodel.insertQuery = function(res, data, next) {
    query.create(data, function(err, user) {
        console.log(user);
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "internal error in inserting data"
            });
        } else if (user.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "no such data inserted"
            });
        } else {
            next(user);
        }
    });
}

///////////////////////////////////////////////
//////////////////COUNT QUERY/////////////////
///////////////////////////////////////////////
usermodel.countQuery = function(res, data, next) {
    query.count(data, function(err, count) {
        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in counting data"
            });
        } else {
            next(count);
        }
    });
}

///////////////////////////////////////////////
/////UPDATE QUERY IN PASSWORD CHANGE//////////
///////////////////////////////////////////////
usermodel.updateQuery = function(res, where, data, next) {
    usermodel.selectQuery(res, where, function(user) {
        user = user[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            user[i] = data[i];
        }
        usermodel.insertQuery(res, user, function(link) {
            next();
        });
    });
}

///////////////////////////////////////////////
/////JOIN QUERY////////////////////////////////
///////////////////////////////////////////////
usermodel.userJoinedQuery = function(res, fetchCriteria, next) {
    query.find(fetchCriteria).populate({
        path: 'roles_id company_id',

        select: 'accomodation_id role_privilege roles_name name',
        populate: [{
            path: 'accomodation_id',
            select: 'name',

        }, {
            path: 'role_privilege'
        }]
    }).select('first_name last_name email company_id birthday roles_id status created_on updated_at').exec(function(err, joinnedUser) {
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "err in searching"
            });
        } else if (joinnedUser.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({
                status: 0,
                msg: "no such data found"
            });
        } else {
            next(joinnedUser);
        }
    });
}


////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = usermodel;
