import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar.css';
import { Button } from '../Button';

function OfficerNavbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('email'); // Check if user is logged in

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const handleLogout = () => {
    // Clear user session (update based on your implementation)
    localStorage.removeItem('email');

    // Redirect to the login page
    navigate('/officerlogin');
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/office' className='navbar-logo' onClick={closeMobileMenu}>
            HOME
            <i className='fas fa-home fa-sm' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item dropdown'>
              <Link to='/data-editing' className='nav-links' onClick={closeMobileMenu}>
                Admission<i className='fas fa-caret-down' />
              </Link>
              <div className='dropdown-content'>
                <Link to='/data-editing' className='dropdown-link' onClick={closeMobileMenu}>
                  Data Entry
                </Link>
                <Link to='/data-table' className='dropdown-link' onClick={closeMobileMenu}>
                  Data Table
                </Link>
                <Link to='/ar' className='dropdown-link' onClick={closeMobileMenu}>
                  Student List
                </Link>
              </div>
            </li>
            <li className='nav-item dropdown'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Student Data<i className='fas fa-caret-down' />
              </Link>
              <div className='dropdown-content'>
                <Link to='/feepayment' className='dropdown-link' onClick={closeMobileMenu}>
                  FeePayment
                </Link>
                <Link to='/' className='dropdown-link' onClick={closeMobileMenu}>
                  Data Table
                </Link>
              </div>
            </li>
          <li className='nav-item dropdown'>
            <Link to='/certificate-distribution' className='nav-links' onClick={closeMobileMenu}>
                Services<i className='fas fa-caret-down' />
              </Link>
            <div className='dropdown-content'>
              <Link to='/certificate-distribution' className='dropdown-link' onClick={closeMobileMenu}>
                Certificates
              </Link>
              <Link to='/payment' className='dropdown-link' onClick={closeMobileMenu}>
                Payments
              </Link>
              <Link to='/notice-updates' className='dropdown-link' onClick={closeMobileMenu}>
                Noticeboard
              </Link>
            </div>
            </li>
            {isLoggedIn && (
            <li>
              <Link to='/officerlogin' className='nav-links-mobile' onClick={handleLogout}>
                Log Out
              </Link>
            </li>
            )}
          </ul>
            {button && (
              <Button buttonStyle='btn--outline' onClick={handleLogout}>
                LOG OUT
              </Button>
            )}
          </div>
      </nav>
    </>
  );
}

export default OfficerNavbar;
