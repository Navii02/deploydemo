const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const RemovedStudent = require('../../models/Officer/NotApprovedstudents');

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

// Route to fetch approved students
router.get('/approvedStudents', async (req, res) => {
  try {
    const approvedStudents = await ApprovedStudent.find();
    res.json(approvedStudents);
  } catch (error) {
    console.error('Error fetching approved students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update student details
router.put('/updateStudent/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const updatedStudent = await ApprovedStudent.findByIdAndUpdate(studentId, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch removed students
router.get('/removedStudents', async (req, res) => {
  try {
    const removedStudents = await RemovedStudent.find();
    res.json(removedStudents);
  } catch (error) {
    console.error('Error fetching removed students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch detailed student information
router.get('/approvedstudentDetails/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await ApprovedStudent.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const { name, admissionType, admissionId, admissionNumber, allotmentCategory, feeCategory, address, permanentAddress, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo, course, annualIncome, nativity, parentDetails, bankDetails, achievements, qualify } = student;
    const photoUrl = photo ? `${req.protocol}://${req.get('host')}/ApprovedRemoved/image/${encodeURIComponent(photo)}` : null;
    res.json({
      studentDetails: {
        name,
        admissionType,
        admissionId,
        admissionNumber,
        allotmentCategory,
        feeCategory,
        address,
        permanentAddress,
        pincode,
        religion,
        community,
        gender,
        dateOfBirth,
        bloodGroup,
        mobileNo,
        whatsappNo,
        email,
        entranceExam,
        entranceRollNo,
        entranceRank,
        aadharNo,
        course,
        annualIncome,
        nativity,
        photoUrl,
        qualify,
        parentDetails,
        bankDetails,
        achievements
      },
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle image upload and update student document
router.post('/upload/:studentId', upload.single('file'), async (req, res) => {
  const studentId = req.params.studentId;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  const fileExtension = path.extname(file.originalname);
  const fileName = `${Date.now()}${fileExtension}`;
  const fileRef = ref(storage, `studentphoto/${fileName}`);

  try {
    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file.buffer);
    const fileURL = await getDownloadURL(fileRef);

    // Update student document with new image URL
    const updatedStudent = await ApprovedStudent.findByIdAndUpdate(
      studentId,
      { $set: { photo: fileURL } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ photoURL: fileURL });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to serve images from Firebase
router.get('/ApprovedRemoved/image/:path', async (req, res) => {
  const imagePath = req.params.path;
  const imageRef = ref(storage, `images/${imagePath}`);

  try {
    const url = await getDownloadURL(imageRef);
    res.redirect(url);
  } catch (error) {
    console.error('Error fetching image URL:', error);
    res.status(500).send('Error fetching image');
  }
});

module.exports = router;
