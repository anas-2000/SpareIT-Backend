const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    // userId: {type: String, required: true},
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        // {
        //     productId: { type: String, required: true},
        //     quantity: { type: Number, default: 1 }
        // }
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type: Number
            },
            seller:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" }
    
}, { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)