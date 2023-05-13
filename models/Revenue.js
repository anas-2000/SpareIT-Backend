const mongoose = require("mongoose")

const RevenueSchema = new mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true })
module.exports = mongoose.model("Revenue", RevenueSchema)