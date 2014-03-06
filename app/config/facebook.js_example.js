var User = require('.././models/user');

// Facebook login using passport
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing. However, since this example does not
// have a database of user records, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var email       = (typeof profile.emails !== "undefined") ? profile.emails[0].value : "";
    var photoUrl    = (typeof profile.emails !== "undefined") ? profile.photos[0].value : "";
    User.create({
     name     : profile.displayName,
     username : profile.username,
     gender   : profile.gender,
     email    : email,
     photoUrl : photoUrl
    }, function(err, user) {
      if (err) { return done(err); }
      return done(null, user);
    });
  }
));
module.exports = passport