const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(__dirname + "/public"));

const controller = require(__dirname + "/app/controllers");
app.use(controller);

app.listen(3000,() => console.log("listening on http://localhost:3000/"));