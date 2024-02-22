const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  notice: String,
  image: String,
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
