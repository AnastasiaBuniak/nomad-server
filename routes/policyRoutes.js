const express = require('express');
const policyController = require('../controllers/policyController');

const router = express.Router();

router.route('/').post(policyController.createPolicy);
router.route('/:id').put(policyController.editPolicyNameAndDescription);
router.route('/:id').delete(policyController.deletePolicy);

module.exports = router;
