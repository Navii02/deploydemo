import React, { useState, useEffect } from 'react';
import axios from 'axios';
const ShowAddedSubjects = () => {
    const [addedSubjects, setAddedSubjects] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedSubjects, setEditedSubjects] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
  
    useEffect(() => {
      // Fetch added subjects when the component mounts
      fetchAddedSubjects();
    }, []);
  
    const fetchAddedSubjects = async () => {
      try {
        // Fetch added subjects from the backend
        const response = await axios.get('/api/hod/subjects');
        // Set the retrieved subjects in the state
        setAddedSubjects(response.data);
        // Initialize edited subjects with the same data
        setEditedSubjects(response.data);
      } catch (error) {
        console.error('Error fetching added subjects:', error);
        // Handle error fetching subjects
      }
    };
  
    const handleEditSubject = (index) => {
      // Enable editing mode for the selected subject
      setEditingIndex(index);
    };
  
    const handleSaveSubject = async (index) => {
      try {
        // Make an API call to update the subject details
        await axios.put(`/api/hod/subjects/${addedSubjects[index]._id}`, editedSubjects[index]);
        alert('Subject details updated successfully!');
        // Clear the editing index after saving
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating subject details:', error);
        // Handle error updating subject details
      }
    };
  
    const handleInputChange = (event, field, index) => {
      const updatedSubjects = [...editedSubjects];
      updatedSubjects[index][field] = event.target.value;
      setEditedSubjects(updatedSubjects);
    };
  
    const handleSemesterChange = (event) => {
      setSelectedSemester(event.target.value);
    };
  
    const filteredSubjects = selectedSemester
      ? addedSubjects.filter((subject) => String(subject.semester) === selectedSemester)
      : addedSubjects;
  
    return (
      <div>
        <h2>Added Subjects</h2>
        <div>
          <label htmlFor="semesterFilter">Filter by Semester:</label>
          <select id="semesterFilter" value={selectedSemester} onChange={handleSemesterChange}>
            <option value="">All</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Major Subject</th>
              <th>Subject Code</th>
              <th>Minor Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject, index) => (
              <React.Fragment key={index}>
                {subject.subjects.map((sub, subIndex) => (
                  <tr key={`${index}-${subIndex}`}>
                    <td>{subject.semester}</td>
                    <td>
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={editedSubjects[index].subjects[subIndex].subjectName}
                          onChange={(e) => handleInputChange(e, 'subjectName', index)}
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
                          onChange={(e) => handleInputChange(e, 'subjectCode', index)}
                        />
                      ) : (
                        sub.subjectCode
                      )}
                    </td>
                    <td>{subIndex === 0 ? `${subject.minorSubject} (${subject.minorSubjectCode})` : ''}</td>
                    <td colSpan={subject.subjects.length}>
                      {editingIndex === index ? (
                        <button onClick={() => handleSaveSubject(index)}>Save</button>
                      ) : (
                        <button onClick={() => handleEditSubject(index)}>Edit</button>
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
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', subjectCode: '' }]);
  const [minorSubject, setMinorSubject] = useState('');
  const [minorSubjectCode, setMinorSubjectCode] = useState('');
  const [showSubjectAddingInterface, setShowSubjectAddingInterface] = useState(false);
  

  const handleChangeSemester = (e) => {
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

  const handleSubmit = async () => {
    try {
      await axios.post('/api/hod/subjects', { semester, subjects, minorSubject, minorSubjectCode });
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
      <h2>Add Subjects</h2>
      {showSubjectAddingInterface && (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="semester">Select Semester:</label>
              <select id="semester" value={semester} onChange={handleChangeSemester}>
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            {semester && (
              <div>
                <h3>Semester {semester}</h3>
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
                      <button type="button" onClick={() => handleRemoveColumn(index)}>Remove Column</button>
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
                  <button type="button" onClick={handleAddColumn}>Add Column</button>
                )}
                <button type="submit">Add Subjects</button>
              </div>
            )}
          </form>
        </div>
      )}
       {!showSubjectAddingInterface && (
        <>
          <ShowAddedSubjects />
          <button onClick={() => setShowSubjectAddingInterface(!showSubjectAddingInterface)}>
            {showSubjectAddingInterface ? 'Hide Subject Adding Interface' : 'Add Subject'}
          </button>
        </>
      )}
    </div>
  );
};

export default AddSubjectForm;
