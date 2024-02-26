const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CertificateRequest = require('../../models/CertificateRequest');
const StudentData = require('../../models/Student/StudentData');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'certificate/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const requestId = req.params.id;
    const fileName = `${requestId}.pdf`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.get('/officer/certificateRequests', async (req, res) => {
  try {
    const requests = await CertificateRequest.find({HoDstatus:'Accepted'}).sort({ createdAt: -1 });

    const requestsWithStudentData = await Promise.all(
      requests.map(async (request) => {
        const studentData = await StudentData.findOne({ registerNumber: request.registerNumber });
        return {
          ...request._doc,
          studentName: studentData ? studentData.name : 'N/A',
        };
      })
    );

    res.json({ requests: requestsWithStudentData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/officer/approveRequest/:id', upload.single('file'), async (req, res) => {
  try {
    const requestId = req.params.id;
    const fileUrl = req.file ? `/certificate/${req.file.filename}` : null;

    await CertificateRequest.findByIdAndUpdate(requestId, { status: 'Approved', fileUrl });

    res.json({ message: 'Request approved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/officer/declineRequest/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const { declineReason } = req.body;

    await CertificateRequest.findByIdAndUpdate(requestId, { status: 'Declined', declineReason });

    res.json({ message: 'Request declined successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;