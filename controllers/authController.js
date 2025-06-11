const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

exports.googleAuth = async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    // You can now get user info from the id_token as before
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await new User({ name, email, picture, rules: [] }).save();
      isNewUser = true;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('User created successfully:', doc);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          rules: user.rules
        },
        isNewUser
      }
    });
  } catch (error) {
    console.error('Error exchanging auth code:', error);
    res.status(401).json({
      status: 'fail',
      message: `Failed: ${error} `
    });
  }
};
