// server.js

// set up ======================================================================
// get all the tools we need
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
var ObjectId = require('mongodb').ObjectID;
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passportLocalMongoose = require("passport-local-mongoose");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var Ad = require("./app/models/ad.js");
var User = require("./app/models/user.js");
var Schema = mongoose.Schema;

var db

// configuration ===============================================================
mongoose.connect(configDB.url, { useMongoClient: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

app.set('view engine', 'ejs'); // set up ejs for templating

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(flash()); // use connect-flash for flash messages stored in session

// mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(methodOverride("_method"));

require('./config/passport')(passport); // pass passport for configuration

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// required for passport
app.use(session({
    secret: 'rcbootcamp2018a', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
