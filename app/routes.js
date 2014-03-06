var Gratitude = require('./models/gratitude');
var passport = require('./config/facebook.js');

module.exports = function(app) {

  // api ---------------------------------------------------------------------
  // get all gratitudes
  app.get('/api/gratitudes', function(req, res) {
    // use mongoose to get all gratitudes in the database
    Gratitude.find(function(err, gratitudes) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err)

      res.json(gratitudes); // return all gratitudes in JSON format
    });
  });

  // create gratitude and send back all gratitudes after creation
  app.post('/api/gratitudes', function(req, res) {
    // create a gratitude, information comes from AJAX request from Angular
    Gratitude.create({
      text : req.body.text,
      done : false
    }, function(err, gratitude) {
      if (err) res.send(err);

      // get and return all the gratitudes after you create another
      Gratitude.find(function(err, gratitudes) {
        if (err) res.send(err)
        res.json(gratitudes);
      });
    });
  });

  // delete a gratitude
  app.delete('/api/gratitudes/:gratitude_id', function(req, res) {
    Gratitude.remove({
      _id : req.params.gratitude_id
    }, function(err, gratitude) {
      if (err) res.send(err);

      // get and return all the gratitudes after you create another
      Gratitude.find(function(err, gratitudes) {
        if (err) res.send(err)
        res.json(gratitudes);
      });
    });
  });


  // FACEBOOK
  // Redirect the user to Facebook for authentication.  When complete,
  // Facebook will redirect the user back to the application at
  //     /auth/facebook/callback
  app.get('/auth/facebook', passport.authenticate('facebook', { display: 'popup'}));
  // Facebook will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });


  // application -------------------------------------------------------------
  app.get('/', function(req, res) {
    res.sendfile('./public/start.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
};