import React, { useEffect, useState } from "react";
import { currentUser } from "../../../function/auth";
import locale from "antd/locale/th_TH";
import axios from "axios";
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

const RequestFromUser = ({ userId }) => {
  const [currentuserData, setCurrentUserData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [cancelUsersData, setCancelUsersData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log("userData", fetchUser.data);
        setCurrentUserData(fetchUser.data);
        console.log("divisionName: ", fetchUser.data.divisionName);
        if (fetchUser.data.divisionName === "กองช่าง") {
          const usersResponse = await axios.get(
            "http://localhost:5432/sameBothDivAndSubDivForRequest",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);

          const cancelResponse = await axios.get(
            "http://localhost:5432/cancelSameBothDivAndSubDivForRequest",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("cancelResponse: ", cancelResponse.data);
          setCancelUsersData(cancelResponse.data);
        } else if (fetchUser.data.divisionName === "สำนักปลัด อบจ.") {
          const usersResponse = await axios.get(
            "http://localhost:5432/divisionOfficePAOForRequest",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);

          const cancelResponse = await axios.get(
            "http://localhost:5432/cancelDivisionOfficePAOForRequest",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("cancelResponse: ", cancelResponse.data);
          setCancelUsersData(cancelResponse.data);
        } else {
          const usersResponse = await axios.get(
            "http://localhost:5432/sameDivisionForRequest",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("sameDivision");
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);

          const cancelResponse = await axios.get(
            "http://localhost:5432/cancelSameDivisionForRequest",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("cancelResponse: ", cancelResponse.data);
          setCancelUsersData(cancelResponse.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [userId]);
  document.body.style.backgroundColor = "#F3F3EA";
  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const handleDetail = (citizenID, type, leaveID, prevStatisticID) => {
    navigate(
      `/inspector/request/${citizenID}/${type}/${leaveID}/${prevStatisticID}`
    );
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

  let dataSource = [];
  if (usersData.length > 0) {
    console.log("in datasource")

    dataSource = usersData.map((user) =>
      user.leaves.map((leave, index) => {
        const statisticIndex = user.statistics.findIndex(
          (statistic) => statistic.statisticID === leave.statisticID
        );
        console.log(leave.date)
        console.log(user.name)

        let detailButton = null
        detailButton = (<Button
          style={{
            borderRadius: 50,
            width: "80%",
            marginLeft: "15px",
            backgroundColor: "#B6594C",
            color: "#FFFFE1",
          }}
          sx={{
            fontFamily: "Kodchasan",
          }}
          variant="contained"
          onClick={() =>
            handleDetail(
              user.citizenID,
              leave.type,
              leave.leaveID,
              user.statistics[statisticIndex].statisticID
            )
          }
        >
          {" "}
          ตรวจสอบ
        </Button>)
        return {
          date:`${formatLeaveDate(leave.date)}`,
          dateleave:`${formatLeaveDate(leave.firstDay)} - ${formatLeaveDate(leave.lastDay)}`,
          name: `${user.prefix} ${user.name} ${user.surname}`,
          topic: `${leave.topic} ${leave.numDay}วัน`,
          VL_remaining:`${user.statistics[statisticIndex].VL_remaining}`,
          SL_remaining:`${user.statistics[statisticIndex].SL_remaining}`,
          PL_remaining:`${user.statistics[statisticIndex].PL_remaining}`,
          detail:detailButton
        }
      })
    ).flat();
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <Container
          fixed
          sx={{
            position: "relative",
          }}
        > */}
        <Box
          sx={{
            display: "grid",
            padding: "1rem",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <h1 className="topic-statistic">คำร้องแจ้งลา</h1>
          {currentuserData.divisionName === "กองช่าง" ? (
            <h2
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {currentuserData.divisionName} {currentuserData.sub_division}{" "}
            </h2>
          ) : (
            <h2
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {currentuserData.divisionName}
            </h2>
          )}
          <h4
            style={{
              fontFamily: "Kodchasan",
              fontSize: "18px",
              textAlign: "left",
              fontWeight: "normal",
            }}
          >
            {formatCurrentDate(Date())}
          </h4>
          <ConfigProvider
          locale={locale}
            theme={{
              token: {
                borderRadius: "16px",
                fontFamily: "Kodchasan",
                colorBgContainer: "#eddcae",
                fontSize: "16px",
                colorPrimary: "#56373c",
              },
            }}
          >
            <Table dataSource={dataSource}>
              <Column align="center" width="10%" title="วันที่แจ้งลา" dataIndex="date" key="date" />
              <Column align="center" width="20%"
                title="วันที่ขอลา"
                dataIndex="dateleave"
                key="dateleave"
              /> 
              <Column align="center" width="20%" title="ชื่อ-นามสกุล" dataIndex="name" key="name" />
              <Column align="center" width="15%" title="ประเภทการลา" dataIndex="topic" key="topic" />
              <Column align="center" width="5%"
                title="ลาพักผ่อนเหลือ (วัน)"
                dataIndex="VL_remaining"
                key="VL_remaining"
              />
              <Column align="center" width="5%"
                title="ลาป่วยไปแล้ว  (วัน)"
                dataIndex="SL_remaining"
                key="SL_remaining"
              />
              <Column align="center" width="5%"
                title="ลากิจส่วนตัวไปแล้ว  (วัน)"
                dataIndex="PL_remaining"
                key="PL_remaining"
              />
              <Column align="center" width="15%"
                title="ตรวจสอบ"
                dataIndex="detail"
                key="detail"
              />
            </Table>
          </ConfigProvider>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default RequestFromUser;
