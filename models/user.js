//imports//
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

//Plugin that handles password and username and hashes/salts them for protection//
userSchema.plugin(passportLocalMongoose);

//Exports userSchema//
module.exports = mongoose.model('User', userSchema);