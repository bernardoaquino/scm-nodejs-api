const express = require('express');
const router = express.Router();
const login = require('../middlewares/login');

const GastosController = require('../controllers/gastos-controller');

router.post('/:idCondominio', login.required, GastosController.postGastos);
router.get('/:idGastos', login.required, GastosController.getOneGasto);
router.get('/', login.required, GastosController.getGastos);
router.patch('/:idGastos', login.required, GastosController.updateGastos);
router.delete('/:idGastos', login.required, GastosController.deleteGastos);

module.exports = router;