import React, { useState, useEffect } from 'react';
import { getPatientHistory } from '../api/patient';
import Navbar from '../components/Navbar';

const PatientDashboard = () => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getPatientHistory();
        setMedicalHistory(Array.isArray(response) ? response : response.data || []);
      } catch (err) {
        console.error("Failed to fetch medical history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading medical history...</div>;
  }

  if (!medicalHistory.length) {
    return <div>No medical history records found.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Patient Medical History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicalHistory.map((record) => (
          <div
            key={record.id}
            className="bg-white shadow p-4 rounded border border-gray-200"
          >
            <h2 className="font-semibold capitalize">{record.recordType}</h2>
            <p>Type: {record.type}</p>
            <p>Data: {record.data}</p>
            {record.filePath && (
              <a
                href={record.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View File
              </a>
            )}
            <p className="text-sm text-gray-500">
              Created At: {new Date(record.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
