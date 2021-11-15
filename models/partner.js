//imports//
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema ({
    name: {
        type: String, 
        required: true, 
        unique: true
    },
    image: {
        type: String, 
        require: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//creates Partner model using partnerSchema//
const Partner = mongoose.model('Partner', partnerSchema);

//Exports Partner Model from module//
module.exports = Partner;