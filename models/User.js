const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        maxLength: 30,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
}, { timestamps: true});

module.exports = mongoose.model('User', UserSchema);