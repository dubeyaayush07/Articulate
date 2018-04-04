var express = require("express");
var app = express();
var expressSanitizer = require("express-sanitizer");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Article = require("./models/article");
var Comment = require("./models/comment");
var User = require("./models/user");

var commentRoutes =require("./routes/comments");
var articleRoutes = require("./routes/articles");
var indexRoutes = require("./routes/index");

//mongodb://localhost/articulate
mongoose.connect("mongodb://dubeyaayush07:dubeyaayush07@ds233769.mlab.com:33769/articulate");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());

app.use(require("express-session")({
    secret:"Howdy Partner",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(articleRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Application is running"); 
});


