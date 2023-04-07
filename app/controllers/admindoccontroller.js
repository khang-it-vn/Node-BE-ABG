const express = require('express');
const router = express.Router();
const verifyToken = require("../util/verifyToken");
const DocService = require("../services/docService");


router.post("/add", async (req, res) => {
    const {title,description} = req.body;
    if(title && description)
    {
        doc = {
           title: title,
           description: description 
        }
          result =  await DocService.create(doc);
       return  res.status(201).json(result);
    }

    return  res.status(500).json({message: "title and description cannot null"})
})
module.exports = router;