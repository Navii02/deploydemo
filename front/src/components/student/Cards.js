import React, { useEffect, useState } from 'react';
import './Cards.css';
import CardItem from './CardItem';
import axios from 'axios';
import { baseurl } from '../../url';


function Cards() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/notices`);
      const reversedNotices = response.data.notices.reverse();
      setNotices(reversedNotices.slice(0, 3));
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
    
  };
  

  

  return (
    <div className='cards'>
      <p>Recent Notices</p>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {notices.map((notice, index) => (
              <CardItem
                key={index}
                src={notice.image} // Updated
                text={notice.notice}
                label='Notice'
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
