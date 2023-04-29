const router = require("express").Router()
const passport = require('passport')
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        // email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString(),
        // phoneNumber: req.body.phoneNumber,
        isAdmin: req.body.isAdmin
    })
    try {
        newUser.save((err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
                return;
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json('Registration Successful');
            }
        })

        // await newUser.save()
        // res.send("Registration successful")
    }
    catch (err) {
        // res.send(err)
        if (!newUser.password) {
            res.send("Please enter a password")
        }
        else if (!newUser.username) {
            res.send("Please enter a username")
        }
        else if (!newUser.email) {
            res.send("Please enter an email")
        }
        else {
            console.log(err)
        }
    }

})

router.post("/login", (req, res) => {
    User.findOne({ username: req.body.username }).then((user) => {
        // const password = user.password
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({ sucess: false, status: 'Login Unsuccessful!', err: 'invalid username' });
        }
        else {
            const encryptedPassword = user.password
            const userpassword = CryptoJS.AES.decrypt(encryptedPassword, process.env.PASS_KEY).toString(CryptoJS.enc.Utf8)
            // const userpassword = user.password
            if (req.body.password !== userpassword) {
                // console.log(req.body.password);
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({ sucess: false, status: 'Login Unsuccessful!', err: 'invalid pasword' });
            }
            else {
                const accessToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                },
                    process.env.JWT_KEY,
                    { expiresIn: "1d" }
                )

                const { password, ...otherFields } = user._doc
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ ...otherFields, accessToken });
            }

        }
    }).catch((err) => {
        console.log(err);
    })



    // try {
    //     User.findOne({ username: req.body.username }).then((user) => {
    //         console.log(user)
    //         // const user = User.findOne({ username: req.body.username })
    //         const encryptedPassword = user.password
    //         // uncomment when using encryption for passwords
    //         // const originalPassword = CryptoJS.AES.decrypt(encryptedPassword, process.env.PASS_KEY).toString(CryptoJS.enc.Utf8)
    //         const originalPassword = encryptedPassword
    //         !user || req.body.password !== originalPassword && res.status(401).json("Please enter valid username and password")
    //         const accessToken = jwt.sign({
    //             id: user._id,
    //             isAdmin: user.isAdmin
    //         },
    //             process.env.JWT_KEY,
    //             { expiresIn: "1d" }
    //         )

    //         const { password, ...otherFields } = user._doc
    //         res.status(200).json({ ...otherFields, accessToken })
    //     })




    //     // const user = User.findOne({ username: req.body.username })
    //     // const encryptedPassword = user.password
    //     // const originalPassword = CryptoJS.AES.decrypt(encryptedPassword, process.env.PASS_KEY).toString(CryptoJS.enc.Utf8)
    //     // !user || req.body.password !== originalPassword && res.status(401).json("Please enter valid username and password")

    //     // const accessToken = jwt.sign({
    //     //     id: user._id,
    //     //     isAdmin: user.isAdmin
    //     // },
    //     //     process.env.JWT_KEY,
    //     //     { expiresIn: "1d" }
    //     // )

    //     // const { password, ...otherFields } = user._doc
    //     // res.status(200).json({ ...otherFields, accessToken })


    // } catch (err) {
    //     res.send("something is wrong")
    // }
})


// when oauth isnt successful
router.get('/oauth-failure', (req, res) => {
    res.send('oauth-failure')
})

// oauth
router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/oauth-failure' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

module.exports = router