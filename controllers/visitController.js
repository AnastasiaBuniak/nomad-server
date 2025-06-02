// const Tour = require('../models/visitModel');
const Visit = require('../models/visitModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getVisitById = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        status: 'fail',
        message: 'No visit found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        visit
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.createVisit = async (req, res) => {
  try {
    const newVisit = await Visit.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        visit: newVisit
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
