const { Policy, Visit } = require('../models');
const APIFeatures = require('../utils/apiFeatures');

exports.getPolicies = async (req, res) => {
  try {
    const userId = req.user.id;
    const policies = await Policy.find({ userId }).populate('visits');

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
