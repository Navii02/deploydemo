import React, { useState, useEffect } from 'react';
import PrinciNavbar from './PrinciNavbar';


function OfficerPage() {
    const [officers, setOfficers] = useState([]);

    useEffect(() => {
        fetchOfficerData();
    }, []);

    const fetchOfficerData = async () => {
        try {
            const response = await fetch(`/api/officers`);
            const data = await response.json();
            setOfficers(data);
        } catch (error) {
            console.error('Error fetching officer data:', error);
        }
    };

    return (
        <div>
            <PrinciNavbar/>
            <div className="admin-teachers-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    {officers.map(officer => (
                        <tr key={officer.id}>
                            <td>{officer.name}</td>
                            <td>{officer.email}</td>
                            <td>{officer.number}</td>
                            <td>{officer.post}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
}

export default OfficerPage;
