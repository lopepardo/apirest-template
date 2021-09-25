const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const { Category, Product, Role, User } = require('../models');

const collectionAllow = ['user', 'products', 'categories', 'roles'];

const searchUsers = async (term = '', res = response) => {
  const isMongoID = isValidObjectId(term);
  if (isMongoID) {
    const user = await User.findById(term);
    return res.status(200).json({
      results: user ? [user] : []
    });
  }

  const regex = new RegExp(term, 'i');
  const user = await User.find({
    $or: [{name: regex}, {email: regex}], 
    $and: [{state: true}]
  });
  res.status(200).json({
    results: user
  });
}

const searchProducts = async (term = '', res = response) => {
  const isMongoID = isValidObjectId(term);
  if (isMongoID) {
    const product = await Product.findById(term);
    return res.status(200).json({
      results: product ? [product] : []
    });
  }

  const regex = new RegExp(term, 'i');
  const product = await Product.find({
    $or: [{name: regex}, {description: regex}], 
    $and: [{state: true}]
  });
  res.status(200).json({
    results: product
  });
}

const searchCategories = async (term = '', res = response) => {
  const isMongoID = isValidObjectId(term);
  if (isMongoID) {
    const category = await Category.findById(term);
    return res.status(200).json({
      results: category ? [category] : []
    });
  }

  const regex = new RegExp(term, 'i');
  const category = await Category.find({
    $or: [{name: regex}], 
    $and: [{state: true}]
  });
  res.status(200).json({
    results: category
  });
}

const search = async (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!collectionAllow.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${collectionAllow.join(', ')}`
    });
  }
  
  switch (collection) {
    case 'user':
      searchUsers(term, res)

    case 'products':
      searchProducts(term, res)

    case 'categories':
      searchCategories(term, res)
  
    default:
      res.status(500).json({
        msg: 'No se realizo la busqueda'
      });
  }
}

module.exports = {
  search,
}