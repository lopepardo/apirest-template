const { User, Role, Category, Product } = require('../models');

const isValidRole = async (role = '') => {
  const existRole = await Role.findOne({ role });
  if (!existRole) {
    throw new Error(`El rol ${role} no es permitido`)
  }
}

const existEmail = async (email) => {
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new Error(`El correo ${email} ya esta registrado`)
  }
}

const existUserById = async (id) => {
  const existUser = await User.findById(id);
  if (!existUser) {
    throw new Error(`El usuario con id ${id} no existe`)
  }
}

const existCategoryById = async (id) => {
  const existCategory = await Category.findById(id);
  
  if (!existCategory || !existCategory.state) {
    throw new Error(`La categoria con id ${id} no existe`)
  }
}

const existProductById = async (id) => {
  const existProduct = await Product.findById(id);

  if (!existProduct || !existProduct.state) {
    throw new Error(`El producto con id ${id} no existe`)
  }
}

module.exports = {
  isValidRole,
  existEmail,
  existUserById,
  existCategoryById,
  existProductById
}