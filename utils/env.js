module.exports = () => {
  const env = process.env.NODE_ENV || 'production';
  const result = require('dotenv').config({ path: `.env.${env}` });
  return result;
};
