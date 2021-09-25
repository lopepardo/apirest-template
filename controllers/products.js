const { request, response } = require('express');
const { Category, Product } = require('../models');

const getProducts = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [products, total] = await Promise.all([
    Product.find({ state: true })
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(Number(from))
      .limit((Number(limit))),
    Product.countDocuments({ state: true })
  ]);

  res.status(200).json({
    products,
    total
  });
}

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
                          .populate('user', 'name')
                          .populate('category', 'name');
  res.status(200).json(product);
}

const createProduct = async (req = request, res = response) => {
  const { state, user, name, ...rest } = req.body;
  const ProductDB = await Product.findOne({ name: name.toUpperCase() });

  if (ProductDB) {
    return res.status(400).json({
      msg: `El producto ${ name } ya existe`
    });
  }

  const product = new Product({
    name: name.toUpperCase(),
    user: req.userAuth._id,
    ...rest
  });
  await product.save();
  
  res.status(200).json({ product });
}

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { state, user, ...rest } = req.body;
  rest.name = rest.name.toUpperCase();
  rest.user = req.userAuth._id;

  const product = await Product.findByIdAndUpdate(id, rest, {new: true});

  res.status(200).json(product);
}

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, { state: false }, {new: true});

  res.status(200).json(product);
}

module.exports = {
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct
}