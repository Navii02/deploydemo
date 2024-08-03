import React, { useState, useEffect, useCallback } from 'react';
import PrinciNavbar from './PrinciNavbar';


function StudentPage() {
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAlumniCourse, setSelectedAlumniCourse] = useState('');
  const [selectedAlumniYear, setSelectedAlumniYear] = useState('');
  const [showAlumni, setShowAlumni] = useState(false);
  const [alumniYears, setAlumniYears] = useState([]);

  const fetchAlumniData = useCallback(async () => {
    try {
      const url = new URL(`/api/principal/alumni`);
      const params = new URLSearchParams();
      
      if (selectedAlumniCourse) {
        params.append('course', selectedAlumniCourse);
      }
      if (selectedAlumniYear) {
        params.append('academicYear', selectedAlumniYear);
      }
      url.search = params.toString();

      const response = await fetch(url.toString());
      const data = await response.json();
      console.log('Fetched alumni data:', data);
      setAlumni(data);

      // Extract unique years from alumni data for year filter
      const uniqueYears = [...new Set(data.map(alum => alum.academicYear))];
      setAlumniYears(uniqueYears);
    } catch (error) {
      console.error('Error fetching alumni data:', error);
    }
  }, [selectedAlumniCourse, selectedAlumniYear]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (showAlumni) {
      fetchAlumniData();
    }
  }, [showAlumni, selectedAlumniCourse, selectedAlumniYear, fetchAlumniData]);

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`/api/principal/student`);
      const data = await response.json();
      console.log('Fetched student data:', data);
      setStudents(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleSemesterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSemester(selectedValue);
  };

  const handleCourseChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCourse(selectedValue);
  };

  const handleAlumniCourseChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAlumniCourse(selectedValue);
  };

  const handleAlumniYearChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAlumniYear(selectedValue);
  };

  const handleDetailsClick = (student) => {
    setSelectedStudent(student);
    setSelectedAlumni(null); // Close alumni details if open
  };

  const handleAlumniDetailsClick = (alum) => {
    setSelectedAlumni(alum);
    setSelectedStudent(null); // Close student details if open
  };

  const handleDetailsClose = () => {
    setSelectedStudent(null);
    setSelectedAlumni(null);
  };

  const handleShowAlumni = () => {
    setShowAlumni(true);
  };

  const handleHideAlumni = () => {
    setShowAlumni(false);
    setSelectedAlumni(null); // Close alumni details if open
  };

  const filteredStudents = students.filter(student => {
    const semesterMatch = selectedSemester ? String(student.semester) === selectedSemester : true;
    const courseMatch = selectedCourse ? student.course === selectedCourse : true;
    return semesterMatch && courseMatch;
  });

  return (
    <div>
      <PrinciNavbar />
      <div className="student-display-container">
        <div>
          {!showAlumni && (
            <div>
              <label htmlFor="courseSelect">Select Course: </label>
              <select id="courseSelect" value={selectedCourse} onChange={handleCourseChange}>
                <option value="">All</option>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="BBA">BBA</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
              </select>
              &nbsp;
              <label htmlFor="semesterSelect">Select Semester: </label>
              <select id="semesterSelect" value={selectedSemester} onChange={handleSemesterChange}>
                <option value="">All</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
          )}
          {showAlumni && (
            <div>
              <label htmlFor="alumniCourseSelect">Select Alumni Course: </label>
              <select id="alumniCourseSelect" value={selectedAlumniCourse} onChange={handleAlumniCourseChange}>
                <option value="">All</option>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="BBA">BBA</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
              </select>
              &nbsp;
              <label htmlFor="alumniYearSelect">Select Alumni Year: </label>
              <select id="alumniYearSelect" value={selectedAlumniYear} onChange={handleAlumniYearChange}>
                <option value="">All</option>
                {alumniYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
          &nbsp;
        </div>
        <button onClick={showAlumni ? handleHideAlumni : handleShowAlumni}>
          {showAlumni ? 'Hide Alumni' : 'Show Alumni'}
        </button>
        &nbsp;
        {selectedStudent && (
          <div>
            <h2>Student Details</h2>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Semester:</strong> {selectedStudent.semester}</p>
            <p><strong>Course:</strong> {selectedStudent.course}</p>
            <p><strong>Phone Number:</strong> {selectedStudent.mobileNo}</p>
            <p><strong>Father's Name:</strong> {selectedStudent.parentDetails?.fatherName ?? 'N/A'}</p>
            <p><strong>Mother's Name:</strong> {selectedStudent.parentDetails?.motherName ?? 'N/A'}</p>
            <p><strong>Address:</strong>{selectedStudent?.address}</p>
            <button onClick={handleDetailsClose}>Close</button>
          </div>
        )}
        {selectedAlumni && (
          <div>
            <h2>Alumni Details</h2>
            <p><strong>Name:</strong> {selectedAlumni.name}</p>
            <p><strong>Year:</strong> {selectedAlumni.academicYear}</p>
            <p><strong>Course:</strong> {selectedAlumni.course}</p>
            <p><strong>Phone Number:</strong> {selectedAlumni.mobileNo}</p>
            <button onClick={handleDetailsClose}>Close</button>
          </div>
        )}
        {showAlumni && !selectedAlumni && (
          <div>
            <h2>Alumni List</h2>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Course</th>
                  <th>Alumni Name</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alumni.map(alum => (
                  <tr key={alum._id}>
                    <td>{alum.academicYear}</td>
                    <td>{alum.course}</td>
                    <td>{alum.name}</td>
                    <td>{alum.mobileNo}</td>
                    <td>
                      <button onClick={() => handleAlumniDetailsClick(alum)}>Show Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!showAlumni && !selectedStudent && (
          <div>
            <h2>Student List</h2>
            <table>
              <thead>
                <tr>
                <th>Admission Number</th>
                  <th>Semester</th>
                 
                  <th>Course</th>
                  <th>Student Name</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student._id}>
                    <td>{student.admissionNumber}</td>
                    <td>{student.semester}</td>
                    <td>{student.course}</td>
                    <td>{student.name}</td>
                    <td>{student.mobileNo}</td>
                    <td>
                      <button onClick={() => handleDetailsClick(student)}>Show Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPage;
