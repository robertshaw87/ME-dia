var db = require("../models");
var express = require("express");
var router = express.Router();
var request = require('request');
var keys = require("../config/keys.js")
var genreTable = require("../config/genre.js")
//require passport
var passport = require("../config/passport.js");
var path = require("path");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

//number of genres to grab for the user
const numGenres = 2;
//number of results for each genre from movie/tv api
const numRec = 3;

router.get("/", function (req, res) {
    
    res.render("index");
});

router.get("/login", function (req, res) {
    if (req.user) {
        res.render("recommendations")
    } else {
        res.render("login");
    }
});

//========================
//SARA'S USER INPUT ROUTE
//========================

//get info from the form
router.get("/addmedia", function (req, res) {
    if (req.user){
        res.render("userForm");
    } else
    res.redirect("/login")
})

router.get("/newuseraddmedia", function (req, res) {
    if (req.user){
        res.render("newuserForm");
    } else
    res.redirect("/login")
})

//create/post the user history in to history table
router.post("/api/users/history", function (req, res) {
    if (req.user){
        var history = req.body;
        var userid = req.user.id;

        db.History.create({
            UserId: userid,
            name: history.name,
            type: history.type
        }).then(function (data) {
            res.json(data);
        });
    } else
    res.redirect("/login")
});
//updating the interest table
router.put("/api/users/interests", function (req, res) {
    if (req.user){

        var interests = req.body;
        var userid = req.user.id;
        console.log(interests.genre);
        db.Interests.update({ counts: db.sequelize.literal('counts + 1') }, {
            where: {
                UserId: userid,
                genre: interests.genre
            }
        }).then(function (data) {
            res.json(data);
        });

    } else
    res.redirect("/login")
});


router.post("/api/login", passport.authenticate("local"), function (req, res) {

    res.json("/recommendations");
});

router.post("/api/signup", function (req, res) {
    db.User.create({
        name: req.body.name,
        password: req.body.password
    }).then(function () {
        res.redirect(307, "/api/newuser");
    }).catch(function (err) {
        console.log(err);
        res.json(err);
    });
});
router.post("/api/newuser", passport.authenticate("local"), function (req, res) {
    if (req.user){

        var userid = req.user.id;
        var genreList = Object.keys(genreTable.TMDB);
        genreList.forEach(elem => {
            db.Interests.create({
                UserId: userid,
                genre: elem,
                count: 0            
            })
        })
        res.json("/newuseraddmedia");
    } else
    res.redirect("/login")
});
//
// Route for logging user out
router.get("/logout", function (req, res) {
    if (req.user){

        req.logout();
        res.redirect("/");

    } else
    res.redirect("/login")
});


//------------------------
//========================
//ROBERT'S RECOMMENDATION ROUTE
//========================

router.get("/recommendations", function (req, res) {
    if (req.user){

        db.Interests.findAll({
            where: { "UserId": req.user.id },
            order: [
                ["counts", "DESC"]
            ]
        }).then(function (data) {

            var searchParams = [];
            for (var i = 0; i < numGenres && i < data.length; i++) {
                searchParams[i] = data[i].genre;
            }
            recommendMovie(searchParams, [], 0, res, req.user.id)

        });
    
    } else
        res.redirect("/login")
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

function finishRequest(searchParams, resultsArray, res, userID) {
    db.User.findAll({ where: { id: userID } }).then(function (data) {
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
    request("https://api.themoviedb.org/3/discover/" + type + queryStr, function (err, res, body) {

        if (!err && res.statusCode === 200) {
            var itemList = JSON.parse(body).results;
            for (var i = 0; i < numRec && 0 < itemList.length; i++) {
                var currItem = itemList.splice(randInt(itemList.length), 1)[0];
                var date = (type === "movie" ? currItem.release_date : currItem.first_air_date);
                var name = (type === "movie" ? currItem.title : currItem.name);
                var itemGenres = [];
                currItem.genre_ids.forEach((elem) => {
                    var elemGenre = genreTable.reverseTMDB[elem]
                    if (elemGenre) {
                        if (typeof elemGenre === "string")
                            itemGenres.push(elemGenre);
                        else {
                            elemGenre.forEach(subGenre => {
                                if (!itemGenres.includes(subGenre))
                                    itemGenres.push(subGenre);
                            })
                        }
                    }
                })
                if (name && currItem.overview && date && currItem.poster_path) {
                    var newMovie = {
                        name: name,
                        plot: currItem.overview,
                        date: date,
                        type: (type === "movie" ? "Movie" : "Tv Show"),
                        genre: itemGenres,
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

//-------------------------

//============================
// View History Routes
//============================



//----------------------------

module.exports = router;