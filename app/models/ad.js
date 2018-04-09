var mongoose = require("mongoose");

var adSchema = new mongoose.Schema({
  adTitle: String,
    zip: Number,
    textArea: String,
    sqFeet: Number,
    minimum: Number,
    maximum: Number,
    pets: String,
    family: String,
    email: String,
    phone: Number,
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {type: Date, default: Date.now}
});

// var Ad = mongoose.model("Ad",adSchema);

module.exports = mongoose.model("Ad",adSchema);
