import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './FacultyNavbar';

const AttendanceForm = () => {
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [hour, setHour] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachername, setTeacherName] = useState('');
  const [loading, setLoading] = useState(false);
  const [markAllPresent, setMarkAllPresent] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [markedSubject, setMarkedSubject] = useState('');
  const [existingAttendance, setExistingAttendance] = useState([]);
  const [noStudentsMessage, setNoStudentsMessage] = useState(false);
  const [lab, setLab] = useState(''); // New state for lab selection

  useEffect(() => {
    const fetchCoursesAndSemesters = async () => {
      const email = localStorage.getItem('email');
      try {
        const response = await axios.post(`/api/data/attendance`, { email });
        const { subjects, semesters, branches, teachername } = response.data;
        setCourses(branches || []);
        setSemesters(semesters || []);
        setSubjects(subjects || []);
        setTeacherName(teachername);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCoursesAndSemesters();

    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/attendance/fetch`, {
        course,
        semester,
        lab, // Include lab in the request
      });
      
      // Assuming each student object has a `rollNo` field that can be used to sort
      const sortedStudents = response.data.sort((a, b) => {
        if (a.RollNo < b.RollNo) return -1;
        if (a.RollNo > b.RollNo) return 1;
        return 0;
      });
  
      setLoading(false);
      return sortedStudents;
    } catch (error) {
      setLoading(false);
      console.error('Error fetching students:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const checkResponse = await axios.post(`/api/attendance/check`, {
        date,
        hour,
        teachername,
        subject,
        course,
        lab,
      });
  
      if (checkResponse.data.isMarked) {
        if (checkResponse.data.type === 'sameSubject') {
          // Show existing attendance for the same subject and hour
          const existingAttendanceResponse = await axios.post(`/api/attendance/existing`, {
            date,
            hour,
            teachername,
            subject,
            course,
            lab,
          });
  
          setExistingAttendance(existingAttendanceResponse.data);
          setStudents(existingAttendanceResponse.data.map(record => ({
            _id: record.student._id,
            name: record.student.name,
            attendance: record.status
          })));
          setNoStudentsMessage(false);
        } else if (checkResponse.data.type === 'differentSubject') {
          // Show message for different subject with the same hour
          setAlreadyMarked(true);
          setNoStudentsMessage(false);
          alert(checkResponse.data.message);
          setExistingAttendance([]);
          setStudents([]);
        } else if (checkResponse.data.type === 'differentTeacher') {
          // Show message for different teacher
          setAlreadyMarked(true);
          setNoStudentsMessage(false);
          alert(checkResponse.data.message);
          setExistingAttendance([]);
          setStudents([]);
        }
      } else {
        const fetchedStudents = await fetchStudents();
        if (fetchedStudents.length === 0) {
          setNoStudentsMessage(true);
        } else {
          setNoStudentsMessage(false);
        }
        setStudents(fetchedStudents);
        setAlreadyMarked(false);
        setExistingAttendance([]);
      }
    } catch (error) {
      console.error('Error checking attendance or fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAttendance = async () => {
    setLoading(true);
    try {
      // Map students to ensure we have updated status
      const updatedStudents = students.map((student) => ({
        studentId: student._id,
        date,
        subject,
        hour,
        teachername,
        attendance: student.attendance,
        lab, // Include lab in the submission
      }));
  
      // Send update request
      await Promise.all(updatedStudents.map(student =>
        axios.post(`/api/attendance`, student)
      ));
  
      alert('Attendance updated successfully!');
      // Reset the form after successful submission
      setCourse('');
      setSemester('');
      setSubject('');
      setHour('');
      setLab(''); // Reset lab selection
      setStudents([]);
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleAttendanceChange = (studentId, isPresent) => {
    setStudents(prevStudents =>
      prevStudents.map((student) =>
        student._id === studentId ? { ...student, attendance: isPresent ? 'Present' : 'Absent' } : student
      )
    );
  };
  


  const handleMarkAllPresentChange = (e) => {
    const isChecked = e.target.checked;
    setMarkAllPresent(isChecked);
    setStudents(prevStudents => prevStudents.map((student) => ({
      ...student,
      attendance: isChecked ? 'Present' : 'Absent',
    })));
  };

  const shouldShowLabField = () => {
    const lowerCaseSubject = subject.toLowerCase();
    return lowerCaseSubject.includes('lab') || lowerCaseSubject.includes('project') || lowerCaseSubject.includes('seminar');
  };

  return (
    <div>
      <Navbar />
      <div className="attendance-form">
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <label>
            Course:
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </label>
          <label>
            Semester:
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </label>
          <label>
            Subject:
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </label>
          {shouldShowLabField() && (
            <label>
              Lab:
              <select value={lab} onChange={(e) => setLab(e.target.value)}>
                <option value="">Select Lab</option>
                <option value="Lab 1">Lab 1</option>
                <option value="Lab 2">Lab 2</option>
              </select>
            </label>
          )}
          <label>
            Hour:
            <select value={hour} onChange={(e) => setHour(e.target.value)}>
              <option value="">Select Hour</option>
              {[1, 2, 3, 4, 5, 6].map((hr) => (
                <option key={hr} value={hr}>{`${hr} hour`}</option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
     
          <button type="submit">Fetch Students</button>
        </form>

        {loading && <p>Loading...</p>}

        {noStudentsMessage && <p>The selected subject, semester, and lab combination does not exist.</p>}

        {alreadyMarked && existingAttendance.length > 0 && (
          <div>
            <p>Attendance for {hour} hour on {date} is already marked for subject {markedSubject} by you.</p>
            <p>Existing Attendance Details:</p>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={student.attendance === 'Present'}
                        onChange={(e) => handleAttendanceChange(student._id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={student.attendance === 'Absent'}
                        onChange={(e) => handleAttendanceChange(student._id, !e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={submitAttendance}>Save Attendance</button>
          </div>
        )}

        {alreadyMarked && existingAttendance.length === 0 && (
          <p>Attendance for {hour} hour on {date} is already marked for a different subject.</p>
        )}

        {!loading && !alreadyMarked && students.length > 0 && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={markAllPresent}
                onChange={handleMarkAllPresentChange}
              />
              Mark All Present
            </label>
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={student.attendance === 'Present'}
                        onChange={(e) => handleAttendanceChange(student._id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={student.attendance === 'Absent'}
                        onChange={(e) => handleAttendanceChange(student._id, !e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={submitAttendance}>Save Attendance</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceForm;