import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
  
function Footer  ()  {

  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        {/*<p className='footer-subscription-heading'>
          Join the Adventure newsletter to receive our best vacation deals
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>*/}
        <div className='input-areas'>
         {/*<form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button buttonStyle='btn--outline'>Subscribe</Button>
          </form>*/}
        </div>
      </section>
      <div class='footer-links'>
        <div className='footer-link-wrapper'>
          <div class='footer-link-items'>
            <Button buttonStyle='btn--outline'><Link to="/about-us">About Us</Link></Button>
          </div>
          <div class='footer-link-items'>
          <Button buttonStyle='btn--outline'><Link to="/contact">Contact Us</Link></Button>
        </div>
        </div>
        </div>
      <section class='social-media'>
        <div class='social-media-wrap'>
          <div class='footer-logo'>
            <Link to='/' className='social-logo'>
              CAP
              <i class='fa fa-graduation-cap' />
            </Link>
          </div>
          <small class='website-rights'>College Of Engineering Poonjar © 2023</small>
          <div class='social-icons'>
            <Link
              class='social-icon-link facebook'
              to='/'
              target='_blank'
              aria-label='Facebook'
            >
              <i class='fab fa-facebook-f' />
            </Link>
            <Link
              class='social-icon-link instagram'
              to='/'
              target='_blank'
              aria-label='Instagram'
            >
              <i class='fab fa-instagram' />
            </Link>
            <Link
              class='social-icon-link youtube'
              to='/'
              target='_blank'
              aria-label='Youtube'
            >
              <i class='fab fa-youtube' />
            </Link>
            {/*<Link
              class='social-icon-link twitter'
              to='/'
              target='_blank'
              aria-label='Twitter'
            >
              <i class='fab fa-twitter' />
            </Link>*/}
            <Link
              class='social-icon-link twitter'
              to='/'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i class='fab fa-linkedin' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;