// Assuming you have already set up MongoDB and imported necessary modules

const express = require('express');
const router = express.Router();
const ApprovedStudent = require('../../models/Officer/ApprovedStudents'); // Import ApprovedStudent model/schema
const RemovedStudent = require('../../models/Officer/NotApprovedstudents'); // Import RemovedStudent model/schema

// Route to fetch approved students
router.get('/approvedStudents', async (req, res) => {
    try {
        // Fetch all approved students from the database
        const approvedStudents = await ApprovedStudent.find();
        res.json(approvedStudents);
    } catch (error) {
        console.error('Error fetching approved students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch removed students
router.get('/removedStudents', async (req, res) => {
    try {
        // Fetch all removed students from the database
        const removedStudents = await RemovedStudent.find();
        res.json(removedStudents);
    } catch (error) {
        console.error('Error fetching removed students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/approvedstudentDetails/:id', async (req, res) => {
    try {
      const studentId = req.params.id;
  
      // Fetch student details including parentDetails from the database
      const student = await ApprovedStudent.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      // Extract necessary details for print preview
      const { name, admissionType, admissionId, allotmentCategory, feeCategory, address,photo,pincode,religion,community,gender,dateOfBirth,bloodGroup,mobileNo,whatsappNo,email,entranceExam,entranceRollNo,entranceRank,aadharNo,course,annualIncome,nativity,} = student;
      const { parentDetails } = student;
      const {bankDetails }= student;
      const{plusTwo} = student;
      const photoUrl = photo ? `${req.protocol}://${req.get('host')}/${photo}` : null;
  
  
      res.json({
        studentDetails: {
          name,
          admissionType,
          admissionId,
          allotmentCategory,
          feeCategory,
          address,
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
          plusTwo: {
            board:plusTwo.board,
            regNo:plusTwo.regNo,
            examMonthYear: plusTwo.examMonthYear,
            percentage:plusTwo.percentage,
            schoolName:plusTwo.schoolName,
            physics:plusTwo.physics,
            chemistry:plusTwo.chemistry,
            mathematics:plusTwo.mathematics,
          },
          parentDetails: {
       
              fatherName:parentDetails.fatherName,
              fatherOccupation: parentDetails.fatherOccupation,
              fatherMobileNo: parentDetails.fatherMobileNo,
              motherName:parentDetails.motherName,
              motherOccupation:parentDetails.motherOccupation,
              motherMobileNo: parentDetails.motherMobileNo,
            
          },
    
          bankDetails: {
            bankName:bankDetails.bankName,
            branch:bankDetails.branch,
            accountNo:bankDetails.accountNo,
            ifscCode:bankDetails.ifscCode,
          }
        }
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
