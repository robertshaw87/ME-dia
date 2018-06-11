var db = require("../models");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get("/recommendations", function (req, res) {
        res.render("recommendations");
    });
}