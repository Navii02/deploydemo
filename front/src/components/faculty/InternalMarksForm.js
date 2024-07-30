import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./FacultyNavbar";
import { baseurl } from '../../url';
import styles from './InternalMarksForm.module.css'; // Import the CSS module

const InternalMarksForm = () => {
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoursesAndSemesters = async () => {
      const email = localStorage.getItem('email');
      setLoading(true);
      setError('');
      try {
        const response = await axios.post(`${baseurl}/api/data`, { email });
        const { subjects, semesters, branches } = response.data;
        setCourses(branches || []);
        setSemesters(semesters || []);
        setSubjects(subjects || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch courses and semesters.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndSemesters();
  }, []);

  const fetchStudents = async () => {
    if (!course || !semester || !subject) {
      console.error('Please select a course, semester, and subject');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${baseurl}/api/students/faculty/${course}/${semester}/${subject}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleInputChange = (studentId, key, value) => {
    const updatedStudents = students.map(student => {
      if (student._id === studentId) {
        const updatedMarks = {
          ...student.subjectMarks,
          [key]: parseFloat(value) || 0,
          totalMarks: calculateTotal(
            key === 'examMarks1' ? parseFloat(value) : student.subjectMarks.examMarks1,
            key === 'examMarks2' ? parseFloat(value) : student.subjectMarks.examMarks2,
            key === 'assignmentMarks1' ? parseFloat(value) : student.subjectMarks.assignmentMarks1,
            key === 'assignmentMarks2' ? parseFloat(value) : student.subjectMarks.assignmentMarks2,
            key === 'attendance' ? parseFloat(value) : student.subjectMarks.attendance
          )
        };
        return { ...student, subjectMarks: updatedMarks };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const submitMarks = async (studentId, marks) => {
    try {
      marks.examMarks1 = parseFloat(marks.examMarks1) || 0;
      marks.examMarks2 = parseFloat(marks.examMarks2) || 0;
      marks.assignmentMarks1 = parseFloat(marks.assignmentMarks1) || 0;
      marks.assignmentMarks2 = parseFloat(marks.assignmentMarks2) || 0;
      marks.attendance = parseFloat(marks.attendance) || 0;
      marks.totalMarks = calculateTotal(
        marks.examMarks1,
        marks.examMarks2,
        marks.assignmentMarks1,
        marks.assignmentMarks2,
        marks.attendance
      );

      await axios.post(`${baseurl}/api/marks`, { studentId, subject, marks });
      console.log('Marks submitted successfully!');
    } catch (error) {
      console.error('Error submitting marks:', error);
    }
  };

  const calculateTotal = (examMarks1, examMarks2, assignmentMarks1, assignmentMarks2, attendancePercentage) => {
    const averageExamMarks = (parseFloat(examMarks1) + parseFloat(examMarks2)) / 4;
    const averageAssignmentMarks = (parseFloat(assignmentMarks1) + parseFloat(assignmentMarks2)) / 2;
    return averageExamMarks + averageAssignmentMarks + (parseFloat(attendancePercentage) || 0);
  };


  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
  
    const printContent = `
      <html>
        <head>
          <title>Print Internal Marks</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .page-wrapper { border: 2px solid #000; padding: 20px; margin: 10px; }
            h1 { text-align: center; margin-top: 0; font-size: 20px; font-weight: bold; }
            h2 { text-align: center; margin: 10px 0; font-size: 16px; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px 10px; text-align: center; }
            th { background-color: #f0f0f0; font-weight: bold; }
            td { background-color: #fff; }
            tr:nth-child(even) td { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="page-wrapper">
            <h1>Internal Marks Report</h1>
            <h2>Semester: ${semester}</h2>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                
                  <th>Exam 1 Marks</th>
                  <th>Exam 2 Marks</th>
                  <th>Assignment 1 Marks</th>
                  <th>Assignment 2 Marks</th>
                  <th>Attendance</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(student => {
                  const subjectMarks = student.subjectMarks;
                  return `
                    <tr>
                      <td>${student.name}</td>
                      <td>${student.course}</td>
                    
                      <td>${subjectMarks.examMarks1 || ''}</td>
                      <td>${subjectMarks.examMarks2 || ''}</td>
                      <td>${subjectMarks.assignmentMarks1 || ''}</td>
                      <td>${subjectMarks.assignmentMarks2 || ''}</td>
                      <td>${subjectMarks.attendance || ''}</td>
                      <td>${calculateTotal(
                        subjectMarks.examMarks1,
                        subjectMarks.examMarks2,
                        subjectMarks.assignmentMarks1,
                        subjectMarks.assignmentMarks2,
                        subjectMarks.attendance
                      )}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {students.length > 0 && (
        <div className={styles.tableContainer}>
          <div id="printTable" className={styles.printTable}>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Exam Mark 1</th>
                  <th>Exam Mark 2</th>
                  <th>Assignment Mark 1</th>
                  <th>Assignment Mark 2</th>
                  <th>Attendance</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const subjectMarks = student.subjectMarks;
                  return (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.course}</td>
                      <td>{student.semester}</td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.examMarks1 || ''}
                          onChange={(e) => handleInputChange(student._id, 'examMarks1', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            examMarks1: parseFloat(e.target.value),
                            totalMarks: calculateTotal(
                              parseFloat(e.target.value),
                              subjectMarks.examMarks2,
                              subjectMarks.assignmentMarks1,
                              subjectMarks.assignmentMarks2,
                              subjectMarks.attendance
                            )
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.examMarks2 || ''}
                          onChange={(e) => handleInputChange(student._id, 'examMarks2', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            examMarks2: parseFloat(e.target.value),
                            totalMarks: calculateTotal(
                              subjectMarks.examMarks1,
                              parseFloat(e.target.value),
                              subjectMarks.assignmentMarks1,
                              subjectMarks.assignmentMarks2,
                              subjectMarks.attendance
                            )
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.assignmentMarks1 || ''}
                          onChange={(e) => handleInputChange(student._id, 'assignmentMarks1', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            assignmentMarks1: parseFloat(e.target.value),
                            totalMarks: calculateTotal(
                              subjectMarks.examMarks1,
                              subjectMarks.examMarks2,
                              parseFloat(e.target.value),
                              subjectMarks.assignmentMarks2,
                              subjectMarks.attendance
                            )
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.assignmentMarks2 || ''}
                          onChange={(e) => handleInputChange(student._id, 'assignmentMarks2', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            assignmentMarks2: parseFloat(e.target.value),
                            totalMarks: calculateTotal(
                              subjectMarks.examMarks1,
                              subjectMarks.examMarks2,
                              subjectMarks.assignmentMarks1,
                              parseFloat(e.target.value),
                              subjectMarks.attendance
                            )
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={subjectMarks.attendance || ''}
                          onChange={(e) => handleInputChange(student._id, 'attendance', e.target.value)}
                          onBlur={(e) => submitMarks(student._id, {
                            ...subjectMarks,
                            attendance: parseFloat(e.target.value),
                            totalMarks: calculateTotal(
                              subjectMarks.examMarks1,
                              subjectMarks.examMarks2,
                              subjectMarks.assignmentMarks1,
                              subjectMarks.assignmentMarks2,
                              parseFloat(e.target.value)
                            )
                          })}
                        />
                      </td>
                      <td>{subjectMarks.totalMarks || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={handlePrint}>Print</button>
        </div>
      )}
    </div>
  );
};

export default InternalMarksForm;
