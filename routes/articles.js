var express= require("express");
var router = express.Router();
var Article = require("../models/article");
var middleware = require("../middleware");


//Index route
router.get("/articles", function(req, res){
   Article.find({}, function(err, allArticles){
      if(err){
          console.log(err);
      } 
      else{
          res.render("./articles/index", {articles:allArticles});
      }
   });
});

//New Route
router.get("/articles/new", middleware.isLoggedIn, function(req, res) {
   res.render("./articles/new"); 
});

//Create Route
router.post("/articles", middleware.isLoggedIn, function(req, res){
   req.body.article.content = req.sanitize(req.body.article.content);
   Article.create(req.body.article, function(err, newArticle){
      if(err){
         console.log(err);
      }
      else{
         newArticle.author.id = req.user._id;
         newArticle.author.username = req.user.username;
         newArticle.save();
         req.flash("success", "Successfully added article");
         res.redirect("/articles");
      }
   });
});

//Show route
router.get("/articles/:id", function(req, res) {
    Article.findById(req.params.id).populate("comments").exec(function(err, article){
       if(err){
          console.log(err);
       }
       else{
          res.render("./articles/show", {article:article});
       }
    });
});

//edit
router.get("/articles/:id/edit", middleware.checkArticleOwnership, function(req, res) {
    Article.findById(req.params.id, function(err,foundArticle){
       if(err){
          console.log(err);
       }
       else{
          res.render("./articles/edit",{article:foundArticle});
       }
    });
});

//update
router.put("/articles/:id", middleware.checkArticleOwnership, function(req, res){
   Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticle){
      if(err){
         res.redirect("/articles");
      }
      else{
         req.flash("success", "Successfully updated article");
         res.redirect("/articles/" + req.params.id);
      }
   });
});

//delete
router.delete("/articles/:id", middleware.checkArticleOwnership, function(req, res){
   Article.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/articles");
      }
      else{
         req.flash("success", "Article deleted");
         res.redirect("/articles");
      }
   });
});

module.exports = router;