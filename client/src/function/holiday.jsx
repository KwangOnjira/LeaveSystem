import axios from "axios";

//getHoliday(localStorage.getItem("token"));
export const getHoliday = async (token) =>
  await axios.get("http://localhost:5432/getHoliday",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getHolidayById = async (id,token) =>
  await axios.get(`http://localhost:5432/getHolidayById/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateHoliday = async (id,updateData, token) =>
  await axios.put(`http://localhost:5432/updateHoliday/${id}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createHoliday = async (data, token) =>
  await axios.post("http://localhost:5432/createHoliday", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const deleteHoliday = async (id,token) =>
  await axios.delete(`http://localhost:5432/deleteHoliday/${id}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

