const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/google').post(authController.googleAuth);

module.exports = router;
