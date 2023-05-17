const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://anasabdullah:anas@cluster0.cmkxcsx.mongodb.net/?retryWrites=true&w=majority';

var createError = require('http-errors');
var path = require('path');
const express = require("express")
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require("cors")
const dotenv = require("dotenv")

const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")
const commentRoute = require("./routes/comments");
const revenueRoute = require("./routes/revenue")
const db = require("./db")



const app = express()
dotenv.config()

// app.all('*', (req,res, next) => {
//   if(req.secure){ // if the incoming request is secure then the secure flag which will be true else the secure flag in the incoming request will be set to false
//     return next(); // just return to the normal flow because the incoming request is already on the secure port
//   }
//   else{
//     res.redirect(307, 'https://'+ req.hostname + ':' + app.get('secPort') + req.url); //redirect to the secure port
//   }
// });


require('./passport')(passport)

db()
app.use(express.json())

// app.use(cors()) // for deployment comment out
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/stripe", stripeRoute)
app.use("/api/comments", commentRoute)
app.use("/api/revenue", revenueRoute)


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}, // this won't work without https
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
  }));
app.use(passport.initialize())
app.use(passport.session())


app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}...`)
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});