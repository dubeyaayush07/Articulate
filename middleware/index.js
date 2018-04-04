var Article = require("../models/article");
var Comment = require("../models/comment");
var middlewareObj = {};

// valid only if the person is logged and the creator
middlewareObj.checkArticleOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Article.findById(req.params.id, function(err, foundArticle){
            if(err){
                req.flash("error","Article not found");
                res.redirect("back");
            }
            else{
                if(foundArticle.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

// valid only if the person is logged and the creator
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.c_id, function(err, foundComment){
            if(err){
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

//verify if the person is logged
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;