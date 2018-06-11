var db = require("../models");
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
        // console.log("index");
        res.render("index");
    });

router.get("/login", function (req, res) {
        res.render("login");
    });

router.get("/recommendations", function (req, res) {
        res.render("recommendations");
    });

module.exports = router;