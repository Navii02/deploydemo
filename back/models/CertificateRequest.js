// models/CertificateRequest.js

const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  registerNumber:  { type: String },
  name: { type: String },
  userEmail: String,
  reason: String,
  branch: String,
  selectedDocuments: [String],
  HoDstatus: { type: String, default: 'Pending' },
  status: { type: String, default: 'Pending' },
  studentName: { type: String },
  fileUrl: { type: String },
  declineReason: String,
  acceptedBy: String,
  hodDeclineReason: { type: String },
}, { timestamps: true });

const CertificateRequest = mongoose.model('CertificateRequest', certificateRequestSchema);

module.exports = CertificateRequest;