import React from 'react';
import './ContactUs.css'; // Import the external CSS file

const ContactUs = () => {
  const phoneNumbers = [
    { label: 'Primary Contact Number', number: '+919746489365' },
    { label: 'Alternate Contact Number', number: '+919061949268' },
  ];

  const emailIds = [
    { label: 'Primary Mail ID', email: 'bettinakpeter@gmail.com' },
    { label: 'Alternate Mail ID', email: 'bettipeter7@gmail.com' },
  ];

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmail = (emailId) => {
    window.location.href = `mailto:${emailId}`;
  };

  return (
    <div className="contact-us">
      <h1>Contact Us</h1>

      <h2>Phone Numbers</h2>
      <ul>
        {phoneNumbers.map((phoneNumber, index) => (
          <li key={index}>
            {phoneNumber.label}:{' '}
            <a href={`tel:${phoneNumber.number}`}>{phoneNumber.number}</a>{' '}
            <button onClick={() => handleCall(phoneNumber.number)}>Make a call</button>
          </li>
        ))}
      </ul>

      <h2>Email IDs</h2>
      <ul>
        {emailIds.map((emailId, index) => (
          <li key={index}>
            {emailId.label}:{' '}
            <a href={`mailto:${emailId.email}`}>{emailId.email}</a>{' '}
            <button onClick={() => handleEmail(emailId.email)}>Send a mail</button>
          </li>
        ))}
      </ul>

      <h2>Visit Us</h2>
      <p>Poonjar Thekkekara (P.O)<br/>
         Kottayam (Dt.)<br/>
         Kerala<br/>
         PIN: 686582</p>

      <h2>Location</h2>
      <div className="map-container">
        <iframe
          title="Map"
          width="100%"
          height="100%"
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0.01!2d76.82631801184216!3d9.67380881087354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNjcnMjYuMyJTIDc2wrAwMSc0Ni4wIlc!5e0!3m2!1sen!2sus!4v1622812345678!5m2!1sen!2sus`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
