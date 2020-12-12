const { v4 } = require('uuid');
const httpError = require('../utils/httpError');

/* load models */
const { Event, Session, User, View, Website } = require('../utils/mongoose');

/**
 * write a collect data to database
 */
module.exports = () => async (req, res, next) => {
  const mongoose = req.mongoose;
  const { type, id, data } = req.body;

  /* get website */
  let website = null;
  try {
    website = await Website.findById(id).lean();
  } catch {
    return res.status(400).send(httpError('Request website not allowed'));
  }
  if (!website) {
    return res.status(400).send(httpError('Request website not allowed'));
  }

  /* check whether is a exist session */
  const uuid = req.cookies.goose_uuid || v4();
  let session = await Session.findOne({ uuid });
  if (!session) {
    session = Session.create({ uuid, _website: website._id });
  }

  /* send 204 response */
  res.cookie('goose_uuid', uuid, { sameSite: 'lax' });
  res.status(204).send();

  /* process data after res send */
  console.log('[WIP] IDENTITY:', session._id + ' on ' + session._website);
  console.log('[WIP] WEBSITE:', website._id);
  console.log('[WIP] REQUEST DATA:', req.body);
  console.log();
};
