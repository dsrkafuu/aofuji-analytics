module.exports = () => {
  const env = process.env.NODE_ENV || 'production';
  const result = require('dotenv').config({ path: `.env.${env}` });
  // check if serverless
  if (process.env.VERCEL) {
    process.env.SERVERLESS = 1;
  }
  return result;
};
