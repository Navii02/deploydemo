// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const https = require('https');
const { storage, ref, getDownloadURL } = require('../../firebase');
const CertificateRequest = require('../../models/CertificateRequest');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
//const Student = require('../../models/Student/StudentData');


router.post('/student/submitRequest', async (req, res) => {
  try {
    const {name, userEmail, reason, selectedDocuments, RegisterNo, admissionNumber, phoneNumber,semester,course } = req.body;

    // Validate request data
    if (!userEmail || !reason || !selectedDocuments) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Save certificate request in CertificateRequest schema
    const newCertificateRequest = new CertificateRequest({
      name,
      RegisterNo,
      admissionNumber,
      userEmail,
      reason,
      selectedDocuments,
      phoneNumber,
      semester,
      course,
    });

    await newCertificateRequest.save();

    // Send success response
    res.status(200).json({ message: 'Certificate request submitted successfully' });
  } catch (error) {
    console.error('Error submitting certificate request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to fetch student details (register number, admission number, phone number) from ApprovedStudent schema
router.get('/student/details/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Find student details in ApprovedStudent schema using userEmail
    const studentDetails = await ApprovedStudent.findOne({ email });

    if (!studentDetails) {
      return res.status(404).json({ message: 'Student not found or not approved' });
    }

    // Send student details to the frontend
    const {name, RegisterNo, admissionNumber, mobileNo,semester,course } = studentDetails;
    res.status(200).json({name, RegisterNo, admissionNumber,mobileNo,semester,course });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/student/certificateRequests/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const requests = await CertificateRequest.find({ userEmail }).sort({ createdAt: -1 });

    // Map over the requests to ensure each has a file URL
    const mappedRequests = await Promise.all(requests.map(async (request) => {
      const filePath = request.fileUrl; // Assuming fileUrl is the path or identifier in Firebase Storage

      // Create a reference to the file in Firebase Storage
      const fileRef = ref(storage, filePath);

      let downloadUrl = null;
      try {
        // Get the download URL
        downloadUrl = await getDownloadURL(fileRef);
      } catch (error) {
        console.error('Error getting download URL:', error);
      }

      return {
        ...request._doc,
        fileUrl: downloadUrl || null
      };
    }));

    res.json({ requests: mappedRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/download/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const fileRef = ref(storage, `certificates/${fileName}`);

    // Get the download URL
    try {
      const url = await getDownloadURL(fileRef);
      
      // Fetch the file from Firebase Storage
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          // Set the appropriate headers
          res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
          res.setHeader('Content-Type', response.headers['content-type']);

          // Pipe the response
          response.pipe(res);
        } else {
          res.status(response.statusCode).send('Error fetching file');
        }
      }).on('error', (error) => {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      });

    } catch (error) {
      console.error('Error getting download URL:', error);
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;