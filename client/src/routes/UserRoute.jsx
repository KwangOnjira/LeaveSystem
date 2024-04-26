import React from "react";
import HeaderBar from "../components/layout/HeaderBar";
import { useSelector } from "react-redux";
import Notfound404 from "../components/pages/Notfound404";
import SideBar from "../components/layout/SideBar";
import '../components/layout/component/SideBarCss.css'
import InspectorSideBar from "../components/layout/InspectorSideBar";
import SuperiorSideBar from "../components/layout/SuperiorSideBar";

const UserRoute = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  console.log("UserRoute", user);

  const userRole = ({ children }) => {
    switch (user.user.role) {
      case "user":
        return <SideBar content={children}/>;
      case "inspector":
        return <InspectorSideBar content={children}/>;
      case "superior":
        return <SuperiorSideBar content={children}/>;
      default:
        return <SideBar content={children}/>;
    }
  };


  return user && user.user.token ? (
    <>
        {userRole({ children })}
        {/* {children} */}
    </>
  ) : (
    <Notfound404 text="กรุณาเข้าสู่ระบบ" />
  );
};

export default UserRoute;
