import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar.css';
import { Button } from '../Button';

function HodNavbar() {
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
            <li className='nav-item'>
              <Link to='/teacher-details' className='nav-links' onClick={closeMobileMenu}>
               Faculty 
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/hodhome' className='nav-links' onClick={closeMobileMenu}>
                Student
              </Link>
            </li>
          </ul>
        </div>
        <div className='nav-out'>
          <li>
            <Link to='/hodlogin' className='nav-links-mobile' onClick={handleLogout}>
              Log Out
            </Link>
          </li>
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
