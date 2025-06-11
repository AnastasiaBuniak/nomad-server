const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');

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

    const user = new User({
      name,
      email,
      picture,
      rules: [] // Assuming you have a default or empty rules array
    })
      .save()
      .then(doc => {
        console.log('User created successfully:', doc);
        res.status(200).json({
          status: 'success',
          message: 'Authorization code exchanged successfully.',
          data: {
            user: {
              id: doc._id,
              name: doc.name,
              email: doc.email,
              picture: doc.picture,
              rules: doc.rules
            }
          }
        });
      });
  } catch (error) {
    console.error('Error exchanging auth code:', error);
    res.status(401).json({
      status: 'fail',
      message: 'Failed to exchange authorization code for tokens.'
    });
  }
};
