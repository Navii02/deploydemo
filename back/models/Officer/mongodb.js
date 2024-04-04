const mongoose = require('mongoose');

const approvedStudentConnection = mongoose.createConnection('mongodb+srv://naveenshaji02:naveen@collegeofficedata.scsxkdd.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

approvedStudentConnection.on('error', (error) => {
  console.error('Approved Student Database Connection Error:', error);
});

approvedStudentConnection.once('open', () => {
  console.log('Connected to Approved Student Database');
});

module.exports = approvedStudentConnection;
