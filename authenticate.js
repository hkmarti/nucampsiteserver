// imports //
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

//Adds the specific strategy plugin 'local' for passport implementation//
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//Serializes and Deserializes user//
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//exports//
//Uses getToken method and returns a token created by jwt.sign method using the secret key and expires in 1 hr//
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

//Contain options for jwt strategy//
const opts = {};
//Requests token to be sent in Authorization header and as a Bearer Token.//
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//Sets secretOrKey to secret key made in config module//
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            //Tries to find a user that has the same id as token//
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    //If no user was found, then err and false (no user)//
                    return done(err, false);
                } else if (user) {
                    //If user was found, then null (no err) and user// 
                    return done(null, user);
                } else {
                    //If no error and no user, then null (no err) and false (no user)//
                    return done(null, false);
                }
            });
        }
    )
);

//Verifies user by authetnicating with jwt and not using sessions//
exports.verifyUser = passport.authenticate('jwt', {session: false});

//Verifies admin. If not admin, then return error// 
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    } else {
        let err = new Error("You are not authorized to perform this operation!")
        err.status = 403;
        return next(err);
    }
};