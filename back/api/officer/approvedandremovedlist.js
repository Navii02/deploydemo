const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const RemovedStudent = require('../../models/Officer/NotApprovedstudents');
const Fee = require('../../models/Officer/FeeDetails');

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
    const { course, feeCategory } = student;


    let feeDetails;
    if (feeCategory === 'Merit Higher Fee' || feeCategory === 'Merit Lower Fee') {
    if (course === 'B.Tech CSE' || course === 'B.Tech ECE') {
      feeDetails = await Fee.findOne({ course: 'B.Tech', feeCategory });
    } else {
      feeDetails = await Fee.findOne({ course });
    }

    if (!feeDetails) {
      return res.status(404).json({ error: 'Fee details not found for the given course and category' });
    }
  }

    const { name, admissionType, admissionId, admissionNumber, allotmentCategory,  address, permanentAddress, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo,  annualIncome, nativity,submissionDate} = student;
    const { parentDetails } = student;
    const { bankDetails } = student;
    const { achievements } = student;
    const { qualify } = student;
    const { marks } = student;
    const { certificates } = student;
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
        submissionDate,
        qualify: {
          exam: qualify.exam,
          board: qualify.board,
          regNo: qualify.regNo,
          examMonthYear: qualify.examMonthYear,
          percentage: qualify.percentage,
          institution: qualify.institution,
          cgpa: qualify.cgpa,
        },
        parentDetails: {
          fatherName: parentDetails.fatherName,
          fatherOccupation: parentDetails.fatherOccupation,
          fatherMobileNo: parentDetails.fatherMobileNo,
          motherName: parentDetails.motherName,
          motherOccupation: parentDetails.motherOccupation,
          motherMobileNo: parentDetails.motherMobileNo,
        },
        bankDetails: {
          bankName: bankDetails.bankName,
          branch: bankDetails.branch,
          accountNo: bankDetails.accountNo,
          ifscCode: bankDetails.ifscCode,
        },
        achievements: {
          arts: achievements.arts,
          sports: achievements.sports,
          other: achievements.other,
        },
        marks: {
          boardType:marks.boardType,
          physics:marks.physics,
          chemistry:marks.chemistry,
          maths:marks.maths,
        },
      certificates: {
        tenth: certificates.tenth,
        plusTwo: certificates.plusTwo,
        tcandconduct:certificates.tcandconduct,
        allotmentmemo: certificates.allotmentmemo,
        Datasheet:certificates.DataSheet,
        physicalfitness: certificates.physicalfitness,
        passportsizephoto: certificates.passportsizephoto,
        incomecertificates: certificates.incomecertificates,
        communitycertificate: certificates.communitycertificate,
        castecertificates: certificates.castecertificates,
        aadhaar: certificates.aadhaar,
        other:certificates.other,
      },
      ...(feeDetails && {
        feeDetails: {
          admissionFee: feeDetails.admissionFee,
          tuitionFee: feeDetails.tuitionFee,
          groupInsuranceandidCard: feeDetails.groupInsuranceandidCard,
          ktuSportsArts: feeDetails.ktuSportsArts,
          ktuAdminFee: feeDetails.ktuAdminFee,
          ktuAffiliationFee: feeDetails.ktuAffiliationFee,
          cautionDeposit: feeDetails.cautionDeposit,
          pta: feeDetails.pta,
          busFund: feeDetails.busFund,
          trainingPlacement: feeDetails.trainingPlacement,
        }
      })
    }
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
  const fileRef = ref(storage, `student_photos/${fileName}`);

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
  //console.log('Image path:', imagePath);
  const imageRef = ref(storage, `images/${imagePath}`);

  try {
    const url = await getDownloadURL(imageRef);
    res.redirect(url);
  } catch (error) {
    console.error('Error fetching image URL:', error);
    res.status(500).send('Error fetching image');
  }
});
router.delete('/deleteStudent/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    // Find and verify the student
    const student = await ApprovedStudent.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Create a new entry in RemovedStudent collection
    const notAdmittedStudent = new RemovedStudent(student.toJSON());
    await notAdmittedStudent.save();

    // Remove the student from ApprovedStudent collection
    await ApprovedStudent.findByIdAndRemove(studentId);

    res.json({ message: 'Student declined and moved to Not Admitted Students collection' });
  } catch (error) {
    console.error('Error declining student:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


module.exports = router;
