const { Rule, User, Visit } = require('../models');

exports.createEmptyRule = async userId => {
  const rule = new Rule({
    name: 'Default Rule',
    description: 'This is a default rule created for the user.',
    user: userId,
    visits: []
  });

  const visit = new Visit({
    entry: Date.now(),
    exit: Date.now(),
    duration: 1,
    rule: rule._id
  });

  rule.visits.push(visit._id);

  await rule.save();
  await visit.save();

  const user = await User.findById(userId);
  user.rules.push(rule._id);

  await user.save();

  return { rule };
};
