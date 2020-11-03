const express = require('express');
const router = express.Router();
const login = require('../middlewares/login');

const ComentariosController = require('../controllers/comentarios-controller.js');

router.post('/', login.required, ComentariosController.postComentarios);
router.get('/:idComentarios', login.required, ComentariosController.getOneComentario);
router.get('/', login.required, ComentariosController.getComentarios);
router.patch('/:idComentarios', login.required, ComentariosController.updateComentarios);
router.delete('/:idComentarios', login.required, ComentariosController.deleteComentarios);

module.exports = router;