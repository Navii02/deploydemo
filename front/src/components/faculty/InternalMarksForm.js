import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./FacultyNavbar";
import {baseurl} from '../../url';
import styles from './InternalMarksForm.module.css'; // Import the CSS module

const InternalMarksForm = () => {
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchCoursesAndSemesters = async () => {
      const email = localStorage.getItem('email');

      try {
        const response = await axios.post(`${baseurl}/api/data`, { email });
        const { subjects, semesters, branches } = response.data;
        setCourses(branches || []);
        setSemesters(semesters || []);
        setSubjects(subjects || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCoursesAndSemesters();
  }, []);

  const fetchStudents = async () => {
    if (!course || !semester || !subject) {
      console.error('Please select a course, semester, and subject');
      return;
    }
  
    try {
      const response = await axios.get(`${baseurl}/api/students/faculty/${course}/${semester}`);
      const studentsData = response.data.map(student => ({
        ...student,
        internalMarks: student.internalMarks.map(mark => mark.subject === subject ? mark : { ...mark, subject, examMarks: 0, assignmentMarks: 0 })
      }));
      setStudents(studentsData);
      console.log(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Add further error handling as needed
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleInputChange = (studentId, key, value) => {
    const updatedStudents = students.map(student => {
      if (student._id === studentId) {
        const updatedMarks = student.internalMarks.map(mark => mark.subject === subject ? { ...mark, [key]: parseFloat(value) || 0 } : mark);
        return { ...student, internalMarks: updatedMarks };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const submitMarks = async (studentId, marks) => {
    try {
      marks.examMarks = parseFloat(marks.examMarks) || 0;
      marks.assignmentMarks = parseFloat(marks.assignmentMarks) || 0;
      marks.attendance = parseFloat(marks.attendance) || 0;

      await axios.post(`${baseurl}/api/marks`, { studentId, subject, marks });
      console.log('Marks submitted successfully!');
    } catch (error) {
      console.error('Error submitting marks:', error);
    }
  };

  const calculateTotal = (examMarks, assignmentMarks, attendancePercentage) => {
    return (parseFloat(examMarks) || 0) + (parseFloat(assignmentMarks) || 0) + (parseFloat(attendancePercentage) || 0);
  };

  const getAttendancePercentage = (student) => {
    const subjectPercentage = student.subjectPercentages.find(sp => sp.subject === subject);
    return subjectPercentage ? subjectPercentage.percentage / 10 : 0;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <Navbar />
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Course:
              <select value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Semester:
              <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              Subject:
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit">Fetch Students</button>
        </form>
      </div>

      {students.length > 0 && (
        <div className={styles.tableContainer}>
          <div id="printTable" className={styles.printTable}>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Exam Marks</th>
                  <th>Assignment Marks</th>
                  <th>Attendance</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const subjectMarks = student.internalMarks.find(mark => mark.subject === subject) || { examMarks: 0, assignmentMarks: 0 };
                  const attendancePercentage = getAttendancePercentage(student);
                  return (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                      <td>{student.semester}</td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.examMarks || ''}
                          onChange={(e) => handleInputChange(student._id, 'examMarks', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            examMarks: e.target.value,
                            assignmentMarks: subjectMarks.assignmentMarks || 0,
                            attendance: attendancePercentage,
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.assignmentMarks || ''}
                          onChange={(e) => handleInputChange(student._id, 'assignmentMarks', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            examMarks: subjectMarks.examMarks || 0,
                            assignmentMarks: e.target.value,
                            attendance: attendancePercentage,
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={attendancePercentage || ''}
                          readOnly
                        />
                      </td>
                      <td>
                        {calculateTotal(
                          subjectMarks.examMarks,
                          subjectMarks.assignmentMarks,
                          attendancePercentage
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button onClick={handlePrint} className={styles.printButton}>Print</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalMarksForm;
