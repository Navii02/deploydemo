import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
     <p>Recent Notices</p>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/img-9.jpg'
              text='NRI seats admission for B.Tech is open now at College of Engineering Poonjar'
              label='Admission'
              path=''
            />
            <CardItem
              src='images/img-2.jpg'
              text='Website of IEEE Student Branch College of Engineering Poonjar is now Live'
              label='IEEE'
              path=''
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/img-3.jpg'
              text='Series exam for B.Tech S2,S4 and S6 will commence on 12th June,2023'
              label='Exam'
              path=''
            />
            <CardItem
              src='images/img-8.jpg'
              text='Registrations open for TCS NQT Off-Campus Drive 2023'
              label='Placement'
              path=''
            />
            <CardItem
              src='images/img-4.jpg'
              text='Classes for B.Tech S2,S4 and S6 will begin from 01/06/2023'
              label='Acadamic'
              path=''
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;