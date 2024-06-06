import axios from "axios";

// statistic for inspector

export const getUserforEdit = async(citizenID,statisticID,token) =>{
  try{
    const response = await axios.get(import.meta.env.VITE_APP_API+`/getuserforEdit/${citizenID}/${statisticID}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
    })
    return response.data
  }catch(error){
    throw error;
  }
    
} 

export const sameDivision = async(fiscal_year,range , token) =>
await axios.get(import.meta.env.VITE_APP_API+`/sameDivision/${fiscal_year}/${range}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const sameBothDivAndSubDiv = async(fiscal_year,range , token) =>
await axios.get(import.meta.env.VITE_APP_API+`/sameBothDivAndSubDiv/${fiscal_year}/${range}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const divisionOfficePAO = async(fiscal_year,range , token) =>
await axios.get(import.meta.env.VITE_APP_API+`/divisionOfficePAO/${fiscal_year}/${range}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getUsers = async(citizenID,token) =>{
    try {
    const response = await axios.get(import.meta.env.VITE_APP_API+`/getuser/${citizenID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    throw error; 
  }
} 

export const updateLastStatistic = async(citizenID,statisticID,statData, token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateLastStatistic/${citizenID}/${statisticID}`, statData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const updateLeaveStatus = async(leaveID,leaveData , token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateLeave/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getDataLastStatisticByid = async(citizenID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getDataLastStatisticByid/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createStatByid = async (citizenID,statData, token) =>
  await axios.post(import.meta.env.VITE_APP_API+`/createStatisticByid/${citizenID}`, statData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateLeaveCount = async(statisticID,statData , token) =>
await axios.put(import.meta.env.VITE_APP_API+`/updateLeaveCount/${statisticID}`, statData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const samedivisionTypeEmployee = async(fiscal_year,range,type_of_employee,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/samedivisionTypeEmployee/${fiscal_year}/${range}/${type_of_employee}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const divisionOfficePAOTypeEmployee = async(fiscal_year,range,type_of_employee,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/divisionOfficePAOTypeEmployee/${fiscal_year}/${range}/${type_of_employee}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const sameBothDivAndSubDivTypeEmployee = async(fiscal_year,range,type_of_employee,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/sameBothDivAndSubDivTypeEmployee/${fiscal_year}/${range}/${type_of_employee}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });