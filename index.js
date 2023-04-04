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
const db = require("./db")



const app = express()
dotenv.config()

require('./passport')(passport)

db()
app.use(express.json())

app.use(cors())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/stripe", stripeRoute)


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
    console.log(`listening on port ${process.env.PORT}...`)})
// const express = require("express")
// const passport = require('passport')
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const cors = require("cors")
// const dotenv = require("dotenv")

// const userRoute = require("./routes/user")
// const sellerRoute = require("./routes/seller")
// const authRoute = require("./routes/auth")
// const productRoute = require("./routes/product")
// const cartRoute = require("./routes/cart")
// const orderRoute = require("./routes/order")
// const stripeRoute = require("./routes/stripe")
// const db = require("./db")



// const app = express()
// dotenv.config()

// require('./passport')(passport)

// db()
// app.use(express.json())

// app.use(cors())
// app.use("/api/auth", authRoute)
// app.use("/api/users", userRoute)
// app.use("/api/seller", sellerRoute)
// app.use("/api/products", productRoute)
// app.use("/api/carts", cartRoute)
// app.use("/api/orders", orderRoute)
// app.use("/api/stripe", stripeRoute)


// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {secure: false}, // this won't work without https
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
//   }));
// app.use(passport.initialize())
// app.use(passport.session())


// app.listen(process.env.PORT, () => {
//     console.log(`listening on port ${process.env.PORT}...`)
// })