//imports//
const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

//If authenticated as user AND admin, then find all users//
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        User.find()
        .then(users =>{
            //If successful, then return code 200 and user//
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        })
        .catch(err => next(err));
});

router.post('/signup', (req, res) => {
  //Registers new user and password//
  User.register(
      new User({username: req.body.username}),
      req.body.password,
      (err, user) => {
          if (err) {
              //if there's an error, send error 500//
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
          } else {
              if (req.body.firstname) {
                //sets user's first name in firstname field//
                  user.firstname = req.body.firstname;
              }
              if (req.body.lastname) {
                //sets user's last name in lastname field//
                  user.lastname = req.body.lastname;
              }
              //Saves info the database//
              user.save(err => {
                  if (err) {
                    //if there's an error, send 500 error//
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({err: err});
                      return;
                  }
                  //if there's no error, create new user//
                  passport.authenticate('local')(req, res, () => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({success: true, status: 'Registration Successful!'});
                  });
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
