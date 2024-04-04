import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar.css';
import { Button } from '../Button';

function PrinciNavbar() {
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
    navigate('/principallogin');
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/phome' className='navbar-logo' onClick={closeMobileMenu}>
            HOME
            <i className='fas fa-home fa-sm' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/pstudents' className='nav-links' onClick={closeMobileMenu}>
                Students
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/phome' className='nav-links' onClick={closeMobileMenu}>
                Faculties
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/phome' className='nav-links' onClick={closeMobileMenu}>
                Office
              </Link>
            </li>
          </ul>
          <div className='nav-out'>
            <li>
              <Link to='/principallogin' className='nav-links-mobile' onClick={handleLogout}>
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

export default PrinciNavbar;
