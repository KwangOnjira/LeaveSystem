import axios from "axios";

// statistic for inspector

export const getUserforEdit = async(citizenID,statisticID,token) =>{
  try{
    const response = await axios.get(`http://localhost:5432/getuserforEdit/${citizenID}/${statisticID}`,{
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
await axios.get(`http://localhost:5432/sameDivision/${fiscal_year}/${range}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const sameBothDivAndSubDiv = async(fiscal_year,range , token) =>
await axios.get(`http://localhost:5432/sameBothDivAndSubDiv/${fiscal_year}/${range}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const divisionOfficePAO = async(fiscal_year,range , token) =>
await axios.get(`http://localhost:5432/divisionOfficePAO/${fiscal_year}/${range}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getUsers = async(citizenID,token) =>{
    try {
    const response = await axios.get(`http://localhost:5432/getuser/${citizenID}`, {
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
await axios.put(`http://localhost:5432/updateLastStatistic/${citizenID}/${statisticID}`, statData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const updateLeaveStatus = async(leaveID,leaveData , token) =>
await axios.put(`http://localhost:5432/updateLeave/${leaveID}`, leaveData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getDataLastStatisticByid = async(citizenID,token) =>
  await axios.get(`http://localhost:5432/getDataLastStatisticByid/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createStatByid = async (citizenID,statData, token) =>
  await axios.post(`http://localhost:5432/createStatisticByid/${citizenID}`, statData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateLeaveCount = async(statisticID,statData , token) =>
await axios.put(`http://localhost:5432/updateLeaveCount/${statisticID}`, statData, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const samedivisionTypeEmployee = async(fiscal_year,range,type_of_employee,token) =>
  await axios.get(`http://localhost:5432/samedivisionTypeEmployee/${fiscal_year}/${range}/${type_of_employee}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const divisionOfficePAOTypeEmployee = async(fiscal_year,range,type_of_employee,token) =>
  await axios.get(`http://localhost:5432/divisionOfficePAOTypeEmployee/${fiscal_year}/${range}/${type_of_employee}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const sameBothDivAndSubDivTypeEmployee = async(fiscal_year,range,type_of_employee,token) =>
  await axios.get(`http://localhost:5432/sameBothDivAndSubDivTypeEmployee/${fiscal_year}/${range}/${type_of_employee}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });