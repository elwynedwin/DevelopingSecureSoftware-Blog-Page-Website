//importing modules
const express = require("express");
const path = require("path");
const sequelize = require("sequelize");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const db = require("./models");
const toobusy = require("toobusy-js");
const hpp = require("hpp");
const https = require("https");
const fs = require("fs");
const key = fs.readFileSync("./cert/CA/localhost/localhost.decrypted.key");
const cert = fs.readFileSync("./cert/CA/localhost/localhost.crt");

//setting up your port
const PORT = process.env.PORT || 4020;

//assigning the variable app to express
const app = express();

//sets up view engine for ejs
app.set("view engine", "ejs");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./public")));
app.use(hpp());

//Middleware protects server from running too many requests //PREVENT DOS ATTACK
toobusy.maxLag(10); //default maxLag value is 70ms
toobusy.interval(250); //default interval is 500ms
toobusy.onLag(function (currentLag) {
  console.log("event loop lag detetcted! Latency: " + currentLag + "ms");
});

//monitoring event loops (stops heavy traffic) //PREVENT DOS ATTACK
app.use(function (req, res, next) {
  if (toobusy()) {
    res.status(503).send("Server too busy!");
  } else {
    next();
  }
});

//Using a Http server protects from Session Hijacking due to data encrption
//const server = https.createServer({ key, cert }, app);

//Sending a null value for verifiedUser so the function checkUser() can check if the user is logged in
app.use(function (req, res, next) {
  res.locals.verifiedUser = null;
  next();
});

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: false }).then(() => {
  console.log("db has been re sync");
});

// var csrf = require('csurf');
// const csrfProtection = csrf({ cookie: true })
// app.use(csrfProtection)

//routes for the user API
app.use("/api/users", require("./routes/routes"));
app.use("/", require("./routes/pages"));

//listening to server connection
server.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
