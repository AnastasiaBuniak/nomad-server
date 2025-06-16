const { Rule, User } = require('../models');

exports.createEmptyRule = async userId => {
  const rule = new Rule({
    name: 'Default Rule',
    description: 'This is a default rule created for the user.',
    user: userId,
    visits: []
  });

  await rule.save();

  const user = await User.findById(userId);
  user.rules.push(rule._id);

  await user.save();

  return { rule };
};
