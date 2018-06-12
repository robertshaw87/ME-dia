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

//========================
//SARA'S USER INPUT ROUTE
//========================

//get info from the form
router.get("/addmedia", function (req, res){
    res.render("userForm");
})

//create/post the user history in to history table
router.post("/api/users/:userid/history", function(req,res){
    var history = req.body;
    var userid = parseInt(req.params.userid);

    db.History.create({
        UserId: userid,
        name: history.name,
        type: history.type
    }).then(function(data){
        res.json(data);
    });
});
//updating the interest table
router.put("/api/users/:userid/interests", function(req,res){
 var interests = req.body;
 var userid = req.params.userid;
console.log(interests.genre);
 db.Interests.update({counts: db.sequelize.literal('counts + 1')}, {
    where: {
        UserId: userid,
        genre: interests.genre
    }
 }).then(function(data){
    res.json(data);
 });

});




//------------------------
//========================
//ROBERT'S RECOMMENDATION ROUTE
//========================

router.get("/recommendations/:userid", function (req, res) {
    db.Interests.findAll({
        where: {UserId: parseInt(req.params.userid)},
        order: [
            ["counts", "DESC"]
        ]
    }).then(function(data) {
        // console.log(data);
        var searchParams = [];
        for (var i = 0; i < 2 && i < data.length; i++){
            searchParams[i] = data[i].genre;
        }
        console.log(searchParams);
    });






    res.render("recommendations");
});

//-------------------------

module.exports = router;