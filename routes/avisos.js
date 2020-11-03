const express = require('express');
const router = express.Router();
const login = require('../middlewares/login');

const AvisosController = require('../controllers/avisos-controller.js');

router.post('/:idCondominio', login.required, AvisosController.postAvisos);
router.get('/:idAvisos', login.required, AvisosController.getOneAviso);
router.get('/', login.required, AvisosController.getAvisos);
router.patch('/:idAvisos', login.required, AvisosController.updateAvisos);
router.delete('/:idAvisos', login.required, AvisosController.deleteAvisos);

module.exports = router;