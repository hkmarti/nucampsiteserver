//imports//
const express = require('express');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next) =>{
  //Checks to see if username already exists//
  User.findOne({username: req.body.username})
  .then(user => {
    //If same username is found, return 403 error.//
    if (user) {
        const err = new Error(`User ${req.body.username} already exists.`);
        err.status = 403; 
        return next(err);
    } else {
        //If no prexisting username is found, creates new user//
        User.create({
          username: req.body.username,
          password: req.body.password
      })
      .then(user => {
        //Sends 200 success for creating new username//
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({status: 'Registration Successful', user: user});
      })
      .catch(err => next(err));
    }
  })
  .catch(err => next(err));
});


router.post('/login', (req, res, next) => {
    //If no sessions for client, it means user is not logged in.//
    //If not logged in, then ask for login information.//
    if(!req.session.user) {
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
      const username = auth[0]; //Sets first item in auth array ['admin', 'password'] to username.
      const password = auth[1]; //Sets second item in auth array to password.

      //Checks to find matching username//
      User.findOne({username: username})
        .then(user => {
          //If matching username not found, send error 'username does not exist.'//
          if (!user){
              const err = new Error(`User ${username} does not exist`);
              err.status = 401;
              return next(err);
          //If password to username is not found, send error 'password is incorrect.//
          } else if (user.password !== password) {
              const err = new Error('Your password is incorrect.');
              err.status = 401;
              return next(err);
          } else if (user.username === username && user.password === password) {
            //If username and password matches, then authenticated//
              req.session.user = 'authenticated';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/plain');
              res.end('You are authenticated.');
          }
        })
        .catch(err => next(err));
    } else {
      //If session exists, then send back status 200//
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated.');
  }
});

router.get('/logout', (req, res, next) => {
    //When user logs out, destory session, clear cookie, and redirect to homepage.//
    if (req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    } else {
    //When user tries to log out, but they're not logged in. Send error.//
        const err = new Error('You are not logged in.');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;
