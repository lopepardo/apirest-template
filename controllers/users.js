const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

const usersGet = async (req = request, res = response) => {

  const { limit = 5, from = 0 } = req.query;

  const [users, total] = await Promise.all([
    User.find({ state: true })
      .skip(Number(from))
      .limit((Number(limit))),
    User.countDocuments({ state: true })
  ]);

  res.json({
    users,
    total
  });
}

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encriptar base de datos
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  await user.save();

  res.status(201).json(user);
}

const usersPut = async (req = request, res = response) => {

  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json(user);
}

const usersDelete = async (req = request, res = response) => {

  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { state: false });

  res.json({ user });
}


module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete
}