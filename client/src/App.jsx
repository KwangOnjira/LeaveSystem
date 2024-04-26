import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/pages/auth/Register";
import Login from "./components/pages/auth/Login";
import Profile from "./components/pages/auth/Profile";
import Statistics from "./components/pages/statistic/Statistics";
import "./App.css";
import TestGetProfile from "./components/pages/auth/TestGetProfile";
import TypeLeave from "./components/leave/TypeLeave";
import FormLeave from "./components/leave/FormLeave";
import HomePageAdmin from "./components/pages/admin/HomePageAdmin";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import { currentUser } from "./function/auth";
import { useDispatch } from "react-redux";
import { login } from "./store/userSlice";
import Notfound404 from "./components/pages/Notfound404";
// import ResponsiveAppBar from "./components/layout/ResponsiveAppBar";
import InspectorRoute from "./routes/InspectorRoute";
import RequestToSuperior from "./components/pages/superior/RequestToSuperior";
import StatDivision from "./components/pages/inspector/StatDivision";
import SuperiorRoute from "./routes/SuperiorRoute";
import RequestFromUser from "./components/pages/inspector/RequestFromUser";
import StatPerPerson from "./components/pages/inspector/StatPerPerson";
import EditStatistic from "./components/pages/inspector/EditStatistic";
import EditDetailStatistic from "./components/pages/inspector/EditDetailStatistic";
import DetailPerPerson from "./components/leave/DetailPerPerson";
import ConfirmRequest from "./components/pages/inspector/ConfirmRequest";
import CancelLeave from "./components/pages/cancleVL/CancelLeave";
import FirstSuperior from "./components/pages/superior/FirstSuperior";
import SecondSuperior from "./components/pages/superior/SecondSuperior";
import RepresentativeList from "./components/pages/deputy/RepresentativeList";
import Representative from "./components/pages/deputy/Representative";
import Try from "./components/pages/exports/Try";
import AdminEditDetail from "./components/pages/admin/AdminEditDetail";
import AdminHoliday from "./components/pages/admin/Holiday/AdminHoliday";
import AddHoliday from "./components/pages/admin/Holiday/AddHoliday";
import UpdateHoliday from "./components/pages/admin/Holiday/UpdateHoliday";
import ResetData from "./components/pages/admin/ResetData";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();

  const authenticate = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      currentUser(token)
        .then((response) => {
          console.log(response);
          dispatch(
            login({
              citizenID: response.data.citizenID,
              prefix: response.data.prefix,
              name: response.data.name,
              surname: response.data.surname,
              role: response.data.role,
              email: response.data.email,
              phone: response.data.phone,
              divisionName: response.data.divisionName,
              sub_division: response.data.sub_division,
              position: response.data.position,
              password: response.data.password,
              birthday: response.data.birthday,
              type_of_employee: response.data.type_of_employee,
              start_of_work_on: response.data.start_of_work_on,
              position_first_supeior: response.data.position_first_supeior,
              position_second_supeior: response.data.position_second_supeior,
              token: token,
            })
          );
        })
        .catch((err) => console.log(err));
      // if (token) {
      //   setLoggedIn(true);
      // } else {
      //   setLoggedIn(false);
      // }
    } catch (err) {
      console.log(err);
      // setLoggedIn(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);


  return (
    <BrowserRouter>
      {/*Publish */}
      <Routes>
        <Route
          path="*"
          element={
            <Notfound404 text="ไม่พบหน้าที่คุณต้องการ"/>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Navigate to={"/login"} />} />

        {/* Normal User */}
        <Route
          path="/"
          element={
            <UserRoute>
              <Home />
            </UserRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />
        <Route
          path="/getProfile"
          element={
            <UserRoute>
              <TestGetProfile />
            </UserRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <UserRoute>
              <Statistics />
            </UserRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <UserRoute>
              <TypeLeave />
            </UserRoute>
          }
        />
        <Route
          path="/deputy"
          element={
            <UserRoute>
              <RepresentativeList />
            </UserRoute>
          }
        />
        <Route
          path="/deputy/list/:citizenID/:leaveID"
          element={
            <UserRoute>
              <Representative />
            </UserRoute>
          }
        />
        <Route
          path="/leave/:type"
          element={
            <UserRoute>
              <FormLeave />
            </UserRoute>
          }
        />
        <Route
          path="/statistic/detail/:type/:leaveID/:fiscal_year"
          element={
            <UserRoute>
              <DetailPerPerson />
            </UserRoute>
          }
        />
        <Route
          path="/cancelVacation/:leaveID"
          element={
            <UserRoute>
              <CancelLeave />
            </UserRoute>
          }
        />
        <Route
          path="/export"
          element={
            <UserRoute>
              <Try />
            </UserRoute>
          }
        />

        {/*Admin*/}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <HomePageAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/detail/:citizenID"
          element={
            <AdminRoute>
              <AdminEditDetail />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/holiday"
          element={
            <AdminRoute>
              <AdminHoliday />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/createholiday"
          element={
            <AdminRoute>
              <AddHoliday />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/updateholiday/:id"
          element={
            <AdminRoute>
              <UpdateHoliday />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reset"
          element={
            <AdminRoute>
              <ResetData />
            </AdminRoute>
          }
        />

        {/*Inspector*/}
        <Route
          path="/inspector"
          element={
            <InspectorRoute>
              <StatDivision />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/edit"
          element={
            <InspectorRoute>
              <EditStatistic />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/request"
          element={
            <InspectorRoute>
              <RequestFromUser />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/detail/:citizenID/:fiscal_year"
          element={
            <InspectorRoute>
              <StatPerPerson />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/edit/detail/:citizenID/:statisticID"
          element={
            <InspectorRoute>
              <EditDetailStatistic />
            </InspectorRoute>
          }
        />
        <Route
          path="/inspector/request/:citizenID/:type/:leaveID/:prevStatisticID"
          element={
            <InspectorRoute>
              <ConfirmRequest />
            </InspectorRoute>
          }
        />
        
        {/*Superior*/}
        <Route
          path="/superior"
          element={
            <SuperiorRoute>
              <RequestToSuperior />
            </SuperiorRoute>
          }
        />
        <Route
          path="/superior/request/:citizenID/:type/:leaveID"
          element={
            <SuperiorRoute>
              <FirstSuperior />
            </SuperiorRoute>
          }
        />
        <Route
          path="/superior/requestHead/:citizenID/:type/:leaveID"
          element={
            <SuperiorRoute>
              <SecondSuperior />
            </SuperiorRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
