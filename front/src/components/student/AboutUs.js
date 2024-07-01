import React from 'react';
import './AboutUs.css'

const AboutUsPage = () => {
  const employees = [
    { id: 1, name: 'Mr.Steny John Panikulam', position: 'Administrative Assistant' },
    { id: 2, name: 'Mr.Thomas Chacko', position: 'Senior   Superintendent' },
    { id: 3, name: 'Mr.Babu Sukumaran', position: 'Head Clerk' },
    { id: 4, name: 'Mr.Bijo Mathew', position: 'Confidential Assistant (Senior Grade)' },
    { id: 5, name: 'Mrs.Ligi Mathew', position: 'Technical Store Keeper (SeniorGrade)' },
    { id: 6, name: 'Mrs.Ancy Joseph', position: 'Senior Office Assistant' },
    { id: 7, name: 'Minimol Joseph', position: 'Senior Office Assistant' },
  ];

  return (
    <div className='about-us-page'>
      <h1>About Us</h1>
      <p>The office of the college comprises of qualified administrative staff who helps the students more efficiently and cordially.  College office mainly looks into the matter related to admission, eligibility, student aid, scholarships, accounts etc. It provides clerical support required for maintaining records for interaction with government, university, parents, students, teachers and management. The Principal of the college is the head of the administrative office section. . The members of Administrative Office’s organizational structure are as follows:</p>
      <img src='./images/office.jpg' alt='office'/>
      <table>
        <thead>
          <tr>
            <th>Sl No:</th>
            <th>Name</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Office Hours</h2>
      <p>Monday-Friday: 8:00 AM - 4:00 PM</p>
      <p>We are closed on weekends and public holidays.</p>
      <h2>Contact Information</h2>
      <p>Email: cepoonjar@ihrd.ac.in</p>
      <p>Phone: +91 9562401737</p>
      <p>Address: Poonjar Thekkekara (P.O)<br/>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kottayam (Dt.)<br/>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kerala<br/>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PIN: 686582</p>
    </div>
  );
};

export default AboutUsPage;
