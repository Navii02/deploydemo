// models/ApprovalStatus.js
const mongoose = require('mongoose');

const approvalStatusSchema = new mongoose.Schema({
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model('ApprovalStatus', approvalStatusSchema);
