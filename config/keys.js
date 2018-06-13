var keys = module.exports = {};

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

keys.TMDB = {
    apikey: process.env.TMDB_APIKEY
}