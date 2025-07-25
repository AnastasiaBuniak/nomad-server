const { Policy, User, Visit } = require('../models');

exports.createEmptyPolicy = async userId => {
  const policy = new Policy({
    name: 'Country',
    description: 'This is a default country/area visits created for the user.',
    user: userId,
    visits: []
  });

  const visit = new Visit({
    entry: Date.now(),
    exit: Date.now(),
    duration: 1,
    policy: policy._id
  });

  policy.visits.push(visit._id);

  await policy.save();
  await visit.save();

  const user = await User.findById(userId);
  user.policies.push(policy._id);

  await user.save();

  return { policy };
};
