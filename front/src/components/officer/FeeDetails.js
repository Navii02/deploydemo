// src/pages/FeeManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./FeeDetails.css";
import OfficerNavbar from "./OfficerNavbar";

const FeeManagementPage = () => {
  const [selectedFee, setSelectedFee] = useState(null);
  const [fees, setFees] = useState([]);

  const [course, setCourse] = useState('');
  const [feeCategory, setFeeCategory] = useState('');
  const [admissionFee, setAdmissionFee] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [groupInsuranceandidCard, setGroupInsuranceandidCard] = useState('');
  const [ktuSportsArts, setKtuSportsArts] = useState('');
  const [ktuAdminFee, setKtuAdminFee] = useState('');
  const [ktuAffiliationFee, setKtuAffiliationFee] = useState('');
  const [cautionDeposit, setCautionDeposit] = useState('');
  const [pta, setPta] = useState('');
  const [busFund, setBusFund] = useState('');
  const [trainingPlacement, setTrainingPlacement] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  useEffect(() => {
    if (selectedFee) {
      setCourse(selectedFee.course);
      setFeeCategory(selectedFee.feeCategory);
      setAdmissionFee(selectedFee.admissionFee);
      setTuitionFee(selectedFee.tuitionFee);
      setGroupInsuranceandidCard(selectedFee.groupInsuranceandidCard);
      setKtuSportsArts(selectedFee.ktuSportsArts);
      setKtuAdminFee(selectedFee.ktuAdminFee);
      setKtuAffiliationFee(selectedFee.ktuAffiliationFee);
      setCautionDeposit(selectedFee.cautionDeposit);
      setPta(selectedFee.pta);
      setBusFund(selectedFee.busFund);
      setTrainingPlacement(selectedFee.trainingPlacement);
    }
  }, [selectedFee]);

  const fetchFees = async () => {
    try {
      const response = await axios.get(`/api/fees`);
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fee details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feeDetails = {
      course,
      feeCategory: course === 'B.Tech' ? feeCategory : undefined,
      admissionFee,
        tuitionFee,
        groupInsuranceandidCard,
        ktuSportsArts,
        ktuAdminFee,
        ktuAffiliationFee,
        cautionDeposit,
        pta,
        busFund,
        trainingPlacement
    };

    try {
      if (selectedFee) {
        // Update existing fee details
        await axios.put(`/api/fees/update/${selectedFee._id}`, feeDetails);
      } else {
        // Add new fee details
        await axios.post(`/api/fees/add`, feeDetails);
      }
      fetchFees();
      resetForm();
    } catch (error) {
      console.error('Error saving fee details:', error);
    }
  };

  const handleEdit = (fee) => {
    setSelectedFee(fee);
  };

  const handleDelete = async (feeId) => {
    const confirm = window.confirm("Are you sure you want to decline this student?");
    if (!confirm) return;
  
    try {
      await axios.delete(`/api/fees/delete/${feeId}`);
      fetchFees();
      alert("Student declined successfully.");
    } catch (error) {
      console.error('Error deleting fee details:', error);
    }
  };

  const resetForm = () => {
    setSelectedFee(null);
    setCourse('');
    setFeeCategory('');
    setAdmissionFee('');
    setTuitionFee('');
    setGroupInsuranceandidCard('');
    setKtuSportsArts('');
    setKtuAdminFee('');
    setKtuAffiliationFee('');
    setCautionDeposit('');
    setPta('');
    setBusFund('');
    setTrainingPlacement('');
  };

  return (
    <div>
         <OfficerNavbar />
  
    <div className='fee-display-container'>
      <h2>Fee Details</h2>
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Fee Category</th>
            <th>Admission Fee</th>
            <th>Tuition Fee</th>
            <th>Group Insurance and Id Card</th>
            <th>KTU Sports and Arts</th>
            <th>KTU Administration Fee</th>
            <th>KTU Affiliation Fee</th>
            <th>Caution Deposit</th>
            <th>PTA</th>
            <th>Bus Fund</th>
            <th>Training and Placement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee._id}>
              <td>{fee.course}</td>
              <td>{fee.feeCategory}</td>
              <td>{fee.admissionFee}</td>
              <td>{fee.tuitionFee}</td>
              <td>{fee.groupInsuranceandidCard}</td>
              <td>{fee.ktuSportsArts}</td>
              <td>{fee.ktuAdminFee}</td>
              <td>{fee.ktuAffiliationFee}</td>
              <td>{fee.cautionDeposit}</td>
              <td>{fee.pta}</td>
              <td>{fee.busFund}</td>
              <td>{fee.trainingPlacement}</td>
              <td>
                <button onClick={() => handleEdit(fee)}>Edit</button>
                <button onClick={() => handleDelete(fee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Fee Management</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course:</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Select Course</option>
            <option value="B.Tech">B.Tech</option>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
            <option value="BBA">BBA</option>
          </select>
        </div>
        {course === 'B.Tech' && (
          <div>
            <label>Fee Category:</label>
            <select value={feeCategory} onChange={(e) => setFeeCategory(e.target.value)}>
              <option value="">Select Fee Category</option>
              <option value="Merit Higher Fee">Merit Higher Fee</option>
              <option value="Merit Lower Fee">Merit Lower Fee</option>
            </select>
          </div>
        )}
        <div>
          <label>Admission Fee:</label>
          <input type="text" value={admissionFee} onChange={(e) => setAdmissionFee(e.target.value)} />
        </div>
        <div>
          <label>Tuition Fee:</label>
          <input type="text" value={tuitionFee} onChange={(e) => setTuitionFee(e.target.value)} />
        </div>
        <div>
          <label>Group Insurance and Id Card:</label>
          <input type="text" value={groupInsuranceandidCard} onChange={(e) => setGroupInsuranceandidCard(e.target.value)} />
        </div>
        <div>
          <label>KTU Sports and Arts:</label>
          <input type="text" value={ktuSportsArts} onChange={(e) => setKtuSportsArts(e.target.value)} />
        </div>
        <div>
          <label>KTU Administration Fee:</label>
          <input type="text" value={ktuAdminFee} onChange={(e) => setKtuAdminFee(e.target.value)} />
        </div>
        <div>
          <label>KTU Affiliation Fee:</label>
          <input type="text" value={ktuAffiliationFee} onChange={(e) => setKtuAffiliationFee(e.target.value)} />
        </div>
        <div>
          <label>Caution Deposit:</label>
          <input type="text" value={cautionDeposit} onChange={(e) => setCautionDeposit(e.target.value)} />
        </div>
        <div>
          <label>PTA:</label>
          <input type="text" value={pta} onChange={(e) => setPta(e.target.value)} />
        </div>
        <div>
          <label>Bus Fund:</label>
          <input type="text" value={busFund} onChange={(e) => setBusFund(e.target.value)} />
        </div>
        <div>
          <label>Training and Placement:</label>
          <input type="text" value={trainingPlacement} onChange={(e) => setTrainingPlacement(e.target.value)} />
        </div>
        <button type="submit">{selectedFee ? 'Update' : 'Submit'}</button>
        <button type="button" onClick={resetForm}>Clear</button>
      </form>
    </div>
    </div>
  );
};

export default FeeManagementPage;
