const express = require('express');
const router = express.Router();
const verifyToken = require("../util/verifyToken");
const DocService = require("../services/docService");


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
module.exports = router;