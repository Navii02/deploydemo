import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';
import styles from './AddSubjectForm.module.css';

const ShowAddedSubjects = ({ selectedSemester }) => {
  const [addedSubjects, setAddedSubjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedSubjects, setEditedSubjects] = useState([]);
  const fetchAddedSubjects = useCallback(async () => {
    try {
        let response;
        const branch = localStorage.getItem('branch'); // Retrieve branch from localStorage
        if (selectedSemester && selectedSemester >= 3) {
            if (!branch) {
                console.error('Branch not found in localStorage.');
                return;
            }
            response = await axios.get('/api/hod/subjects', {
                params: {
                    semester: selectedSemester,
                    branch: branch // Pass branch as a query parameter
                }
            });
        } else {
            // If selected semester is not provided or is less than 3, fetch subjects without branch
            response = await axios.get('/api/hod/subjects', {
                params: {
                    semester: selectedSemester // Send request without branch
                }
            });
        }

        setAddedSubjects(response.data);
        setEditedSubjects(response.data);
    } catch (error) {
        console.error('Error fetching added subjects:', error);
    }
}, [selectedSemester]);


  useEffect(() => {
    fetchAddedSubjects();
  }, [fetchAddedSubjects, selectedSemester]);

  const handleEditSubject = (index) => {
    setEditingIndex(index);
  };

  const handleSaveSubject = async (index) => {
    try {
      await axios.put(`/api/hod/subjects/${addedSubjects[index]._id}`, editedSubjects[index]);
      alert('Subject details updated successfully!');
      setEditingIndex(null);
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
    <div className={styles.table}> {/* Use CSS module class */}
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', subjectCode: '' }]);
  const [minorSubject, setMinorSubject] = useState('');
  const [minorSubjectCode, setMinorSubjectCode] = useState('');

  const handleChangeSemester = (e) => {
    setSelectedSemester(e.target.value);
    setSemester(e.target.value);
    setSubjects([{ subjectName: '', subjectCode: '' }]);
    setMinorSubject('');
    setMinorSubjectCode('');
  };

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
    if (subjects.length < 6) {
      setSubjects([...subjects, { subjectName: '', subjectCode: '' }]);
    } else {
      alert('You can only add up to 6 columns.');
    }
  };

  const handleRemoveColumn = (index) => {
    const values = [...subjects];
    values.splice(index, 1);
    setSubjects(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const branch = localStorage.getItem('branch');
    try {
      await axios.post('/api/hod/subjects', { semester, subjects, minorSubject, minorSubjectCode,branch });
      alert('Subjects added successfully!');
      setSemester('');
      setSubjects([{ subjectName: '', subjectCode: '' }]);
      setMinorSubject('');
      setMinorSubjectCode('');
    } catch (err) {
      console.error(err);
      alert('Error adding subjects.');
    }
  };

  
  return (
    <div>
      <HodNavbar />
      <div className={styles.container}> {/* Use CSS module class */}
        <label htmlFor="semesterFilter">Select Semester:</label>
        <select id="semesterFilter" value={selectedSemester} onChange={handleChangeSemester}>
          <option value="">Select Semester</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>
      {showAddForm && selectedSemester && (
        <div className={styles.container}> {/* Use CSS module class */}
          <form onSubmit={handleSubmit} className={styles.form}> {/* Use CSS module class */}
            <div>
              {subjects.map((subject, index) => (
                <div key={index}>
                  <div>
                    <label htmlFor={`subjectName${index}`}>Subject Name:</label>
                    <input
                      type="text"
                      id={`subjectName${index}`}
                      name="subjectName"
                      value={subject.subjectName}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`subjectCode${index}`}>Subject Code:</label>
                    <input
                      type="text"
                      id={`subjectCode${index}`}
                      name="subjectCode"
                      value={subject.subjectCode}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemoveColumn(index)}>
                      Remove Column
                    </button>
                  )}
                </div>
              ))}
              {semester >= 3 && semester <= 6 && (
                <div>
                  <div>
                    <label htmlFor="minorSubject">Minor Subject:</label>
                    <input
                      type="text"
                      id="minorSubject"
                      value={minorSubject}
                      onChange={(e) => setMinorSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="minorSubjectCode">Minor Subject Code:</label>
                    <input
                      type="text"
                      id="minorSubjectCode"
                      value={minorSubjectCode}
                      onChange={(e) => setMinorSubjectCode(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {subjects.length < 6 && (
                <button type="button" onClick={handleAddColumn}>
                  Add Column
                </button>
              )}
              <button type="submit">Add Subjects</button>
            </div>
          </form>
        </div>
      )}
      {!showAddForm && selectedSemester && (
        <div className={styles.container}> {/* Use CSS module class */}
          <button onClick={() => setShowAddForm(true)}>Add Subject</button>
        </div>
      )}
      {selectedSemester && <ShowAddedSubjects selectedSemester={selectedSemester} />}
    </div>
  );
};

export default AddSubjectForm;