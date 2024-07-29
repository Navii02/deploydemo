import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './OfficerNavbar';
import './OfficeHome.css';
import { baseurl } from '../../url';

function OfficeHome() {
  const [officerName, setOfficerName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficerProfile = async () => {
      const userEmail = localStorage.getItem('email');
      console.log('User Email:', userEmail);

      if (!userEmail) {
        console.error('User email not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseurl}/api/officerprofile/${userEmail}`);
        console.log('Officer Profile Response:', response.data);

        const { name, post } = response.data;

        setOfficerName(name);
        setPosition(post);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching officer profile:', error);
        setLoading(false);
      }
    };

    fetchOfficerProfile();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="officer-home-container">
        <div className="welcome-section">
          {loading ? (
            <div className="loading-spinner">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              <h1 className="welcome-header">Welcome, {officerName}!</h1>
              <p className="welcome-text">
                This is your officer home page. Explore the features and modules available for you.
              </p>
              <div className="associated-data">
                <h2>Your Associated Data:</h2>
                <p>
                  <strong>Position:</strong> {position ? position : 'No position available'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfficeHome;
