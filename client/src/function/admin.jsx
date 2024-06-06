import axios from "axios";

export const getAllUsers = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllUsers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllStatistics = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllStatistics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getFiscalYear = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getFiscalYear`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getRange = async (fiscal_year,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getRange/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllUsersWithAllStatistic = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllUsersWithAllStatistic`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllStatisticsOfUser = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getAllStatisticsOfUser/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserData = async (citizenID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserData/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getStatisticsOfUserForAdmin = async (citizenID,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getStatisticsOfUserForAdmin/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateDataUser = async (citizenID,userData,token) =>
  await axios.put(import.meta.env.VITE_APP_API+`/updateDataUser/${citizenID}`,userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const resetPasswordForAdmin = async (citizenID,userData,token) =>
  await axios.put(import.meta.env.VITE_APP_API+`/resetPasswordForAdmin/${citizenID}`,userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
