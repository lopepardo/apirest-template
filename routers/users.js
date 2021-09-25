const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const {validateInputs, validateJWT, validateRoles, allowTo} = require('../middlewares');

const { isValidRole, existEmail, existUserById } = require('../helpers/db-validators');
const { usersGet,
  usersPost,
  usersPut,
  usersDelete } = require('../controllers/users');

router.get('/', usersGet);

router.post('/', [
  check('name', 'El nombre es obligatorio').notEmpty(),
  check('email', 'El correo no es válido').isEmail(),
  check('password', 'La contraseña debe tener mas de 6 caracteres').isLength({ min: 6 }),
  check('role').custom(isValidRole),
  check('email').custom(existEmail),
  validateInputs
], usersPost);

router.put('/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existUserById),
  check('role').custom(isValidRole),
  validateInputs
], usersPut);

router.delete('/:id', [
  validateJWT,
  // validateRoles,
  allowTo('ADMIN_ROLE', 'SALES_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existUserById),
  validateInputs
], usersDelete);

module.exports = router;