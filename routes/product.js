// this is for vendor/warehouse side of the application, have to change verifyToken functions accordingly 
// because they're built for client/admin side (excepe 1 or 2)
const bodyParser = require('body-parser');
const router = require("express").Router()
const {verifyToken, verifyTokenAndAdmin} = require("./verifyToken")
const Product = require("../models/Product")

// Create
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {

    Product.create(req.body).then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err));
    // const newProduct = new Product(req.body);

    // try{
    //     const savedProduct = await newProduct.save();
    //     res.status(200).json(savedProduct);
    // }catch(err){
    //     res.status(500).json(err)
    // }
})


// Update
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {

    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedProduct)
    }catch(err){
        res.status(500).json(err)
    }
})


// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json(req.params.id)
    }catch(err){
        res.status(500).json(err)
    }
})


// Get
router.get("/find/:id", async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})


// Get all products 
router.get("/", async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    const querySeller = req.query.seller; //

    try{
        let products;

        if(queryNew){
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if(queryCategory){
            // products = await Product.find({ categories: { $in: [queryCategory] } }) // use this line if categories array is used in db
            products = await Product.find({ category: { $in: [queryCategory] } }) // use this line if category field is used in db
        }
        else if(querySeller){//
            products = await Product.find({ seller: querySeller }); // use this line if seller field is used in db
        } 
        else{
            products = await Product.find()
        }

        res.status(200).json(products)
    }catch(err){

    }
})



module.exports = router