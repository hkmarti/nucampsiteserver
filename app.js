var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

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
// app.use(cookieParser('12345-67890-09876-54321'));

//Using Session instead of cookieParser//
app.use(session({
  name: 'session-id',
  //Secret key//
  secret: '12345-67890-09876-54321',
  //'saveUninitialized: false' --> When a new session is created and no updates are made to it, then at the end of the request it won't get saved. Avoids making empty sessions and no cookie will be sent to the client.//
  saveUninitialized: false,
  //'resave: false' --> Once the session has been created and updated and saved, it will continue to be resaved whenever a request is made for that session even if that request didn't make any updates. Helps keep session marked as active so it doesn't get deleted while the user is still making requests.//
  resave: false,
  //Creates a new FileStore as an object that saves session information to the server's hard disk instead of the running application's memory//
  store: new FileStore()
}));

//Client has acesses to log in before authentication//
app.use('/', indexRouter);
app.use('/users', usersRouter);


//Set up authentication before accessing server//
function auth(req, res, next){

  console.log(req.session);
  //if no session, then ask for login.//
  if(!req.session.user) {
    const err = new Error('You are not authenticated.');
    err.status = 401;
    return next(err);
  } else {
      //if cookie is signed, checks to see if value is 'admin'//
      if (req.session.user === 'authenticated') {
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
