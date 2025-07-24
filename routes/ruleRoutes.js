const express = require('express');
const ruleController = require('../controllers/ruleController');

const router = express.Router();

router.route('/').post(ruleController.createRule);

router.route('/:id').get(ruleController.getRuleByUserId);
// .patch(ruleController.updateRule)
// .delete(ruleController.deleteRule)
module.exports = router;
