var db = require("../models");
var express = require("express");
var router = express.Router();
var request = require('request');
var keys = require("../config/keys.js");
var genreTable = require("../config/genre.js");
// var spotifyToken;
// authorizeSpotify();

//number of genres to grab for the user
const numGenres = 2;
//number of results for each genre from movie/tv api
const numRec = 3;

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
        var searchParams = [];
        for (var i = 0; i < numGenres && i < data.length; i++){
            searchParams[i] = data[i].genre;
        }
        recommendMovie(searchParams, [], 0, res, parseInt(req.params.userid))
        
    });
});

// return a random integer between 0 and the argument (non-inclusive)
function randInt(x) {
    return Math.floor(Math.random() * x)
}

function recommendMovie(searchParams, resultsArray, iterator, res, userID) {
    if (iterator >= searchParams.length)
        recommendTV(searchParams, resultsArray, 0, res, userID)
    else {
        callTMDB("movie", searchParams, resultsArray, iterator, res, userID, recommendMovie);
    }
}

function recommendTV(searchParams, resultsArray, iterator, res, userID) {
       if (iterator >= searchParams.length)
        finishRequest(searchParams, resultsArray, res, userID)
    else {
        callTMDB("tv", searchParams, resultsArray, iterator, res, userID, recommendTV);
    }
}

// function recommendMusic(searchParams, resultsArray, iterator, res, userID) {
//     if (iterator >= searchParams.length) {
//         finishRequest(searchParams, resultsArray, res, userID);
//     } else {
//         callSpotify(searchParams, resultsArray, iterator, res, userID, recommendMusic);
//     }
// }

function finishRequest(searchParams, resultsArray, res, userID) {
    // console.log(resultsArray);
    db.User.findAll({where: {id: userID}}).then(function (data) {
        res.render("recommendations", {
            recommendations: resultsArray,
            userID: data.name,
            userName: data[0].name
        });
    });
}

// make calls to get movies or tv shows and then add to resultsArray
// executes callback function afterwards
function callTMDB(type, searchParams, resultsArray, iterator, apiResponse, userID, callback) {
    var queryStr = `?api_key=${keys.TMDB.apikey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=`
    queryStr += genreTable.TMDB[searchParams[iterator]];
    request("https://api.themoviedb.org/3/discover/" + type + queryStr, function (err, res, body){
        if (!err && res.statusCode === 200){
            var itemList = JSON.parse(body).results;
            for (var i = 0; i < numRec && 0 < itemList.length; i++) {
                var currItem = itemList.splice(randInt(itemList.length), 1)[0];
                console.log("========");
                console.log(currItem);
                console.log("========");
                var date = (type === "movie" ? currItem.release_date : currItem.first_air_date);
                var name = (type === "movie" ? currItem.title : currItem.name);
                var itemGenres = [];
                currItem.genre_ids.forEach((elem) => {
                    itemGenres.push(genreTable.reverseTMDB[elem]);
                })
                console.log(currItem)
                if (name && currItem.overview && date && currItem.poster_path) {
                    var newMovie = {
                        name: name,
                        plot: currItem.overview,
                        date: date,

                        image: "https://image.tmdb.org/t/p/original" + currItem.poster_path
                    }
                    resultsArray.push(newMovie);
                } else {
                    i--;
                }
            }
            var newIterator = iterator + 1;
            callback(searchParams, resultsArray, newIterator, apiResponse, userID);
        }
    })
}

// function authorizeSpotify() {
//     request({
//         url: "https://accounts.spotify.com/api/token",
//         type: "POST", 
//         headers: {
//             Authorization: "Basic ",
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         data: {grant_type: "client_credentials"},
//         success: function (data) {
//             spotifyToken = result.access_token;
//             setTimeout(authorizeSpotify, result.expires_in * 1000);
//         }
//     })
// }

// function callSpotify(searchParams, resultsArray, iterator, apiResponse, userID, callback) {
//     spotify.getCategory(genreTable.spotify[searchParams[iterator]], {
//         country: "US",
//         limit: 20,
//         offset: 0
//     }).then(function (data) {
//         console.log(data.body)
//     }, function (err) {
//         console.log(err)
//     });


// }

//-------------------------

module.exports = router;