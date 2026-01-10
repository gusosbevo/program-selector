const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

usersRouter.post('/register', async (request, response) => {
  const { email, password } = request.body;
  console.log('email', email);
  console.log('password', password);

  let user;
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);
  try {
    user = await User.create({
      email,
      passwordHash
    });
  } catch (error) {
    /*     throw new UserInputError(error.message, {
          invalidArgs: args,
        }) */
    console.log(error);
  }

  const userForToken = { email, id: user.id };

  response.status(201).json({ token: jwt.sign(userForToken, process.env.SECRET) });
});

usersRouter.post('/login', async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ where: { email } });

  const correctPassword = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && correctPassword)) return response.status(401).json('error no user or incorrect password');

  const userForToken = { email, id: user.id, is_admin: user.is_admin };
  response.json({
    token: jwt.sign(userForToken, process.env.SECRET),
    is_admin: user.is_admin
  });
});

usersRouter.post('/google-login', async (request, response) => {
  try {
    const { access_token } = request.body;

    // Get user info from Google using access token
    const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) return response.status(401).json({ message: 'Invalid access token' });

    const { email, name, picture } = userInfo;

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    // Create user if doesn't exist
    if (!user)
      user = await User.create({
        email,
        name,
        google_id: userInfo.id,
        profile_picture: picture
      });

    const userForToken = { email, id: user.id, is_admin: user.is_admin };
    response.json({
      token: jwt.sign(userForToken, process.env.SECRET),
      is_admin: user.is_admin
    });
  } catch (error) {
    console.error('Google login error:', error);
    response.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = usersRouter;
