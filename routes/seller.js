const router = require("express").Router()
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")
const Order = require("../models/Order")

// returns seller orders
router.get("/stats/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orders = await Order.find({products:{vendorId: req.params.id}})
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router



// {$match: {createdAt: {$gte: lastYear}}},
//             {
//                 $project: {
//                     month: {$month: "$createdAt"}
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$month", 
//                     total: {$sum: 1}
//                 }
//             }