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
        recommendMovie(searchParams, [], res, parseInt(req.params.userid))
        
    });
    // res.render("recommendations");
});

// return a random integer between 0 and the argument (non-inclusive)
function randInt(x) {
    return Math.floor(Math.random() * x)
}

function recommendMovie(searchParams, resultsArray, res, userID) {
    callTMDB("movie", searchParams, resultsArray, res, userID, recommendTV);
}

function recommendTV(searchParams, resultsArray, res, userID) {
    callTMDB("tv", searchParams, resultsArray, res, userID, recommendBook);
}

function recommendBook(searchParams, resultsArray, res, userID) {
    console.log(resultsArray);
    // finishRequest(searchParams, resultsArray, res, userID);
}

function finishRequest(searchParams, resultsArray, res, userID) {
    // res.json(resultsArray);
}

// make calls to get movies or tv shows and then add to resultsArray
// executes callback function afterwards
function callTMDB(type, searchParams, resultsArray, res, userID, callback) {
    var queryStr = `?api_key=${keys.TMDB.apikey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=`
    queryStr += genreTable.TMDB[searchParams[0]];
    for (var i=1; i<searchParams.length; i++){
        queryStr += "%2C" + genreTable.TMDB[searchParams[i]];
    }
    console.log("https://api.themoviedb.org/3/discover/" + type + queryStr)
    request("https://api.themoviedb.org/3/discover/" + type + queryStr, function (err, res, body){
        if (!err && res.statusCode === 200){
            var itemList = JSON.parse(body).results;
            for (var i = 0; i < 3 && 0 < itemList.length; i++) {
                var currItem = itemList.splice(randInt(itemList.length), 1)[0];
                var date = (type === "movie" ? currItem.release_date : currItem.first_air_date)
                var name = (type === "movie" ? currItem.title : currItem.name)
                // console.log(date)
                if (name && currItem.overview && date && currItem.poster_path) {
                    var newMovie = {
                        name: name,
                        plot: currItem.overview,
                        date: date,
                        image: "https://image.tmdb.org/t/p/original/" + currItem.poster_path
                    }
                    resultsArray.push(newMovie);
                } else {
                    i--;
                }
            }
            callback(searchParams, resultsArray, res, userID);
        }
    })
}

//-------------------------

module.exports = router;