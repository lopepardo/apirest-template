const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  price: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: { 
    type: String 
  },
  stock: {
    type: Number, 
    default: 0
  }
});

ProductSchema.methods.toJSON = function() {
  const { __v, state, ...rest } = this.toObject();
  return rest;
}

module.exports = model('Product', ProductSchema);