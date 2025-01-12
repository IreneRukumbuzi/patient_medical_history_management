import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { getPatients, savePatientData } from '../api/practitioner';
import Navbar from '../components/Navbar';

const PractitionerDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [recordType, setRecordType] = useState('');
    const [data, setData] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const patientsData = await getPatients();
                setPatients(
                    patientsData.map((patient) => ({
                        value: patient.id,
                        label: `${patient.username} (${patient.id})`,
                    }))
                );
            } catch (error) {
                alert('Failed to load patients');
            }
        };
        fetchPatients();
    }, []);

    const handleFileChange = useCallback((e) => {
        setFile(e.target.files[0]);
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            if (!selectedPatient || !recordType || !data) {
                alert('All fields are required');
                return;
            }

            const formData = new FormData();
            formData.append('type', recordType);
            formData.append('data', data);
            formData.append('recordType', recordType);
            if (file) formData.append('file', file);

            setIsLoading(true);
            try {
                await savePatientData(selectedPatient.value, formData);
                alert('Medical record added successfully');
                setSelectedPatient(null);
                setRecordType('');
                setData('');
                setFile(null);
            } catch (error) {
                alert('Error adding medical record');
            } finally {
                setIsLoading(false);
            }
        },
        [selectedPatient, recordType, data, file]
    );

    return (
        <div className="p-6 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                        Practitioner Dashboard
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient">
                                Search and Select Patient
                            </label>
                            <Select
                                id="patient"
                                options={patients}
                                value={selectedPatient}
                                onChange={(selectedOption) => setSelectedPatient(selectedOption)}
                                placeholder="Search and select a patient"
                                isClearable
                                isSearchable
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recordType">
                                Select Record Type
                            </label>
                            <select
                                id="recordType"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setRecordType(e.target.value)}
                                value={recordType}
                            >
                                <option value="">Select Record Type</option>
                                <option value="allergy">Allergy</option>
                                <option value="prescription">Prescription</option>
                                <option value="lab-order">Lab Order</option>
                                <option value="lab-result">Lab Result</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data">
                                Record Data
                            </label>
                            <textarea
                                id="data"
                                placeholder="Enter data for the record"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                                Upload File
                            </label>
                            <input
                                type="file"
                                id="file"
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PractitionerDashboard;
