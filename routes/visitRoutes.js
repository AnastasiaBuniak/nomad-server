const express = require('express');
const visitController = require('../controllers/visitController');

const router = express.Router();

router.route('/').post(visitController.createVisit);
router.route('/:id').delete(visitController.deleteVisit);

module.exports = router;
