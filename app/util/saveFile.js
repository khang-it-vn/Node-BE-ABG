const multer = require('multer');
const path = require('path');

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
module.exports = upload;