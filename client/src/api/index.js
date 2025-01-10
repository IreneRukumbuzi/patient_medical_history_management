import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000', // Adjust based on backend setup
});

export const login = (data) => API.post('/auth/login', data);
export const getPatients = () => API.get('/practitioner/patients');
export const addPatientData = (patientId, data) => API.post(`/practitioner/patient/${patientId}`, data);
export const getPatientHistory = (patientId) => API.get(`/patient/${patientId}/history`);
