var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");

//require passport
var passport = require("./config/passport.js");

require("dotenv").config();
var keys = require("./config/keys.js");

var PORT = process.env.PORT || 8080;

var app = express();

// require models for syncing
var db = require("./models");

// give access to the public folder
app.use(express.static("public"));

// use the body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// setup handlebars as our render engine
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// import and use routes for the server
var routes = require("./controllers/media_controller.js");

app.use(routes);

// set the server to start listening to our port
db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });