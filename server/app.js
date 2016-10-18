////////////////////////////////////////////////////////
////////////////////   App.js //////////////////////////
///////// Author  : Ayan Sil //////////////////////////
////////  Company : UIPL     /////////////////////////
///////   Project : TRIPOSIA ////////////////////////
////////////////////////////////////////////////////


//////////////////   Inclueded libraries ///////////////////////


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//////////////////  security packages  //////////////////////////

var helmet = require('helmet');
var hpp = require('hpp');
var contentLength = require('express-content-length-validator');

////////////////////////////////////////////////////////////////////


/////////////////     Including libraries end    /////////////////////////////////////////



//////////////// Including config files ////////////////////////////////////////////


var config = require('./config/config'); /////////  config file loaded

var dbconfig = require('./config/database'); /////////  db config loaded

require('./config/modelsConfig');

//require('./models/relational_schema');
//////////////////////////////////////////////////////////////////////////////////



///////////////////     routes loaded here ///////////////

var routes = require('./config/routes');




var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
//app.use(hpp());
app.use(contentLength.validateMax({
    max: config.MAX_CONTENT_LENGTH_ACCEPTED,
    status: 400,
    message: "stop it!"
})); // max size accepted for the content-length


app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var MongoClient = require('mongodb').MongoClient;



module.exports = app;
