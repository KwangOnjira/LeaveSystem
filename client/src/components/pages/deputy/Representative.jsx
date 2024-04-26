import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { currentUser, userById } from "../../../function/auth";
import { getDataLastStatisticByid } from "../../../function/inspector";
import { getLeavebyId, getLeavebyIdForRequest } from "../../../function/leave";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { updateDateDeputy, updateStatusLeave } from "../../../function/deputy";
import { Modal } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const Representative = () => {
  const { confirm } = Modal;
  const { citizenID, leaveID } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    prefix: "",
    name: "",
    surname: "",
    position: "",
    divisionName: "",
  });

  const [leaveData, setLeaveData] = useState([]);
  const [userLeaveData, setUserLeaveData] = useState([]);
  const [statData, setStatData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log("userData", fetchUser.data);
        setUserData(fetchUser.data);

        const fetchleave = await getLeavebyIdForRequest(
          "vacationleave",
          leaveID,
          localStorage.getItem("token")
        );
        console.log("leaveData", fetchleave.data);
        setLeaveData(fetchleave.data);

        const fetchUserLeave = await userById(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("UserLeave", fetchUserLeave.data);
        setUserLeaveData(fetchUserLeave.data);

        const fetchstat = await getDataLastStatisticByid(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("statData", fetchstat.data);
        setStatData(fetchstat.data);
      } catch (error) {
        console.error("Error fetching Data:", error);
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

  const handleConfirm = async (e) => {
    const currentDate = dayjs().toDate();
    try {
      const response = await updateStatusLeave(
        leaveID,
        { status: "รอผู้ตรวจสอบ", date_deputy_confirm: currentDate },
        localStorage.getItem("token")
      );
      const updateDate = await updateDateDeputy(
        leaveID,
        { date_deputy_confirm: currentDate },
        localStorage.getItem("token")
      );

      navigate("/deputy");
    } catch (error) {
      console.error("Error handleConfirm:", error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันการรับมอบหมาย",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleConfirm();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#687a86" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
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

  return (
    <>
      <ThemeProvider theme={theme}>
        <LeftOutlined onClick={() => navigate("/deputy")} />
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
              textAlign: "center",
            }}
          >
            <h2 className="topic-leave">ข้อมูลการลาของผู้มอบหมายงาน</h2>
            {leaveData && leaveData.vacationleave && (
              <React.Fragment>
                <form>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "22px",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {leaveData.topic}
                      </p>

                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        เรียน{" "}
                        <span
                          style={{ display: "inline", fontWeight: "normal" }}
                        >
                          {leaveData.to}
                        </span>
                      </p>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <br />
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      ข้าพเจ้า{" "}
                      {`${userLeaveData.prefix} ${userLeaveData.name} ${userLeaveData.surname}`}
                    </p>

                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      ตำแหน่ง{" "}
                      <span style={{ display: "inline", fontWeight: "normal" }}>
                        {userLeaveData.position}
                      </span>
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      สังกัด{" "}
                      <span style={{ display: "inline", fontWeight: "normal" }}>
                        {userLeaveData.divisionName}
                      </span>
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      มีลาพักผ่อนสะสม {statData.VL_accumulatedDays} วัน
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      มีสิทธิ์ลาพักผ่อนประจำปีอีก {statData.leave_rights} วัน
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      รวมเป็น {statData.VL_total} วัน
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      ตั้งแต่วันที่ {formatLeaveDate(leaveData.firstDay)}{" "}
                      ถึงวันที่ {formatLeaveDate(leaveData.lastDay)} มีกำหนด{" "}
                      {leaveData.numDay} วัน
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      ติดต่อได้ที่ {leaveData.contact}
                    </p>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      ผู้รับมอบปฏิบัติหน้าที่แทน{" "}
                      {leaveData.vacationleave.deputyName.split("(")[0].trim()}{" "}
                      ({leaveData.vacationleave.deputyName.split("(")[1].trim()}
                    </p>
                  </Grid>
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      color="primary"
                      size="medium"
                      variant="contained"
                      onClick={showConfirm}
                      style={{
                        borderRadius: 50,
                        width: "50%",
                        marginLeft: "15px",
                        backgroundColor: "#4a707a",
                        color: "#f3f7f8",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                    >
                      อนุมัติ
                    </Button>
                  </Grid>
                </form>
              </React.Fragment>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Representative;
