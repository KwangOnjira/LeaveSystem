import React, { useState } from "react";
import { Layout, Button, theme, ConfigProvider } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import "./component/SideBarCss.css";
import ComponentLogo from "./component/ComponentLogo";
import ToggleThemeButton from "./component/ToggleThemeButton";
import MenuListSuperior from "./component/MenuListSuperior";
const { Header, Sider, Content } = Layout;


const SuperiorSideBar = ({ content }) => {
    const [darkTheme, setDarkTheme] = useState(false);
    const toggleTheme = () => {
      setDarkTheme(!darkTheme);
    };
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  
    //   const siderBackgroundColor = darkTheme ? "#273813" : "#DDDFD1";
  
    const [collapsed, setCollapsed] = useState(false);
    return (
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#FFB5A7",
            borderRadius: 2,
  
            // Alias Token
            colorBgContainer: "#B6C4A0",
          },
        }}
      >
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth={0}
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            collapsed={collapsed}
            collapsible
            trigger={null}
            theme={darkTheme ? "dark" : "light"}
            // style={{ backgroundColor: siderBackgroundColor }}
            className="sidebar"
          >
            <ComponentLogo />
            <MenuListSuperior darkTheme={darkTheme} />
            <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, backgroundColor:"#e7f1dc"}}>
              <Button
                type="text"
                className="toggle"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              ></Button>
            </Header>
            <Content
              style={{
                margin: "24px 16px 0",
                padding: 24,
                minHeight: 280,
                backgroundColor: "#DDDFD1",
                background: colorBgContainer,
              }}
            >
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: "#f3f3f0",
                  borderRadius: borderRadiusLG,
                }}
              >
                {content}
              </div>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
      
    );

}

export default SuperiorSideBar