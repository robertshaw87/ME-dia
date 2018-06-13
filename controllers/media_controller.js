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
        // console.log("index");
        res.render("index");
    });

router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
//
  router.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be 
  //redirected to the signup page
  router.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });
//========================
//SARA'S USER INPUT ROUTE
//========================

//get info from the form
router.get("/addmedia", function (req, res) {
    res.render("userForm");
})

//create/post the user history in to history table
router.post("/api/users/:userid/history", function (req, res) {
    var history = req.body;
    var userid = parseInt(req.params.userid);

    db.History.create({
        UserId: userid,
        name: history.name,
        type: history.type
    }).then(function (data) {
        res.json(data);
    });
});
//updating the interest table
router.put("/api/users/:userid/interests", function (req, res) {
    var interests = req.body;
    var userid = req.params.userid;
    console.log(interests.genre);
    db.Interests.update({ counts: db.sequelize.literal('counts + 1') }, {
        where: {
            UserId: userid,
            genre: interests.genre
        }
    }).then(function (data) {
        res.json(data);
    });

});
// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
});
// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
        email: req.body.email,
        password: req.body.password
    }).then(function () {
        res.redirect(307, "/api/login");
    }).catch(function (err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
    });
});
//
// Route for logging user out
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


//------------------------
//========================
//ROBERT'S RECOMMENDATION ROUTE
//========================

router.get("/recommendations/:userid", function (req, res) {
    db.Interests.findAll({
        where: { UserId: parseInt(req.params.userid) },
        order: [
            ["counts", "DESC"]
        ]
    }).then(function (data) {
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
                var date = (type === "movie" ? currItem.release_date : currItem.first_air_date);
                var name = (type === "movie" ? currItem.title : currItem.name);
                var itemGenres = [];
                currItem.genre_ids.forEach((elem) => {
                    if (genreTable.reverseTMDB[elem])
                    itemGenres.push(genreTable.reverseTMDB[elem]);
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

module.exports = router;