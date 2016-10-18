var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var rolesModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var RolesSchema = new Schema({
    _id: Number,
    roles_name: String,
    parent_id: Number,
    childs: [{
        type: Number,
        ref: 'roles'
    }],
    accomodation_id: {
        type: Number,
        ref: 'accomodation'
    },
    role_privilege: [{
        type: Number,
        ref: 'privileges'
    }]
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
RolesSchema.plugin(autoIncrement.plugin, {
    model: 'roles',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('roles', RolesSchema, 'roles');


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
rolesModel.selectQuery = function(res, data, next) {

    query.find(data, function(err, roles_row) {

        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in searching data"
            });
        } else if (roles_row.length == 0) {
            return res.send({
                status: 0,
                msg: "cannot find any data"
            });
        } else {
            next(roles_row);
        }
    });
}




///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
rolesModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, roles_row) {
        if (err) {
            return res.send({
                status: 0,
                msg: "internal error in inserting data"
            });
        } else if (roles_row.length == 0) {
            return res.send({
                status: 0,
                msg: "no such data inserted"
            });
        } else {
            next(roles_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
rolesModel.updateQuery = function(res, where, data, next) {
    rolesModel.selectQuery(res, where, function(roles) {
        roles = roles[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            roles[i] = data[i];
        }
        rolesModel.insertQuery(res, roles, function(roles_upd) {
            next();
        });
    });
}

//////////////////////////////////////////////////////////////////////////////
////////////JOINNING QUERY FOR SELECTING ROLES+SUB ROLES+PRIVILEGES//////////
////////////////////////////////////////////////////////////////////////////
rolesModel.rolesJoinedQuery = function(res, fetchCriteria, next) {
        query.find(fetchCriteria).populate('role_privilege').exec(function(err, joinnedRoles) {
            if (err) {
                return res.send({
                    status: 0,
                    msg: "err in searching"
                });
            } else if (joinnedRoles.length == 0) {
                return res.send({
                    status: 0,
                    msg: "no such data found"
                });
            } else {
                next(joinnedRoles);
            }
        });
    }
    ////////////////////////////////////////////////
    ////////////EXPORT MODEL///////////////////////
    ///////////////////////////////////////////////
module.exports = rolesModel;
