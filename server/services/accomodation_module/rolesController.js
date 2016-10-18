//////////////////////////////////////////
/////////TEMPORARY OBJECT TO EXPORT//////
////////////////////////////////////////
var PublicVar = {};

//////////////////////////////////////////
/////////REQUIRING ALL FILES/////////////
////////////////////////////////////////
var models = require('../../config/modelsConfig');
// var fs = require('fs');
// var Thumbnail = require('thumbnail');
var moment = require('moment');
var filter = require('filter-object');
//////////////////////////////////////////
/////////CALLING ALL MODELS//////////////
////////////////////////////////////////
var roles = models.roles;
var privileges = models.privileges;
//var accomodation_category = models.accomodation_category;

//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var roles_info = roles.selectQuery;
var roles_update = roles.updateQuery;
var roles_insert = roles.insertQuery;
var rolesJoinedQuery = roles.rolesJoinedQuery;



var privileges_info = privileges.selectQuery;


//var privileges_info_insert = accomodation_category.insertQuery;

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR Roles INSERT//////////
/////////////////////////////////////////////////////////////
PublicVar.postRolesInsert = function(req, res, next) {


    var insertdata = {};
    var parent_id = parseInt(req['body']['parent_id'].trim());

    insertdata.roles_name = req['body']['roles_name'].trim();
    insertdata.accomodation_id = parseInt(req['body']['accomodation_id'].trim());
    insertdata.parent_id = parent_id;
    insertdata.childs = [];
    var role_privilege = [];
    role_privilege = req.body.roles_privilege;
    if (role_privilege.length == 0) {
        return res.send({
            status: 0,
            msg: "You Must Select At Least One Privilege"
        });
    }
    insertdata.role_privilege = req.body.roles_privilege.map(Number);
    roles_insert(res, insertdata, function(returned_data) {
        var last_inserted = returned_data._id;
        if (parent_id != 0) {
            var fetchData = {
                _id: parent_id
            };
            roles_info(res, fetchData, function(returned_role) {
                console.log(JSON.stringify(returned_role));
                var returned_role = returned_role[0];
                var child = returned_role.childs;
                child.push(last_inserted);
                console.log(child);
                var updateData = [];
                updateData['childs'] = child;
                roles_update(res, fetchData, updateData, function() {
                    return res.send({
                        status: 1,
                        msg: "Information Inserted Successfully with parent"
                    });
                });
            });
        } else {
            return res.send({
                status: 1,
                msg: "Information Inserted Successfully"
            });
        }
    });
}



///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR ACCOMODATION UPDATE///////////
/////////////////////////////////////////////////////////////
PublicVar.postRolesUpdate = function(req, res, next) {
    var searchInfo = {
        _id: parseInt(req['body']['id'])
    };

    var updateRolesInfo = [];
    var role_privilege = [];
    role_privilege = req.body.roles_privilege;

    if (role_privilege.length == 0) {
        return res.send({
            status: 0,
            msg: "You Must Select At Least One Privilege"
        });
    }

    updateRolesInfo['roles_name'] = req['body']['roles_name'].trim();
    updateRolesInfo['accomodation_id'] = parseInt(req['body']['accomodation_id'].trim());
    updateRolesInfo['role_privilege'] = req.body.roles_privilege.map(Number);

    roles_update(res, searchInfo, updateRolesInfo, function() {
        return res.send({
            status: 1,
            msg: "Information Edited Successfully"
        });
    });

}

///////////////////////////////////////////////////////////////
//////////SERVICE FOR SPECIFIC ROLES SHOW////////////
/////////////////////////////////////////////////////////////
PublicVar.postRoles = function(req, res, next) {
    /*******************************************************************
     Showing 1st level roles and sub roles also.
     To show the 1st level of roles - accomodation id is supplied.
     From next time only selected parent id is supplied.
     *******************************************************************/
    console.log(typeof req['body']['id']);
    if (typeof req['body']['id'] == 'undefined') {
        var fetchingData = {
            parent_id: 0,
            accomodation_id: parseInt(req['body']['acc_id'].trim())
        };
    } else {
        var fetchingData = {
            parent_id: parseInt(req['body']['id'].trim())
        };
    }
    //return res.send(fetchingData);
    rolesJoinedQuery(res, fetchingData, function(ret_roles) {
        return res.send({
            status: 1,
            msg: "Field Fetched",
            list: ret_roles
        });
    });
}


///////////////////////////////////////////////////////////////
//////////SERVICE FOR ROLES LIST//////////////////////////////
//////////////////////////////////////////////////////////////
PublicVar.getRolesList = function(req, res, next) {

    rolesJoinedQuery(res, {}, function(ret_roles) {
        return res.send({
            status: 1,
            msg: "Field Fetched",
            list: ret_roles
        });
    });
}








////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
