import axios from "axios";

//getHoliday();
export const getHoliday = async () =>
  await axios.get(import.meta.env.VITE_APP_API+"/getHoliday");

export const getHolidayById = async (id,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getHolidayById/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateHoliday = async (id,updateData, token) =>
  await axios.put(import.meta.env.VITE_APP_API+`/updateHoliday/${id}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const createHoliday = async (data, token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/createHoliday", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const deleteHoliday = async (id,token) =>
  await axios.delete(import.meta.env.VITE_APP_API+`/deleteHoliday/${id}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

