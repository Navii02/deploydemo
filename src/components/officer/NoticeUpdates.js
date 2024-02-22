
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './NoticeUpdates.css'
import Navbar from './OfficerNavbar';

function NoticeUpdates() {
  const [notice, setNotice] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/notices');
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

      const response = await axios.post('/api/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage(response.data.message);
      setNotice('');
      setImage(null);

      fetchNotices(); // Fetch the updated list of notices after adding a new one
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
    <Navbar/>
    <div className="board">
      <form onSubmit={handleSubmit}>
        <label>
          Notice:
          <textarea className='area'
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
      {successMessage && <p>{successMessage}</p>}

      <div className="notice-list">
        {notices.map((notice) => (
          <div key={notice._id}>
            <img style={{ width: 400, height: 400 }} src={`/uploads/${notice.image}`} alt="Notice" />
            <h3>{notice.notice}</h3>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default NoticeUpdates;