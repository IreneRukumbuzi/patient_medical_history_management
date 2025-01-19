import API from './index';

export const getPatientHistory = async (pagination) => {
  try {
    const { current, pageSize } = pagination;
    const response = await API.get(
      `/patient/history?query=limit=${pageSize}&page=${current}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return [];
  }
};