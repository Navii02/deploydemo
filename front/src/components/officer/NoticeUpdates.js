import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './NoticeUpdates.css';
import Navbar from './OfficerNavbar';
import {baseurl} from '../../url';

function NoticeUpdates() {
  const [notice, setNotice] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notices, setNotices] = useState([]);
  const [visibleNotices, setVisibleNotices] = useState(3); // Number of notices to initially display

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${baseurl}/api/notices`);
      setNotices(response.data.notices.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('notice', notice);
      formData.append('image', image);

      const response = await axios.post(`${baseurl}/api/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage(response.data.message);
      setNotice('');
      setImage(null);

      fetchNotices();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage(error.response.data.message);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Hide error message after 3 seconds
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleShowMore = () => {
    setVisibleNotices(visibleNotices + 3); // Show 3 more notices
  };

  const handleShowLess = () => {
    setVisibleNotices(3); // Show only the initial 3 notices
  };

  return (
    <>
      <Navbar />
      <div className="board">
        <form onSubmit={handleSubmit}>
          <label>
            Notice:
            <textarea
              className='area'
              value={notice}
              onChange={(e) => setNotice(e.target.value)}
            ></textarea>
          </label>
          <label>
            <br/>Image:
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
            ></input>
          </label>
          <button type="submit">Add Notice</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="notice-list">
          {notices.slice(0, visibleNotices).map((notice) => (
            <div key={notice._id} className="notice-item">
              <img src={`/uploads/${notice.image}`} alt="Notice" />
              <h3>{notice.notice}</h3>
            </div>
          ))}
        </div>

        {/* Show more/less buttons */}
        {notices.length > visibleNotices && (
          <div className="show-buttons">
            <button onClick={handleShowMore}>Show More</button>
          </div>
        )}
        {visibleNotices > 3 && (
          <div className="show-buttons">
            <button onClick={handleShowLess}>Show Less</button>
          </div>
        )}
      </div>
    </>
  );
}

export default NoticeUpdates;
