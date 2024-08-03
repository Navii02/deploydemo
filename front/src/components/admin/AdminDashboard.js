import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; // Ensure the correct import for Chart.js

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
        const response = await axios.get(`/api/user/stats`); 
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
      return; // Avoid Chart.js setup if data is not fully updated
    }

    const ctx = document.getElementById('userStatsChart');

    let userStatsChart;

    if (ctx) {
      userStatsChart = new Chart(ctx, {
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
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
  
      const resizeChart = () => {
        userStatsChart.resize();
        userStatsChart.update();
      };

      window.addEventListener('resize', resizeChart);

      return () => {
        window.removeEventListener('resize', resizeChart);
        userStatsChart.destroy();
      };
    }
  }, [userStats]);

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>User Statistics</h1>
        </div>
        <div className="stats-container">
          <div className="stat-card total-users">
            <h3>Total Users</h3>
            <p>{userStats.totalUsers}</p>
          </div>
          {Object.entries(userStats).map(([key, value]) => (
            key !== "totalUsers" && (
              <div key={key} className={`stat-card ${key}`}>
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p>{value}</p>
              </div>
            )
          ))}
        </div>
        <div className="chart-container">
          <canvas id="userStatsChart"></canvas>
        </div>
        {/* Other analysis or data visualization components can be added here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
