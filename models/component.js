const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComponentSchema = new Schema({
  name: {type: String, required: true},
  part: [{type: Schema.Types.ObjectId, ref: 'Part'}],
  category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
  brand: {type: Schema.Types.ObjectId, ref: 'Brand', required: true},
  description: {type: String, required: true},
  price: {type: Double, required: true},
  imgUrl: {type: String, required: true},
});

// Virtual for component's url
ComponentSchema.virtual('url').get(function () {
  return `catalog/component/${this._id}`;
});

// Export model
module.exports = mongoose.model('Component', ComponentSchema);
