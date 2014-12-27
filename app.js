var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var eventsMethods = require('./resources/userRoutes');
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');
var flash = require('connect-flash');
var secret = require('../secrets/secretKey').secret;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('private', path.join(__dirname, 'private'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname + '/private')));

//Initialize passport, session and express session
app.use(expressSession({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function (username, password, done) {
    eventsMethods.loginUser(username, password, done)
}));

//Passport serialize and deserialize
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    //Query Database or cache here
    done(null, {id: id, name: id});    
});

var isAuthenticated = function (request, response, next) {
    return request.isAuthenticated() ? next() : response.redirect('/');
};

app.get(['/', '/index.html'], function (request, response){

    response.render('index');
});

app.post('/registration', eventsMethods.registerUser);

app.get('/loginError', function (request, response) {
    response.render('loginError');
});

app.post('/login', passport.authenticate('local', {
        failureRedirect: '/loginError'
    }), eventsMethods.postLogin);

app.get('/practice', isAuthenticated, eventsMethods.goToHome);

app.post('/postForm', isAuthenticated, eventsMethods.uploadComment);

app.get('/logout', eventsMethods.logout);

app.get('/friends', isAuthenticated, eventsMethods.getFriends);

app.get('/editProfile', isAuthenticated, eventsMethods.getEditProfile);

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


module.exports = app;