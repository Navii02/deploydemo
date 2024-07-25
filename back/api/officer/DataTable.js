const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase'); // Ensure this path is correct

const Student = require('../../models/Officer/StudentAdmission');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const NotAdmittedStudent = require('../../models/Officer/NotApprovedstudents');

const router = express.Router();
router.put('/datatable/updateStudent/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Fetch all student admissions
router.get('/studentAdmission', async (req, res) => {
  
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch student details by ID
router.get('/studentDetails/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Fetch student details including parentDetails from the database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Extract necessary details for print preview
    const { name, admissionType, admissionId, admissionNumber, allotmentCategory, 
      feeCategory, address, permanentAddress, photo, pincode, religion, community, gender, 
      dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo,
       entranceRank, aadharNo, course, annualIncome, nativity,      submissionDate, } = student;
    const { parentDetails } = student;
    const { bankDetails } = student;
    const { achievements } = student;
    const { qualify } = student;
    const {marks} = student;
    const {certificates} = student;
    const photoUrl = photo ? `${req.protocol}://${req.get('host')}/${photo}` : null;

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

        
        submissionDate,
      },
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Decline student by ID and move to NotAdmittedStudents
router.post('/decline/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const notAdmittedStudent = new NotAdmittedStudent(student.toJSON());
    await notAdmittedStudent.save();

    await Student.findByIdAndRemove(studentId);

    res.json({ message: 'Student Declined and Moved to Not Admitted Students Collection' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch image URL
router.get('/image/:path', async (req, res) => {
  const imagePath = req.params.path;
  const imageRef = ref(storage, imagePath);

  try {
    const url = await getDownloadURL(imageRef);
    res.redirect(url); // Redirect to the image URL
  } catch (error) {
    console.error('Error fetching image URL:', error);
    res.status(500).send('Error fetching image');
  }
});

// Approve student and move to ApprovedStudents collection

router.post('/approve/:id', async (req, res) => {
  const studentId = req.params.id;
  const providedAdmissionNumber = req.body.admissionNumber; // Get admissionNumber from the request body

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let semester;
    if (['KEAM', 'SPOT'].includes(student.admissionType)) {
      semester = 1;
    } else if (['MCA', 'BBA', 'BCA'].includes(student.course)) {
      semester = 1;
    } else if (student.admissionType === 'LET') {
      semester = 3;
    }

    let academicYear;
    const currentYear = new Date().getFullYear();
    if (['KEAM'].includes(student.admissionType) || ['BBA', 'BCA', 'B.Tech CSE', 'B.Tech ECE'].includes(student.course)) {
      const endYear = currentYear + 4;
      academicYear = `${currentYear}-${endYear}`;
    } else if (['LET'].includes(student.admissionType)) {
      const startYear = currentYear - 1;
      const endYear = startYear + 4;
      academicYear = `${startYear}-${endYear}`;
    } else if (['MCA'].includes(student.course)) {
      const endYear = currentYear + 2;
      academicYear = `${currentYear}-${endYear}`;
    }

    // Determine the starting number based on the course
    let startingNumber;
    if (['B.Tech CSE', 'B.Tech ECE'].includes(student.course)) {
      startingNumber = 3434;
    } else if (['BCA'].includes(student.course)) {
      startingNumber = 0;
    } else if (['MCA'].includes(student.course)) {
      startingNumber = 23;
    } else if (['BBA'].includes(student.course)) {
      startingNumber = 0;
    } else {
      return res.status(400).json({ error: 'Invalid course' });
    }

    let highestAdmissionNumber = null;

    if (['B.Tech CSE', 'B.Tech ECE'].includes(student.course)) {
      // Fetch the highest admission number for both BTech CSE and BTech ECE
      const [cseStudent, eceStudent] = await Promise.all([
        ApprovedStudent.findOne({ course: 'B.Tech CSE' })
          .sort({ admissionNumber: -1 })
          .limit(1),
        ApprovedStudent.findOne({ course: 'B.Tech ECE' })
          .sort({ admissionNumber: -1 })
          .limit(1)
      ]);

      // Compare and set the highest admission number
      const cseAdmissionNumber = cseStudent ? parseInt(cseStudent.admissionNumber.split('/')[0], 10) : startingNumber;
      const eceAdmissionNumber = eceStudent ? parseInt(eceStudent.admissionNumber.split('/')[0], 10) : startingNumber;

      highestAdmissionNumber = Math.max(cseAdmissionNumber, eceAdmissionNumber);
    } else {
      // Fetch the highest admission number for the current course only
      const lastStudent = await ApprovedStudent.findOne({ course: student.course })
        .sort({ admissionNumber: -1 })
        .limit(1);

      if (lastStudent) {
        highestAdmissionNumber = parseInt(lastStudent.admissionNumber.split('/')[0], 10);
      } else {
        // No previous records found, set startingNumber
        highestAdmissionNumber = startingNumber;
      }
    }

    // Generate the next admission number
    const nextAdmissionNumber = highestAdmissionNumber !== null
      ? `${highestAdmissionNumber + 1}/${currentYear.toString().substring(2)}`
      : `${startingNumber}/${currentYear.toString().substring(2)}`;

    // Use the provided admission number if it differs from the generated one
    const admissionNumber = providedAdmissionNumber && providedAdmissionNumber !== nextAdmissionNumber
      ? providedAdmissionNumber
      : nextAdmissionNumber;

    // Check for duplicate admission number
    const existingStudent = await ApprovedStudent.findOne({ admissionNumber });
    if (existingStudent) {
      return res.status(400).json({ error: 'Admission number already exists' });
    }

    const approvedStudentData = {
      ...student.toJSON(),
      semester,
      academicYear,
      admissionNumber
    };

    const approvedStudent = new ApprovedStudent(approvedStudentData);
    await approvedStudent.save();

    await Student.findByIdAndRemove(studentId);

    res.json({ message: 'Student approved and moved to the approved students collection' });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get the last admission number for a specific course
router.post('/lastAdmissionNumbers', async (req, res) => {
  const { courses } = req.body;
  const currentYear = new Date().getFullYear();
  const lastDigitOfCurrentYear = currentYear.toString().slice(-2);

  try {
    const numbers = await Promise.all(courses.map(async (course) => {
      const lastStudent = await ApprovedStudent.findOne({ course })
        .sort({ admissionNumber: -1 })
        .limit(1);
      
      let lastAdmissionNumber = lastStudent ? lastStudent.admissionNumber : '';
      
      // Set default admission numbers based on course if last admission number is empty
      if (lastAdmissionNumber === '') {
        if (course === 'B.Tech CSE' || course === 'B.Tech ECE') {
          lastAdmissionNumber = `3434/${lastDigitOfCurrentYear}`;
        } else if (course === 'MBA') {
          lastAdmissionNumber = `23/${lastDigitOfCurrentYear}`;
        } else {
          lastAdmissionNumber = `0000/${lastDigitOfCurrentYear}`; // Default for other courses if needed
        }
      }

      return { course, lastAdmissionNumber };
    }));

    res.json(numbers);
  } catch (error) {
    console.error('Error fetching last admission numbers:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;