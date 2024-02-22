import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OfficerNavbar.css';
import { Button } from '../Button';

function OfficerNavbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const navigate = useNavigate();

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
      <nav className='officer-navbar'>
        <div className='navbar-container'>
          <Link to='/office' className='navbar-logo' onClick={closeMobileMenu}>
            HOME
            <i className='fas fa-home fa-sm' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/data-editing' className='nav-links' onClick={closeMobileMenu}>
                Student Data
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/certificate-distribution' className='nav-links' onClick={closeMobileMenu}>
                Certificates
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/payment' className='nav-links' onClick={closeMobileMenu}>
                Payments
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/notice-updates' className='nav-links' onClick={closeMobileMenu}>
                Noticeboard
              </Link>
            </li>
          </ul>
          <div className='nav-out'>
            <li>
              <Link to='/officerlogin' className='nav-links-mobile' onClick={handleLogout}>
                Log Out
              </Link>
            </li>
            {button && (
              <Button buttonStyle='btn--outline' onClick={handleLogout}>
                LOG OUT
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default OfficerNavbar;
