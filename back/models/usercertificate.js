const mongoose = require('mongoose');
const certificateRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  reason: String,
  isApproved: { type: Boolean, default: false },
  sentFile: { type: Boolean, default: false },
  });
  
  // Define the certificate request model
  const CertificateRequest = mongoose.model(
    'CertificateRequest',
    certificateRequestSchema
  );
  module.exports = CertificateRequest;