const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString(),
        phoneNumber: req.body.phoneNumber
    })
    try{
        await newUser.save()
        res.send("Registration successful")
    }
    catch(err){
        // res.send(err)
        if (!newUser.password){
            res.send("Please enter a password")
        }
        else if (!newUser.username){
            res.send("Please enter a username")
        }
        else if (!newUser.email){
            res.send("Please enter an email")
        }
        else {
            console.log(err)
        }
    }
    
})

router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username})
        const encryptedPassword = user.password
        const originalPassword = CryptoJS.AES.decrypt(encryptedPassword, process.env.PASS_KEY).toString(CryptoJS.enc.Utf8)
        !user || req.body.password !== originalPassword && res.status(401).json("Please enter valid username and password")

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, 
        process.env.JWT_KEY,
        { expiresIn: "1d" }
        )

        const { password, ...otherFields } = user._doc
        res.status(200).json({...otherFields, accessToken})
        
        
    }catch(err){
        res.send("something is wrong")
    }
})

module.exports = router