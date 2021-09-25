const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');
const generateJWT = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: 'Usuario/Contraseña no son correctos'
      })
    }

    if (!user.state) {
      return res.status(400).json({
        msg: 'Usuario/Contraseña no son correctos'
      })
    }

    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        msg: 'Usuario/Contraseña no son correctos'
      })
    }

    const token = await generateJWT(user.id);

    res.json({
      msg: 'El usuario es correcto. TODO: auth',
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Problemas!! los servidores se estan incendiando, por favor, comuniquese con el administrador'
    });
  }
}

const googleSingin = async (req = request, res = response) => {
  const { id_token } = req.body;
  try {
    const { email, name, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name, 
        email, 
        password: 'xD',
        img,
        google: true
      };
      user = new User(data);
      await user.save();
    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'Usuario bloqueado'
      })
    }

    const token = await generateJWT(user.id);

    res.json({
      msg: 'google Singin',
      token
    });

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Token de google no es válido'
    });
  }
}

module.exports = {
  login,
  googleSingin
}