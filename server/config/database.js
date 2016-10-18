////////////////////////////////////////////////////////
////////////////////   database.js ////////////////////
///////// Author  : Ayan Sil //////////////////////////
////////  Company : UIPL     /////////////////////////
///////   Project : TRIPOSIA ////////////////////////
////////////////////////////////////////////////////


var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var MongoDBprotocol = 'mongodb';
// var Username = 'root';
// var Password = 'uipl\@2016#';
var serverAddress = 'localhost';
var Port = '27017';
var dbName = 'tripoasia';


var dbUrl = MongoDBprotocol + '://accountAdmin01:changeMe@' + serverAddress + ':' + Port + '/' + dbName;

var connection = mongoose.connect(dbUrl);


autoIncrement.initialize(connection);
//mongoose.connect('mongodb://username:password@localhost:27027/passport_local_mongoose_express4');



//module.exports = database;
