var User = require('.././models/user');
var FacebookSecrets = require('./facebook_secrets');

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
    clientID: FacebookSecrets.clientID,
    clientSecret: FacebookSecrets.clientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    var email       = (typeof profile.emails !== "undefined") ? profile.emails[0].value : "";
    var photoUrl    = (typeof profile.emails !== "undefined") ? profile.photos[0].value : "";
    var query = User.findOne({ 'fbId': profile.id });
    query.exec(function (err, oldUser) {
      console.log(oldUser);
      if(oldUser) {
        // console.log('User: ' + oldUser.name + ' found and logged in!');
        done(null, oldUser);
      } else {
        var newUser = new User();
        newUser.fbId      = profile.id;
        newUser.name      = profile.displayName;
        newUser.gender    = profile.gender;
        newUser.email     = email;
        newUser.photoUrl  = photoUrl;

        newUser.save(function(err) {
          if(err) {throw err;}
          // console.log('New user: ' + newUser.name + ' created and logged in!');
          done(null, newUser);
        });
      }
    });
  }
));
module.exports = passport