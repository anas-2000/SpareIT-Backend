const router = require("express").Router()
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")
const CryptoJS = require("crypto-js")
const User = require("../models/User")

router.put("/:id", verifyToken, async (req,res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString()
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted.")
    }catch(err){
        res.status(500).json(err)
    }
})

router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const { password, ...otherFields } = user._doc
        res.status(200).json(otherFields)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router