const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    // title: {type: String, required: true, unique: true},
    // description: {type: String, required: true},
    // img: {type: String, required: true},
    // categories: {type: Array, required: true},
    // price: {type: Number, required: true},
    // model: {type: Number, required: true}
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
    //make this change in new version
    // subcategory: {
    //     type: String
    // },
    manufacturer: {
        type: String,
        default: ''
        // required: true
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
    // featured: {
    //     type: Boolean,
    //     required: true,
    //     default: false
    // },
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