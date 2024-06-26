import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './UserNavbar';
import './reminders.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    const categories = ['attendance', 'internalMarks', 'fees', 'assignments', 'updates'];

    const fetchReminders = async (category) => {
      const apiEndpoint = `/api/reminders/${category}/${userEmail}`;

      try {
        const response = await axios.get(apiEndpoint);
        //console.log(`Fetched reminders for ${category}:`, response.data);
        const fetchedReminders = { category, data: response.data };
        setReminders(prevReminders => [...prevReminders, fetchedReminders]);
      } catch (error) {
        console.error(`Error fetching ${category} reminders:`, error);
        setReminders(prevReminders => [...prevReminders, { category, data: [] }]);
      }
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

    //console.log(`Rendering reminder for category ${category}:`, reminder);

    const messageContent = Array.isArray(reminder) ? reminder.join(', ') : reminder.message || reminder;

    switch (category) {
      case 'assignments':
        const { subject, teacherName } = reminder;
        return (
          <div>
            <strong>{subject}</strong> Assignment by {teacherName}: {messageContent}
          </div>
        );
      case 'updates':
        return (
          <div>
            <strong>Update:</strong> {messageContent}
          </div>
        );
      default:
        return <div>{messageContent}</div>;
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
