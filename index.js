const express = require("express")
const dotenv = require("dotenv")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const db = require("./db")

const app = express()
dotenv.config()

db()
app.use(express.json())

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}...`)
})