const { Policy, Visit, User } = require('../models');

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
