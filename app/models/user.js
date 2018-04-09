// load the things we need
var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt   = require('bcrypt-nodejs');
//var Ad = require("ad");
// define the schema for our user model
var userSchema = new mongoose.Schema({
        email        : String,
        password     : String,
        ads: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ad"
        }]
    });

userSchema.plugin(passportLocalMongoose);
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
