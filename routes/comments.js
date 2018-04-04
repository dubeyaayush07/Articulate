var express= require("express");
var router = express.Router({mergeParams: true});
var Article = require("../models/article");
var Comment   = require("../models/comment");
var middleware = require("../middleware");




//new route
router.get("/articles/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Article.findById(req.params.id, function(err, article) {
       if(err){
          console.log(err);
       } 
       else{
          res.render("./comments/new", {article:article});
       }
    });
});

//create route
router.post("/articles/:id/comments", middleware.isLoggedIn, function(req, res){
   req.body.comment.text = req.sanitize(req.body.comment.text);      
   Article.findById(req.params.id, function(err, article) {
       if(err){
          console.log(err);
          res.redirect("/articles");
       }
       else{
          Comment.create(req.body.comment, function(err,comment){
             if(err){
                console.log(err);
             }
             else{
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                article.comments.push(comment._id);
                article.save();
                req.flash("success", "Successfully added comment");
                res.redirect("/articles/" + article._id);
             }
          });
          
       }
   });
});

//edit route
router.get("/articles/:id/comments/:c_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.c_id, function(err, comment){
        if(err){
            console.log(err);
        }
        else{
            res.render("./comments/edit", {article_id:req.params.id, comment:comment});
        }
    });
});

//update route
router.put("/articles/:id/comments/:c_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.c_id, req.body.comment, function(err, updatedComment){
       if(err){
           console.log(err);
       }
       else{
           req.flash("success", "Successfully updatedComment comment");
           res.redirect("/articles/" + req.params.id);
       }
   }); 
});

//delete route
router.delete("/articles/:id/comments/:c_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.c_id, function(err){
       if(err){
           console.log(err);
       }
       else{
           req.flash("success", "Comment deleted");
           res.redirect("/articles/" + req.params.id);
       }
   });
});

module.exports = router;