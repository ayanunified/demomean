////////////////////////////////////////////
////////NODE MODULES///////////////////////
//////////////////////////////////////////
var express = require('express');
var router = express.Router();
var multer = require('multer');
////////////////////////////////////////////
////////MULTER FOR IMAGE UPLOAD////////////
//////////////////////////////////////////
var uploading = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/images')
        },
        filename: function(req, file, cb) {
            var fn_arr = file.mimetype.split('/');
            var fntype = fn_arr[1];
            cb(null, Date.now() + '.' + fntype) //Appending .jpg
        }
    })
})

////////////////////////////////////////////
////////CONTROLLERS////////////////////////
//////////////////////////////////////////
var defineLoginController = require('../services/login_module/loginController');
var defineSiteSettingsController = require('../services/login_module/siteSettingsController');
var defineEmailTemplateController = require('../services/template_module/emailTemplateController');
var defineNotificationTemplateController = require('../services/template_module/notificationTemplateController');
var defineAccomodationController = require('../services/accomodation_module/accomodationController');
var definePrivilegesController = require('../services/accomodation_module/privilegesController');
var defineRolesController = require('../services/accomodation_module/rolesController');
var definePartnerAccomodationController = require('../services/partner_accomodation_module/partner_accomodation_controller');
var defineCompanyController = require('../services/accomodation_module/companyController');
////////////////////////////////////////////
////////LOGIN CONTROLLER///////////////////
//////////////////////////////////////////
router.post('/login', defineLoginController.postLogin);
router.post('/logout', defineLoginController.Logout);
router.post('/register', defineLoginController.postRegister);
router.post('/forgot_password', defineLoginController.postForgotPwd);
router.post('/reset_password', defineLoginController.postResetPwd);
router.post('/partnerDetails', defineLoginController.partnerDetails);
router.post('/userStatusChange', defineLoginController.postUserStatusChange);
router.post('/specific_partnerList', defineLoginController.specific_partnerDetails);

router.post('/user_update', defineLoginController.postUserUpdate);

////////////////////////////////////////////
////////SITE SETTINGS CONTROLLER///////////
//////////////////////////////////////////
router.get('/sitesettings/list', defineSiteSettingsController.getSiteSettingsList);
router.post('/sitesettings/show', defineSiteSettingsController.postSiteSetting);
router.post('/sitesettings/update', uploading.single('logo'), defineSiteSettingsController.postSiteSettingsUpdate);
router.post('/sitesettings/insert', defineSiteSettingsController.postSiteSettingsInsert);
////////////////////////////////////////////
////////EMAIL TEMPLATE CONTROLLER//////////
//////////////////////////////////////////
router.get('/emailtemplate/list', defineEmailTemplateController.getEmailTemplateList);
router.post('/emailtemplate/show', defineEmailTemplateController.postEmailTemplate);
router.post('/emailtemplate/update', defineEmailTemplateController.postEmailTemplateUpdate);
router.post('/emailtemplate/insert', defineEmailTemplateController.postEmailTemplateInsert);
//////////////////////////////////////////
////////NOTIFICATION TEMPLATE CONTROLLER//
//////////////////////////////////////////
router.get('/notificationtemplate/list', defineNotificationTemplateController.getNotificationTemplateList);
router.post('/notificationtemplate/show', defineNotificationTemplateController.postNotificationTemplate);
router.post('/notificationtemplate/update', defineNotificationTemplateController.postNotificationTemplateUpdate);
router.post('/notificationtemplate/insert', defineNotificationTemplateController.postNotificationTemplateInsert);

////////////////////////////////////////////
////////ACCOMODATION CONTROLLER////////////
//////////////////////////////////////////
router.post('/accomodation/list', defineAccomodationController.getAccomodationList);
router.post('/accomodation/show', defineAccomodationController.postAccomodation);
router.post('/accomodation/update', uploading.single('image'), defineAccomodationController.postAccomodationUpdate);
router.post('/accomodation/insert', uploading.single('image'), defineAccomodationController.postAccomodationInsert);
//router.post('/accomodation/insert', defineAccomodationController.postAccomodationInsert);
router.post('/accomodation/change_status', defineAccomodationController.postAccomodationStatusChange);
router.get('/accomodation/category/list', defineAccomodationController.getAccomodationCategoryList);
router.post('/accomodation/category/insert', defineAccomodationController.postAccomodationCategoryInsert);

router.post('/accomodation/room/insert', defineAccomodationController.postAccomodationRoomInsert);
router.post('/accomodation/room/update', defineAccomodationController.postAccomodationRoomUpdate);
router.post('/accomodation/room/status_change', defineAccomodationController.postAccomodationRoomStatusUpdate);

router.post('/accomodation/room_book', defineAccomodationController.postRoomBook);

router.post('/accomodation/filter_search', defineAccomodationController.postAccomodationListByfilter);

////////////////////////////////////////////
////////ROLES  AND PRIVILEGES CONTROLLER//////////////
//////////////////////////////////////////
router.get('/privileges/list', definePrivilegesController.getPrivilegesList);
router.post('/privileges/insert', definePrivilegesController.postPrivilegesInsert);

router.post('/roles/insert', defineRolesController.postRolesInsert);
router.get('/roles/list', defineRolesController.getRolesList);
router.post('/roles/show', defineRolesController.postRoles);
router.post('/roles/update', defineRolesController.postRolesUpdate);


////////////////////////////////////////////
////////PARTNER ACCOMODATION CONTROLLER//////////////
//////////////////////////////////////////
//router.get('/privileges/list', definePrivilegesController.getPrivilegesList);
router.post('/private_accomodation/insert', definePartnerAccomodationController.postPartnerAccomodationInsert);
router.post('/private_accomodation/insertDescription', uploading.single('image'), definePartnerAccomodationController.postAccomodationDescriptionInsert);
router.post('/private_accomodation/list', definePartnerAccomodationController.postPartnerAccomodation);

// router.post('/roles/insert', defineRolesController.postRolesInsert);
// router.get('/roles/list', defineRolesController.getRolesList);
// router.post('/roles/show', defineRolesController.postRoles);
// router.post('/roles/update', defineRolesController.postRolesUpdate);

///////////////////////////////////////////
////////COMPANY CONTROLLER////////////////
/////////////////////////////////////////
router.post('/company/register', uploading.single('comp_logo'), defineCompanyController.postCompanyRegister);
router.post('/company/changestatus', defineCompanyController.postCompanyChangeStatus);
router.get('/company/listAll', defineCompanyController.getCompanylistAll);
router.get('/company/listActive', defineCompanyController.getCompanylistActive);
router.post('/company/update', uploading.single('comp_logo'), defineCompanyController.postCompanyUpdate);
router.post('/company/show', defineCompanyController.postCompanyShow);

////////////////////////////////////////////
////////EXPORTS////////////////////////////
//////////////////////////////////////////
module.exports = router;
