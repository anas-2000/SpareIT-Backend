const mongoose = require("mongoose")

const SellerSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    vendorId: {type: String, required: true, unique: true},
    shopAddress: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber: {type: Number, required: true, unique: true},
    isAdmin: {type: Boolean, default: true}
    
}, { timestamps: true }
)

const Seller = mongoose.model("Seller", SellerSchema)
module.exports = Seller