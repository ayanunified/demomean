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
var notification_template = models.notification_template;
//var notification_template_parameter = models.notification_template_parameter;
//////////////////////////////////////////
/////////USING ALL QUERY METHODS/////////
////////////////////////////////////////
var template_info = notification_template.selectQuery;
var template_update = notification_template.updateQuery;
var template_insert = notification_template.insertQuery;
///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR SITE SETTINGS INSERT///////////
/////////////////////////////////////////////////////////////
PublicVar.postNotificationTemplateInsert = function(req, res, next) {
    var template_body = req['body']['template_body'].trim();
    var param_arr = req['body']['parameter'].trim().split(',');
    for (i in param_arr) {
        var index = template_body.indexOf(param_arr[i]);
        if (index == -1) {
            var message = "Parameter " + param_arr[i] + " is not present in email body.";
            return res.send({ status: 0, msg: message });
        }
    }
    var insertdataTemplate = {};
    insertdataTemplate.title = req['body']['title'].trim();
    insertdataTemplate.subject = req['body']['subject'].trim();
    insertdataTemplate.template_body = template_body;
    insertdataTemplate.status = 1;
    insertdataTemplate.parameter = param_arr;
    template_insert(res, insertdataTemplate, function(template) {
        return res.send({ status: 1, msg: "Information Inserted Successfully" });
    });

}

///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR NOTIFICATION TEMPLATE LIST////////////
/////////////////////////////////////////////////////////////
PublicVar.getNotificationTemplateList = function(req, res, next) {
    template_info(res, {}, function(template_list) {
        return res.send({ status: 1, msg: "Information Fetched Successfully", template_list: template_list });
    });
}

///////////////////////////////////////////////////////////////
//////////SERVICE FOR SPECIFIC NOTIFICATION TEMPLATE SHOW////////////
/////////////////////////////////////////////////////////////
PublicVar.postNotificationTemplate = function(req, res, next) {
    var templateFetchingData = { _id: req.body.id };
    template_info(res, templateFetchingData, function(template_info) {
        return res.send({ status: 1, msg: "Field Fetched", template_data: template_info[0] });
    });
}


///////////////////////////////////////////////////////////////
///////////////////SERVICE FOR NOTIFICATION SETTINGS UPDATE///////////
/////////////////////////////////////////////////////////////
PublicVar.postNotificationTemplateUpdate = function(req, res, next) {
    var searchInfo = { _id: parseInt(req['body']['id']) };
    var template_body = req['body']['template_body'].trim();
    if (template_body.length == 0) {
        return res.send({ status: 0, msg: "Information cannot edit without Template Body." });
    }
    template_info(res, searchInfo, function(template_info) {
        var parameter = template_info[0].parameter;
        console.log("array--->" + parameter);
        console.log("array length-->" + parameter.length);
        console.log("array last index-->" + parameter[parameter.length - 1]);
        var count = 0;
        for (var i = 0; i < parameter.length; i++) {
            count++;
            console.log("loop count--->" + count);
            var index = template_body.indexOf(parameter[i]);
            console.log("array value--->" + parameter[i]);
            console.log("occurence pos--->" + index);
            if (index == -1) {
                var message = "Parameter " + parameter[i] + " is not present in Template body so cannot update.";
                return res.send({ status: 0, msg: message });
            }
        }

        var updateNotificationTemplateInfo = [];
        var status = req['body']['status'].trim();
        updateNotificationTemplateInfo['updated_at'] = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        updateNotificationTemplateInfo['title'] = req['body']['title'].trim();
        updateNotificationTemplateInfo['subject'] = req['body']['subject'].trim();
        updateNotificationTemplateInfo['template_body'] = template_body;
        updateNotificationTemplateInfo['status'] = parseInt(status);

        template_update(res, searchInfo, updateNotificationTemplateInfo, function() {
            return res.send({ status: 1, msg: "Information Edited Successfully" });
        });
    });
}



////////////////////////////////////////
///////////EXPORTING TEMPORARY OBJECT//
//////////////////////////////////////
module.exports = PublicVar;
