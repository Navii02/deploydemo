import React from 'react';
import '../../App.css';
import HeroSection from './HeroSection';
import Footer from './Footer';
import Cards from './Cards';
import UserNavbar from './UserNavbar';

function UserHome() {
  return (
    <>
      <UserNavbar/>
      <HeroSection/>
      <Cards/>
      <Footer/>
    </>
  );
}

export default UserHome;