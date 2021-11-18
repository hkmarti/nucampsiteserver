// imports //
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

//Adds the specific strategy plugin 'local' for passport implementation//
exports.local = passport.use(new LocalStrategy(User.authenticate()));

//Serializes and Deserializes user//
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());