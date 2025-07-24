const { Rule, Visit } = require('../models');
const APIFeatures = require('../utils/apiFeatures');

exports.getRuleByUserId = async (req, res) => {
  try {
    const rules = await Rule.find({ user: req.params.id });

    if (rules.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No rule found with that ID'
      });
    }

    const rulesWithVisits = await Promise.all(
      rules.map(async rule => {
        const populatedVisits = await Promise.all(
          rule.visits.map(async visitId => {
            return await Visit.findById(visitId);
          })
        );
        const ruleObj = rule.toObject();
        ruleObj.visits = populatedVisits;
        return ruleObj;
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        rules: rulesWithVisits
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
