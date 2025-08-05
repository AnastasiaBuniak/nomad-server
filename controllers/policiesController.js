const { Policy, Visit } = require('../models');
const APIFeatures = require('../utils/apiFeatures');

const fetchUserPoliciesAndVisits = async userId => {
  const policies = await Policy.find({ userId });

  if (policies.length === 0) {
    return [];
  }

  return await Promise.all(
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
};

exports.getPolicies = async (req, res) => {
  try {
    const userId = req.user.id;
    const policies = await fetchUserPoliciesAndVisits(userId);

    if (!policies || policies.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No policies found for this user'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        policies
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
