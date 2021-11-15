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
//Gives cookieParser a secret key//
app.use(cookieParser('12345-67890-09876-54321'));

//Set up authentication before accessing server//
function auth(req, res, next){
  //if cookie not properly signed...//
  if(!req.signedCookies.user) {
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
          //Signs cookie.//
          // {signed: true} tells Express to use secret key from cookieParser to create a signed cookie //
          //sets cookie name to 'user'//
          res.cookie('user','admin', {signed:true});
          return next(); //authorized
      } else {
          const err = new Error('You are not authenticated.');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }
  } else {
      //if cookie is signed, checks to see if value is 'admin'//
      if (req.signedCookies.user === 'admin') {
        //if true, passes client onto the next middleware function//
        return next();
      } else {
        //if value is not admin, sends 401 error//
        const err = new Error('You are not authenticated.');
        err.status = 401;
        return next(err);
      }
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
