const router = require("express").Router()
const {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization, verifyUser} = require("./verifyToken")
const Revenue = require("../models/Revenue")
const { default: mongoose } = require("mongoose")


router.route("/")
.get(verifyTokenAndAdmin, async (req, res, next) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1)) // last month
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)) // month before the last month to compare income with last month
    try{
        const income = await Revenue.aggregate([
            { $match: 
                {  seller: mongoose.Types.ObjectId(req.user.id),
                    createdAt: { $gte: prevMonth } } 
            },
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
.post(verifyUser, (req, res, next) => {
    if(req.body != null){
        Revenue.create(req.body)
        .then((revenues) => {
            const rev = [];
            revenues.forEach(revenue => {
                Revenue.findById(revenue._id)
                .populate('seller')
                .populate('order')
                .then((revenue) => {
                    rev.push(revenue);
                })
            });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(rev);
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else{
        err = new Error('Seller and/or order details not found in request body');
        err.status = 404;
        return next(err);
    }
})

module.exports = router