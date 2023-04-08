const express = require('express');
const router = express.Router();
const verifyToken = require("../util/verifyToken");
const DocService = require("../services/docService");
const CategoryService = require('../services/categoryService');

const ProductService = require('../services/productService');

router.get("/detail/:id", verifyToken, async(req, res) => {
    id = req.params.id;
    if(id)
    {
        const doc = await DocService.getById(id);
        if(doc){
            return res.status(200).json(doc);
        }
        
    }
    return res.status(404).json({message: "Not Found"});
})

router.get("/doc/:keyword",verifyToken, async(req, res) => {
    let keyword = req.params.keyword;

    let docs = await DocService.getByContentTitle(keyword);
    if(docs)
    {
        return res.status(200).json(docs);
    }
    return res.status(404).json({message: "Not Found"});
})

router.get("/docs", async (req, res) => {
    let docs = await DocService.getAll();
    return res.status(200).json(docs);
})


// category
router.get("/categorys",verifyToken, async(req, res) => {
    try {
        
        const categorys = await CategoryService.findAll();
        return res.status(200).json(categorys);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})

router.get("/category/:id", verifyToken, async(req, res) => {
    const id = req.params.id;
    const category = await CategoryService.findByPk(id);
    if(category)
    {
        return res.status(200).json(category);
    }
    return res.status(404).json({messgae: "404: Not Found"});
})


// end category

// start product

router.get('/product/:id',verifyToken, async(req, res) => {
    const id = req.params.id;
    const product = await ProductService.findByPk(id);
    if(product)
    {
        return res.status(200).json(product);
    }
    return res.status(404);
})

router.get('/products/:keyword', verifyToken, async(req, res) => {
    const keyword = req.params.keyword;
    const products = await ProductService.findByNameProduct(keyword);
    if(products)
    {
        return res.status(200).json(products);
    }
    return res.status(404).json({message: "404: NOt Found"});
})

router.get('/products', verifyToken, async (req, res) => {
    const products = await ProductService.findAll();
    return res.status(200).json(products);
})
// end product

module.exports = router;