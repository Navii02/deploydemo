import React, { useState, useEffect } from 'react';

function TeacherPage() {
    const [teachers, setTeachers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetchTeacherData();
    }, []); // Empty dependency array ensures this effect runs once after initial render

    const fetchTeacherData = async () => {
        try {
            const response = await fetch('/api/teachers');
            const data = await response.json();
            setTeachers(data); // Assuming the data is an array of teacher objects
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        }
    };

    const handleDepartmentChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedDepartment(selectedValue);
    };

    const filteredTeachers = selectedDepartment
        ? teachers.filter(teacher => String(teacher.branches) === selectedDepartment)
        : teachers;

    return (
        <div>
            <h1>Teachers Information</h1>
            <div>
                <label htmlFor="departmentSelect">Select Department: </label>
                <select id="departmentSelect" value={selectedDepartment} onChange={handleDepartmentChange}>
                    <option value="">All</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    {/* Add more options for other departments */}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Phone Number</th>
                        <th>Subjects</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTeachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.name}</td>
                            <td>{teacher.branches}</td>
                            <td>{teacher.phoneNumber}</td>
                            <td>{teacher.subjects.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeacherPage;
