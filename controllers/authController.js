const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const { createEmptyPolicy } = require('../utils/createEmptyPolicyAndVisit');

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

exports.googleAuth = async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await new User({ name, email, picture, policies: [] }).save();
      isNewUser = true;
      createEmptyPolicy(user._id);
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        policies: user.policies,
        picture: picture
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000 // Convert days to milliseconds
      })
      .status(200)
      .json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            policies: user.policies
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

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token:', decoded);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    req.user = currentUser;

    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }
};

exports.logout = (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    })
    .status(200)
    .json({
      status: 'success',
      message: 'Logged out successfully'
    });
};
