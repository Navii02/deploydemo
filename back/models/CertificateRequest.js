// models/CertificateRequest.js

const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  registerNumber: String,
  userEmail: String,
  reason: String,
  selectedDocuments: [String],
  officerstatus: { type: String, default: 'Pending' },
  studentName: {
    type: String,
    required: true,},
  fileUrl: { type: String },
  declineReason: { type: String },
  hodDecision: { type: String, default: 'Pending' },
  hoddeclineReason: String,
  
}, { timestamps: true });

const CertificateRequest = mongoose.model('CertificateRequest', certificateRequestSchema);

module.exports = CertificateRequest;