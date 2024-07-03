import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './UserNavbar';
import './reminders.css';
import {baseurl} from '../../url';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [assignmentReminders, setAssignmentReminders] = useState([]);
  const [attendanceReminders, setAttendanceReminders] = useState([]);
  const [internalMarksReminders, setInternalMarksReminders] = useState([]);
  const [updatesReminders, setUpdatesReminders] = useState([]);
  const userEmail = localStorage.getItem('email');
  const course = localStorage.getItem('course');
  const semester = localStorage.getItem('semester');
  const currentYear = new Date().getFullYear(); // Get the current year

  useEffect(() => {
    const categories = ['attendance', 'internalMarks', 'assignments', 'updates'];

    const fetchReminders = async (category) => {
      let apiEndpoint;

      switch (category) {
        case 'attendance':
          apiEndpoint = `${baseurl}/api/reminders/${category}?email=${userEmail}&course=${course}`;
          break;
        case 'assignments':
          apiEndpoint = `${baseurl}/api/reminders/${category}?course=${course}&semester=${semester}&currentyear=${currentYear}`;
          break;
        case 'internalMarks':
          apiEndpoint = `${baseurl}/api/reminders/${category}?email=${userEmail}&course=${course}`;
          break;
        default:
          apiEndpoint = `${baseurl}/api/reminders/${category}/${userEmail}`;
      }

      try {
        const response = await axios.get(apiEndpoint);
        const fetchedReminders = { category, data: response.data };

        console.log(`Fetched ${category} reminders:`, fetchedReminders);

        switch (category) {
          case 'attendance':
            setAttendanceReminders(fetchedReminders.data);
            break;
          case 'assignments':
            setAssignmentReminders(fetchedReminders.data);
            break;
          case 'internalMarks':
            setInternalMarksReminders(fetchedReminders.data);
            break;
          case 'updates':
            setUpdatesReminders(fetchedReminders.data);
            break;
          default:
            setReminders(prevReminders => [...prevReminders, fetchedReminders]);
        }
      } catch (error) {
        console.error(`Error fetching ${category} reminders:`, error);
        switch (category) {
          case 'attendance':
            setAttendanceReminders([]);
            break;
          case 'assignments':
            setAssignmentReminders([]);
            break;
          case 'internalMarks':
            setInternalMarksReminders([]);
            break;
          case 'updates':
            setUpdatesReminders([]);
            break;
          default:
            setReminders(prevReminders => [...prevReminders, { category, data: [] }]);
        }
      }
    };

    categories.forEach(category => {
      fetchReminders(category);
    });
  }, [userEmail, course, semester, currentYear]);

  const renderCategoryReminders = (categoryReminders) => {
    const { category, data } = categoryReminders;

    if (!data || data.length === 0) {
      return <p>No reminders for this category.</p>;
    }

    switch (category) {
      case 'attendance':
        return (
          <div>
            <h3>Subject-wise Attendance</h3>
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
            <h3>Internal Marks</h3>
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
          <div>
            <h3>Updates</h3>
            <ul className="updates">
              {data.map((update, index) => (
                <li key={index}>{update}</li>
              ))}
            </ul>
          </div>
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
      return null; // Handle case where reminder is undefined or null
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <Navbar />
      <div className="reminder-page-container">
        {assignmentReminders.length > 0 && (
          <div className="reminder-category">
            <h2>Assignments</h2>
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
          </div>
        )}
        {attendanceReminders.length > 0 && (
          <div className="reminder-category">
            <h2>Attendance</h2>
            {renderCategoryReminders({ category: 'attendance', data: attendanceReminders })}
          </div>
        )}
        {internalMarksReminders.length > 0 && (
          <div className="reminder-category">
            <h2>Internal Marks</h2>
            {renderCategoryReminders({ category: 'internalMarks', data: internalMarksReminders })}
          </div>
        )}
        {updatesReminders.length > 0 && (
          <div className="reminder-category">
            <h2>Updates</h2>
            {renderCategoryReminders({ category: 'updates', data: updatesReminders })}
          </div>
        )}
        {reminders.length === 0 ? (
        <p></p>
        ) : (
          reminders.map((reminder, index) => (
            <div className="reminder-category" key={index}>
              <h2>{capitalizeFirstLetter(reminder.category)}</h2>
              {renderCategoryReminders(reminder)}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Reminders;
