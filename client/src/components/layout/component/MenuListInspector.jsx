import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  HistoryOutlined,
  FileTextOutlined,
  SolutionOutlined,
  UserOutlined,
  LogoutOutlined,
  FormOutlined,
  FundViewOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {  useDispatch } from "react-redux";
import { logout } from "../../../store/userSlice";

const MenuListInspector = ({ darkTheme }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleLogout = (e) => {
      dispatch(logout());
      navigate("/login");
    };
  
  //   const siderBackgroundColor = darkTheme ? "#273813" : "#DDDFD1";
  
    return (
      <Menu
        theme={darkTheme ? "dark" : "light"}
        mode="inline"
        className="menu-bar"
      //   style={{ backgroundColor: siderBackgroundColor }}
      >
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="profile"
          icon={<UserOutlined />}
          onClick={()=>navigate('/profile')}
        >
          ข้อมูลส่วนตัว
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="home"
          icon={<HomeOutlined />}
          onClick={()=>navigate('/')}
        >
          หน้าแรก
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="history"
          icon={<HistoryOutlined />}
          onClick={()=>navigate('/statistics')}
        >
          ประวัติการลา
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="leave"
          icon={<FormOutlined />}
          onClick={()=>navigate('/leave')}
        >
          แจ้งลา
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="deputy"
          icon={<SolutionOutlined />}
          onClick={()=>navigate('/deputy')}
        >
          รับมอบงาน
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="inspector"
          icon={<FundViewOutlined />}
          onClick={()=>navigate('/inspector')}
        >
          สถิติการลาในสังกัด
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="request"
          icon={<FileTextOutlined />}
          onClick={()=>navigate('/inspector/request')}
        >
          คำร้อง
        </Menu.Item>
        <Menu.Item
          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
          key="Logout"
          icon={<LogoutOutlined />}
          onClick={()=>{handleLogout()}}
        >
          ออกจากระบบ
        </Menu.Item>
      </Menu>
    );
}

export default MenuListInspector