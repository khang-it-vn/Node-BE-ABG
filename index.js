require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public",express.static(__dirname + "/public"));
const controller = require(__dirname + "/apps/controllers");
app.use(controller);

const server = app.listen(port,() => console.log(`Server is listening port ${port}`))