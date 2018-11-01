var feathers = require('feathers');
var socketio = require('feathers-socketio');
var rest = require('feathers-rest');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var winston = require('winston');
var winstonExpress = require('winston-express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var fs = require('fs-extra');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// var config = require('./config/config')();

var app = feathers();
app.configure(rest());

app.eventEmitter = new EventEmitter();

// var socketHandler = require('./routes/socket');
// app.configure(socketio(socketHandler));

mongoose.Promise = global.Promise;

// var mongoUrl = "mongodb://" + config.database.mongo.host + ':' + config.database.mongo.port + '/' + config.database.mongo.dbname;
// var dbAttempts = 0;
// var maxDbRetries = config.database.mongo.maxRetries || 5;
// var dbRetryTimeoutSeconds = config.database.mongo.retrySeconds || 5;

// var connectWithRetry = function() {
//     return mongoose.connect(mongoUrl, function(err) {
//         dbAttempts++;
//         if (err && dbAttempts >= maxDbRetries) {
//             console.error('Failed to connect to mongo on startup - maximum ' + maxDbRetries + ' retries, shutting down.');
//             throw "Failed to connect to Mongo DB: " + err;
//         } else if (err) {
//             console.error('Failed to connect to mongo on startup - attempt ' + dbAttempts + ' of ' + maxDbRetries + ', retrying in ' + dbRetryTimeoutSeconds + ' sec', err);
//             setTimeout(connectWithRetry, dbRetryTimeoutSeconds * 1000);
//         } else {
//             app.eventEmitter.emit('app.dbReady');
//         }
//     });
// };

// tests insert a mockgoose instance on global space
// if (global.mockgoose) {
//     global.mockgoose(mongoose).then(connectWithRetry);
// } else {
//     connectWithRetry();
// }

// app.set('config', config);

// require('./routes/passport')(passport);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'assets', 'common', 'images', 'favicon.ico')));

// set up logging
// var logTransports = [];
// var logFile = null;
// if (config.logger.file) {
//     logFile = path.join(config.logger.root || 'logs', config.logger.file || 'uxframe-log.json');
//     fs.ensureFileSync(logFile);
//     logTransports.push(new winston.transports.File({
//             level: 'info',
//             filename: logFile,
//             handleException: true,
//             json: true,
//             maxsize: 5242880, //5MB
//             maxFiles: 5,
//             colorize: false
//         })
//     );
// }
// logTransports.push(new winston.transports.Console({
//         level: 'debug',
//         handleExceptions: true,
//         json: false,
//         colorize: true
//     })
// );
//
// var logger = new winston.Logger({
//     transports: logTransports,
//     exitOnError: false
// });
//
// if (config.logger.file) {
//     var logStream = fs.createWriteStream(logFile, {flags: 'a'});
//     app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', {stream: logStream}));
// } else {
//     app.use(morgan('dev'));
// }
//
// winstonExpress(app, winston);
//
// logger.info('Logging configured');
// app.logger = logger;
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(passport.initialize());

// improve logging output
// require('console-stamp')(console);

// controller-managed routes
// require('./routes/routes')(app, passport);

// static routes (public folder)
// var staticContentDir = path.join(__dirname, 'public', 'webpack');
// console.log( "Static content dir " + staticContentDir);
// app.use(feathers.static(staticContentDir));
// var solutionFilesDir = path.join(__dirname, 'solutions', 'files');
// console.log( "Solutions file dir " + solutionFilesDir);
// app.use('/solutions/files', feathers.static(solutionFilesDir));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    if (util.isString(err)) { err = new Error(err); }
    err = err || new Error('Unknown error');
    var logError = new Error('Failure getting ' + req.path + ': ' + (err.message || 'Unknown error'));
    if (!err.suppress) {
        logger.error(logError);
    }
    var errorMessage = err.message || 'Unknown error';
    var errorCode = err.name || 'unknown';
    var passError = (err.suppress || req.app.get('config').environment !== 'development') ? {} : err;
    if (req.accepts('html') && !req.xhr) {
        res.render('error', {
            message: err.message,
            error: passError
        });
    } else {
        res.send({success: false, status: status, error: errorMessage, errorCode: errorCode});
    }
});

app.listen(13841);
console.error('Listening on 13841');
// module.exports = app;
