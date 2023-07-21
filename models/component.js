const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComponentSchema = new Schema({
  name: {type: String, required: true},
  category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
  brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  imgUrl: {type: String},
});

// Virtual for component's url
ComponentSchema.virtual('url').get(function () {
  return `catalog/component/${this._id}`;
});

// Export model
module.exports = mongoose.model('Component', ComponentSchema);
