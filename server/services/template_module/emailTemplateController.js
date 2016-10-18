//////////////////////////////////////////
/////////TEMPORARY OBJECT TO EXPORT//////
////////////////////////////////////////
var PublicVar = {};

//////////////////////////////////////////
/////////REQUIRING ALL FILES/////////////
////////////////////////////////////////
var models = require('../../config/modelsConfig');
var moment = require('moment');
//////////////////////////////////////////
/////////CALLING ALL MODELS//////////////
////////////////////////////////////////
var email_template = models.email_template;
//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var template_info = email_template.selectQuery;
var template_update = email_template.updateQuery;
var template_insert = email_template.insertQuery;


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR EMAIL TEMPLATE INSERT//////////
/////////////////////////////////////////////////////////////
PublicVar.postEmailTemplateInsert = function(req, res, next) {
    var email_body = req['body']['email_body'].trim();
    var param_arr = req['body']['parameter'].trim().split(',');
    for (i in param_arr) {
        var index = email_body.indexOf(param_arr[i]);
        if (index == -1) {
            var message = "Parameter " + param_arr[i] + " is not present in email body.";
            return res.send({ status: 0, msg: message });
        }
    }
    var insertdataTemplate = {};
    insertdataTemplate.name = req['body']['name'].trim();
    insertdataTemplate.subject = req['body']['subject'].trim();
    insertdataTemplate.email_body = email_body;
    insertdataTemplate.status = 1;
    insertdataTemplate.parameters = [];
    for (var i = 0; i < param_arr.length; i++) {
        insertdataTemplate.parameters.push(param_arr[i]);
    }
    template_insert(res, insertdataTemplate, function(template) {
        return res.send({ status: 1, msg: "Information Inserted Successfully" });
    });
}

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR EMAIL TEMPLATE LIST////////////
/////////////////////////////////////////////////////////////
PublicVar.getEmailTemplateList = function(req, res, next) {
    template_info(res, {}, function(template_list) {
        return res.send({ status: 1, msg: "Information Fetched Successfully", template_list: template_list });
    });
}

///////////////////////////////////////////////////////////////
//////////SERVICE FOR SPECIFIC EMAIL TEMPLATE SHOW////////////
/////////////////////////////////////////////////////////////
PublicVar.postEmailTemplate = function(req, res, next) {
    var templateFetchingData = { _id: req.body.id };
    template_info(res, templateFetchingData, function(template_info) {
        return res.send({ status: 1, msg: "Field Fetched", template_data: template_info[0] });
    });
}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR SITE SETTINGS UPDATE///////////
/////////////////////////////////////////////////////////////
PublicVar.postEmailTemplateUpdate = function(req, res, next) {
    var searchInfo = { _id: parseInt(req['body']['id']) };
    var email_body = req['body']['email_body'].trim();
    if (email_body.length == 0) {
        return res.send({ status: 0, msg: "Information cannot edit without Email Body." });
    }
    template_info(res, searchInfo, function(template_info) {
        var parameters = template_info[0].parameters;
        console.log("array--->" + parameters);
        console.log("array length-->" + parameters.length);
        console.log("array last index-->" + parameters[parameters.length - 1]);
        var count = 0;
        for (var i = 0; i < parameters.length; i++) {
            count++;
            console.log("loop count--->" + count);
            var index = email_body.indexOf(parameters[i]);
            console.log("array value--->" + parameters[i]);
            console.log("occurence pos--->" + index);
            if (index == -1) {
                var message = "Parameter " + parameters[i] + " is not present in email body cannot update.";
                return res.send({ status: 0, msg: message });
            }
        }

        var updateEmailTemplateInfo = [];
        var status = req['body']['status'].trim();
        updateEmailTemplateInfo['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        updateEmailTemplateInfo['name'] = req['body']['name'].trim();
        updateEmailTemplateInfo['subject'] = req['body']['subject'].trim();
        updateEmailTemplateInfo['email_body'] = email_body;
        updateEmailTemplateInfo['status'] = parseInt(status);

        template_update(res, searchInfo, updateEmailTemplateInfo, function() {
            return res.send({ status: 1, msg: "Information Edited Successfully" });
        });
    });
}


////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
