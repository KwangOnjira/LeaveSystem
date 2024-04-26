import React, { useEffect, useState } from "react";
import { currentUser } from "../../../function/auth";
import { getMatchStatus, getUserMatch } from "../../../function/superior";
import locale from "antd/locale/th_TH";
import {
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getMatchStatusCancel,
  getUserMatchCancel,
} from "../../../function/cancel";
import { Table, ConfigProvider } from "antd";
const { Column, ColumnGroup } = Table;

const RequestToSuperior = () => {
  const [currentUserData, setCurrentUserData] = useState([]);
  const [userInRequest, setUserInRequest] = useState([]);
  const [matchStatus, setMatchStatus] = useState([]);
  const [userInCancelRequest, setUserInCancelRequest] = useState([]);
  const [matchStatusCancel, setMatchStatusCancel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log("fetchUser.data: ", fetchUser.data);
        setCurrentUserData(fetchUser.data);

        const fetchRequest = await getUserMatch(localStorage.getItem("token"));
        console.log("fetchRequest.data: ", fetchRequest.data);
        setUserInRequest(fetchRequest.data);

        const fetchRequestCancel = await getUserMatchCancel(
          localStorage.getItem("token")
        );
        console.log("fetchRequestCancel.data: ", fetchRequestCancel.data);
        setUserInCancelRequest(fetchRequestCancel.data);

        const fetchStatus = await getMatchStatus(localStorage.getItem("token"));
        console.log("fetchStatus.data: ", fetchStatus.data);
        setMatchStatus(fetchStatus.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      const fetchStatusCancel = await getMatchStatusCancel(
        localStorage.getItem("token")
      );
      console.log("fetchStatusCancel.data: ", fetchStatusCancel.data);
      setMatchStatusCancel(fetchStatusCancel.data);
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

  const handleSubmitToFirst = (citizenID, type, leaveID) => {
    navigate(`/superior/request/${citizenID}/${type}/${leaveID}`);
  };
  const handleSubmitToSecond = (citizenID, type, leaveID) => {
    navigate(`/superior/requestHead/${citizenID}/${type}/${leaveID}`);
  };

  const CheckMatch = (citizenID, type, leaveID) => {
    for (let index = 0; index < matchStatus.length; index++) {
      console.log("index: ", index);
      console.log("matchStatus[index][0]: ", matchStatus[index][0]);
      console.log("matchStatus[index][1]: ", matchStatus[index][1]);

      if (matchStatus[index][0] === leaveID) {
        console.log("------", leaveID, "------");
        if (matchStatus[index][1] === "who_first_supeior") {
          return (
            <td>
              <Button
                style={{
                  borderRadius: 50,
                  marginLeft: "15px",
                  backgroundColor: "#424530",
                  color: "#FFFFE1",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={() => handleSubmitToFirst(citizenID, type, leaveID)}
              >
                {" "}
                ดูรายละเอียด
              </Button>
            </td>
          );
        } else if (matchStatus[index][1] === "who_second_supeior") {
          return (
            <td>
              <Button
                style={{
                  borderRadius: 50,
                  marginLeft: "15px",
                  backgroundColor: "#424530",
                  color: "#FFFFE1",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={() => handleSubmitToSecond(citizenID, type, leaveID)}
              >
                {" "}
                ดูรายละเอียด
              </Button>
            </td>
          );
        }
      }
    }
    return <td></td>;
  };

  const CheckMatchCancel = (citizenID, cancelID) => {
    for (let index = 0; index < matchStatusCancel.length; index++) {
      console.log("index: ", index);
      console.log("matchStatusCancel[index][0]: ", matchStatusCancel[index][0]);
      console.log("matchStatusCancel[index][1]: ", matchStatusCancel[index][1]);

      if (matchStatusCancel[index][0] === cancelID) {
        console.log("------", cancelID, "------");
        if (matchStatusCancel[index][1] === "who_first_supeior") {
          return (
            <td>
              <Button
                style={{
                  borderRadius: 50,
                  marginLeft: "15px",
                  backgroundColor: "#424530",
                  color: "#FFFFE1",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={() =>
                  handleSubmitToFirst(citizenID, "cancel", cancelID)
                }
              >
                {" "}
                ดูรายละเอียด
              </Button>
            </td>
          );
        } else if (matchStatusCancel[index][1] === "who_second_supeior") {
          return (
            <td>
              <Button
                style={{
                  width: "100%",
                  borderRadius: 50,
                  marginLeft: "15px",
                  backgroundColor: "#424530",
                  color: "#FFFFE1",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={() =>
                  handleSubmitToSecond(citizenID, "cancel", cancelID)
                }
              >
                {" "}
                ดูรายละเอียด
              </Button>
            </td>
          );
        }
      }
    }
    return <td></td>;
  };

  let dataSource = [];

  userInRequest.forEach((user) => {
    user.leaves.forEach((leave, index) => {
      const statisticIndex = user.statistics.findIndex(
        (statistic) => statistic.statisticID === leave.statisticID
      );
      let detailButton = null;
      if (matchStatus) {
        detailButton = CheckMatch(user.citizenID, leave.type, leave.leaveID);
      } else if (matchStatusCancel) {
        detailButton = CheckMatchCancel(user.citizenID, leave.cancelID);
      }

      dataSource.push({
        date: formatLeaveDate(leave.date),
        dateleave: `${formatLeaveDate(leave.firstDay)} - ${formatLeaveDate(
          leave.lastDay
        )}`,
        name: `${user.prefix} ${user.name} ${user.surname}`,
        topic: leave.topic,
        detail: detailButton,
      });
    });
  });

  userInCancelRequest.forEach((user) => {
    user.cancel_leaves.forEach((leave, index) => {
      dataSource.push({
        date: formatLeaveDate(leave.date),
        dateleave: `${formatLeaveDate(
          leave.cancelFirstDay
        )} - ${formatLeaveDate(leave.cancelLastDay)}`,
        name: `${user.prefix} ${user.name} ${user.surname}`,
        topic: leave.topic,
        // detail:
      });
    });
  });

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
          <h1 className="topic-statistic">คำร้อง</h1>
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
                colorBgContainer: "#dddfd1",
                fontSize: "16px",
                colorPrimary: "#56373c",
              },
            }}
          >
            <style>
              {`
          .ant-table-thead th {
            font-size: 17px; 
          }
        `}
            </style>
            <Table dataSource={dataSource}>
              <Column
                align="center"
                width="15%"
                title="วันที่แจ้งลา"
                dataIndex="date"
                key="date"
              />
              <Column
                align="center"
                width="20%"
                title="วันที่ขอลา"
                dataIndex="dateleave"
                key="dateleave"
              />
              <Column
                align="center"
                width="20%"
                title="ชื่อ-นามสกุล"
                dataIndex="name"
                key="name"
              />
              <Column
                align="center"
                width="20%"
                title="ประเภทการลา"
                dataIndex="topic"
                key="topic"
              />
              <Column
                align="center"
                width="20%"
                title="ดูรายละเอียด"
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

export default RequestToSuperior;
