const validateRoles = async (req, res, next) => {
  if (!req.userAuth) {
    return res.status(500).json({
      msg: 'Se quiere verificar el rol, sin válidar el token primero'
    });
  }
  const {role, name} = req.userAuth;
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} no es administrador. Requiere permisos para modificar este recurso`
    });
  }
  next();
}

const allowTo = (...roles) => {
  return (req, res, next) => {
    if (!req.userAuth) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol, sin válidar el token primero'
      });
    }

    const { role, name } = req.userAuth;
    if (!roles.includes(role)) {
      return res.status(401).json({
        msg: `${name} no tiene permisos para modificar este recurso. Debe se ${roles}`
      });
    }

    next();
  }
}

module.exports = {
  validateRoles,
  allowTo
};
