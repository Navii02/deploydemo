// RejectedRequest.js

const mongoose = require('mongoose');

const rejectedRequestSchema = new mongoose.Schema({
  requestId: String,
  reason: String,
});

const RejectedRequest = mongoose.model('RejectedRequest', rejectedRequestSchema);

module.exports = RejectedRequest;
