const mongoose = require('mongoose');

const officerDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
     required: true},
  post: {
    type: String,
    required: true,
  },
});

const Officer = mongoose.model('OfficerDetails', officerDetailSchema);

module.exports = Officer;
