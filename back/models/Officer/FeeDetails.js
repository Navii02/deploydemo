// models/Fee.js
const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  course: { 
    type: String, 
    required: true 
  },
  feeCategory: { 
    type: String 
  }, // Only for B.Tech
  admissionFee: { 
    type: Number, 
    required: true 
  },
  tuitionFee: { 
    type: Number, 
    required: true 
  },
  groupInsuranceandidCard: { 
    type: Number, 
    required: true 
  },

  ktuSportsArts: { 
    type: Number, 
    required: true 
  },
  ktuAdminFee: { 
    type: Number, 
    required: true 
  },
  ktuAffiliationFee: { 
    type: Number, 
    required: true 
  },
  cautionDeposit: { 
    type: Number, 
    required: true 
  },
  pta: { 
    type: Number, 
    required: true 
  },
  busFund: { 
    type: Number, 
    required: true 
  },
  trainingPlacement: { 
    type: Number, 
    required: true 
  }
});

module.exports = mongoose.model('Fee', FeeSchema);
