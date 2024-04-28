import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar.css';
import { Button } from '../Button';

function HodNavbar() {
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
    navigate('/hodlogin');
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/hodhome' className='navbar-logo' onClick={closeMobileMenu}>
            HOME
            <i className='fas fa-home fa-sm' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/certificate-approval' className='nav-links' onClick={closeMobileMenu}>
                Requests
              </Link>
            </li>
            <li className='nav-item dropdown'>
              <Link to='/teacher-details' className='nav-links' onClick={closeMobileMenu}>
                Faculty<i className='fas fa-caret-down' />
              </Link>
              <div className='dropdown-content'>
                <Link to='/teacher-details' className='dropdown-link' onClick={closeMobileMenu}>
                  Details
                </Link>
                <Link to='/subject' className='dropdown-link' onClick={closeMobileMenu}>
                  Add Subject
                </Link>
                <Link to='/asigntutor' className='dropdown-link' onClick={closeMobileMenu}>
                  Assign Tutor
                </Link>
              </div>
            </li>
            <li className='nav-item dropdown'>
              <Link to='/hstudents' className='nav-links' onClick={closeMobileMenu}>
                Student<i className='fas fa-caret-down' />
              </Link>
              <div className='dropdown-content'>
                <Link to='/hstudents' className='dropdown-link' onClick={closeMobileMenu}>
                  Details
                </Link>
                <Link to='/' className='dropdown-link' onClick={closeMobileMenu}>
                  Performance
                </Link>
              </div>
            </li>
            {isLoggedIn && (
            <li>
              <Link to='/hodlogin' className='nav-links-mobile' onClick={handleLogout}>
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

export default HodNavbar;
