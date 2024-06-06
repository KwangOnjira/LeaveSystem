import axios from "axios";

//register(formData)
export const register = async (data) =>
  await axios.post(import.meta.env.VITE_APP_API+"/register", data);

//login(formData)
export const login = async (formData) =>
  await axios.post(import.meta.env.VITE_APP_API+"/login", formData);
  

//currentUser(localStorage.getItem("token"));
export const currentUser = async (token) =>
  await axios.get(import.meta.env.VITE_APP_API+"/getProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentAdmin(localStorage.getItem("token"));
export const currentAdmin = async (token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/currentAdmin",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentInspector(localStorage.getItem("token"));
export const currentInspector = async (token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/currentInspector",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//currentSuperior(localStorage.getItem("token"));
export const currentSuperior = async (token) =>
  await axios.post(import.meta.env.VITE_APP_API+"/currentSuperior",{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

//updateUser(userData,localStorage.getItem("token"))
export const updateUser = async (userData, token) =>
  await axios.put(import.meta.env.VITE_APP_API+"/profile", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  //userById(citizenID,localStorage.getItem("token"))
export const userById = async (citizenID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getUserById/${citizenID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const getSignatureDeputy = async (leaveID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getSignatureDeputy/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
export const getSignatureInspector = async (leaveID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getSignatureInspector/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getSignatureFirstSuperior = async (leaveID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getSignatureFirstSuperior/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const getSignatureSecondSuperior = async (leaveID, token) =>
  await axios.get(import.meta.env.VITE_APP_API+`/getSignatureSecondSuperior/${leaveID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const deleteUsers = async (citizenID,token) =>
  await axios.delete(import.meta.env.VITE_APP_API+`/deleteUsers/${citizenID}`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });