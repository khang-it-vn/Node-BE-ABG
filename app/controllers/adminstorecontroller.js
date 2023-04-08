const express = require('express');
const router = express.Router();
const ProductService = require('../services/productService');
const multer = require('multer');
const path = require('path');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../util/verifyToken');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img'); // specify the destination folder here
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // get the extension of the uploaded file
        cb(null, file.fieldname + '-' + Date.now() + ext); // generate a unique filename for the uploaded file
    }
});
const upload = multer({ storage });

router.post('/product', verifyToken, upload.single('image'),async (req,res) => {
    const file = req.file;
    const filename = file.filename;
    const {name,description,price,id} = req.body;
    let product = {
        name,
        description,
        price,
        id,
        image: filename
    };
    console.log(product);
    const productCreated = await ProductService.create(product);
    return res.status(200).json(productCreated);
})

router.delete('/product/:id', verifyToken, async(req, res) => {
    const id = req.params.id;

    const state = await ProductService.delete(id);
    if(state)
    {
        return res.status(200).json({message: 'deleted'});
    }
    
    return res.status(404).json({message: "404: Not Found"});
})

module.exports = router;