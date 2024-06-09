// InternalMarksForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./FacultyNavbar";

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
        const response = await axios.post('/api/data', { email });
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
      const response = await axios.get(`/api/students/faculty/${course}/${semester}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleInputChange = (studentId, key, value) => {
    const updatedStudents = students.map(student => {
      if (student._id === studentId) {
        const updatedMarks = student.internalMarks.map(mark => {
          if (mark.subject === subject) {
            return { ...mark, [key]: parseFloat(value) || 0 };
          }
          return mark;
        });
        return { ...student, internalMarks: updatedMarks };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const submitMarks = async (studentId, marks) => {
    try {
      await axios.post('/api/marks', { studentId, subject, marks });
      console.log('Marks submitted successfully!');
    } catch (error) {
      console.error('Error submitting marks:', error);
    }
  };

  const calculateTotal = (examMarks, assignmentMarks, attendancePercentage) => {
    return (parseFloat(examMarks) || 0) + (parseFloat(assignmentMarks) || 0) + (parseFloat(attendancePercentage) || 0);
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Fetch Students</button>
      </form>

      {students.length > 0 && (
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
              const subjectMarks = student.internalMarks.find(mark => mark.subject === subject) || {};
              return (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td>
                    <input
                      type="text"
                      value={subjectMarks.examMarks || ''}
                      onChange={(e) => handleInputChange(student._id, 'examMarks', e.target.value)}
                      onBlur={(e) => submitMarks(student._id, {
                        ...subjectMarks,
                        examMarks: parseFloat(e.target.value) || 0,
                        assignmentMarks: subjectMarks.assignmentMarks || 0,
                        attendance: subjectMarks.attendancePercentage || 0,
                      })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={subjectMarks.assignmentMarks || ''}
                      onChange={(e) => handleInputChange(student._id, 'assignmentMarks', e.target.value)}
                      onBlur={(e) => submitMarks(student._id, {
                        ...subjectMarks,
                        examMarks: subjectMarks.examMarks || 0,
                        assignmentMarks: parseFloat(e.target.value) || 0,
                        attendance: subjectMarks.attendancePercentage || 0,
                      })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={subjectMarks.attendancePercentage || ''}
                      onChange={(e) => handleInputChange(student._id, 'attendancePercentage', e.target.value)}
                      onBlur={(e) => submitMarks(student._id, {
                        ...subjectMarks,
                        examMarks: subjectMarks.examMarks || 0,
                        assignmentMarks: subjectMarks.assignmentMarks || 0,
                        attendance: parseFloat(e.target.value) || 0,
                      })}
                    />
                  </td>
                  <td>
                    {calculateTotal(subjectMarks.examMarks, subjectMarks.assignmentMarks, subjectMarks.attendancePercentage)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InternalMarksForm;
