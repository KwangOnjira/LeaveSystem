import axios from "axios";

export const getUserinSameDivision = async (token) =>
  await axios.get(`http://localhost:5432/getUserinSameDivision`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserForDeputy = async (token) =>
  await axios.get(`http://localhost:5432/getUserForDeputy`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateStatusLeave = async(leaveID,leaveData , token) =>
await axios.put(`http://localhost:5432/updateStatus/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
  export const updateDateDeputy = async(leaveID,leaveData , token) =>
await axios.put(`http://localhost:5432/updateDateDeputy/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// export const getLeaveForDeputy = async (citizenID,leaveID,token) =>
//   await axios.get(`http://localhost:5432/getLeaveForDeputy/${citizenID}/${leaveID}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });