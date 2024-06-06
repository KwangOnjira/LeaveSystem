import React, { useState, useEffect } from "react";
import { getStatById, getStatistic } from "../../../function/statistic";
import locale from "antd/locale/th_TH";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { Table, ConfigProvider,Modal } from "antd";
const { Column, ColumnGroup } = Table;
import { useNavigate } from "react-router-dom";
import { deleteRequest, getAllLeaveOfUserId, getLeavebyId } from "../../../function/leave";
import {
  currentUser,
  getSignatureFirstSuperior,
  getSignatureInspector,
  getSignatureSecondSuperior,
} from "../../../function/auth";
import PdfGenerator from "../exports/PdfGenerator";
import { cancelLeave, deleteCancelRequest, updateAllowLeave } from "../../../function/cancel";
import cancelleave from "../exports/format/cancelleave";
import { getFiscalYear } from "../../../function/admin";

const Statistics = () => {
  const { confirm } = Modal;
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState();
  const [leaveData, setLeaveData] = useState([]);
  const [signatureUser, setSignatureUser] = useState(null);
  const [fiscalYearData, setFiscalYearData] = useState([]);
  const [useFiscalYearData, setUseFiscalYearData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUser = await currentUser(localStorage.getItem("token"));
        console.log("getUser: ", getUser.data);
        setUserData(getUser.data);
        if (getUser.data.signature) {
          setSignatureUser(
            import.meta.env.VITE_APP_API+`/signatures/${getUser.data.signature}`
          );
        }

        const fetchFiscalYear = await getFiscalYear(
          localStorage.getItem("token")
        );
        console.log("fetchFiscalYear", fetchFiscalYear.data);
        setFiscalYearData(fetchFiscalYear.data);

        if (useFiscalYearData === "") {
          setUseFiscalYearData(fetchFiscalYear.data[0].fiscal_year);
        }

        const getStat = await getStatistic(localStorage.getItem("token"));
        console.log("getStat: ", getStat.data);
        setData(getStat.data);

        const getLeave = await getAllLeaveOfUserId(
          useFiscalYearData,
          localStorage.getItem("token")
        );
        console.log("getLeave: ", getLeave.data);
        setLeaveData(getLeave.data);
      } catch (err) {
        console.log("Error Fetching statistics data: " + err);
      }
    };
    fetchData();
  }, [useFiscalYearData]);

  const handleDetail = (type, leaveID,fiscal_year) => {
    navigate(`/statistic/detail/${type}/${leaveID}/${fiscal_year}`);
  };

  const handleCancel = (leaveID) => {
    navigate(`/cancelVacation/${leaveID}`);
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

  const generatePdf = async (type, leaveID,fiscal_year) => {
    const getLeaveData = await getLeavebyId(
      type,
      leaveID,
      fiscal_year,
      localStorage.getItem("token")
    );

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
    console.log("pdfDataUri: ", pdfDataUri);
  };

  const generatePdfCancel = async (leaveID,fiscal_year) => {
    const getCancelData = await cancelLeave(
      userData.citizenID,
      leaveID,
      localStorage.getItem("token")
    );
    console.log(getCancelData.data[0]);

    let secondSignature = null;
    let firstSignature = null;
    let prevVacation = null;

    if (getCancelData.data[0]) {
      prevVacation = await getLeavebyId(
        "vacationleave",
        getCancelData.data[0].leaveID,
        fiscal_year,
        localStorage.getItem("token")
      );

      console.log("prevVacation: ", prevVacation.data);

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

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
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
  let dataSourceOnGoing = [];
  let dataSourceIncomplete = [];

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
              showConfirm(leave.leaveID)
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
              showConfirmCancel(leave.cancel_leave.cancelID)
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


    if (leave.status === "ไม่อนุมัติ") {
      detailButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "90%",
            borderRadius: 50,
            backgroundColor: "#695356",
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

      dataSourceIncomplete.push({
        date: formatLeaveDate(leave.date),
        dateleave: `${formatLeaveDate(leave.firstDay)} - ${formatLeaveDate(
          leave.lastDay
        )}`,
        topic: leave.topic,
        status: leave.status,
        detail: detailButton,
      });
    } else if (
      leave.cancel_leave &&
      leave.cancel_leave.status === "ไม่อนุมัติ"
    ) {
      detailButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "90%",
            borderRadius: 50,
            backgroundColor: "#695356",
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
      dataSourceIncomplete.push({
        date: formatLeaveDate(leave.cancel_leave.date),
        dateleave: `${formatLeaveDate(
          leave.cancel_leave.cancelFirstDay
        )} - ${formatLeaveDate(leave.cancel_leave.cancelLastDay)}`,
        topic: leave.cancel_leave.topic,
        status: leave.cancel_leave.status,
        detail: detailButton,
      });
    }
  });

  const filteredDataSourceOnGoing = dataSourceOnGoing;

  const filterdataSourceIncomplete = dataSourceIncomplete;

  let dataSourceComplete = [];
  data.forEach((statistic, index) => {
    const leave = leaveData.find(
      (leave) => leave.leaveID === statistic.isStatOfLeaveID
    );
    if (statistic.isStatOfLeaveID === null) {
      // console.log("empty")
      return null;
    }

    if (!leave) {
      return null;
    }

    let detailButton = null;
    let cancelButton = null;
    let exportButton = null;

    if (statistic.isStatOfLeaveID && statistic.isStatOfCancelID === null) {
      detailButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "100%",
            borderRadius: 50,
            backgroundColor: "#c17466",
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
      if (leave.cancelOrNot == false && leave.topic === "ขอลาพักผ่อน") {
        cancelButton = (
          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "100%",
              borderRadius: 50,
              backgroundColor: "#ca012d",
              color: "#faf1d6",
            }}
            variant="contained"
            onClick={() => {
              handleCancel(leave.leaveID);
            }}
          >
            ยกเลิก
          </Button>
        );
      }
      exportButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "100%",
            borderRadius: 50,
            backgroundColor: "#4a707a",
            color: "#faf1d6",
          }}
          variant="contained"
          onClick={() => {
            generatePdf(leave.type, leave.leaveID,leave.fiscal_year);
          }}
        >
          พิมพ์เอกสาร
        </Button>
      );
      dataSourceComplete.push({
        date: formatLeaveDate(leave.date),
        dateleave: `${formatLeaveDate(leave.firstDay)} - ${formatLeaveDate(
          leave.lastDay
        )}`,
        topic: leave.topic,
        status: leave.status,
        VL_remaining: statistic.VL_remaining,
        SL_remaining: statistic.SL_remaining,
        PL_remaining: statistic.PL_remaining,
        detail: detailButton,
        cancel: cancelButton,
        report: exportButton,
      });
    }

    if (statistic.isStatOfLeaveID && statistic.isStatOfCancelID) {
      let detailButton = null;
      let exportButton = null;
      detailButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "100%",
            borderRadius: 50,
            backgroundColor: "#c17466",
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
      exportButton = (
        <Button
          sx={{
            fontFamily: "Kodchasan",
            width: "100%",
            borderRadius: 50,
            backgroundColor: "#4a707a",
            color: "#faf1d6",
          }}
          variant="contained"
          onClick={() => {
            generatePdfCancel(leave.cancel_leave.cancelID,leave.fiscal_year);
          }}
        >
          พิมพ์เอกสาร
        </Button>
      );
      dataSourceComplete.push({
        date: formatLeaveDate(leave.cancel_leave.date),
        dateleave: `${formatLeaveDate(
          leave.cancel_leave.cancelFirstDay
        )} - ${formatLeaveDate(leave.cancel_leave.cancelLastDay)}`,
        topic: `${leave.cancel_leave.topic}
        ${leave.cancel_leave.cancelNumDay}วัน`,
        status: leave.cancel_leave.status,
        VL_remaining: statistic.VL_remaining,
        SL_remaining: statistic.SL_remaining,
        PL_remaining: statistic.PL_remaining,
        detail: detailButton,
        report: exportButton,
      });
    }
  });

  const filterdataSourceComplete = dataSourceComplete;

  const parseDate = (dateString) => {
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const parts = dateString.split(" ");
    const day = parseInt(parts[0]);
    const monthIndex = thaiMonths.indexOf(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, monthIndex, day);
  };

  return (
    <div className="profile-container">
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
            [theme.breakpoints.down("xl")]: {
              // maxHeight: "100vh",
              overflowY: "auto",
            },
          }}
        >
          <h1 className="topic-statistic">ประวัติการแจ้งลา</h1>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <style>
              {`
          .ant-table-thead th {
            font-size: 18px; 
          }
        `}
            </style>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {fiscalYearData && fiscalYearData.length > 0 && (
                <>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "left",
                      fontWeight: "normal",
                    }}
                  >
                    ปีงบประมาณ{" "}
                  </label>
                  <Select
                    sx={{
                      width: "20%",
                      margin: "0.5rem",
                      fontFamily: "Kodchasan",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                    defaultValue={fiscalYearData[0].fiscal_year}
                    value={useFiscalYearData}
                    onChange={(e) => {
                      e.preventDefault(),
                        setUseFiscalYearData(e.target.value),
                        getAllLeaveOfUserId(
                          e.target.value,
                          localStorage.getItem("token")
                        );
                    }}
                  >
                    {fiscalYearData.map((year) => (
                      <MenuItem
                        sx={{
                          fontFamily: "Kodchasan",
                        }}
                        key={year.fiscal_year}
                        value={year.fiscal_year}
                      >
                        ปี{year.fiscal_year}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
              <p
                style={{
                  fontFamily: "Kodchasan",
                  fontSize: "18px",
                  textAlign: "left",
                  fontWeight: "normal",
                }}
              >
                ชื่อผู้ใช้งาน: {userData?.prefix} {userData?.name}{" "}
                {userData?.surname}{" "}
              </p>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {userData ? (
                <>
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
                      <>
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
                              onFilter={(value, record) =>
                                record.topic.includes(value)
                              }
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
                      </>
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

                  <br />
                  <ConfigProvider
                    locale={locale}
                    theme={{
                      token: {
                        borderRadius: "16px",
                        fontFamily: "Kodchasan",
                        colorBgContainer: "#eddcae",
                        fontSize: "16px",
                        colorPrimary: "#c18c5d",
                      },
                    }}
                  >
                    {filterdataSourceComplete.length > 0 ? (
                      <Table dataSource={dataSourceComplete}>
                        <ColumnGroup title="รายการที่ดำเนินการเสร็จสิ้น">
                          <Column
                            align="center"
                            width="10%"
                            title="วันที่แจ้งลา"
                            dataIndex="date"
                            key="date"
                            defaultSortOrder="descend"
                            sorter={(a, b) => {
                              const dateA = parseDate(a.date);
                              const dateB = parseDate(b.date);
                              return dateA - dateB;
                            }}
                          />
                          <Column
                            align="center"
                            width="15%"
                            title="วันที่ลา"
                            dataIndex="dateleave"
                            key="dateleave"
                          />
                          <Column
                            align="center"
                            width="13%"
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
                            onFilter={(value, record) =>
                              record.topic.includes(value)
                            }
                          />
                          <Column
                            align="center"
                            width="5%"
                            title="สถานะ"
                            dataIndex="status"
                            key="status"
                          />
                          <Column
                            align="center"
                            width="10%"
                            title="ลาพักผ่อนเหลือ"
                            dataIndex="VL_remaining"
                            key="VL_remaining"
                          />
                          <Column
                            align="center"
                            width="10%"
                            title="ลาป่วยไปแล้ว"
                            dataIndex="SL_remaining"
                            key="SL_remaining"
                          />
                          <Column
                            align="center"
                            width="10%"
                            title="ลากิจส่วนตัวไปแล้ว"
                            dataIndex="PL_remaining"
                            key="PL_remaining"
                          />
                          <Column
                            align="center"
                            width="15%"
                            title="รายละเอียด"
                            dataIndex="detail"
                            key="detail"
                          />
                          <Column
                            align="center"
                            width="15%"
                            title="พิมพ์เอกสาร"
                            dataIndex="report"
                            key="report"
                          />
                          <Column
                            align="center"
                            width="15%"
                            title="ยกเลิกการลาพักผ่อน"
                            dataIndex="cancel"
                            key="cancel"
                          />
                        </ColumnGroup>
                      </Table>
                    ) : (
                      <Table>
                        <ColumnGroup title="รายการที่ดำเนินการเสร็จสิ้น">
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
                            title="ลาพักผ่อนเหลือ"
                            dataIndex="VL_remaining"
                            key="VL_remaining"
                          />
                          <Column
                            align="center"
                            title="ลาป่วยไปแล้ว"
                            dataIndex="SL_remaining"
                            key="SL_remaining"
                          />
                          <Column
                            align="center"
                            title="ลากิจส่วนตัวไปแล้ว"
                            dataIndex="PL_remaining"
                            key="PL_remaining"
                          />
                          <Column
                            align="center"
                            title="รายละเอียด"
                            dataIndex="detail"
                            key="detail"
                          />
                          <Column
                            align="center"
                            title="พิมพ์เอกสาร"
                            dataIndex="report"
                            key="report"
                          />
                          <Column
                            align="center"
                            title="ยกเลิกการลาพักผ่อน"
                            dataIndex="cancel"
                            key="cancel"
                          />
                        </ColumnGroup>
                      </Table>
                    )}
                  </ConfigProvider>
                  <br />

                  <ConfigProvider
                    locale={locale}
                    theme={{
                      token: {
                        borderRadius: "16px",
                        fontFamily: "Kodchasan",
                        colorBgContainer: "#f3d7d4",
                        fontSize: "16px",
                        colorPrimary: "#c56869",
                      },
                    }}
                  >
                    {filterdataSourceIncomplete.length > 0 ? (
                      <Table dataSource={dataSourceIncomplete}>
                        <ColumnGroup title="รายการที่ดำเนินการไม่สำเร็จ">
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
                            onFilter={(value, record) =>
                              record.topic.includes(value)
                            }
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
                        </ColumnGroup>
                      </Table>
                    ) : (
                      <Table>
                        <ColumnGroup title="รายการที่ดำเนินการไม่สำเร็จ">
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
                        </ColumnGroup>
                      </Table>
                    )}
                  </ConfigProvider>
                </>
              ) : (
                <p>Loading User data...</p>
              )}
            </Grid>
          </Grid>
        </Box>
        {/* </Container> */}
      </ThemeProvider>
    </div>
  );
};

export default Statistics;
