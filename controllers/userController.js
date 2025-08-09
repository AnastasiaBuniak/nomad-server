const { User, Policy, Visit } = require('../models');

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userIsDeletingThemselves = req.user.id === userId;

    if (!userIsDeletingThemselves) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own account'
      });
    }

    const userPolicies = await Policy.find({ userId });

    for (const policy of userPolicies) {
      await Visit.deleteMany({ policyId: policy._id });
      await Policy.findByIdAndDelete(policy._id);
    }

    console.log('Removed policies and visits for user:', userId);

    await User.findByIdAndDelete(userId);

    res
      .clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax'
      })
      .status(200)
      .json({
        status: 'success',
        message: 'Deleted and logged out successfully'
      });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
