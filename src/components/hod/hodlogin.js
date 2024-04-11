import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import { regexPassword } from '../../utils';
import '../Login.css'; // Add your CSS file if needed

function HodLogin() {
  const Navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    fetchError: false,
    fetchErrorMsg: '',
  });

  const handleChange = (fieldName) => (event) => {
    const currValue = event.target.value;
    let isCorrectValue =
      fieldName === 'email'
        ? validator.isEmail(currValue)
        : regexPassword.test(currValue);

    isCorrectValue
      ? setErrors({ ...errors, [fieldName]: false })
      : setErrors({ ...errors, [fieldName]: true });

    setValues({ ...values, [fieldName]: event.target.value });
  };

  const handleShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleForgotPassword = () => {
    // Navigate to the Forgot Password page
    Navigate('/oforgot');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/hodlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        return setErrors({
          ...errors,
          fetchError: true,
          fetchErrorMsg: error.msg,
        });
      }

      const data = await res.json();

      if (data) {
        // Redirect the officer to the office page
        Navigate('/hodhome');
        localStorage.setItem('branch', data.branch);
        localStorage.setItem('email', data.email);
        console.log('email', data.email);
        console.log('branch', data.branch);
      } else {
        alert('Login failed. Please contact the office.');
      }

      setValues({
        email: '',
        password: '',
        showPassword: false,
      });
      return;
    } catch (error) {
      setErrors({
        ...errors,
        fetchError: true,
        fetchErrorMsg:
          'There was a problem with our server, please try again later',
      });
    }
  };

  return (
    <>
      <div className="login-background-image">
        <div className="login-container">
          <div className="login-form">
            <div className='login-header-box'>
              <div className='login-header'>
                <div className="login-avatar">
                  <img
                    src={process.env.PUBLIC_URL + '/images/icon.png'}
                    alt="Avatar"
                    style={{ width: '70px', height: '70px', borderRadius: '50%' }}
                  />
                </div>
                <h2>Login</h2>
              </div>
            </div>
            <form className='login-fill' onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange('email')}
                className={errors.email ? 'login-error' : ''}
              />
              {errors.email && <p className="login-error-text">Please insert a valid email address</p>}

              <div className="login-password-field">
                <div className="password-input-container">
                  <input
                    id="login-password-field"
                    type={values.showPassword ? 'text' : 'password'}
                    placeholder='Password'
                    value={values.password}
                    onChange={handleChange('password')}
                    className={errors.password ? 'login-error' : ''}
                  />
                  
                </div>
                </div>
              <div className="forgot-show-password-links">
              <span className="show-password-link" onClick={handleShowPassword}>
                  {values.showPassword ? 'Hide' : 'Show'} Password
                </span>
                <a href="/hforgot" onClick={handleForgotPassword} className="forgot-password-link">
                  Forgot Password?
                </a>
               
              </div>

              <div className="login-button-container">
                <button
                  type="submit"
                  disabled={errors.email || errors.password}
                >
                  Login
                </button>
              </div>
              <div className="signup-link">
                <p>Not yet registered? <Link to="/hodsignup">Sign up</Link></p>
              </div>
              {errors.fetchError && <p className="login-error-text">{errors.fetchErrorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default HodLogin;
