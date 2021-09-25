const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const {validateInputs, validateJWT, allowTo} = require('../middlewares');
const { existProductById, existCategoryById } = require('../helpers/db-validators');
const {getProducts, 
       getProduct, 
       createProduct, 
       updateProduct, 
       deleteProduct} = require('../controllers/products');

router.get('/', getProducts);

router.get('/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existProductById),
  validateInputs
], getProduct);

router.post('/', [ 
  validateJWT,
  check('category', 'No es un id válido').isMongoId(),
  check('category').custom(existCategoryById),
  check('name', 'El nombre del producto es obligatorio').notEmpty(),
  validateInputs
], createProduct);

router.put('/:id', [
  validateJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existProductById),
  check('name', 'El nombre del producto es obligatorio').notEmpty(),
  check('category', 'No es un id válido').isMongoId(),
  check('category').custom(existCategoryById),
  validateInputs
], updateProduct);

router.delete('/:id', [
  validateJWT,
  allowTo('ADMIN_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom(existProductById),
  validateInputs
], deleteProduct);

module.exports = router;