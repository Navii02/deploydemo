import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseurl} from '../../url';
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

  useEffect(() => {
    const fetchCoursesAndSemesters = async () => {
      const email = localStorage.getItem('email');

      try {
        const response = await axios.post(`${baseurl}/api/data/attendance`, { email });
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
      const response = await axios.get(`${baseurl}/api/students/faculty/attendance/${course}/${semester}`);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error('Error fetching students:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkResponse = await axios.post(`${baseurl}/api/attendance/check`, {
        date,
        hour,
        teachername,
        subject,
        course,
      });

      if (checkResponse.data.isMarked) {
        setAlreadyMarked(true);
        setMarkedSubject(checkResponse.data.markedSubject);

        if (checkResponse.data.teachername === teachername && checkResponse.data.markedSubject === subject) {
          const response = await axios.post(`${baseurl}/api/attendance/existing`, {
            date,
            hour,
            teachername,
            subject,
            course,
          });

          setExistingAttendance(response.data);
          setStudents(response.data.map(record => ({
            ...record.student,
            attendance: record.status
          })));
        } else {
          setExistingAttendance([]);
        }
      } else {
        const fetchedStudents = await fetchStudents();
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

  const handleAttendanceChange = (studentId, isPresent) => {
    setStudents(students.map((student) =>
      student._id === studentId ? { ...student, attendance: isPresent ? 'Present' : 'Absent' } : student
    ));
  };

  const submitAttendance = async () => {
    setLoading(true);

    try {
      await Promise.all(students.map((student) =>
        axios.post(`${baseurl}/api/attendance`, {
          studentId: student._id,
          date,
          subject,
          hour,
          teachername,
          attendance: student.attendance,
        })
      ));

      console.log('Attendance marked successfully!');
  alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllPresentChange = (e) => {
    const isChecked = e.target.checked;
    setMarkAllPresent(isChecked);
    setStudents(students.map((student) => ({
      ...student,
      attendance: isChecked ? 'Present' : 'Absent',
    })));
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <label>
          Course:
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map((course) => (
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
            {semesters.map((semester) => (
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
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label>
          Hour:
          <select value={hour} onChange={(e) => setHour(e.target.value)}>
            <option value="">Select Hour</option>
            {[1, 2, 3, 4, 5, 6].map((hr) => (
              <option key={hr} value={hr}>
                {`${hr} hour`}
              </option>
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
            Mark All as Present
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
  );
};

export default AttendanceForm;
