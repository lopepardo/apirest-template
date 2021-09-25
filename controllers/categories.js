const { request, response } = require('express');
const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [categories, total] = await Promise.all([
    Category.find({ state: true })
      .populate('user', 'name')
      .skip(Number(from))
      .limit((Number(limit))),
    Category.countDocuments({ state: true })
  ]);

  res.status(200).json({
    categories,
    total
  });
}

const getCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate('user', 'name');
  res.status(200).json(category);
}

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const CategoryDB = await Category.findOne({ name });
  
  if (CategoryDB) {
    return res.status(400).json({
      msg: `La categoria ${ CategoryDB.name } ya existe`
    });
  }

  const category = new Category({
    name,
    user: req.userAuth._id
  });
  await category.save()
  
  res.status(200).json({ category });
}

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  let { state, user, ...rest } = req.body;
  rest.name = rest.name.toUpperCase();
  rest.user = req.userAuth._id;

  const category = await Category.findByIdAndUpdate(id, rest, {new: true});

  res.status(200).json(category);
}

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(id, { state: false }, {new: true});

  res.status(200).json(category);
}

module.exports = {
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory
}