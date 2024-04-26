import * as React from "react";
import { useEffect } from "react";
import { currentUser } from "../function/auth";
import { useState } from "react";
import { getFiscalYear } from "../function/admin";
import { getLastStatistic, getStatistic } from "../function/statistic";
import locale from "antd/locale/th_TH";
import {
  deleteRequest,
  getAllLeaveByCitizenID,
  getAllLeaveOfUserByCitizenID,
  getAllLeaveOfUserId,
} from "../function/leave";
import {
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
  Select,
  MenuItem,
  css,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Modal, Table, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
const { Column, ColumnGroup } = Table;
import { ExclamationCircleFilled } from "@ant-design/icons";
import { deleteCancelRequest, updateAllowLeave } from "../function/cancel";

const Home = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [lastStat, setLastStat] = useState(null);
  const [userData, setUserData] = useState();
  const [leaveData, setLeaveData] = useState([]);
  const [signatureUser, setSignatureUser] = useState(null);
  const [fiscalYearData, setFiscalYearData] = useState([]);
  const [useFiscalYearData, setUseFiscalYearData] = useState("");
  document.body.style.backgroundColor = "#F3F3EA";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUser = await currentUser(localStorage.getItem("token"));
        console.log("getUser: ", getUser.data);
        setUserData(getUser.data);

        const fetchFiscalYear = await getFiscalYear(
          localStorage.getItem("token")
        );
        console.log("fetchFiscalYear", fetchFiscalYear.data);
        setFiscalYearData(fetchFiscalYear.data);

        if (useFiscalYearData === "") {
          setUseFiscalYearData(fetchFiscalYear.data[0].fiscal_year);
          console.log(fetchFiscalYear.data[0].fiscal_year);
        }

        const getStat = await getStatistic(localStorage.getItem("token"));
        console.log("getStat: ", getStat.data);
        setData(getStat.data);

        const getLastStat = await getLastStatistic(
          localStorage.getItem("token")
        );
        console.log("getLastStat: ", getLastStat.data);
        setLastStat(getLastStat.data);

        const getLeave = await getAllLeaveOfUserId(
          useFiscalYearData,
          localStorage.getItem("token")
        );
        console.log("getLeave: ", getLeave.data);
        setLeaveData(getLeave.data);
      } catch (error) {
        console.log("Error Fetching statistics data: " + error);
      }
    };
    fetchData();
  }, [useFiscalYearData]);

  const handleDetail = (type, leaveID,fiscal_year) => {
    navigate(`/statistic/detail/${type}/${leaveID}/${fiscal_year}`);
  };

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const handleDelete = async (leaveID) => {
    try {
      // Perform delete operation
      await deleteRequest(leaveID, localStorage.getItem("token"));
      console.log("Delete successful");
      window.location.reload();
    } catch (error) {
      console.log("Error deleting request: ", error);
    }
  };

  const handleDeleteCancel = async (cancelID,leaveID) => {
    try {
      await updateAllowLeave(
        leaveID,
        { cancelOrNot: false },
        localStorage.getItem("token")
      );
      await deleteCancelRequest(cancelID, localStorage.getItem("token"));
      
      console.log("Delete successful");
      window.location.reload();
    } catch (error) {
      console.log("Error deleting request: ", error);
    }
  };

  const showConfirm = (leaveID) => {
    confirm({
      title: "ยืนยันการยกเลิกคำร้อง",
      icon: <ExclamationCircleFilled />,
      content: "กดยืนยันเพื่อยกเลิกคำร้อง",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleDelete(leaveID);
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#c1012d" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };
  const showConfirmCancel = (cancelID,leaveID) => {
    confirm({
      title: "ยืนยันการยกเลิกคำร้อง",
      icon: <ExclamationCircleFilled />,
      content: "กดยืนยันเพื่อยกเลิกคำร้อง",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleDeleteCancel(cancelID,leaveID)
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#c1012d" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };

  let dataSourceOnGoing = [];

  leaveData.forEach((leave, index) => {
    const statIndex = data.findIndex(
      (statistic) => statistic.isStatOfLeaveID === leave.leaveID
    );
    const isMatch = statIndex !== -1;
    let statIndexCancel;
    let isMatchCancel;

    if (leave.cancel_leave) {
      statIndexCancel = data.findIndex(
        (statistic) =>
          statistic.isStatOfCancelID === leave.cancel_leave.cancelID
      );
      isMatchCancel = statIndexCancel !== -1;
    }

    let detailButton = null;
    let deleteButton = null;

    if (leave.status !== "ไม่อนุมัติ" && leave.status !== "เสร็จสิ้น") {
      detailButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "90%",
            borderRadius: 50,
            backgroundColor: "#7d82b8",
            color: "#faf1d6",
          }}
          variant="contained"
          onClick={() => {
            handleDetail(leave.type, leave.leaveID,leave.fiscal_year);
          }}
        >
          ดูรายละเอียด
        </Button>
      );

      if (leave.status === "รอผู้ตรวจสอบ") {
        deleteButton = (
          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "90%",
              borderRadius: 50,
              backgroundColor: "#c1012d",
              color: "#faf1d6",
            }}
            variant="contained"
            onClick={() => {
              showConfirm(leave.leaveID);
            }}
          >
            ยกเลิกคำร้อง
          </Button>
        );
      }
      dataSourceOnGoing.push({
        date: formatLeaveDate(leave.date),
        dateleave: `${formatLeaveDate(leave.firstDay)} - ${formatLeaveDate(
          leave.lastDay
        )}`,
        topic: leave.topic,
        status: leave.status,
        detail: detailButton,
        cancelRequest: deleteButton,
      });
    } else if (
      leave.cancel_leave &&
      leave.cancel_leave.status !== "ไม่อนุมัติ" &&
      leave.cancel_leave.status !== "เสร็จสิ้น"
    ) {
      detailButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "90%",
            borderRadius: 50,
            backgroundColor: "#7d82b8",
            color: "#faf1d6",
          }}
          variant="contained"
          onClick={() => {
            handleDetail("cancel", leave.cancel_leave.cancelID,leave.fiscal_year);
          }}
        >
          ดูรายละเอียด
        </Button>
      );
      if (leave.cancel_leave.status === "รอผู้ตรวจสอบ") {
        deleteButton = (
          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "90%",
              borderRadius: 50,
              backgroundColor: "#c1012d",
              color: "#faf1d6",
            }}
            variant="contained"
            onClick={() => {
              showConfirmCancel(leave.cancel_leave.cancelID,leave.cancel_leave.leaveID);
            }}
          >
            ยกเลิกคำร้อง
          </Button>
        );
      }

      dataSourceOnGoing.push({
        date: formatLeaveDate(leave.cancel_leave.date),
        dateleave: `${formatLeaveDate(
          leave.cancel_leave.cancelFirstDay
        )} - ${formatLeaveDate(leave.cancel_leave.cancelLastDay)}`,
        topic: leave.cancel_leave.topic,
        status: leave.cancel_leave.status,
        detail: detailButton,
        cancelRequest: deleteButton,
      });
    }
  });

  const filteredDataSourceOnGoing = dataSourceOnGoing;

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
            component: "span",
            display: "grid",
            padding: "1rem",
            textAlign: "center",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "16px",
                textAlign: "right",
                fontWeight: "normal",
              }}
            >
              {formatCurrentDate(Date())}
            </p>
            <Card
              sx={{
                borderRadius: "16px",
                border: "1px solid #ccc",
                backgroundColor: "#868f74",
                color: "#f3f7f8",
              }}
            >
              <CardContent>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  สวัสดี, {userData?.prefix} {userData?.name}{" "}
                  {userData?.surname}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "center",
                    fontWeight: "normal",
                  }}
                >
                  สังกัด {userData?.divisionName} {userData?.sub_division}
                </p>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            direction="row"
            container
            spacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            {" "}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <h1
                style={{
                  fontFamily: "Kodchasan",
                  fontSize: "24px",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: "3rem",
                  marginBottom: "-1rem",
                }}
              >
                {" "}
                สถิติการลาปัจจุบันของคุณ
              </h1>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #ccc",
                  margin: "1rem",
                  marginBottom: "3rem",
                  height: "80%",
                  backgroundColor: "#c6d1b3",
                  color: "#273813",
                  alignContent: "center",
                }}
              >
                <CardContent>
                  <h3
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ลาพักผ่อน
                  </h3>
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "center",
                      fontWeight: "normal",
                    }}
                  >
                    วันลาพักผ่อนที่คุณมี {lastStat?.VL_total}วัน
                  </p>
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "center",
                      fontWeight: "normal",
                    }}
                  >
                    คุณเหลือวันลาพักผ่อน {lastStat?.VL_remaining}วัน
                  </p>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #ccc",
                  margin: "1rem",
                  marginBottom: "3rem",
                  height: "80%",
                  alignContent: "center",
                  backgroundColor: "#e1d6c3",
                  color: "#684929",
                }}
              >
                <CardContent>
                  <h3
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ลาป่วย
                  </h3>
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "center",
                      fontWeight: "normal",
                    }}
                  >
                    ลาป่วยไปแล้ว {lastStat?.SL_remaining} วัน <br />
                    (ใน 1 ปีงบประมาณ)
                  </p>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #ccc",
                  margin: "1rem",
                  marginBottom: "3rem",
                  height: "80%",
                  alignContent: "center",
                  backgroundColor: "#e5c1b3",
                  color: "#443826",
                }}
              >
                <CardContent>
                  <h3
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    ลากิจส่วนตัว
                  </h3>
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "center",
                      fontWeight: "normal",
                    }}
                  >
                    ลากิจไปแล้ว {lastStat?.PL_remaining} วัน
                    <br />
                    (ใน 1 ปีงบประมาณ)
                  </p>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <br />

          <style>
            {`
          .ant-table-thead th {
            font-size: 17px; 
          }
        `}
          </style>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ConfigProvider
              locale={locale}
              theme={{
                token: {
                  borderRadius: "16px",
                  fontFamily: "Kodchasan",
                  colorBgContainer: "#dfebeb",
                  fontSize: "16px",
                  colorPrimary: "#495784",
                },
              }}
            >
              {filteredDataSourceOnGoing.length > 0 ? (
                <Table dataSource={dataSourceOnGoing}>
                  <ColumnGroup title="รายการที่กำลังดำเนินการ">
                    <Column
                      align="center"
                      title="วันที่แจ้งลา"
                      dataIndex="date"
                      key="date"
                    />
                    <Column
                      align="center"
                      title="วันที่ลา"
                      dataIndex="dateleave"
                      key="dateleave"
                    />
                    <Column
                      align="center"
                      title="ประเภทการลา"
                      dataIndex="topic"
                      key="topic"
                      filters={[
                        { text: "ลาพักผ่อน", value: "ขอลาพักผ่อน" },
                        { text: "ลาป่วย", value: "ขอลาป่วย" },
                        { text: "ลากิจส่วนตัว", value: "ขอลากิจ" },
                        { text: "ลาคลอด", value: "ขอลาคลอด" },
                        { text: "ลาอุปสมบท", value: "ขอลาอุปสมบท" },
                        {
                          text: "ลาศึกษาต่อ",
                          value:
                            "ขอลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน",
                        },
                        { text: "ยกเลิกวันลา", value: "ขอยกเลิกวันลา" },
                      ]}
                      onFilter={(value, record) => record.topic.includes(value)}
                    />
                    <Column
                      align="center"
                      title="สถานะ"
                      dataIndex="status"
                      key="status"
                    />
                    <Column
                      align="center"
                      title="รายละเอียด"
                      dataIndex="detail"
                      key="detail"
                    />
                    <Column
                      align="center"
                      title="ยกเลิกคำร้อง"
                      dataIndex="cancelRequest"
                      key="cancelRequest"
                    />
                  </ColumnGroup>
                </Table>
              ) : (
                <Table>
                  <ColumnGroup title="รายการที่กำลังดำเนินการ">
                    <Column
                      align="center"
                      title="วันที่แจ้งลา"
                      dataIndex="date"
                      key="date"
                    />
                    <Column
                      align="center"
                      title="วันที่ลา"
                      dataIndex="dateleave"
                      key="dateleave"
                    />
                    <Column
                      align="center"
                      title="ประเภทการลา"
                      dataIndex="topic"
                      key="topic"
                    />
                    <Column
                      align="center"
                      title="สถานะ"
                      dataIndex="status"
                      key="status"
                    />
                    <Column
                      align="center"
                      title="รายละเอียด"
                      dataIndex="detail"
                      key="detail"
                    />
                    <Column
                      align="center"
                      title="ยกเลิกคำร้อง"
                      dataIndex="cancelRequest"
                      key="cancelRequest"
                    />
                  </ColumnGroup>
                </Table>
              )}
            </ConfigProvider>
          </Grid>
        </Box>
      </ThemeProvider>

      <br />
    </>
  );
};

export default Home;
