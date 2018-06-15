<h1 align="center">
  <img src="public/assets/imgs/logo.svg" alt="Me.dia" width="500">
</h1>

ME.dia is an app that generates cross platform media and entertainment recommendations. Just watched a good movie? But want something to read or watch on tv instead? We can do that! Tell us what you've watched or read and we'll give you more related media to enjoy. 

It's easy to go on Netflix and view your recommendations or view a currated playlist on Spotify, but with ME.dia you can get the both of best worlds. 

## Built With :crescent_moon:
* HTML5 & CSS3
* [Bootstrap](https://getbootstrap.com/) - CSS framework
* [Javascript](https://www.javascript.com/) - programming language
* [Node.js](https://nodejs.org/en/) - javascript runtime
* [Express.js](https://expressjs.com/) - routing framework
* [Handlebars](http://handlebarsjs.com/) - semantic templating
* [Owl Carousel 2](https://owlcarousel2.github.io/OwlCarousel2/) - better carousel

### NPM Packages
* [sequelize](http://docs.sequelizejs.com/) - ORM for SQL database
* [Express](https://www.npmjs.com/package/express) - Server-side framework
* [Express-Handlebars](https://www.npmjs.com/package/express-handlebars) - Semantic templates for HTML generation
* [Express-session](https://www.npmjs.com/package/express-session) - Middleware for session data
* [body-parser](https://www.npmjs.com/package/body-parser) - Request parsing middleware
* [mySQL2](https://www.npmjs.com/package/mysql2) - Make server-side SQL queries 
* [passport](http://www.passportjs.org/) - Authenticate requests 
* [passport-local](https://www.npmjs.com/package/passport-local) - Local login authentication
* [bcrypt-nodejs](https://www.npmjs.com/package/bcrypt-nodejs) - Encrypt user password
* [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Middleware for cookies
* [dotenv](https://www.npmjs.com/package/dotenv) - Keep API keys hidden
* [request](https://www.npmjs.com/package/request) - Make server-side API calls 

### APIs
* [The MovieDB](https://www.themoviedb.org/documentation/api)

## Authors :key:
* **Sara Khosravinasr** [saranasr83](https://github.com/saranasr83)
* **Rober Shaw** - [robertshaw87](https://github.com/robertshaw87)
* **Jimmy Tu** - [jimmytutron](https://github.com/jimmytutron)


## Routes

<h1 align="center">
  <img src="public/assets/imgs/readme-routes.png" alt="Routes" width="500">
</h1>

Because this was a full stack app, we had to create our own routes for our client to interact with the server. Everything from the `get` methods to serve up html to the `post` and `put` methods to interact with our database. So many interconnected parts meant that the Front-end and the Back-end developers had to maintain good communication to produce a coherent product.

## Models

<h1 align="center">
  <img src="public/assets/imgs/readme-models.png" alt="Models" width="500">
  <img src="public/assets/imgs/readme-models-code.gif" alt="Models Code" width="500">
</h1>

We chose to keep the models for the app simple for now: each `user` has many `histories` and many `interests`. By splitting the view history and the user interests, we could more easily integrate addition types of media into our app by simply expanding the types available in the history table. In addition, we can still eventually choose to store more information about each movie/show/book/song that the user has seen without overcomplicating our interactions with the rest of the database.

## CRUD Database

<h1 align="center">
  <img src="public/assets/imgs/readme-C-U.png" alt="Models" width="500">
  <img src="public/assets/imgs/readme-C-U.png" alt="Models" width="500">
</h1>

## Acknowledgments :pray:
A huuuuge MEGA bigly thank you to our instructor, Jerome, and the TAs, Amber, Ricky, and Sasha!!  :grimacing: