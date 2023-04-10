const express = require("express");
const morgan = require("morgan"); 
const routes = require("./routes/index");


// Sample request before sanitization:
// { "username": "user123", "search": "search$gt" }
// =>
// { "username": "user123", "search": "search" }
const mongosanitize = require("express-mongo-sanitize");
const cors = require("cors");


const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static('public'));
app.use(routes);


module.exports = app;