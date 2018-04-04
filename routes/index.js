var express= require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//landing
router.get("/", function(req, res){
   res.render("landing"); 
});

//register form
router.get("/register", function(req, res) {
   res.render("register"); 
});

// register 
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
         req.flash("error", err.message);
         return res.redirect("/articles");
      }
      passport.authenticate("local")(req, res, function(){
         req.flash("success", "Welcome to Articulate " + user.username);
         res.redirect("/articles");
      });
   });
});

//login form
router.get("/login", function(req, res) {
   res.render("login"); 
});

//login
router.post("/login", passport.authenticate("local",
{
  successRedirect:"/articles",
  failureRedirect:"/login"
}),function(req, res){
});

//logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/articles");
});

//to handle all other requests
router.get("*", function(req, res){
   res.redirect("/articles"); 
});

module.exports = router;