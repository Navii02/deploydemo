import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const email = localStorage.getItem('email');

  return email ? children : <Navigate to="/" />;
};

export default PrivateRoute;
