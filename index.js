require('dotenv').config();
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))
app.use(cors())
// if you want get image from name using this url http://localhost:3000/img/<name_img>
const controller = require(__dirname + "/app/controllers");
app.use(controller);

app.listen(port,() => console.log(`listening on http://localhost:${port}/`));