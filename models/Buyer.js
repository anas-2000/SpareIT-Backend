const mongoose = require("mongoose")

const BuyerSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    shippingAddress: {type: String, required: true},
    billingAddress: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber: {type: Number, required: true, unique: true},
    isAdmin: {type: Boolean, default: false}
    
}, { timestamps: true }
)

const Buyer = mongoose.model("Buyer", BuyerSchema)
module.exports = Buyer