const { Policy, User, Visit } = require('../models');

exports.createNewPolicy = async ({ userId, dateData }) => {
  const policy = new Policy({
    name: 'Country or Zone',
    description: 'A country or zone visits',
    userId: userId,
    visits: []
  });

  if (dateData) {
    const dates = JSON.parse(dateData);
    const visits = await Visit.insertMany(
      dates.map(({ entry, exit }) => ({
        entry,
        exit,
        policyId: policy._id
      }))
    );
    policy.visits = visits.map(visit => visit._id);
  } else {
    const visit = new Visit({
      entry: Date.now(),
      exit: Date.now(),
      policyId: policy._id
    });

    policy.visits.push(visit._id);
    await visit.save();
  }

  await policy.save();

  const user = await User.findById(userId);
  user.policies.push(policy._id);

  await user.save();

  return { policy };
};
