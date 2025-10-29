const { Policy, Visit, User } = require('../models');
const { validateString } = require('../utils/validators');

exports.createPolicy = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const newPolicy = new Policy({
      name,
      description,
      userId
    });
    const visit = new Visit({
      entry: Date.now(),
      exit: Date.now(),
      policyId: newPolicy._id
    });

    newPolicy.visits.push(visit._id);

    await visit.save();
    await newPolicy.save();

    const user = await User.findById(userId);
    user.policies.push(newPolicy._id);

    await user.save();

    res.status(201).json({
      status: 'success',
      data: {
        policy: newPolicy
      }
    });
  } catch (err) {
    console.log('Error creating policy:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getPolicy = async (req, res) => {
  try {
    const policyId = req.params.id;

    if (!policyId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Policy ID is required'
      });
    }

    const policy = await Policy.findById(policyId).populate('visits');

    if (!policy) {
      return res.status(404).json({
        status: 'fail',
        message: 'No policy found with that ID'
      });
    }

    if (policy.userId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this policy'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        policy
      }
    });
  } catch (err) {
    console.log('Error fetching policy:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.editPolicyNameAndDescription = async (req, res) => {
  try {
    const policyId = req.params.id;
    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(404).json({
        status: 'fail',
        message: 'No policy found with that ID'
      });
    }

    if (policy.userId.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to edit this policy'
      });
    }

    if (!req.body.name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name and description are required'
      });
    }

    if (validateString(req.body.name) !== true) {
      return res.status(400).json({
        status: 'fail',
        message: validateString(req.body.name)
      });
    }

    policy.name = req.body.name;
    policy.description = req.body.description;
    await policy.save();

    res.status(200).json({
      status: 'success',
      data: {
        policy
      }
    });
  } catch (err) {
    console.log('Error editing policy:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const policyToDelete = await Policy.findById(id);

    if (!policyToDelete) {
      return res.status(404).json({
        status: 'fail',
        message: 'No policy found with that ID'
      });
    }

    if (policyToDelete.userId.toString() !== userId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this policy'
      });
    }

    // Remove all visits associated with the policy
    await Visit.deleteMany({ policyId: id });
    // Remove the policy from the user's policies array
    const user = await User.findById(userId);
    user.policies.pull(id);
    await user.save();
    // Finally, remove the policy itself
    await policyToDelete.remove();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.log('Error deleting policy:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
