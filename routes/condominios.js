const express = require('express');
const router = express.Router();
const login = require('../middlewares/login');

const CondominiosController = require('../controllers/condominios-controller.js');

router.get('/:idCondominios', login.required, CondominiosController.getOneCondominios);
router.patch('/:idCondominios', login.required, CondominiosController.updateCondominios);
// router.delete('/:idCondominios', login.required, CondominiosController.deleteCondominios);

module.exports = router;