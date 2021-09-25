const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { login, googleSingin } = require('../controllers/auth');
const { validateInputs } = require('../middlewares');

router.post('/login',[
  check('email', 'El correo no es válido').isEmail(),
  check('password', 'La contraseña es obligatoria').notEmpty(),
  validateInputs
], login);

router.post('/google',[
  check('id_token', 'El id_token es necesario').notEmpty(),
  validateInputs
], googleSingin);

module.exports = router;