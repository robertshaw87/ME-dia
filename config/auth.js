const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var keys = require("./keys.js")
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    var googleCredentials = keys.googleOAuth;
    googleCredentials.callbackURL = "/auth/google/callback"
    passport.use(new GoogleStrategy(googleCredentials,
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};