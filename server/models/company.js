var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var companyModel = {};

///////////////////////////////////////////////////
////////////////SCHEMA////////////////////////////
/////////////////////////////////////////////////
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    name: String,
    contact_person_name: String,
    contact_number: String,
    email: String,
    caption: String,
    head_office_address: String,
    user_type: Number,
    comp_logo: String,
    created_on: String,
    updated_at: String,
    status: Number
}, {
    versionKey: false
});


////////////////////////////////////////////////
////////////USING MODEL/////////////////////
///////////////////////////////////////////////
CompanySchema.plugin(autoIncrement.plugin, {
    model: 'company',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
var query = mongoose.model('company', CompanySchema, 'company');


//////////////////////////////////////////////
////////////SELECT QUERY/////////////////////
////////////////////////////////////////////
companyModel.selectQuery = function(res, data, next) {

    query.find(data, function(err, company_row) {

        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            return res.send({
                status: 0,
                msg: "internal error in searching data"
            });
        } else if (company_row.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            return res.send({
                status: 0,
                msg: "cannot find any data"
            });
        } else {
            next(company_row);
        }
    });
}


///////////////////////////////////////////////
//////////////////INSERT QUERY/////////////////
///////////////////////////////////////////////
companyModel.insertQuery = function(res, data, next) {
    query.create(data, function(err, company_row) {
        if (err) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            return res.send({
                status: 0,
                msg: "internal error in inserting data"
            });
        } else if (company_row.length == 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            return res.send({
                status: 0,
                msg: "no such data inserted"
            });
        } else {
            next(company_row);
        }
    });
}


///////////////////////////////////////////////
/////UPDATE QUERY ////////////////////////////
///////////////////////////////////////////////
companyModel.updateQuery = function(res, where, data, next) {
    companyModel.selectQuery(res, where, function(company) {
        company = company[0];
        ///////////////////////////////////////////////////////////////////////////////////////
        //////////////////////dynamic updating the field of a row/////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        for (i in data) {
            company[i] = data[i];
        }
        companyModel.insertQuery(res, company, function(company_upd) {
            next();
        });
    });
}

////////////////////////////////////////////////
////////////EXPORT MODEL///////////////////////
///////////////////////////////////////////////
module.exports = companyModel;
