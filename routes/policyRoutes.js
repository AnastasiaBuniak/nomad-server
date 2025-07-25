const express = require('express');
const policyController = require('../controllers/policyController');

const router = express.Router();

router.route('/').post(policyController.createPolicy);

router.route('/:id').get(policyController.getPolicyByUserId);

module.exports = router;
