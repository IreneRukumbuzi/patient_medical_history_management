import API from './index';

export const getPatients = async () => {
    try {
        const response = await API.get('/practitioner/patients');
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
};

export const searchPatients = async (query) => {
    try {
        const response = await API.get(`/practitioner/search?query=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
};

export const savePatientData = async (patientId, data) => API.post(`/practitioner/patients/${patientId}/medical-record`, data);
