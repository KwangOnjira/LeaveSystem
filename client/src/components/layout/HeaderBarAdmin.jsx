import React from "react";
import { Breadcrumb, Layout, Menu, theme, ConfigProvider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
const { Header, Content, Footer } = Layout;
import { Link } from "react-router-dom";
import { logout } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import ComponentLogo from "./component/ComponentLogo";
import logo from "../../assets/lppao-logo.png";

const HeaderBarAdmin = ({ content }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const itemsLeft = [
    {
      key: "user",
      label: "ข้อมูลส่วนตัว",
      route: "/admin",
    },
    {
      key: "holiday",
      label: "ข้อมูลวันหยุด",
      route: "/admin/holiday",
    },
    {
      key: "reset",
      label: "รีเซ็ตข้อมูล",
      route: "/admin/reset",
    },
  ];

  const itemsRight = [
    {
      key: "logout",
      label: "ออกจากระบบ",
      route: "/logout",
    },
  ];

  const handleMenuClick = (route) => {
    if (route === "/logout") {
      dispatch(logout());
    }
  };

  const CustomMenu = ({ items }) => {
    const { pathname } = useLocation();

    return (
      <Menu
      theme="dark"
        style={{ fontSize: "15px", fontFamily: "Kodchasan" }}
        mode="horizontal"
        selectedKeys={[pathname]}
      >
        {items.map((item) => (
          <Menu.Item key={item.route} onClick={() => handleMenuClick(item.route)}>
            <Link to={item.route}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: "#e6f0f2",
            headerBg: "#151c36",
            headerColor:"#c11"
          },
        },
        token: {
          colorPrimary: "#1cc",
          borderRadius: 2,
          colorBgBase: "#151c36",
          colorText: "#abb1bc",
          colorBgContainer: "#151c36",
        },
      }}
    >
      <Layout>
        <Header 
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            style={{ width: "50px", margin: "1rem" }}
            alt="Logo"
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <CustomMenu items={itemsLeft} />
          </div>
          <CustomMenu items={itemsRight} />
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            padding: 24,
            minHeight: 800,
          }}
        >
          <div
            style={{
              fontFamily: "Kodchasan",
              padding: 24,
              minHeight: 700,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {content}
          </div>
        </Content>
        <Footer
          style={{
            fontSize: "14px",
            fontFamily: "Kodchasan",
            textAlign: "center",
          }}
        >
          สำหรับผู้ดูแลระบบ
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default HeaderBarAdmin;
