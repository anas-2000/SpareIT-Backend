const bodyParser = require('body-parser');
const router = require("express").Router();
const {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyUser} = require("./verifyToken");
const Comments = require("../models/Comments");

router.route("/")
.get((req, res, next) => {
    Comments.find(req.query) //req.query will contain the query we want to find the comments with. i.e. req.query will contain => product: 'some productid' 
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
    
})
.post(verifyUser, (req, res, next) => {
    if((req.body != null)){
        req.body.author = req.user.id;
        Comments.create(req.body)
        .then((comment) => {
            Comments.findById(comment._id)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else{
        err = new Error('Comment not found in request body');
        err.status = 404;
        return next(err);
    }
    
})
.put(verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments/');
})
.delete(verifyTokenAndAdmin, (req, res, next) => {
    Comments.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
}, (err) => next(err))
    .catch((err) => next(err));
});

router.route('/:commentId')
.get((req,res,next) =>{
    Comments.findById(req.params.commentId)
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment);
        
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post(verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /comments/'+req.params.commentId);
})
.put(verifyUser, (req,res,next)=>{
    Comments.findById(req.params.commentId).then((comment) => {
        if(comment != null){
            if(comment.author.equals(req.user.id)){
                // req.body.author = req.body.user._id;
                Comments.findByIdAndUpdate(req.params.commentId, {$set: req.body}, {new: true})
                .then((comment) => {
                    //If comment updated successfully
                    Comments.findById(comment._id)
                    .populate('author')
                    .then((comment) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(comment);
                    })
                    
                }, (err) => next(err));
            }
            else{
                err = new Error("You are not authorized to update this comment!");
                err.status = 403;
                next(err);
            }
            
        }
        else{ 
            err = new Error('Comment '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(verifyUser, (req,res,next) =>{
    Comments.findById(req.params.commentId).then((comment) => {
        if(comment != null){ 
            if(comment.author.equals(req.user.id)){
                Comments.findByIdAndRemove(req.params.commentId)
                .then((resp) => {
                    //If comment deleted successfully
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                    
            }, (err) => next(err))
            .catch((err) => next(err));
            }
            else{
                err = new Error("You are not authorized to delete this comment!");
                err.status = 403;
                next(err);
            }
            
        }
        else{
            err = new Error('Comment '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router
