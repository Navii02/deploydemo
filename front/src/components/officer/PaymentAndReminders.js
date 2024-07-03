// PaymentAndReminders.js

import React, { useState, useEffect } from 'react';
import './PaymentAndReminders.css'; // Make sure to import the CSS file
import Navbar from './OfficerNavbar';
import {baseurl} from '../../url';

const OfficerPaymentPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch the list of payments from the server
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${baseurl}/api/officer/payments`);
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        const data = await response.json();
        setPayments(data.payments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const markPaymentReceived = async (paymentId) => {
    // Implement the logic to mark a payment as received
  };

  return (
    <>
      <Navbar />
      <div className="officer-payment-page-container">
        <h2>Student Payments</h2>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Student Email</th>
              <th>Year of Study</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.userEmail}</td>
                <td>{payment.year}</td>
                <td>{payment.type}</td>
                <td>{payment.status}</td>
                <td>
                  {payment.status !== 'Received' && (
                    <button className="mark-received-btn" onClick={() => markPaymentReceived(payment.id)}>
                      Mark as Received
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OfficerPaymentPage;