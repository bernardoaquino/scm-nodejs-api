const express = require('express');
const router = express.Router();
const login = require('../middlewares/login');

const AreasController = require('../controllers/areas-controller.js');

router.post('/:idCondominio', login.required, AreasController.postAreas);
router.get('/:idAreas', login.required, AreasController.getOneAreas);
router.get('/', login.required, AreasController.getAreas);
router.patch('/:idAreas', login.required, AreasController.updateAreas);
router.delete('/:idAreas', login.required, AreasController.deleteAreas);

module.exports = router;