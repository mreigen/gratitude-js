var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  name: String,
  username : String,
  email : String,
  gender : String,
  photoUrl : String,
  data : Object
});