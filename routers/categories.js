const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const {validateInputs, validateJWT, allowTo} = require('../middlewares');
const { existCategoryById } = require('../helpers/db-validators');
const { getCategories, 
        getCategory, 
        createCategory, 
        updateCategory, 
        deleteCategory } = require('../controllers/categories');

// Obtener todas la cartagorias - público
router.get('/', getCategories);

// Obtener una cartagoria - público
router.get('/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existCategoryById),
  validateInputs
], getCategory);

// Crear un nueva categoria - con token válido
router.post('/', [ 
  validateJWT,
  check('name', 'El nombre de la categoria es obligatorio').notEmpty(),
  validateInputs
], createCategory);

// Actualizar una categoria - con token válido
router.put('/:id', [
  validateJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existCategoryById),
  check('name', 'El nombre de la categoria es obligatorio').notEmpty(),
  validateInputs
], updateCategory);

// Borrar una categoria - Admin
router.delete('/:id', [
  validateJWT,
  allowTo('ADMIN_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existCategoryById),
  validateInputs
], deleteCategory);

module.exports = router;