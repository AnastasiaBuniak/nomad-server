const express = require('express');
const ruleController = require('../controllers/ruleController');

const router = express.Router();

router.route('/').post(ruleController.createRule);

router.route('/:id').get(ruleController.getRuleById);
// .patch(ruleController.updateRule)
// .delete(ruleController.deleteRule)
router.route('/:ruleId/visits').get(ruleController.getRuleVisits);
module.exports = router;
