import API from "./index";

export const getPatients = async () => {
  try {
    const response = await API.get("/practitioner/patients");
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

export const searchPatients = async (query) => {
  try {
    const response = await API.get(`/practitioner/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching patients:", error);
    return [];
  }
};

export const saveMedicalRecord = async (patientId, data) =>
  API.post(`/practitioner/patients/${patientId}/medical-record`, data);

export const getDashboardOverview = async () => {
  try {
    const response = await API.get("/practitioner/overview");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return null;
  }
};

export const getAllMedicalRecords = async (pagination) => {
  try {
    const { current, pageSize } = pagination;
    const response = await API.get(
      `/practitioner/records?query=limit=${pageSize}&page=${current}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return [];
  }
};
