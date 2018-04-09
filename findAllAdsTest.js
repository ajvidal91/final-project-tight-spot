var mongoose = require("mongoose"),
    User = require("./models/user.js"),
    Ad = require("./models/ad.js"),
    userId = "5a039c733c4ddb306ffa69d3";

mongoose.connect("mongodb://localhost/index");

User.findById(userId).populate("message").exec(function(err,user){
    if(err){
        console.log(err);
    }else{
        user.ads.forEach(function(ad){
            console.log(ad.title);
        })
    }
})
