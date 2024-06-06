import axios from "axios";

export const getUserinSameDivision = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserinSameDivision`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserForDeputy = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserForDeputy`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateStatusLeave = async(leaveID,leaveData , token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateStatus/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
  export const updateDateDeputy = async(leaveID,leaveData , token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateDateDeputy/${leaveID}`, leaveData, {
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