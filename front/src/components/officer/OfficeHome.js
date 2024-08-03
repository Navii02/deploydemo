import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './OfficerNavbar';
import './OfficeHome.css';
import { baseurl } from '../../url';


function OfficeHome() {
  const [officerName, setOfficerName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState(false);

  useEffect(() => {
    const fetchOfficerProfile = async () => {
      const userEmail = localStorage.getItem('email');

      if (!userEmail) {
        console.error('User email not found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseurl}/api/officerprofile/${userEmail}`);
        const { name, post } = response.data;

        setOfficerName(name);
        setPosition(post);
        setLoading(false);

        // Fetch approval status
        const statusResponse = await axios.get(`${baseurl}/api/status`);
        setApprovalStatus(statusResponse.data.isApproved);
      } catch (error) {
        console.error('Error fetching officer profile:', error);
        setLoading(false);
      }
    };

    fetchOfficerProfile();
  }, []);

  const handleToggleApproval = async () => {
    try {
      await axios.post(`${baseurl}/api/status/update`, {
        isApproved: !approvalStatus,
      });
      setApprovalStatus(!approvalStatus);
    } catch (error) {
      console.error('Error toggling approval status:', error);
    }
  };

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
               <button className="approval-button" onClick={handleToggleApproval}>
                {approvalStatus ? 'Close Application Form' : 'Close Application Form'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfficeHome;
