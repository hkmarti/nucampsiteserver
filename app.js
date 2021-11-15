var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//IMPORTING ROUTERS//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//Imports mongoose//
const mongoose = require('mongoose');

//Sets up url and connection for mongoDB server//
const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log ('Connected correctly to server'),
  //Another way of catching errors if it doesn't connect//
  err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Order in which server runs//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Set up authentication before accessing server//
function auth(req, res, next){
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  
  //if authorization header is null, send back error.//
  if (!authHeader) {
    const err = new Error('You are not authenticated.');
    //Requests authentication from client. Authentication method is basic.// 
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  //Separates admin:password and puts it into an array//
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0]; //Sets first item in auth array ['admin', 'password'] to user.
  const pass = auth[1]; //Sets second item in auth array to pass.

  //If admin and password are 'admin' and 'password', then grant access to server.//
  //Otherwise, request authentication again with 401 error.//
  if (user === 'admin' && pass === 'password') {
      return next(); //authorized
  } else {
      const err = new Error('You are not authenticated.');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
  }
}

//Calls auth function (above)//
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

//Set up appropiate path for each router//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
