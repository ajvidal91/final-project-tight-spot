module.exports = function(app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  // app.get('/', function(req, res) {
  //   db.collection('message').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('index.ejs', {
  //       message: result
  //     })
  //   })
  // });

  app.get("/index",function(req,res){
      Ad.find({},function(err,ads){
          if(err){
              console.log(err);
          }else{
              res.render("index.ejs",{ads: ads});
          }
      });
  });

  app.get("/index",function(req,res){
      res.redirect("/index");
  });





// app.get("/posting/:from-to", function(req.res){
//     var from = parseInt(req.params.from, i),
//     to = parseInt(req.params.to, i);
//
//     res.json(message.)
// });

  app.get('/about', function(req, res) {
    db.collection('message').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('about.ejs', {
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

  app.post("/ad-posting",isLoggedIn,function(req,res){
    Ad.create(req.body.message,function(err,ad){
        if(err){
            console.log(err);
        }else {
            ad.set({contact: req.user._id});
            ad.save(function(err,data){
                if(err){
                    console.log(err);
                }else{
                    req.user.message.push(data);
                    req.user.save();
                }
            })
            res.redirect("/index");
        }
    });
});

app.get("/ad-posting/:id",function(req,res){
    Ad.findById(req.params.id,function(err,foundPost){
        if(err){
            console.log(err);
        }else{
            User.findById(foundPost.contact,function(err,user){
                if(err){
                    console.log(err);
                }else{
                    res.render("show",{message: foundPost, user: user});
                    // console.log(currentUser);
                    // console.log(user);
                }
            });
        }
    });
});

app.put("/ad-posting/:id",checkAdOwnership,function(req,res){
    Ad.findByIdAndUpdate(req.params.id,req.body.ad,function(err,foundAd){
        if (err){
            console.log(err);
        }else{
            res.redirect("/index/"+foundAd._id)
        }
    });
});


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


function checkAdOwnership(req, res, next){
    if(req.isAuthenticated()){
        Ad.findById(req.params.id,function(err,foundAd){
            if(err){
                res.redirect("back");
            }else{
                if(foundAd.contact.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}
