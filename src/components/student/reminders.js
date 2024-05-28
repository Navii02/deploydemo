import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './UserNavbar';
import './reminders.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    const categories = ['attendance', 'internalMarks', 'fees', 'assignments', 'updates'];

    const fetchReminders = (category) => {
      const apiEndpoint = `/api/reminders/${category}/${userEmail}`;

      axios.get(apiEndpoint)
        .then(response => {
          const fetchedReminders = { category, data: response.data };
          setReminders(prevReminders => [...prevReminders, fetchedReminders]);
        })
        .catch(error => {
          console.error(`Error fetching ${category} reminders:`, error);
          setReminders(prevReminders => [...prevReminders, { category, data: [] }]);
        });
    };

    categories.forEach(category => {
      fetchReminders(category);
    });
  }, [userEmail]);

  const renderCategoryReminders = (categoryReminders) => {
    const { category, data } = categoryReminders;

    if (!data || data.length === 0) {
      return <p>No reminders for this category.</p>;
    }

    return (
      <ul>
        {data.map((reminder, index) => (
          <li key={index}>
            {renderReminderContent(category, reminder)}
          </li>
        ))}
      </ul>
    );
  };

  const renderReminderContent = (category, reminder) => {
    if (!reminder) {
      return null; // Handle case where reminder is undefined or null
    }

    if (Array.isArray(reminder)) {
      // Handle array of update messages
      return (
        <>
          {reminder.map((message, index) => (
            <div key={index}>
              <strong>Update:</strong> {message}
            </div>
          ))}
        </>
      );
    }

    const { subject, teacherName, message } = reminder;

    switch (category) {
      case 'assignments':
        return (
          <>
            <strong>{subject}</strong> Assignment by {teacherName}: {message}
          </>
        );
       
      case 'updates':
        return (
          <>
            <strong>Update:</strong> {message}
            
          </>
        );
       
              default:
        return <span>{message}</span>;
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <Navbar />
      <div className="reminder-page-container">
        {reminders.length === 0 ? (
          <p>Loading...</p>
        ) : (
          reminders.map(reminder => (
            <div className="reminder-category" key={reminder.category}>
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
