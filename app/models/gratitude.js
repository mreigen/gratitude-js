var mongoose = require('mongoose');

module.exports = mongoose.model('Gratitude', {
  text : String,
  date : Date
});