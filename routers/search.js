const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { search } = require('../controllers/search');

router.post('/:collection/:term',[
], search);

module.exports = router;