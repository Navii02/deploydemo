import React, { useState, useEffect } from 'react';
import axios from 'axios';

import UserNavbar from './UserNavbar';
import './FeeDetails.css';
import Loading from './Loading';

function InstallmentPage() {
  const [installments, setInstallments] = useState([]);
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInstallments = async () => {
      const email = localStorage.getItem('email');
      const storedCourse = localStorage.getItem('course');
    
      if (!email || !storedCourse) {
        setError('Email or course not found in localStorage');
        setLoading(false);
        return;
      }
    
      setCourse(storedCourse);
    
      try {
        const response = await axios.post(`/api/student/fetch-installments`, {
          email,
          course: storedCourse,
        });
    
        if (response.data && response.data.installmentsPaid) {
          setInstallments(response.data.installmentsPaid);
        } else {
          setError('No installments data found');
        }
      } catch (err) {
        setError('Failed to fetch installments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchInstallments();
  }, []);

  const getInstallmentCount = (course) => {
    return course === 'MCA' ? 1 : 4;
  };

  if (loading) {
    return <Loading />; // Show loading component while data is being fetched
  }

  return (
    <>
      <UserNavbar />
      <div className="installment-container">
        <h2>Installment Payment Status</h2>
        {error && <p className="error">{error}</p>}
        {course && (
          <div className="installment-list">
            {[...Array(getInstallmentCount(course))].map((_, index) => {
              const installmentNumber = index + 1;
              const isPaid = installments.includes(installmentNumber);

              return (
                <div key={installmentNumber} className="installment-item">
                  <p>Installment {installmentNumber}</p>
                  <p className={isPaid ? 'paid' : 'not-paid'}>
                    {isPaid ? 'Paid' : 'Not Paid'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default InstallmentPage;