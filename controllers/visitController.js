const { Rule } = require('../models/ruleModel');
const { Visit } = require('../models/visitModel');

exports.createVisit = async (req, res) => {
  try {
    const { startDate, endDate, ruleId } = req.body;
    const user = req.user;
    const durationInDays =
      Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const rule = await Rule.findById(ruleId);

    if (!rule) {
      return res.status(404).json({
        status: 'fail',
        message: 'No rule found with that ID'
      });
    }

    const visit = new Visit({
      entry: new Date(startDate),
      exit: new Date(endDate),
      duration: durationInDays,
      rule: ruleId
    });

    rule.visits.push(visit._id);

    await rule.save();
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

    const rule = await Rule.findById(visit.rule);
    rule.visits.pull(visit._id);
    await rule.save();

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
