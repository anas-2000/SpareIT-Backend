const bodyParser = require('body-parser');
const router = require("express").Router();
const {verifyToken, verifyTokenAndAdmin} = require("./verifyToken");
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


module.exports = router
