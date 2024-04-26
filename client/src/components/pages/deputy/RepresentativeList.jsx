import React, { useEffect, useState } from "react";
import locale from "antd/locale/th_TH";
import { currentUser } from "../../../function/auth";
import { getUserForDeputy } from "../../../function/deputy";
import {
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Table, ConfigProvider } from "antd";
const { Column, ColumnGroup } = Table;

const RepresentativeList = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [deputy, setDeputy] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log("userData", fetchUser.data);
        setUserData(fetchUser.data);

        const fetchDeputy = await getUserForDeputy(
          localStorage.getItem("token")
        );
        console.log("Deputy", fetchDeputy.data);
        setDeputy(fetchDeputy.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const formatCurrentDate = (dateString) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("th-TH", options).format(
      date
    );

    return formattedDate;
  };

  const handleDetail = (citizenID, leaveID) => {
    navigate(`/deputy/list/${citizenID}/${leaveID}`);
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 300,
        md: 660,
        lg: 980,
        xl: 1620,
        xxl: 1800,
      },
    },
  });

  const dataSource =
    deputy && deputy.length > 0 && userData.citizenID === deputy[2][0].citizenID
      ? deputy[2].map((deputyUser) => ({
          date: formatLeaveDate(deputy[0].date),
          name: `${deputy[1].prefix} ${deputy[1].name} ${deputy[1].surname}`,
          detail: (
            <Button
            style={{
              borderRadius: 50,
              width: "50%",
              marginLeft: "15px",
              backgroundColor: "#484569",
              color: "#f3f7f8",
            }}
            sx={{
              fontFamily: "Kodchasan",
            }}
              color="primary"
              size="medium"
              variant="contained"
              onClick={() =>
                handleDetail(deputyUser.citizenID, deputy[0].leaveID)
              }
            >
              ดูรายละเอียด
            </Button>
          ),
        }))
      : [];

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container
          fixed
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "grid",
              padding: "1rem",
              // textAlign: "center",
            }}
          >
            <h1 className="topic-statistic">รับมอบงาน</h1>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {formatCurrentDate(Date())}
            </p>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <ConfigProvider
                locale={locale}
                  theme={{
                    token: {
                      borderRadius: "16px",
                      fontFamily: "Kodchasan",
                      colorBgContainer: "#c2dbdf",
                      fontSize: "16px",
                      colorPrimary: "#56373c",
                    },
                  }}
                >
                  <Table dataSource={dataSource}>
                    <Column align="center" title="วันที่แจ้งลา" dataIndex="date" key="date" />
                    <Column align="center"
                      title="ชื่อ-สกุลผู้มอบหมายงาน"
                      dataIndex="name"
                      key="name"
                    />
                    <Column align="center"
                      title="รายละเอียด"
                      dataIndex="detail"
                      key="detail"
                    />
                  </Table>
                </ConfigProvider>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default RepresentativeList;
