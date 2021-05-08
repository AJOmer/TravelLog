const mongoose = require('mongoose');

const PinSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
        minLength: 3,
    },
    description: {
        type: String,
        require: true,
        maxLength: 50,
    },
    rating : {
        type: Number,
        require: true,
        minNumber: 0,
        maxNumber: 5,
    },
    latitude: {
        type: Number,
        require: true,
    },
    longitude: {
        type: Number,
        require: true,
    }
}, { timestamps: true})

module.exports = mongoose.model('Pin', PinSchema);