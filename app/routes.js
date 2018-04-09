module.exports = function(app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    db.collection('message').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {
        message: result
      })
    })
  });

  app.get('/about', function(req, res) {
    db.collection('message').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('about.ejs', {
        message: result
      })
    })
  });

  app.get('/posting/:id', function(req, res) {
    uId = ObjectId(req.params.id)
    console.log(uId)
    db.collection('message').findOne({"_id": uId}, (err, result) => {
      if (err) return console.log(err)
      console.log(result)
      res.render('ad-post.ejs', {
        message: result
      })
    })
  });



  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('message').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        message: result
      })
    })
  });



  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/message', (req, res) => {
    db.collection('message').save({
      adTitle: req.body.adTitle,
      zip: req.body.zip,
      textArea: req.body.textArea,
      sqFeet: req.body.sqFeet,
      minimum: req.body.minimum,
      maximum: req.body.maximum,
      pets: req.body.pets,
      family: req.body.family,
      email: req.body.email,
      contact: req.body.contact,
      phone: req.body.phone
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/')
    })
  })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
