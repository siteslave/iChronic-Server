"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var apis = require('./routes/apis');
var admin = require('./routes/admin');

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

app.use(session({
  secret: 'sflkjwlflsfljsdfPLjWefsdlfjWafd$%#%#',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

var auth = function (req, res, next) {
  if (!req.session.username) {
    if (req.isXHR) {
      res.send({ok: false, msg: 'Please login'})
    } else {
      res.redirect('/users/login');
    }

  } else {
    next();
  }
};

let db = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    database: 'ichronic',
    user: 'sa',
    password: 'sa'
  }
});

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/users', users);
app.use('/api', auth, apis);
app.use('/admin', auth, admin);
app.use('/', routes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
