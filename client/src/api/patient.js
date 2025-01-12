import API from './index';

export const getPatientHistory = async () => API.get('/patient/history');
