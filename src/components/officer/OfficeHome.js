import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './OfficerNavbar';
import './OfficeHome.css'


function OfficeHome() {
  const [officername, setOfficerName] = useState('');
  const [position, setPosition] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('email');
      console.log('User Email:', userEmail);

      if (!userEmail) {
        console.error('User email not found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`/api/officer-profile?email=${userEmail}`);
        console.log('Full Response:', response);

        const { officername, position } = response.data;

        console.log('Received Data:', {
          officername,
          position,
        });

        setOfficerName(officername);
        setPosition(position);
        

        console.log('User:', officername);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log('User:', officername);
  }, [officername]);


    return(
    <div>
        <Navbar/>
        <div className="officer-home-container">
        <div className="welcome-section">
          <h1 className="welcome-header">Welcome, {officername}!</h1>
          <p className="welcome-text">
            This is your officer home page. Explore the features and modules available for you.
          </p>
          <div className="associated-data">
            <h2>Your Associated Data:</h2>
            <p><strong>Position:</strong> {position.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
    )
}

export default OfficeHome;