import axios from "axios";

export const getUserFromPosition = async (position,divisionName, token) =>
  await axios.get(`http://localhost:5432/getUserFromPosition/${position}/${divisionName}`);

  export const getUserFromOnlyPosition = async (position,token) =>
  await axios.get(`http://localhost:5432/getUserFromOnlyPosition/${position}`);

export const getSuperior = async (token) =>
  await axios.get("http://localhost:5432/getSuperior", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllFirstSuperior = async (token) =>
  await axios.get("http://localhost:5432/getAllFirstSuperior", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllSecondSuperiorInDivision = async (token) =>
  await axios.get("http://localhost:5432/getAllSecondSuperiorInDivision", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllHightSecondSuperior = async (token) =>
  await axios.get("http://localhost:5432/getAllHightSecondSuperior", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getFirstSuperior = async (citizenID, token) =>
  await axios.get(`http://localhost:5432/getFirstSuperior/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getSomeSecondSuperior = async (citizenID, token) =>
  await axios.get(`http://localhost:5432/getSomeSecondSuperior/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateFirstSuperior = async (updateData, token) =>
  await axios.put(`http://localhost:5432/updateFirstSuperior`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserMatch = async (token) =>
  await axios.get("http://localhost:5432/getUserMatch", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMatchStatus = async (token) =>
  await axios.get("http://localhost:5432/getMatchStatus", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateComment = async (leaveID,updateData, token) =>
  await axios.put(`http://localhost:5432/updateComment/${leaveID}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const updateCompleteStatus = async (leaveID,updateData, token) =>
  await axios.put(`http://localhost:5432/updateCompleteStatus/${leaveID}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
