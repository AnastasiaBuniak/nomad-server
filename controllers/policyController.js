const { Policy, Visit } = require('../models');
const APIFeatures = require('../utils/apiFeatures');

exports.getPolicyByUserId = async (req, res) => {
  try {
    const policies = await Policy.find({ user: req.params.id });

    if (policies.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No policies found with that ID'
      });
    }

    const policiesWithVisits = await Promise.all(
      policies.map(async policy => {
        const populatedVisits = await Promise.all(
          policy.visits.map(async visitId => {
            return await Visit.findById(visitId);
          })
        );
        const policyObj = policy.toObject();
        policyObj.visits = populatedVisits;
        return policyObj;
      })
    );

    res.status(200).json({
      status: 'success',
      data: {
        policies: policiesWithVisits
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.createPolicy = async (req, res) => {
  try {
    const newPolicy = await Visit.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        policy: newPolicy
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
