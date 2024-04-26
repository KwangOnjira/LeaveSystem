import axios from "axios";

//Maternity Leave
//postMLLeave({ ...formMaternity, date: currentDate },localStorage.getItem("token"));
export const postMLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/maternityleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Orination Leave
//postOLLeave({...formOrdination,date: currentDate,},localStorage.getItem("token"));
export const postOLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/ordinationleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Personal Leave
//postPLLeave({...formPersonal,date: currentDate,},localStorage.getItem("token"));
export const postPLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/personalleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Sick Leave
export const postSLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/sickleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
//Sick Leave
export const postSTLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/studyleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//Vacation Leave
export const postVLLeave = async (userData, token) =>
  await axios.post("http://localhost:5432/leave/vacationleave", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// getLeavebyId function
export const getLeavebyId = async (type, leaveID,fiscal_year, token) =>
  await axios.get(`http://localhost:5432/statisticsDetailLeave/${type}/${leaveID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllLeaveOfUserId = async (fiscal_year,token) =>
  await axios.get(`http://localhost:5432/getAllLeaveOfUser/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// getLeavebyIdForRequest function
export const getLeavebyIdForRequest = async (type, leaveID, token) =>
  await axios.get(`http://localhost:5432/getLeaveById/${type}/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
// // getDataLastLeave function
// export const getDataLastLeave = async (token) =>
//   await axios.get(`http://localhost:5432/getDataLastLeave`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// getprevLeave function
export const prevLeave = async (citizenID,type, leaveID,fiscal_year,token) =>
  await axios.get(`http://localhost:5432/prevLeave/${citizenID}/${type}/${leaveID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// prevLeaveOfUserID function
export const prevLeaveOfUserID = async (type,fiscal_year,token) =>
  await axios.get(`http://localhost:5432/prevLeaveOfUserID/${type}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getAllLeaveOfUserByCitizenID = async (citizenID,fiscal_year,token) =>
  await axios.get(`http://localhost:5432/getAllLeaveOfUserByCitizenID/${citizenID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllLeaveByCitizenID = async (citizenID,fiscal_year,token) =>
  await axios.get(`http://localhost:5432/getAllLeaveByCitizenID/${citizenID}/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 
export const getLeaveForExport = async (leaveID,token) =>
  await axios.get(`http://localhost:5432/getLeaveForExport/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 
export const dowloadFiles = async (files,token) =>
  await axios.get(`http://localhost:5432/dowloadFiles/${files}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }, responseType: 'blob',
    
  });

  export const deleteRequest = async (leaveID,token) =>
  await axios.delete(`http://localhost:5432/deleteRequest/${leaveID}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });