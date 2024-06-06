import axios from "axios";

export const getLeavebyUserID = async (leaveID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getLeavebyUserID/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const postCancel = async (cancelData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/createCancelLeave", cancelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateAllowLeave = async(leaveID,leaveData, token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateAllowLeave/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  export const updateCommentCancel = async(cancelID,leaveData, token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateCommentCancel/${cancelID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  export const updateCancelLeave = async(cancelID,leaveData, token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateCancelLeave/${cancelID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  export const updateCompleteStatusCancel = async(cancelID,leaveData, token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateCompleteStatusCancel/${cancelID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const cancelLeave = async (citizenID,cancelID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getCancelLeave/${citizenID}/${cancelID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const getMatchStatusCancel = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getMatchStatusCancel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserMatchCancel = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserMatchCancel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createStatisticByidCancel = async (citizenID,userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+`/createStatisticByidCancel/${citizenID}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getLastLeavebyUserID = async (citizenID,leaveID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getLastLeavebyUserID/${citizenID}/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getStatisticLastLeavebyUserID = async (citizenID,leaveID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getStatisticLastLeavebyUserID/${citizenID}/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getCancelLeaveForExport = async (cancelID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getCancelLeaveForExport/${cancelID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const getSignatureInspectorForCancel = async (cancelID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getSignatureInspectorForCancel/${cancelID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const deleteCancelRequest = async (cancelID,token) =>
  await axios.delete(import.meta.env.VITE_APP_API+`/deleteCancelRequest/${cancelID}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });