import axios from "axios";

export const getUserFromPosition = async (position,divisionName, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserFromPosition/${position}/${divisionName}`);

  export const getUserFromOnlyPosition = async (position,token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserFromOnlyPosition/${position}`);

export const getSuperior = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getSuperior", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllFirstSuperior = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getAllFirstSuperior", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllSecondSuperiorInDivision = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getAllSecondSuperiorInDivision", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllHightSecondSuperior = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getAllHightSecondSuperior", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getFirstSuperior = async (citizenID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getFirstSuperior/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getSomeSecondSuperior = async (citizenID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getSomeSecondSuperior/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateFirstSuperior = async (updateData, token) =>
  await axios.put(import.meta.env.VITE_APP_API+`/updateFirstSuperior`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserMatch = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getUserMatch", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMatchStatus = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getMatchStatus", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateComment = async (leaveID,updateData, token) =>
  await axios.put(import.meta.env.VITE_APP_API+`/updateComment/${leaveID}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateCompleteStatus = async (leaveID,updateData, token) =>
  await axios.put(import.meta.env.VITE_APP_API+`/updateCompleteStatus/${leaveID}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
