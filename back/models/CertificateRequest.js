// models/CertificateRequest.js

const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  registerNumber: String,
  userEmail: String,
  reason: String,
  selectedDocuments: [String],
  status: { type: String, default: 'Pending' },
  studentName: { type: String },
  fileUrl: { type: String },
  declineReason: { type: String },
}, { timestamps: true });

const CertificateRequest = mongoose.model('CertificateRequest', certificateRequestSchema);

module.exports = CertificateRequest;
