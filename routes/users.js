//imports//
const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res) =>{
  //Registers new user and password.//
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    err => {
      if (err) {
        //If there's an error, return 500 error//
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        //If there's no error, create new user//
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({success: true, status: 'Registration Successful'});
        });
      }
    }
  );
});


//Adding passport.authenticate in argument enables passport authentication for this route.//
//If there's no issue with passport.authenticate, then it'll move to the next middleware (req, res)//
router.post('/login', passport.authenticate('local'), (req, res) => {
    //Issues a token to the user using user id//
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in.'});
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
