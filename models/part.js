const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartSchema = new Schema({
  name: {type: String, required: true},
  number: {type: String, required: true},
  store: {type: String, required: true},
});

// Virtual for part's url
PartSchema.virtual('url').get(function () {
  return `catalog/part/${this._id}`;
});

// Export model
module.exports = mongoose.model('Part', PartSchema);
