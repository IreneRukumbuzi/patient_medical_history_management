import React, { useEffect, useState } from 'react';
import { getPatients, addPatientData } from '../api';

const PractitionerDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState({ type: '', details: '' });

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await getPatients();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  const handleSubmit = async () => {
    await addPatientData(selectedPatient, patientData);
    alert('Data added successfully');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Practitioner Dashboard</h1>
      <div className="mb-4">
        <select
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>{patient.username}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Data Type (e.g., Allergy)"
          value={patientData.type}
          onChange={(e) => setPatientData({ ...patientData, type: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Details"
          value={patientData.details}
          onChange={(e) => setPatientData({ ...patientData, details: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded">
        Submit
      </button>
    </div>
  );
};

export default PractitionerDashboard;
