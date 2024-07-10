import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const email = localStorage.getItem('email');
 

  if (!email ) {
    // If user is not logged in or doesn't have the allowed role, redirect to login
    return <Navigate to="/" />;
  }

  // If user is logged in and has the allowed role, render the children components
  return children;
};

export default ProtectedRoute;
