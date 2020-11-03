const express = require('express');
const router = express.Router();
const login = require('../middlewares/login');

const UserController = require('../controllers/user-controller');

router.post('/login', UserController.getUsers);
router.get('/:idUser', login.required, UserController.getOneUser);
router.post('/register', UserController.postUser);
router.patch('/', login.required, UserController.updateUser);
router.delete('/', login.required, UserController.deleteUser);

module.exports = router;