import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './UserNavbar';
import './reminders.css';

import Loading from './Loading'; // Import the Loading component

const Reminders = () => {
  const [assignmentReminders, setAssignmentReminders] = useState([]);
  const [attendanceReminders, setAttendanceReminders] = useState([]);
  const [internalMarksReminders, setInternalMarksReminders] = useState([]);
  const [updatesReminders, setUpdatesReminders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const userEmail = localStorage.getItem('email');
  const course = localStorage.getItem('course');
  const semester = localStorage.getItem('semester');
  const currentYear = new Date().getFullYear(); // Get the current year
  //console.log(course, semester, currentYear);

  useEffect(() => {
    const categories = ['attendance', 'internalMarks', 'assignments', 'updates'];

    const fetchReminders = async (category) => {
      let apiEndpoint;

      switch (category) {
        case 'attendance':
          apiEndpoint = `/api/reminders/${category}?email=${userEmail}&course=${course}`;
          break;
        case 'assignments':
          apiEndpoint = `/api/reminders/${category}?course=${course}&semester=${semester}&currentyear=${currentYear}`;
          break;
        case 'internalMarks':
          apiEndpoint = `/api/reminders/${category}?email=${userEmail}&course=${course}`;
          break;
        default:
          apiEndpoint = `/api/reminders/${category}/${userEmail}`;
      }

      try {
        const response = await axios.get(apiEndpoint);
        const fetchedReminders = response.data;

        //console.log(`Fetched ${category} reminders:`, fetchedReminders);

        switch (category) {
          case 'attendance':
            setAttendanceReminders(fetchedReminders);
            break;
          case 'assignments':
            setAssignmentReminders(fetchedReminders);
            break;
          case 'internalMarks':
            setInternalMarksReminders(fetchedReminders);
            break;
          case 'updates':
            setUpdatesReminders(fetchedReminders);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${category} reminders:`, error);
        setError('Failed to fetch reminders. Please try again later.');
      }
    };

    const fetchAllReminders = async () => {
      const fetchPromises = categories.map(category => fetchReminders(category));
      await Promise.all(fetchPromises);
      setLoading(false);
    };

    fetchAllReminders();
  }, [userEmail, course, semester, currentYear]);

  const renderCategoryReminders = (category, data) => {
    if (data.message) { // Check for custom message in response
      return <p>{data.message}</p>;
    }

    if (!data || data.length === 0) {
      return <p>No reminders for this category.</p>;
    }

    switch (category) {
      case 'attendance':
        return (
          <div>
            <div className="attendance-container">
              {data.map((attendance, index) => (
                <div className="attendance-item" key={index}>
                  <div className="attendance-circle">
                    <svg>
                      <circle cx="25" cy="25" r="20"></circle>
                      <circle cx="25" cy="25" r="20" style={{ strokeDasharray: `${attendance.percentage}, 100` }}></circle>
                    </svg>
                    <div className="attendance-info">
                      <div className="attendance-text">{attendance.subject}</div>
                      <div className="attendance-text">{attendance.percentage}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'internalMarks':
        return (
          <div>
            <table className="internal-marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {data.map((internalMark, index) => (
                  <tr key={index}>
                    <td>{internalMark.subject}</td>
                    <td>{internalMark.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'updates':
        return (
          <ul className="updates">
            {data.map((update, index) => (
              <li key={index}>{update}</li>
            ))}
          </ul>
        );
      default:
        return (
          <ul>
            {data.map((reminder, index) => (
              <li key={index}>
                {renderReminderContent(category, reminder)}
              </li>
            ))}
          </ul>
        );
    }
  };

  const renderReminderContent = (category, reminder) => {
    if (!reminder) {
      return <div>No data available</div>; // Handle case where reminder is undefined or null
    }

    switch (category) {
      case 'assignments':
        const { subject, teachername, assignmentDetails, submissionDate } = reminder;
        return (
          <tr key={subject}>
            <td><strong>{subject}</strong></td>
            <td>{teachername}</td>
            <td>{assignmentDetails}</td>
            <td>{new Date(submissionDate).toLocaleDateString()}</td>
          </tr>
        );
      case 'updates':
        return (
          <div key={reminder.message}>
            <strong>Update:</strong> {reminder.message}
          </div>
        );
      default:
        return <div key={reminder.message}>{reminder.message}</div>;
    }
  };

  if (loading) {
    return <Loading />; // Show loading component while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="reminder-page-container">
        <div className="reminder-category">
          <h2>Assignments</h2>
          {assignmentReminders.length > 0 ? (
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Assignment Details</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {assignmentReminders
                  .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
                  .map((reminder, index) => (
                    <React.Fragment key={index}>
                      {renderReminderContent('assignments', reminder)}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No assignments available.</p>
          )}
        </div>
        <div className="reminder-category">
          <h2>Attendance</h2>
          {renderCategoryReminders('attendance', attendanceReminders)}
        </div>
        <div className="reminder-category">
          <h2>Internal Marks</h2>
          {renderCategoryReminders('internalMarks', internalMarksReminders)}
        </div>
        <div className="reminder-category">
          <h2>Updates</h2>
          {renderCategoryReminders('updates', updatesReminders)}
        </div>
      </div>
    </>
  );
};

export default Reminders;
