const { Policy } = require('../models/policyModel');
const { Visit } = require('../models/visitModel');

exports.createVisit = async (req, res) => {
  try {
    const { startDate, endDate, policyId } = req.body;
    const user = req.user;
    const policy = await Policy.findById(policyId);

    if (!policy) {
      return res.status(404).json({
        status: 'fail',
        message: 'No policy found with that ID'
      });
    }

    const visit = new Visit({
      entry: new Date(startDate),
      exit: new Date(endDate),
      policyId: policyId
    });

    policy.visits.push(visit._id);

    await policy.save();
    await visit.save();

    res.status(201).json({
      status: 'success',
      data: {
        visit: visit
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        status: 'fail',
        message: 'No visit found with that ID'
      });
    }

    await visit.remove();

    const policy = await Policy.findById(visit.policyId);
    policy.visits.pull(visit._id);
    await policy.save();

    res.status(204).json({
      status: 'success',
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
