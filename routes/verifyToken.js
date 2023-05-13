const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if(err){
                res.status(403).json("Invalid token.")
            }
            else{
                req.user = user
                next()
            }
            // req.user = user
            // next()
        })
    }
    else{
        return res.status(401).json("You are not authenticated.")
    }
}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user){
            next()
        }
        else{
            res.status(401).json("You are not authenticated")
        }
    })
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user){
            if (req.user.id === req.params.id || req.user.isAdmin){
                next()
            }else{
                res.status(403).json("You are not allowed to make any changes.")
            }
        }
        else{
            res.status(401).json("You are not authenticated");
        }
        
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {

        if(req.user){
            if(req.user.isAdmin){
                next();
            }
            else{
                res.status(403).json("Access not allowed");
            }
            
        }
        else{
            res.status(401).json("Your are not authenticated");
        }
        // if (req.user.isAdmin){
        //     next()
        // }else{
        //     res.status(403).json("Access not allowed.")
        // }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyUser}