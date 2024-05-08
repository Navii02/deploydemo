const mongoose = require('mongoose');
const cron = require('node-cron');
const ApprovedStudent = require('../Officer/ApprovedStudents');
const AlumniStudent = require('../Officer/Alumni');

// MongoDB connection is already established
// Assuming mongoose.connect() has been called elsewhere in your application

// Schedule a cron job to run every day at 9:30 PM (21:30)
cron.schedule('06 22 * * *', async () => {
  console.log('Running scheduled migration...');

  try {
    const currentYear = new Date().getFullYear();

    // Find all approved students
    const approvedStudents = await ApprovedStudent.find();

    // Iterate over each approved student
    for (const student of approvedStudents) {
      const academicYears = student.academicYear.split('-');
      const endYear = parseInt(academicYears[1]);

      // Check if academic year has ended (endYear < currentYear)
      if (endYear < currentYear) {
        // Prepare data for alumni student
        const alumniStudentData = {
          customId: `${student.admissionNumber}/${endYear}`,
          admissionNumber: student.admissionNumber,
          admissionType: student.admissionType,
          admissionId: student.admissionId,
          allotmentCategory: student.allotmentCategory,
          feeCategory: student.feeCategory,
          name: student.name,
          photo: student.photo,
          address: student.address,
          pincode: student.pincode,
          religion: student.religion,
          community: student.community,
          gender: student.gender,
          dateOfBirth: student.dateOfBirth,
          bloodGroup: student.bloodGroup,
          mobileNo: student.mobileNo,
          email: student.email,
          whatsappNo: student.whatsappNo,
          entranceExam: student.entranceExam,
          entranceRollNo: student.entranceRollNo,
          entranceRank: student.entranceRank,
          aadharNo: student.aadharNo,
          course: student.course,
          plusTwo: {
            board: student.plusTwo.board,
            regNo: student.plusTwo.regNo,
            examMonthYear: student.plusTwo.examMonthYear,
            percentage: student.plusTwo.percentage,
            schoolName: student.plusTwo.schoolName,
            physics: student.plusTwo.physics,
            chemistry: student.plusTwo.chemistry,
            mathematics: student.plusTwo.mathematics,
          },
          parentDetails: {
            fatherName: student.parentDetails.fatherName,
            fatherOccupation: student.parentDetails.fatherOccupation,
            fatherMobileNo: student.parentDetails.fatherMobileNo,
            motherName: student.parentDetails.motherName,
            motherOccupation: student.parentDetails.motherOccupation,
            motherMobileNo: student.parentDetails.motherMobileNo,
          },
          annualIncome: student.annualIncome,
          nativity: student.nativity,
          bankDetails: {
            bankName: student.bankDetails.bankName,
            branch: student.bankDetails.branch,
            accountNo: student.bankDetails.accountNo,
            ifscCode: student.bankDetails.ifscCode,
          },
          tutormessage: student.tutormessage,
          achievements: {
            arts: student.achievements.arts,
            sports: student.achievements.sports,
            other: student.achievements.other,
          },
          academicYear: student.academicYear,
          semester: student.semester,
          assignments: student.assignments,
          exams: student.exams,
          attendance: student.attendance,
          installmentsPaid: student.installmentsPaid,
          registerNumber: student.registerNumber,
          collegemail: student.collegemail,
        };

        // Create new AlumniStudent document
        const alumniStudent = new AlumniStudent(alumniStudentData);

        // Save the new AlumniStudent document
        await alumniStudent.save();

        // Optional: Remove the approved student record after migration
         await student.remove();
      }
    }

    console.log('Scheduled migration completed successfully');
  } catch (error) {
    console.error('Error during scheduled migration:', error);
  }
});
