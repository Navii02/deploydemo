import React, { useState, useEffect } from 'react';
import Chart from 'chart.js';

import './AdminDashboard.css'; 
import Navbar from './AdminNavbar';
import axios from 'axios';

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    principal: 0,
    hod: 0,
    classTutor: 0,
    faculty: 0,
    officer: 0,
    student: 0, 
  });

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await axios.get('/api/user/stats'); // Adjust the API endpoint accordingly
        const data = response.data;
        setUserStats(data);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };

    fetchUserStatistics();
  }, []);

  useEffect(() => {
    if (Object.values(userStats).some(val => val === 0)) {
      // If the userStats data is not updated properly, return to avoid Chart.js setup
      return;
    }
  
    const ctx = document.getElementById('userStatsChart');
  
    if (ctx) {
      const userStatsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Principal', 'HOD', 'Class Tutor', 'Faculty', 'Officer', 'Student'],
          datasets: [
            {
              label: 'Number of Users',
              data: [
                userStats.principal,
                userStats.hod,
                userStats.classTutor,
                userStats.faculty,
                userStats.officer,
                userStats.student,
              ],
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true, // Ensure responsiveness
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 100, // Set a maximum value for the y-axis (adjust as needed)
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
        },
      });
  
      // Add a resize listener to adjust the chart size when the window is resized
      const resizeChart = () => {
        userStatsChart.resize();
        userStatsChart.update(); // Force a redraw of the chart
      };
  
      window.addEventListener('resize', resizeChart);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', resizeChart);
      };
    }
  }, [userStats]);
  

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        <div className="chart-container">
          <h1>User Statistics:</h1>
          <div>
            <canvas id="userStatsChart"></canvas>
          </div>
          <div className="user-stats">
            <div className="total-users">
              &nbsp;
              <h3>Total Users: {userStats.totalUsers}</h3>
            </div>
            <div className="user-stats-details">
              <div className="user-stat-box principal">
                <p>Principal: {userStats.principal}</p>
              </div>
              <div className="user-stat-box hod">
                <p>HOD: {userStats.hod}</p>
              </div>
              <div className="user-stat-box class-tutor">
                <p>Class Tutor: {userStats.classTutor}</p>
              </div>
              <div className="user-stat-box faculty">
                <p>Faculty: {userStats.faculty}</p>
              </div>
              <div className="user-stat-box officer">
                <p>Officer: {userStats.officer}</p>
              </div>
              <div className="user-stat-box student">
                <p>Student: {userStats.student}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Other analysis or data visualization components can be added here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
