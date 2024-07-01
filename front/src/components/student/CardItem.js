import React, { useState } from 'react';
import './CardItem.css'; // Assuming you have a CSS file for CardItem styling

function CardItem(props) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <li className={isFullScreen ? 'cards__item cards__item--full-screen' : 'cards__item'}>
      <div className='cards__item__link' onClick={toggleFullScreen}>
        <figure className='cards__item__pic-wrap' data-category={props.label}>
          <img
            className={isFullScreen ? 'cards__item__img cards__item__img--full-screen' : 'cards__item__img'}
            alt='Notice'
            src={props.src}
          />
        </figure>
        {!isFullScreen && (
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.text}</h5>
          </div>
        )}
      </div>

      {isFullScreen && (
        <div className='cards__item__info--full-screen'>
          <h5 className='cards__item__text'>{props.text}</h5>
        </div>
      )}

      {isFullScreen && (
        <div className='close-btn' onClick={toggleFullScreen}>
          &#10005; {/* Close icon */}
        </div>
      )}
    </li>
  );
}

export default CardItem;
