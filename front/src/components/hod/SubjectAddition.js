import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import HodNavbar from './HodNavbar';
import styles from './AddSubjectForm.module.css';

const ShowAddedSubjects = ({ selectedSemester, selectedCourse }) => {
  const [addedSubjects, setAddedSubjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedSubjects, setEditedSubjects] = useState([]);

  const fetchAddedSubjects = useCallback(async () => {
    try {
      const branch = localStorage.getItem('branch');
      if (selectedSemester && selectedSemester >= 1 && selectedCourse) {
        if (!branch) {
          console.error('Branch not found in localStorage.');
          return;
        }
        const response = await axios.get(`/api/hod/subjects`, {
          params: {
            semester: selectedSemester,
            course: selectedCourse,
            branch: branch,
          }
        });
        setAddedSubjects(response.data);
        setEditedSubjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching added subjects:', error);
    }
  }, [selectedSemester, selectedCourse]);

  useEffect(() => {
    fetchAddedSubjects();
  }, [fetchAddedSubjects, selectedSemester, selectedCourse]);

  const handleEditSubject = (index) => {
    setEditingIndex(index);
  };

  const handleSaveSubject = async (index) => {
    try {
      const subjectId = addedSubjects[index]._id;
      await axios.put(`/api/hod/subjects/${subjectId}`, editedSubjects[index]);
      alert('Subject details updated successfully!');
      setEditingIndex(null);
      fetchAddedSubjects(); // Refresh data after saving
    } catch (error) {
      console.error('Error updating subject details:', error);
    }
  };

  const handleInputChange = (event, field, index, subIndex) => {
    const updatedSubjects = [...editedSubjects];
    updatedSubjects[index].subjects[subIndex][field] = event.target.value;
    setEditedSubjects(updatedSubjects);
  };

  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>
            <th>Major Subject</th>
            <th>Subject Code</th>
            <th>Minor Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {addedSubjects.map((subject, index) => (
            <React.Fragment key={index}>
              {subject.subjects.map((sub, subIndex) => (
                <tr key={`${index}-${subIndex}`}>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedSubjects[index].subjects[subIndex].subjectName}
                        onChange={(e) => handleInputChange(e, 'subjectName', index, subIndex)}
                      />
                    ) : (
                      sub.subjectName
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedSubjects[index].subjects[subIndex].subjectCode}
                        onChange={(e) => handleInputChange(e, 'subjectCode', index, subIndex)}
                      />
                    ) : (
                      sub.subjectCode
                    )}
                  </td>
                  <td>{subIndex === 0 ? `${subject.minorSubject} (${subject.minorSubjectCode})` : ''}</td>
                  <td>
                    {subIndex === 0 && (
                      <>
                        {editingIndex === index ? (
                          <button onClick={() => handleSaveSubject(index)}>Save</button>
                        ) : (
                          <button onClick={() => handleEditSubject(index)}>Edit</button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddSubjectForm = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', subjectCode: '' }]);
  const [minorSubject, setMinorSubject] = useState('');
  const [minorSubjectCode, setMinorSubjectCode] = useState('');
  const [branch, setBranch] = useState('');
  const [courses, setCourses] = useState([]);

  const handleChangeSemester = (e) => {
    const value = e.target.value;
    setSelectedSemester(value);
    setSemester(value);
    setSubjects([{ subjectName: '', subjectCode: '' }]);
    setMinorSubject('');
    setMinorSubjectCode('');
  };

  const handleChangeCourse = (e) => {
    setSelectedCourse(e.target.value);
  };

  useEffect(() => {
    const branchFromLocalStorage = localStorage.getItem('branch');
    setBranch(branchFromLocalStorage);
    // Update courses based on selected branch
    if (branchFromLocalStorage === 'CS') {
      setCourses(['B.Tech CSE', 'MCA', 'BBA', 'BCA']);
    } else if (branchFromLocalStorage === 'EC') {
      setCourses(['B.Tech ECE']);
    } else if (branchFromLocalStorage === 'EE') {
      setCourses(['B.Tech CSE', 'B.Tech ECE', 'MCA', 'BBA', 'BCA']);
    }
  }, []);

  const handleChange = (index, event) => {
    const values = [...subjects];
    if (event.target.name === 'subjectName') {
      values[index].subjectName = event.target.value;
    } else {
      values[index].subjectCode = event.target.value;
    }
    setSubjects(values);
  };

  const handleAddColumn = () => {
    if (semester < 7 && subjects.length < 6) {
      setSubjects([...subjects, { subjectName: '', subjectCode: '' }]);
    } else if (semester === '8' && subjects.length < 8) {
      setSubjects([...subjects, { subjectName: '', subjectCode: '' }]);
    } else {
      alert('You can only add up to 6 columns for semesters 1-7 and 8 columns for semester 8.');
    }
  };

  const handleRemoveColumn = (index) => {
    const values = [...subjects];
    values.splice(index, 1);
    setSubjects(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/hod/subjects`, { semester, subjects, minorSubject, minorSubjectCode, branch, course: selectedCourse });
      alert('Subjects added successfully!');
      setSemester('');
      setSubjects([{ subjectName: '', subjectCode: '' }]);
      setMinorSubject('');
      setMinorSubjectCode('');
      setShowAddForm(false); // Hide form after submission
    } catch (err) {
      console.error('Error adding subjects:', err);
      alert('Error adding subjects.');
    }
  };

  return (
 
      <div>
        <HodNavbar />
        <div className={styles.container}>
          {/* Content of the page */}
          {branch && (
            <>
              <label className={styles.label} htmlFor="courseFilter">Select Course:</label>
              <select className={styles.select} id="courseFilter" value={selectedCourse} onChange={handleChangeCourse}>
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
            </>
          )}
       
          <label className={styles.label} htmlFor="semesterFilter">Select Semester:</label>
          <select className={styles.select} id="semesterFilter" value={selectedSemester} onChange={handleChangeSemester}>
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
        {showAddForm && selectedSemester && selectedCourse && (
          <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                {subjects.map((subject, index) => (
                  <div key={index} className={styles.subjectRow}>
                    <div>
                      <label className={styles.label} htmlFor={`subjectName${index}`}>Subject Name:</label>
                      <input
                        className={styles.inputText}
                        type="text"
                        id={`subjectName${index}`}
                        name="subjectName"
                        value={subject.subjectName}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </div>
                    <div>
                      <label className={styles.label} htmlFor={`subjectCode${index}`}>Subject Code:</label>
                      <input
                        className={styles.inputText}
                        type="text"
                        id={`subjectCode${index}`}
                        name="subjectCode"
                        value={subject.subjectCode}
                        onChange={(e) => handleChange(index, e)}
                      />
                    </div>
                    {index > 0 && (
                      <button type="button" className={styles.buttonRemove} onClick={() => handleRemoveColumn(index)}>
                        Remove subject
                      </button>
                    )}
                  </div>
                ))}
                {semester >= 3 && semester <= 6 && (
                  <div>
                    <div>
                      <label className={styles.label} htmlFor="minorSubject">Minor Subject:</label>
                      <input
                        className={styles.inputText}
                        type="text"
                        id="minorSubject"
                        value={minorSubject}
                        onChange={(e) => setMinorSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={styles.label} htmlFor="minorSubjectCode">Minor Subject Code:</label>
                      <input
                        className={styles.inputText}
                        type="text"
                        id="minorSubjectCode"
                        value={minorSubjectCode}
                        onChange={(e) => setMinorSubjectCode(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {subjects.length < 8 && (
                  <button type="button" className={styles.button} onClick={handleAddColumn}>
                    Add Subject
                  </button>
                )}
                <button type="submit" className={styles.button}>Add Subjects</button>
              </div>
            </form>
          </div>
        )}
        {!showAddForm && selectedSemester && selectedCourse && (
          <div className={styles.container}>
            <button className={styles.button} onClick={() => setShowAddForm(true)}>Add Subject</button>
          </div>
        )}
        {selectedSemester && selectedCourse && <ShowAddedSubjects selectedSemester={selectedSemester} selectedCourse={selectedCourse} />}
      </div>
    );
  };
  
  export default AddSubjectForm;