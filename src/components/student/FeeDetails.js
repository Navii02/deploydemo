import React, { useState } from 'react';
import './FeeDetails.css';  // Import your CSS file
import Navbar from './UserNavbar';

const FeeDetails = () => {
 // eslint-disable-next-line
  const [paymentStatus] = useState({});
  const userEmail = localStorage.getItem('email');

  const handlePayment = async (year, type) => {
    try {
      const response = await fetch('http://localhost:3001/api/paytm/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          year,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const paymentInitiationResponse = await response.json();

      // Redirect to the Paytm payment page
      window.location.href = paymentInitiationResponse.paymentUrl;
    } catch (error) {
      console.error('Payment initiation error:', error);
      // Handle payment initiation error, display a message, etc.
    }
  };

  const feeDetails = [
    { year: 'First Year', totalFees: 'Rs.43,965' },
    { year: 'Second Year', totalFees: 'Rs.35,000*' },
    { year: 'Third Year', totalFees: 'Rs.35,000*' },
    { year: 'Fourth Year', totalFees: 'Rs.35,000*' },
  ];

  const additionalFeeDetails = [
    { year: 'First Year', totalFees: 'Rs.73,965' },
    { year: 'Second Year', totalFees: 'Rs.65,000' },
    { year: 'Third Year', totalFees: 'Rs.65,000' },
    { year: 'Fourth Year', totalFees: 'Rs.65,000' },
  ];

  return (
    <>
      <Navbar />
      <div className="fee-details">
        <h2>Fee Structure(Merit)</h2>
        <table className="fee-table">
          <thead>
            <tr>
              <th>Year of Study</th>
              <th>Total Fees</th>
              <th>Pay Now</th>
            </tr>
          </thead>
          <tbody>
            {feeDetails.map((fee) => (
              <tr key={fee.year}>
                <td>{fee.year}</td>
                <td>{fee.totalFees}</td>
                <td>
                  <button onClick={() => handlePayment(fee.year, 'merit')}>Pay Now</button>
                  <p>{paymentStatus[`merit-${fee.year}`]}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Fee Structure(Management)</h2>
        <table className="fee-table">
          <thead>
            <tr>
              <th>Year of Study</th>
              <th>Total Fees</th>
              <th>Pay Now</th>
            </tr>
          </thead>
          <tbody>
            {additionalFeeDetails.map((fee) => (
              <tr key={fee.year}>
                <td>{fee.year}</td>
                <td>{fee.totalFees}</td>
                <td>
                  <button onClick={() => handlePayment(fee.year, 'management')}>Pay Now</button>
                  <p>{paymentStatus[`management-${fee.year}`]}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        Note*: Tuition Fee Waiver(TFW) for Top two candidates from each course.
      </div>
    </>
  );
};

export default FeeDetails;