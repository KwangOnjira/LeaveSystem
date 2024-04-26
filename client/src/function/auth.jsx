import axios from "axios";

//register(formData)
export const register = async (data) =>
  await axios.post("http://localhost:5432/register", data);

//login(formData)
export const login = async (formData) =>
  await axios.post("http://localhost:5432/login", formData);

//currentUser(localStorage.getItem("token"));
export const currentUser = async (token) =>
  await axios.get("http://localhost:5432/getProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentAdmin(localStorage.getItem("token"));
export const currentAdmin = async (token) =>
  await axios.post("http://localhost:5432/currentAdmin",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentInspector(localStorage.getItem("token"));
export const currentInspector = async (token) =>
  await axios.post("http://localhost:5432/currentInspector",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentSuperior(localStorage.getItem("token"));
export const currentSuperior = async (token) =>
  await axios.post("http://localhost:5432/currentSuperior",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//updateUser(userData,localStorage.getItem("token"))
export const updateUser = async (userData, token) =>
  await axios.put("http://localhost:5432/profile", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //userById(citizenID,localStorage.getItem("token"))
export const userById = async (citizenID, token) =>
  await axios.get(`http://localhost:5432/getUserById/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const getSignatureDeputy = async (leaveID, token) =>
  await axios.get(`http://localhost:5432/getSignatureDeputy/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const getSignatureInspector = async (leaveID, token) =>
  await axios.get(`http://localhost:5432/getSignatureInspector/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getSignatureFirstSuperior = async (leaveID, token) =>
  await axios.get(`http://localhost:5432/getSignatureFirstSuperior/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getSignatureSecondSuperior = async (leaveID, token) =>
  await axios.get(`http://localhost:5432/getSignatureSecondSuperior/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const deleteUsers = async (citizenID,token) =>
  await axios.delete(`http://localhost:5432/deleteUsers/${citizenID}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });