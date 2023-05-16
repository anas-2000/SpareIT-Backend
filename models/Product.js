const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        default: ''
    },
    vehicle: {
        type: Array,
        default: []
    },
    vehiclemodel: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0 //
    },
    inStock: {
        type: Boolean,
        default: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema)