import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';
import {baseurl} from '../../url';
import styles from './AssignTutorPage.module.css';

function AssignTutorPage() {
  const [tutors, setTutors] = useState([]);
  const [assignedTutors, setAssignedTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);
  const department = localStorage.getItem('branch');

  const fetchTutors = useCallback(async () => {
    try {
      const response = await axios.get(`${baseurl}/api/tutors?department=${department}`);
      setTutors(response.data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  }, [department]);

  const fetchAssignedTutors = useCallback(async () => {
    try {
      const response = await axios.get(`${baseurl}/api/assigned-tutors?department=${department}`);
      setAssignedTutors(response.data);
    } catch (error) {
      console.error('Error fetching assigned tutors:', error);
    }
  }, [department]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTutors();
      await fetchAssignedTutors();
    };
    fetchData();
  }, [fetchTutors, fetchAssignedTutors]);

  const handleAssignTutor = async () => {
    try {
      if (!selectedTutor || !academicYear || !selectedCourse) {
        console.error('Please select tutor, academic year, and class');
        return;
      }
      await axios.post(`${baseurl}/api/tutors/assign`, { tutorId: selectedTutor, academicYear, tutorclass: selectedCourse });
      setAssignSuccess(true);
      fetchAssignedTutors();
    } catch (error) {
      console.error('Error assigning tutor:', error);
    }
  };

  return (
    <div>
      <HodNavbar />
      <div className={styles.container}>
        <div>
          <label className={styles.label} htmlFor="academicYear">Academic Year:
          <label>yyyy-yyyy</label> </label>
          
          <input
            className={styles.input}
            type="text"
            id="academicYear"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="course">Select class:</label>
          <select
            className={styles.select}
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Class</option>
            {department === 'EC' && <option value="B.Tech ECE">B.Tech ECE</option>}
            {department === 'CS' && (
              <>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
              </>
            )}
          </select>
        </div>
        <div>
          <label className={styles.label} htmlFor="tutor">Select Tutor:</label>
          <select
            className={styles.select}
            id="tutor"
            value={selectedTutor}
            onChange={(e) => setSelectedTutor(e.target.value)}
          >
            <option value="">Select Tutor</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>
                {tutor.name}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.button} onClick={handleAssignTutor}>Assign Tutor</button>
        {assignSuccess && <p className={styles.successMessage}>Tutor assigned successfully!</p>}

        <h2 className={styles.assignedTutorsHeader}>Assigned Tutors:</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Academic Year</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {assignedTutors.map((tutor) => (
              <tr key={tutor._id}>
                <td>{tutor.name}</td>
                <td>{tutor.academicYear}</td>
                <td>{tutor.tutorclass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignTutorPage;
