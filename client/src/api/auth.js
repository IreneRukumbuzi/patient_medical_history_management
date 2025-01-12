import API from './index';

export const login = async (data) => API.post('/auth/login', data);
