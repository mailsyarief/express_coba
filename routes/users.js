//Routes Users

const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');

router.get('/register', UserController.register_form);
router.post('/register', UserController.register_action);
router.get('/login', UserController.login_form);
router.post('/login', UserController.login_action);
router.get('/logout', UserController.logout);

module.exports = router;
