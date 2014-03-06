var mongoose = require('mongoose');

module.exports = mongoose.model('Gratitude', {
  text        : String,
  created_at  : { type: Date, default: Date.now },
  updated_at  : { type: Date, default: Date.now }
});