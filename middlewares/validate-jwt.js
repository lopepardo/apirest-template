const jwt = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async (req, res, next) => {
  const token = req.header('x-token');
  if(!token){
    return res.status(401).json({
      msg: 'Se requiere token'
    });
  }

  try {
    const {uid} = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(uid);

    if (!user || !user.state) {
      return res.status(401).json({
        msg: 'El usuario no se encuentra registrado o ya no existe'
      });
    }

    req.userAuth = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Token no válido'
    });
  }

}

module.exports = {
  validateJWT
};