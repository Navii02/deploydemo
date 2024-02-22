// ForgotPassword.js
import React, { useState } from 'react';
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSendVerificationCode = async () => {
    try {
      // Send a request to the server to send the verification code
      const res = await fetch('/api/sendverificationcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.msg);
        return;
      }

      // Display a success message to the user
      setEmailSent(true);
      setVerificationCodeSent(true);
    } catch (error) {
      console.error('There was an error:', error);
      // Handle unexpected errors
      setError('Something went wrong. Please try again later.');
    }
  };

  const handleVerifyCodeAndChangePassword = async () => {
    try {
      // Send a request to the server to verify the code and update the password
      const res = await fetch('/api/verifycodeandchangepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode,
          newPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setError(error.msg);
        return;
      }

      // Display a success message to the user
      setEmailSent(false);
      setVerificationCodeSent(false);
      setError(null); // Reset error state
      // Redirect the user to the login page or another relevant page
      // Navigate('/login');
    } catch (error) {
      console.error('There was an error:', error);
      // Handle unexpected errors
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {!emailSent && (
        <form>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="button" onClick={handleSendVerificationCode}>
            Send Verification Code
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
      {emailSent && verificationCodeSent && (
        <form>
          <label>
            Verification Code:
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <button type="button" onClick={handleVerifyCodeAndChangePassword}>
            Verify Code and Change Password
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
