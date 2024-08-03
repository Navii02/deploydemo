import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentForm.css'; // Import your CSS file
import Navbar from './FacultyNavbar';
import Loading from './Loading'; // Import the Loading component


const AssignmentForm = () => {
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachername, setTeacherName] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const currentYear = new Date().getFullYear(); // Get the current year

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const email = localStorage.getItem('email');
        const response = await axios.get(`/api/teacher/by-email/${email}`);
        const { subjects, semesters, branches, teachername } = response.data;
        setCourses(branches || []);
        setSemesters(semesters || []);
        setSubjects(subjects || []);
        setTeacherName(teachername);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching teacher details:', error);
        // Handle error, show an error message, etc.
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchTeacherDetails();
  }, []); // Run only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send assignment details to the backend
      await axios.post(`/api/assignments`, {
        course,
        semester,
        subject,
        teachername,
        assignmentDetails,
        submissionDate,
        currentYear
      });

      // Optionally, you can add a success message or reset the form
      setCourse('');
      setSemester('');
      setSubject('');
      setAssignmentDetails('');
      setSubmissionDate('');
    } catch (error) {
      console.error('Error submitting assignment details:', error);
      // Handle error, show an error message, etc.
    }
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <Navbar />
      <div className="assignment-form-container">
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
            Teacher Name:
            <input type="text" value={teachername} readOnly />
          </label>

          <label>
            Assignment Details:
            <textarea
              value={assignmentDetails}
              onChange={(e) => setAssignmentDetails(e.target.value)}
            />
          </label>

          <label>
            Submission Date:
            <input
              type="date"
              value={submissionDate}
              onChange={(e) => setSubmissionDate(e.target.value)}
            />
          </label>

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
