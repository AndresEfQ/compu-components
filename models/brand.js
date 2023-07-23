const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandShema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  imgUrl: {type: String},
});

// Virtual for brand's url
BrandShema.virtual('url').get(function () {
  return `catalog/brand/${this._id}`;
});

// Export model
module.exports = mongoose.model('Brand', BrandShema);