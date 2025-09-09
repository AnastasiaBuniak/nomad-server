const { Policy, User, Visit } = require('../models');

exports.createNewPolicy = async ({ userId, dateData }) => {
  const policy = new Policy({
    name: 'Country / Zone',
    description: 'A country / zone visits',
    userId: userId,
    visits: []
  });

  if (dateData) {
    const dates = JSON.parse(dateData);
    const visits = await Promise.all(
      dates.map(async ({ entry, exit }) => {
        const visit = new Visit({
          entry,
          exit,
          policyId: policy._id
        });
        await visit.save();
        return visit;
      })
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
