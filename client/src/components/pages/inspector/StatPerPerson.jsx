import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import locale from "antd/locale/th_TH";
import { getUsers } from "../../../function/inspector";
// import { Table } from "@mui/joy";
import { getStatById, getStatisticsOfUser } from "../../../function/statistic";
import { LeftOutlined } from "@ant-design/icons";
import {
  getAllLeaveOfUserByCitizenID,
  getLeaveForExport,
  prevLeave,
} from "../../../function/leave";
import {
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import {
  getSignatureFirstSuperior,
  getSignatureInspector,
  getSignatureSecondSuperior,
} from "../../../function/auth";
import PdfGenerator from "../exports/PdfGenerator";
import {
  cancelLeave,
  getCancelLeaveForExport,
  getSignatureInspectorForCancel,
} from "../../../function/cancel";
import { Table, ConfigProvider } from "antd";
const { Column, ColumnGroup } = Table;
import cancelleave from "../exports/format/cancelleave";
import PdfPerPerson from "../exports/PdfPerPerson";

const StatPerPerson = () => {
  const [userData, setUserData] = useState();
  const [statData, setStatData] = useState();
  const [leaveData, setLeaveData] = useState([]);
  const [signatureUser, setSignatureUser] = useState(null);
  const { citizenID, fiscal_year } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await getUsers(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchUser: ", fetchUser);
        setUserData(fetchUser);
        if (fetchUser.signature) {
          setSignatureUser(
            import.meta.env.VITE_APP_API+`/signatures/${fetchUser.signature}`
          );
        }

        const fetchLeave = await getAllLeaveOfUserByCitizenID(
          citizenID,
          fiscal_year,
          localStorage.getItem("token")
        );
        console.log("fetchLeave: ", fetchLeave.data);
        setLeaveData(fetchLeave.data);

        const fetchStat = await getStatisticsOfUser(
          citizenID,
          fiscal_year,
          localStorage.getItem("token")
        );
        console.log("fetchStat: ", fetchStat.data);
        setStatData(fetchStat.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [citizenID, fiscal_year]);

  const generatePdf = async (citizenID, type, leaveID) => {
    const getLeaveData = await prevLeave(
      citizenID,
      type,
      leaveID,
      fiscal_year,
      localStorage.getItem("token")
    );
    console.log("getLeaveData", getLeaveData);

    const PrevStat = await getStatById(
      getLeaveData.data[0].statisticID,
      localStorage.getItem("token")
    );

    const inspectorSignature = await getSignatureInspector(
      leaveID,
      localStorage.getItem("token")
    );
    const secondSignature = await getSignatureSecondSuperior(
      leaveID,
      localStorage.getItem("token")
    );
    let firstSignature;
    if (getLeaveData.data[0].who_first_supeior) {
      const getfirstSignature = await getSignatureFirstSuperior(
        leaveID,
        localStorage.getItem("token")
      );
      firstSignature = import.meta.env.VITE_APP_API+`/signatures/${getfirstSignature.data}`;
    } else {
      firstSignature = null;
    }

    const pdfDataUri = PdfGenerator({
      userData,
      leaveData: getLeaveData.data,
      userSignature: signatureUser,
      prevStat: PrevStat.data,
      inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${inspectorSignature.data}`,
      firstSignature: firstSignature,
      secondSignature: import.meta.env.VITE_APP_API+`/signatures/${secondSignature.data}`,
    });
    console.log("signatureUser: ", signatureUser);
  };

  const generatePdfCancel = async (citizenID, leaveID) => {
    const getCancelData = await cancelLeave(
      citizenID,
      leaveID,
      localStorage.getItem("token")
    );
    console.log("getCancelData.data[0]", getCancelData.data[0]);

    let secondSignature = null;
    let firstSignature = null;
    let prevVacation = null;

    if (getCancelData.data[0]) {
      prevVacation = await prevLeave(
        citizenID,
        "vacationleave",
        getCancelData.data[0].leaveID,
        fiscal_year,
        localStorage.getItem("token")
      );

      secondSignature = await getSignatureSecondSuperior(
        getCancelData.data[0].leaveID,
        localStorage.getItem("token")
      );

      if (getCancelData.data[0].who_first_supeior) {
        const getfirstSignature = await getSignatureFirstSuperior(
          getCancelData.data[0].leaveID,
          localStorage.getItem("token")
        );
        firstSignature = import.meta.env.VITE_APP_API+`/signatures/${getfirstSignature.data}`;
      } else {
        firstSignature = null;
      }
    }

    const pdfDataUri = cancelleave({
      userData,
      leaveData: getCancelData.data,
      prevleave: prevVacation.data,
      userSignature: signatureUser,
      firstSignature: firstSignature,
      secondSignature: import.meta.env.VITE_APP_API+`/signatures/${secondSignature.data}`,
    });
  };

  const generatePdfPerPerson = async (allDataArray, userData) => {
    const pdfData = PdfPerPerson({
      allDataArray,
      userData,
    });
  };

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  let allDataArray = [];

  let array = [];
  let leaveArray = [];
  let statisticArray = [];
  const fetchLeaveData = (statisticID) => {
    const leave = leaveData.find((leave) => leave.leaveID === statisticID);
    return leave;
  };

  const promise = [];

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

  let datasource = [];
  if (statData) {
    datasource = statData
      .sort((a, b) => a.statisticID - b.statisticID)
      .map((statistic, index) => {
        const matchingLeaves = leaveData.find(
          (leave) => leave.leaveID === (statistic.isStatOfLeaveID || "")
        );
        console.log("matchingLeaves", matchingLeaves);

        if (
          statistic.isStatOfLeaveID === null &&
          statistic.isStatOfCancelID === null &&
          statistic.range === 1
        ) {
          array.push([statistic.statisticID, null, null]);
          return {
            leave_rights: statistic.leave_rights,
            VL_accumulatedDays: statistic.VL_accumulatedDays,
            VL_total: statistic.VL_total,
            VL_lastLeave: `${
              statistic.VL_lastLeave !== 0 ? statistic.VL_lastLeave : ""
            }`,
            VL_thisLeave: `${
              statistic.VL_thisLeave !== 0 ? statistic.VL_thisLeave : ""
            }`,
            VL_remaining: `${
              statistic.VL_remaining !== 0 ? statistic.VL_remaining : ""
            }`,
            SL_lastLeave: `${
              statistic.SL_lastLeave !== 0 ? statistic.SL_lastLeave : ""
            }`,
            SL_thisLeave: `${
              statistic.SL_thisLeave !== 0 ? statistic.SL_thisLeave : ""
            }`,
            SL_remaining: `${
              statistic.SL_remaining !== 0 ? statistic.SL_remaining : ""
            }`,
            PL_lastLeave: `${
              statistic.PL_lastLeave !== 0 ? statistic.PL_lastLeave : ""
            }`,
            PL_thisLeave: `${
              statistic.PL_thisLeave !== 0 ? statistic.PL_thisLeave : ""
            }`,
            PL_remaining: `${
              statistic.PL_remaining !== 0 ? statistic.PL_remaining : ""
            }`,
          };
        }

        if (statistic.isStatOfLeaveID && statistic.isStatOfCancelID === null) {
          if (
            matchingLeaves.type === "vacationleave" ||
            matchingLeaves.type === "sickleave" ||
            matchingLeaves.type === "personalleave"
          ) {
            array.push([statistic.statisticID, matchingLeaves.leaveID, null]);
          }
          let reportButton = null;

          if (matchingLeaves.type === "sickleave") {
            reportButton = (
              <Button
                style={{
                  borderRadius: 50,
                  width: "90%",
                  marginLeft: "15px",
                  backgroundColor: "#8497b5",
                  color: "#FFFFE1",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={() => {
                  generatePdf(
                    citizenID,
                    matchingLeaves.type,
                    matchingLeaves.leaveID
                  );
                }}
              >
                พิมพ์ใบลา
              </Button>
            );
            return {
              leaveCount: statistic.leave_count,
              typeleave: matchingLeaves.topic,
              date: `${formatLeaveDate(
                matchingLeaves.firstDay
              )} - ${formatLeaveDate(matchingLeaves.lastDay)}`,
              SL_lastLeave: statistic.SL_lastLeave,
              SL_thisLeave: statistic.SL_thisLeave,
              SL_remaining: statistic.SL_remaining,
              report: reportButton,
            };
          } else if (matchingLeaves.type === "personalleave") {
            reportButton = (
              <Button
              style={{
                borderRadius: 50,
                width: "90%",
                marginLeft: "15px",
                backgroundColor: "#8497b5",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
                variant="contained"
                onClick={() => {
                  generatePdf(
                    citizenID,
                    matchingLeaves.type,
                    matchingLeaves.leaveID
                  );
                }}
              >
                พิมพ์ใบลา
              </Button>
            );
            return {
              leaveCount: statistic.leave_count,
              typeleave: matchingLeaves.topic,
              date: `${formatLeaveDate(
                matchingLeaves.firstDay
              )} - ${formatLeaveDate(matchingLeaves.lastDay)}`,
              PL_lastLeave: statistic.PL_lastLeave,
              PL_thisLeave: statistic.PL_thisLeave,
              PL_remaining: statistic.PL_remaining,
              report: reportButton,
            };
          } else if (matchingLeaves.type === "vacationleave") {
            reportButton = (
              <Button
              style={{
                borderRadius: 50,
                width: "90%",
                marginLeft: "15px",
                backgroundColor: "#8497b5",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
                variant="contained"
                onClick={() => {
                  generatePdf(
                    citizenID,
                    matchingLeaves.type,
                    matchingLeaves.leaveID
                  );
                }}
              >
                พิมพ์ใบลา
              </Button>
            );
            return {
              typeleave: matchingLeaves.topic,
              date: `${formatLeaveDate(
                matchingLeaves.firstDay
              )} - ${formatLeaveDate(matchingLeaves.lastDay)}`,
              VL_lastLeave: statistic.VL_lastLeave,
              VL_thisLeave: statistic.VL_thisLeave,
              VL_remaining: statistic.VL_remaining,
              report: reportButton,
            };
          } else if (matchingLeaves.type === "maternityleave") {
            reportButton = (
              <Button
              style={{
                borderRadius: 50,
                width: "90%",
                marginLeft: "15px",
                backgroundColor: "#8497b5",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
                variant="contained"
                onClick={() => {
                  generatePdf(
                    citizenID,
                    matchingLeaves.type,
                    matchingLeaves.leaveID
                  );
                }}
              >
                พิมพ์ใบลา
              </Button>
            );
            return {
              leaveCount: statistic.leave_count,
              typeleave: matchingLeaves.topic,
              date: `${formatLeaveDate(
                matchingLeaves.firstDay
              )} - ${formatLeaveDate(matchingLeaves.lastDay)}`,
              ML_DayCount: statistic.ML_DayCount,
              report: reportButton,
            };
          } else if (matchingLeaves.type === "ordinationleave") {
            reportButton = (
              <Button
              style={{
                borderRadius: 50,
                width: "90%",
                marginLeft: "15px",
                backgroundColor: "#8497b5",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
                variant="contained"
                onClick={() => {
                  generatePdf(
                    citizenID,
                    matchingLeaves.type,
                    matchingLeaves.leaveID
                  );
                }}
              >
                พิมพ์ใบลา
              </Button>
            );
            return {
              leaveCount: statistic.leave_count,
              typeleave: matchingLeaves.topic,
              date: `${formatLeaveDate(
                matchingLeaves.firstDay
              )} - ${formatLeaveDate(matchingLeaves.lastDay)}`,
              OL_DayCount: statistic.OL_DayCount,
              report: reportButton,
            };
          } else if (matchingLeaves.type === "studyleave") {
            reportButton = (
              <Button
              style={{
                borderRadius: 50,
                width: "90%",
                marginLeft: "15px",
                backgroundColor: "#8497b5",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
                variant="contained"
                onClick={() => {
                  generatePdf(
                    citizenID,
                    matchingLeaves.type,
                    matchingLeaves.leaveID
                  );
                }}
              >
                พิมพ์ใบลา
              </Button>
            );
            return {
              leaveCount: statistic.leave_count,
              typeleave: matchingLeaves.topic,
              date: `${formatLeaveDate(
                matchingLeaves.firstDay
              )} - ${formatLeaveDate(matchingLeaves.lastDay)}`,
              STL_DayCount: statistic.STL_DayCount,
              report: reportButton,
            };
          }
        }

        if (statistic.isStatOfLeaveID && statistic.isStatOfCancelID) {
          array.push([
            statistic.statisticID,
            matchingLeaves.leaveID,
            matchingLeaves?.cancel_leave.cancelID,
          ]);
          let reportButton = null;

          reportButton = (
            <Button
            style={{
              borderRadius: 50,
              width: "90%",
              marginLeft: "15px",
              backgroundColor: "#8497b5",
              color: "#FFFFE1",
            }}
            sx={{
              fontFamily: "Kodchasan",
            }}
              variant="contained"
              onClick={() => {
                generatePdfCancel(
                  citizenID,
                  matchingLeaves.cancel_leave.cancelID
                );
              }}
            >
              พิมพ์ใบลา
            </Button>
          );
          return {
            date: `${formatLeaveDate(
              matchingLeaves?.cancel_leave.cancelFirstDay
            )} - ${formatLeaveDate(
              matchingLeaves?.cancel_leave.cancelLastDay
            )}`,
            typeleave: `${matchingLeaves?.cancel_leave.topic} ${matchingLeaves?.cancel_leave.cancelNumDay}วัน`,
            VL_lastLeave: statistic.VL_lastLeave,
            VL_thisLeave: statistic.VL_thisLeave,
            VL_remaining: statistic.VL_remaining,
            report: reportButton,
          };
        }
      });
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        {/* <Container
          fixed
          sx={{
            position: "relative",
          }}
        > */}
        <LeftOutlined onClick={() => navigate("/inspector")} />
        <Box
          sx={{
            display: "grid",
            padding: "1rem",
            [theme.breakpoints.down("xl")]: {
              // maxHeight: "100vh",
              overflowY: "auto",
            },
          }}
        >
          <h1 className="topic-statistic">
            ประวัติการลา(รายคน) ใน 1 ปีงบประมาณ
          </h1>
          {userData && (
            <>
              <h3
                style={{
                  fontFamily: "Kodchasan",
                  fontSize: "18px",
                  textAlign: "left",
                  fontWeight: "normal",
                }}
              >
                ชื่อ-สกุล: {userData.prefix} {userData.name} {userData.surname}{" "}
              </h3>
              <h3
                style={{
                  fontFamily: "Kodchasan",
                  fontSize: "18px",
                  textAlign: "left",
                  fontWeight: "normal",
                }}
              >
                ตำแหน่ง: {userData.position}{" "}
              </h3>
              <ConfigProvider
                locale={locale}
                theme={{
                  token: {
                    borderRadius: "16px",
                    fontFamily: "Kodchasan",
                    colorBgContainer: "#d8e2dc",
                    fontSize: "16px",
                    colorBgBase: "#b6c4a0",
                    colorPrimary: "#437657",
                  },
                }}
              >
                <Table dataSource={datasource}>
                  <Column align="center"
                  width="5%"
                    title="จำนวนครั้งที่ลา"
                    dataIndex="leaveCount"
                    key="leaveCount"
                  />
                  <Column align="center" width="20%" title="วันที่แจ้งลา" dataIndex="date" key="date" />
                  <Column align="center"
                  width="20%"
                    title="ประเภทการลา"
                    dataIndex="typeleave"
                    key="typeleave"
                  />
                  <Column align="center"
                  width="5%"
                    title="วันลาพักผ่อนสะสม"
                    dataIndex="VL_accumulatedDays"
                    key="VL_accumulatedDays"
                  />
                  <Column align="center"
                  width="5%"
                    title="สิทธิวันลาพักผ่อน"
                    dataIndex="leave_rights"
                    key="leave_rights"
                  />
                  <Column align="center"
                  width="5%"
                    title="รวมมีวันลาพักผ่อน"
                    dataIndex="VL_total"
                    key="VL_total"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาพักผ่อนมาแล้ว"
                    dataIndex="VL_lastLeave"
                    key="VL_lastLeave"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาพักผ่อนครั้งนี้"
                    dataIndex="VL_thisLeave"
                    key="VL_thisLeave"
                  />
                  <Column align="center"
                  width="5%"
                    title="คงเหลือวันลาพักผ่อน"
                    dataIndex="VL_remaining"
                    key="VL_remaining"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาป่วยมาแล้ว"
                    dataIndex="SL_lastLeave"
                    key="SL_lastLeave"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาป่วยครั้งนี้"
                    dataIndex="SL_thisLeave"
                    key="SL_thisLeave"
                  />
                  <Column align="center"
                  width="5%"
                    title="คงเหลือวันลาป่วย"
                    dataIndex="SL_remaining"
                    key="SL_remaining"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลากิจมาแล้ว"
                    dataIndex="PL_lastLeave"
                    key="PL_lastLeave"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลากิจครั้งนี้"
                    dataIndex="PL_thisLeave"
                    key="PL_thisLeave"
                  />
                  <Column align="center"
                  width="5%"
                    title="คงเหลือวันลากิจ"
                    dataIndex="PL_remaining"
                    key="PL_remaining"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาคลอด"
                    dataIndex="ML_DayCount"
                    key="ML_DayCount"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาอุปสมบท"
                    dataIndex="OL_DayCount"
                    key="OL_DayCount"
                  />
                  <Column align="center"
                  width="5%"
                    title="ลาไปศึกษาต่อ"
                    dataIndex="STL_DayCount"
                    key="STL_DayCount"
                  />
                  <Column align="center" width="15%" title="พิมพ์ใบลา" dataIndex="report" key="report" />
                </Table>
              </ConfigProvider>
            </>
          )}
        </Box>
      </ThemeProvider>

      {userData && (
        <>
          {console.log("array: ", array)}
          {array &&
            array.map((item, index) => {
              if (item[1] === null && item[2] === null) {
                promise.push(
                  getStatById(item[0], localStorage.getItem("token"))
                    .then((thisstatData) => {
                      console.log("thisstatData.data: ", thisstatData.data);
                      allDataArray.push([null, thisstatData.data]); // Assuming no cancelData when both item[1] and item[2] are null
                    })
                    .catch((error) => {
                      console.error("Error fetching data:", error);
                    })
                );
              } else if (item[1] != null && item[2] === null) {
                promise.push(
                  Promise.all([
                    getLeaveForExport(item[1], localStorage.getItem("token")),
                    getStatById(item[0], localStorage.getItem("token")),
                    getSignatureInspector(
                      item[1],
                      localStorage.getItem("token")
                    ),
                  ])
                    .then(([leaveData, thisstatData, signatureInspector]) => {
                      console.log("leaveData.data: ", leaveData.data);
                      console.log("thisstatData.data: ", thisstatData.data);
                      console.log(
                        "signatureInspector: ",
                        signatureInspector.data
                      );
                      allDataArray.push([
                        leaveData.data,
                        thisstatData.data,
                        signatureInspector.data,
                      ]);
                    })
                    .catch((error) => {
                      console.error("Error fetching data:", error);
                    })
                );
              } else if (item[2] != null) {
                promise.push(
                  Promise.all([
                    getCancelLeaveForExport(
                      item[2],
                      localStorage.getItem("token")
                    ),
                    getStatById(item[0], localStorage.getItem("token")),
                    getSignatureInspectorForCancel(
                      item[2],
                      localStorage.getItem("token")
                    ),
                  ])
                    .then(([cancelData, thisstatData, signatureInspector]) => {
                      console.log("cancelData.data: ", cancelData.data);
                      console.log("thisstatData.data: ", thisstatData.data);
                      console.log(
                        "signatureInspector.data: ",
                        signatureInspector.data
                      );
                      allDataArray.push([
                        cancelData.data,
                        thisstatData.data,
                        signatureInspector.data,
                      ]);
                    })
                    .catch((error) => {
                      console.error("Error fetching data:", error);
                    })
                );
              }

              Promise.all(promise)
                .then(() => {
                  console.log("All data fetched:", allDataArray);
                  // Sorting by statisticID
                  allDataArray.sort((a, b) => {
                    if (a[1] && b[1]) {
                      return a[1].statisticID - b[1].statisticID;
                    } else {
                      return 0; // Handle null values
                    }
                  });
                  console.log("Sorted data:", allDataArray);
                  // setArrayStatistic(allDataArray)
                })
                .catch((error) => {
                  console.error("Error fetching data:", error);
                });
            })}

          {console.log("leaveArray", leaveArray)}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <br />
            <Button
              style={{
                borderRadius: 50,
                marginLeft: "15px",
                backgroundColor: "#5d7b6f",
                color: "#f3f3ea",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
              variant="contained"
              onClick={() => {
                generatePdfPerPerson(allDataArray, userData);
              }}
            >
              พิมพ์ทะเบียนคุมวันลา
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StatPerPerson;
