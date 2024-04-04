import React, { useState, useEffect } from 'react';

function StudentPage() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState('');

    useEffect(() => {
        fetchStudentData();
    }, []); // Empty dependency array ensures this effect runs once after initial render

    const fetchStudentData = async () => {
        try {
            const response = await fetch('/api/principal/student');
            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data
            setStudents(data); // Assuming the data is an array of student objects
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const handleSemesterChange = (event) => {
        const selectedValue = event.target.value;
        console.log('Selected semester:', selectedValue); // Log the selected semester
        setSelectedSemester(selectedValue);
    };

    const handleDetailsClick = (student) => {
        setSelectedStudent(student);
    };

    const handleDetailsClose = () => {
        setSelectedStudent(null);
    };
    
    const filteredStudents = selectedSemester
        ? students.filter(student => String(student.semester) === selectedSemester)
        : students;

    return (
        <div>
            <h1>Students Classified by Semester</h1>
            <div>
                <label htmlFor="semesterSelect">Select Semester: </label>
                <select id="semesterSelect" value={selectedSemester} onChange={handleSemesterChange}>
                    <option value="">All</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    {/* Add more options for other semesters */}
                </select>
            </div>
            {selectedStudent && (
                <div>
                    <h2>Student Details</h2>
                    <p><strong>Name:</strong> {selectedStudent.name}</p>
                    <p><strong>Semester:</strong> {selectedStudent.semester}</p>
                    <p><strong>Phone Number:</strong> {selectedStudent.mobileNo}</p>
                    <p><strong>Father's Name:</strong> {selectedStudent.parentDetails?.fatherName ?? 'N/A'}</p>
                    <p><strong>Mother's Name:</strong> {selectedStudent.parentDetails?.motherName ?? 'N/A'}</p>
                    <button onClick={handleDetailsClose}>Close</button>
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>Student Name</th>
                        <th>Phone Number</th>
                        <th>Father's Name</th>
                        <th>Mother's Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map(student => (
                        <tr key={student.id}>
                            <td>{student.semester}</td>
                            <td>{student.name}</td>
                            <td>{student.mobileNo}</td>
                            <td>{student.parentDetails?.fatherName ?? 'N/A'}</td>
                            <td>{student.parentDetails?.motherName ?? 'N/A'}</td>
                            <td>
                                {selectedStudent !== student ? (
                                    <button onClick={() => handleDetailsClick(student)}>Show Details</button>
                                ) : (
                                    <button onClick={handleDetailsClose}>Close</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentPage;
