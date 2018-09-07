"use strict";

const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/todo.html");
});

// Start server
const port = process.env.PORT || 3000; // Will check for env if on Heroku, otherwise use 3000
console.log("running on port " + port);
app.listen(port);
