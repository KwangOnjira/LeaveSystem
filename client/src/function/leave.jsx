import axios from "axios";

//Maternity Leave
//postMLLeave({ ...formMaternity, date: currentDate },localStorage.getItem("token"));
export const postMLLeave = async (userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/leave/maternityleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Orination Leave
//postOLLeave({...formOrdination,date: currentDate,},localStorage.getItem("token"));
export const postOLLeave = async (userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/leave/ordinationleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Personal Leave
//postPLLeave({...formPersonal,date: currentDate,},localStorage.getItem("token"));
export const postPLLeave = async (userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/leave/personalleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Sick Leave
export const postSLLeave = async (userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/leave/sickleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
//Sick Leave
export const postSTLLeave = async (userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/leave/studyleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Vacation Leave
export const postVLLeave = async (userData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/leave/vacationleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// getLeavebyId function
export const getLeavebyId = async (type, leaveID,fiscal_year, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/statisticsDetailLeave/${type}/${leaveID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllLeaveOfUserId = async (fiscal_year,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllLeaveOfUser/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// getLeavebyIdForRequest function
export const getLeavebyIdForRequest = async (type, leaveID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getLeaveById/${type}/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
// getprevLeave function
export const prevLeave = async (citizenID,type, leaveID,fiscal_year,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/prevLeave/${citizenID}/${type}/${leaveID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// prevLeaveOfUserID function
export const prevLeaveOfUserID = async (type,fiscal_year,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/prevLeaveOfUserID/${type}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getAllLeaveOfUserByCitizenID = async (citizenID,fiscal_year,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllLeaveOfUserByCitizenID/${citizenID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllLeaveByCitizenID = async (citizenID,fiscal_year,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllLeaveByCitizenID/${citizenID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 
export const getLeaveForExport = async (leaveID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getLeaveForExport/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 
export const dowloadFiles = async (files,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/dowloadFiles/${files}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }, responseType: 'blob',
    
  });

  export const deleteRequest = async (leaveID,token) =>
  await axios.delete(import.meta.env.VITE_APP_API+`/deleteRequest/${leaveID}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });