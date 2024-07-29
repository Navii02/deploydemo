import React, { useState, useEffect } from 'react';
import PrinciNavbar from './PrinciNavbar';
import {baseurl} from '../../url';

function TeacherPage() {
    const [teachers, setTeachers] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetchTeacherData();
    }, []); // Empty dependency array ensures this effect runs once after initial render

    const fetchTeacherData = async () => {
        try {
            const response = await fetch(`${baseurl}/api/teachers`);
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
        ? teachers.filter(teacher => String(teacher.department) === selectedDepartment)
        : teachers;

    return (
        <div>
           <PrinciNavbar/>
            <div className="student-display-container">
                <label htmlFor="departmentSelect">Select Department: </label>
                <select id="departmentSelect" value={selectedDepartment} onChange={handleDepartmentChange}>
                    <option value="">All</option>
                    <option value="CS">CS</option>
                    <option value="EC">EC</option>
                    <option value="EE">EE</option>
                    <option value="Aplied Science">Aplied Science</option>
         
                    {/* Add more options for other departments */}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Subjects</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTeachers.map(teacher => (
                        <tr key={teacher.id}>
                            <td>{teacher.teachername}</td>
                            <td>{teacher.department}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.subjects.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeacherPage;
