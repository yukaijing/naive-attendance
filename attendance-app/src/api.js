import axios from 'axios';

export const registerStudent = async (studentID, publicKey) => {
  return axios.post('/api/register', { studentID, publicKey });
};

export const submitAttendance = async (studentID, eventID, signature) => {
  return axios.post('/api/submit-attendance', { studentID, eventID, signature });
};

export const queryAttendance = async (queryType, queryValue) => {
  return axios.get('/api/query-attendance', {
    params: { [queryType]: queryValue },
  });
};
