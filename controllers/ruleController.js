const Visit = require('../models/visitModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getRuleById = async (req, res) => {
  try {
    const rule = await Visit.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({
        status: 'fail',
        message: 'No rule found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        rule
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getRuleVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ rules: req.params.ruleId });

    if (visits.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No visits found for this rule'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        visits
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.createRule = async (req, res) => {
  try {
    const newRule = await Visit.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        rule: newRule
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
