const express = require('express');
const router = express.Router();
const verifyToken = require("../util/verifyToken");
const DocService = require("../services/docService");


router.post("/add",verifyToken, async (req, res) => {
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

router.put("/update", verifyToken,async(req, res) => {
    const {id,title, description} = req.body;
    if(id && title && description)
    {
        let newDoc = {
            id_product: id,
            title ,
            description
        }
        const doc = await DocService.update(id,newDoc);
        if(doc){
            return res.status(200).json(doc);
        }
        
    }
    return res.status(404).json({message: "Not Found"});
})

router.delete("/delete/:id",verifyToken, async (req, res) => {
    let id = req.params.id;
    let state = await DocService.delete(id);
    if(state)
    {
        return res.status(200).json({success: true, message: "Deleted"});

    }
    return res.status(404).json({message: "Not Found "});
})


module.exports = router;