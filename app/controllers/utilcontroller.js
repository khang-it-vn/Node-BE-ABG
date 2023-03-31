const multer = require('multer');
const path = require('path');
const express = require("express");
const router = express.Router();

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

// Define route to handle file upload with middleware
router.post('/upload',  upload.single('image'), (req, res) => {
  // Handle file upload here
  const file = req.file;
  console.log(file);
  res.status(200).json({filename: file.filename});
});


module.exports = router;
