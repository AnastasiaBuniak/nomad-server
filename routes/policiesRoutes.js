const express = require('express');
const policiesController = require('../controllers/policiesController');

const router = express.Router();

router.route('/').get(policiesController.getPolicies);

module.exports = router;
