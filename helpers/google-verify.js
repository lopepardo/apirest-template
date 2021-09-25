const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const googleVerify = async ( idToken = '' ) => {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
  });
  const { email, name, picture: img } = ticket.getPayload();

  return { email, name, img };
}

module.exports = {
  googleVerify
}