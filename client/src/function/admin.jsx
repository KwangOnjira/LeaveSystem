import axios from "axios";

export const getAllUsers = async (token) =>
  await axios.get(`http://localhost:5432/getAllUsers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllStatistics = async (token) =>
  await axios.get(`http://localhost:5432/getAllStatistics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getFiscalYear = async (token) =>
  await axios.get(`http://localhost:5432/getFiscalYear`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getRange = async (fiscal_year,token) =>
  await axios.get(`http://localhost:5432/getRange/${fiscal_year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllUsersWithAllStatistic = async (token) =>
  await axios.get(`http://localhost:5432/getAllUsersWithAllStatistic`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllStatisticsOfUser = async (token) =>
  await axios.get(`http://localhost:5432/getAllStatisticsOfUser/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserData = async (citizenID,token) =>
  await axios.get(`http://localhost:5432/getUserData/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getStatisticsOfUserForAdmin = async (citizenID,token) =>
  await axios.get(`http://localhost:5432/getStatisticsOfUserForAdmin/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateDataUser = async (citizenID,userData,token) =>
  await axios.put(`http://localhost:5432/updateDataUser/${citizenID}`,userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const resetPasswordForAdmin = async (citizenID,userData,token) =>
  await axios.put(`http://localhost:5432/resetPasswordForAdmin/${citizenID}`,userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
