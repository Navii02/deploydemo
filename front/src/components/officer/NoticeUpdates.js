import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './NoticeUpdates.css';
import Navbar from './OfficerNavbar';
import { baseurl } from '../../url';

function NoticeUpdates() {
  const [notice, setNotice] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notices, setNotices] = useState([]);
  const [visibleNotices, setVisibleNotices] = useState(3); // Number of notices to initially display
  const [loading, setLoading] = useState(false); // State for loading animation

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

    setLoading(true); // Start loading animation

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
      }, 1000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred');

      setTimeout(() => {
        setErrorMessage('');
      }, 1000); // Hide error message after 3 seconds
    } finally {
      setLoading(false); // Stop loading animation
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`${baseurl}/api/notices/${id}`);
        setSuccessMessage('Notice deleted successfully');
        fetchNotices(); // Refresh notices list
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'An error occurred');
      }
    }
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
            <br />Image:
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
            ></input>
          </label>
          <button 
          className='savebutton'
          type="submit">Add Notice</button>
        </form>
        {loading && (
          <div className="full-page-loader">
            <div className="pulsing-dot"></div>
          </div>
        )}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="notice-list">
          {notices.slice(0, visibleNotices).map((notice) => (
            <div key={notice._id} className="notice-item">
              <img src={notice.image} alt="Notice" style={{ maxWidth: '100%' }} />
              <h3>{notice.notice}</h3>
              <button onClick={() => handleDelete(notice._id)} className="delete-button">Delete</button>
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
