import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <div className='input-areas'>
        </div>
      </section>
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <Link to="/about-us" className='btn btn--outline'>
              About Us
            </Link>
          </div>
          <div className='footer-link-items'>
            <Link to="/contact" className='btn btn--outline'>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <a href='https://cep.ac.in/' className='social-logo'>
              CAP
              <i className='fa fa-graduation-cap' />
            </a>
          </div>
          <small className='website-rights'>College Of Engineering Poonjar © 2024</small>
          <div className='social-icons'>
            <a
              className='social-icon-link facebook'
              href='https://www.facebook.com/profile.php?id=100013005493803&mibextid=ZbWKwL'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </a>
            <a
              className='social-icon-link instagram'
              href='https://www.instagram.com/cepoonjar?igsh=czRhMmVtZ3l6ZnJw'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </a>
            <a
              className='social-icon-link youtube'
              href='https://youtube.com/@cepfilmsociety?si=1IQzud2MvnvWl0z_'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Youtube'
            >
              <i className='fab fa-youtube' />
            </a>
            <a
              className='social-icon-link linkedin'
              href='https://www.linkedin.com/school/college-of-engineering-poonjar-kottayam/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
