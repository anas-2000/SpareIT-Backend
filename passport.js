const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20');
const User = require("./models/User")

const dotenv = require("dotenv")
dotenv.config()

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/callback"
      },
      async function(accessToken, refreshToken, profile, done) {
        try{
            const user = await User.findOne({googleId: profile.id})
              if(user){
                return done(null, user)
              }
              const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString(),
                phoneNumber: req.body.phoneNumber,
                isAdmin: req.body.isAdmin
            })
            await newUser.save()
            return done(null, newUser)
        }catch(err){

        }
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, { id: user.id, username: user.username});
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            done(err, user);
        })
      });
}