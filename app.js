var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');

//IMPORTING ROUTERS//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//Imports mongoose//
const mongoose = require('mongoose');

//Sets up url and connection for mongoDB server//
const url = config.mongoUrl;
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

//Catches ALL requests that goes to the server (GET, PUT, POST, DELETE) to ANY path '*'//
app.all('*', (req, res, next) => {
  if (req.secure){
    //If connection is HTTPS, then go to next middleware function//
    return next();
  } else {
    //If connect is NOT SECURE (not HTTPS), then console log and redirects to secure HTTPS connection.//
    console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
    //Redirect 301 --> means permanent redirect
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Order in which server runs//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Gives cookieParser a secret key//
// app.use(cookieParser('12345-67890-09876-54321'));

//Two middleware functions provided by Passport to check incoming requests to see if there's an existing session for that client. If so, the session data for that client is loaded into the request as rec.user//
app.use(passport.initialize());

//Client has acesses to log in before authentication//
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

//Set up appropiate path for each router//
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
