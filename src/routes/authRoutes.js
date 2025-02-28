const express = require('express');
const { authController } = require('../controller/authController');

const router = express.Router();
const authcontroller= new authController()
router.post('/register', authcontroller.register);
router.post('/login', authcontroller.login);

module.exports = router;