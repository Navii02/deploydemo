import React from 'react';
import '../../App.css';
import './HeroSection.css';
import { FaArrowDown } from 'react-icons/fa'; // Make sure to install react-icons if you haven't

function HeroSection() {
  const scrollToNotices = () => {
    const noticesSection = document.getElementById('notices-section');
    if (noticesSection) {
      noticesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='hero-container'>
      <video src='/videos/website_intro.mp4' autoPlay loop muted />
      <div className='arrow-container' onClick={scrollToNotices}>
        <FaArrowDown className='arrow-icon' />
        <p className='arrow-text'>See Notices</p>
      </div>
    </div>
  );
}

export default HeroSection;
