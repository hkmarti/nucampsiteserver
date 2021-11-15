//imports//
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Load new currency type into mongoose, so it's available for mongoose schemas to use.//
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema ({
    name: {
        type: String, 
        required: true, 
        unique: true
    },
    image: {
        type: String, 
        required: true, 
    },
    featured:{
        type: Boolean, 
        default: false
    },
    cost: {
        type: Currency,
        required: true, 
        min: 0
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//creates Promotion model using promotionSchema//
const Promotion = mongoose.model('Promotion', promotionSchema);

//Exports Promotion Model from module//
module.exports = Promotion;