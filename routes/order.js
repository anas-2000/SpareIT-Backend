const router = require("express").Router()
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")
const Order = require("../models/Order")

// Create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }catch(err){
        res.status(500).json(err)
    }
})


// Update
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {

    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedOrder)
    }catch(err){
        res.status(500).json(err)
    }
})


// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deleted.")
    }catch(err){
        res.status(500).json(err)
    }
})


// Get 
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const orders = await Order.find({userId: req.params.id})
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})


// Get all orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const orders = await Order.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})


// Get monthly income (for vendors and warehouses)
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1)) // last month
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)) // month before the last month to compare income with last month

    try{
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: prevMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            { 
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                    }
            }
        ])
        res.status(200).json(income)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router 

// order.products.indexOf(vendorId)