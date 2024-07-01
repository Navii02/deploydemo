import React from 'react';
import './ScholarshipDetails.css';
import Navbar from './UserNavbar';

const scholarships = [
  {
    id: 1,
    name: 'C H MUHAMMEDKOYA SCHOLARSHIP(CHMS)',
    eligibility: ['Should belong to Muslim, Christian,Sikh,Jain,Parsi,Budha community and should be a native of Kerala.',
      'Should be a GIRL student studying for Graduation or Higher courses in Govt./ Aided Institution.',
      'Students who got admission to Self financing colleges from merit seat are also eligible to apply for this scholarship.',
      'Should have scored 50% or above in the qualifying Examination.',
      'Family Annual income should not exceed 8 Lakhs.',
      'Those who apply for Hostel stipend should be staying in recognized hostels.'],
    applyLink: 'https://www.scholarship.minoritywelfare.kerala.gov.in/dmw_ma/dmw_ind.php',
  },
  {
    id: 2,
    name: 'MERIT CUM MEANS SCHOLARSHIP',
    eligibility: ['Should belong to Muslims, Sikhs, Christians, Buddhists, Jain and Zoroastrians (Parsis)',
  'Students who get admission to a college to pursue technical/professional courses, on the basis of a competitive examination will be eligible for the scholarship',
  'Students who get admission in technical/professional courses without taking any competitive examination will also be eligible for scholarship. However, such students should have secured not less than 50% marks in last qualifying exam at higher secondary/graduation level in case of Fresh Scholarship only. Selection of these students will be done strictly on merit basis',
  'Scholarship will be awarded to the students who have secured not less than 50% marks or equivalent grade in the previous final examination',
  'The annual income from all sources must not exceed Rs.2.50 lakh.'],
    applyLink: 'https://scholarships.gov.in/',
  },
  {
    id: 3,
    name: 'CENTRAL SECTOR SCHEME OF SCHOLARSHIPS FOR COLLEGE AND UNIVERSITY STUDENTS',
    eligibility: ['Students who are above 80th percentile of successful candidates in the relevant stream from the respective Board of Examination in Class XII of 10+2 pattern or equivalent',
  'Students with gross parental/family income upto Rs. 4.5 lakh per annum'],
    applyLink: 'https://scholarships.gov.in/',
  },
  {
    id: 4,
    name: 'PRAGATI SCHOLARSHIP SCHEME FOR GIRL STUDENTS ( TECHNICAL DEGREE)',
    eligibility: ['The girl candidate should be admitted to First year of Degree level course or Second year of Degree level course through lateral entry in any of the AICTE approved Institution of respective year.',
    'Maximum two girl child per family are eligible.',
    'Family income from all sources should not be more than Rs. 8 lakh per annum during the current financial year. A valid income certificate issued by State/ UT Government need to be enclosed. '],
    applyLink: 'https://scholarships.gov.in/',
  }, 
  {
    id: 5,
    name: 'E GRANTZ SCHOLARSHIP',
    eligibility: ['The student must be a native or resident of Kerala state.',
    'He or she must belong to the  SC, ST, EBC, SBC, and OBC categories.',
    'The student must be carrying out Degree, Diploma, Doctoral, Higher Secondary, Polytechnic, Post Graduate, Professional, and VHSE courses.',
    'The annual income limit of the student’s family should not exceed Rs. 1 lakh.'],
    applyLink: 'https://egrantz.kerala.gov.in/',
  },

  // Add more scholarship objects as needed
];

const ScholarshipDetails = () => {
  const handleApplyNow = (applyLink) => {
    window.open(applyLink, '_blank');
  };

  return (
    <>
      <Navbar />
    <div className="scholarships">
      <table className='sch-table'>
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Name</th>
            <th>Eligibility</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
          {scholarships.map((scholarship, index) => (
            <tr key={scholarship.id}>
              <td>{index + 1}</td>
              <td>{scholarship.name}</td>
              <td>
                <ol>
                  {scholarship.eligibility.map((criteria, idx) => (
                    <li key={idx}>{criteria}</li>
                  ))}
                </ol>
              </td>
              <td>
                <button onClick={() => handleApplyNow(scholarship.applyLink)}>Apply Now</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ScholarshipDetails;
