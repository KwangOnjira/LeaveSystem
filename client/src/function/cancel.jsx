import axios from "axios";

export const getLeavebyUserID = async (leaveID, token) =>
  await axios.get(`http://localhost:5432/getLeavebyUserID/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const postCancel = async (cancelData, token) =>
  await axios.post("http://localhost:5432/createCancelLeave", cancelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateAllowLeave = async(leaveID,leaveData, token) =>
await axios.put(`http://localhost:5432/updateAllowLeave/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  export const updateCommentCancel = async(cancelID,leaveData, token) =>
await axios.put(`http://localhost:5432/updateCommentCancel/${cancelID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  export const updateCancelLeave = async(cancelID,leaveData, token) =>
await axios.put(`http://localhost:5432/updateCancelLeave/${cancelID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  export const updateCompleteStatusCancel = async(cancelID,leaveData, token) =>
await axios.put(`http://localhost:5432/updateCompleteStatusCancel/${cancelID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const cancelLeave = async (citizenID,cancelID,token) =>
  await axios.get(`http://localhost:5432/getCancelLeave/${citizenID}/${cancelID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const getMatchStatusCancel = async (token) =>
  await axios.get(`http://localhost:5432/getMatchStatusCancel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserMatchCancel = async (token) =>
  await axios.get(`http://localhost:5432/getUserMatchCancel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createStatisticByidCancel = async (citizenID,userData, token) =>
  await axios.post(`http://localhost:5432/createStatisticByidCancel/${citizenID}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getLastLeavebyUserID = async (citizenID,leaveID,token) =>
  await axios.get(`http://localhost:5432/getLastLeavebyUserID/${citizenID}/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getStatisticLastLeavebyUserID = async (citizenID,leaveID,token) =>
  await axios.get(`http://localhost:5432/getStatisticLastLeavebyUserID/${citizenID}/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getCancelLeaveForExport = async (cancelID,token) =>
  await axios.get(`http://localhost:5432/getCancelLeaveForExport/${cancelID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getSignatureInspectorForCancel = async (cancelID,token) =>
  await axios.get(`http://localhost:5432/getSignatureInspectorForCancel/${cancelID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const deleteCancelRequest = async (cancelID,token) =>
  await axios.delete(`http://localhost:5432/deleteCancelRequest/${cancelID}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });