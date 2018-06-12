var db = require("../models");
var express = require("express");
var router = express.Router();
var request = require('request');
var keys = require("../config/keys.js")
var genreTable = require("../config/genre.js")

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

router.get("/api/users/:userid/recommendations", function (req, res) {
    console.log("banananananan")
    db.Interests.findAll({
        where: {UserId: parseInt(req.params.userid)},
        order: [
            ["counts", "DESC"]
        ]
    }).then(function(data) {
        var searchParams = [];
        for (var i = 0; i < 2 && i < data.length; i++){
            searchParams[i] = data[i].genre;
        }
        callTMDB(searchParams, [], res, parseInt(req.params.userid));
    });
    res.render("recommendations");
});

// return a random integer between 0 and the argument (non-inclusive)
function randInt(x) {
    return Math.floor(Math.random() * x)
}

// make calls to get movies and tv shows and then add to resultsArray
// executes book recommendations afterwards
function callTMDB(searchParams, resultsArray, res, userID) {
    var queryStr = `?api_key=${keys.TMDB.apikey}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&include_video=false&page=1&with_genres=`
    queryStr += genreTable.TMDB[searchParams[0]];
    for (var i=1; i<searchParams.length; i++){
        queryStr += "%2C" + genreTable.TMDB[searchParams[i]];
    }
    request("https://api.themoviedb.org/3/discover/movie" + queryStr, function (err, res, body){
        if (!err && res.statusCode === 200){
            var movieList = body;
            console.log("===========================")
            console.log(body)
            console.log("===========================")
            console.log(res.body)
            
        }
    })
    console.log("===========================")
    console.log(queryStr)
}

//-------------------------

module.exports = router;