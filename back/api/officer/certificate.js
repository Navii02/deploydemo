const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CertificateRequest = require('../../models/CertificateRequest');
const StudentData = require('../../models/Student/StudentData');

const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase'); // Adjust path accordingly

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

router.get('/officer/certificateRequests', async (req, res) => {
  try {
    const requests = await CertificateRequest.find({ HoDstatus: 'Accepted' }).sort({ createdAt: -1 });

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
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `${requestId}.pdf`;
    const fileRef = ref(storage, `certificates/${fileName}`);
    await uploadBytes(fileRef, file.buffer);
    const fileUrl = await getDownloadURL(fileRef);

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
