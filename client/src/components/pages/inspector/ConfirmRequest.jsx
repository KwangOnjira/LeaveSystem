import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { currentUser, userById } from "../../../function/auth";
import {
  dowloadFiles,
  getLeavebyIdForRequest,
  prevLeave,
} from "../../../function/leave";
import { createStat, getStatById } from "../../../function/statistic";
import { ExclamationCircleFilled, DownloadOutlined } from "@ant-design/icons";
import locale from "antd/locale/th_TH";
import {
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  // Select,
  // MenuItem,
  Typography,
} from "@mui/material";
import { Select } from "antd";
import {
  createStatByid,
  getDataLastStatisticByid,
  updateLeaveCount,
  updateLeaveStatus,
} from "../../../function/inspector";
import { ConfigProvider, Modal } from "antd";
import {
  getAllFirstSuperior,
  getAllHightSecondSuperior,
  getAllSecondSuperiorInDivision,
  getFirstSuperior,
  getSomeSecondSuperior,
  getSuperior,
  getUserFromOnlyPosition,
  getUserFromPosition,
} from "../../../function/superior";
import { cancelLeave, updateCancelLeave } from "../../../function/cancel";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";

const ConfirmRequest = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const { citizenID, type, leaveID, prevStatisticID } = useParams();
  const [inspectorData, setInspectorData] = useState({
    prefix: "",
    name: "",
    surname: "",
    position: "",
  });
  const [userData, setUserData] = useState({
    prefix: "",
    name: "",
    surname: "",
    position: "",
    divisionName: "",
    position_first_supeior: "",
    position_second_supeior: "",
  });
  const [hightSuperior, setHightSuperior] = useState([]);
  const [defaultFirstSuperior, setDefaultFirstSuperior] = useState();
  const [defaultSecondSuperior, setDefaultSecondSuperior] = useState();
  const [firstSuperior, setFirstSuperior] = useState([]);
  const [secondSuperior, setSecondSuperior] = useState([]);
  const [fsSuperior, setFSSuperior] = useState([]);
  const [firstSelectedSuperior, setfirstSelectedSuperior] = useState("");
  const [secondSelectedSuperior, setsecondSelectedSuperior] = useState("");
  const [statData, setStatData] = useState({
    isStatOfLeaveID: "",
    leave_rights: "",
    VL_accumulatedDays: "",
    VL_total: "",
    VL_lastLeave: "",
    VL_thisLeave: "",
    currentUseVL: "",
    VL_remaining: "",
    leave_count: "",
    SL_lastLeave: "",
    SL_thisLeave: "",
    SL_remaining: "",
    PL_lastLeave: "",
    PL_thisLeave: "",
    PL_remaining: "",
    ML_lastLeave: "",
    ML_thisLeave: "",
    ML_DayCount: "",
    OL_DayCount: "",
    STL_DayCount: "",
    total_leaveDay: "",
  });
  const [lastStatData, setLastStatData] = useState({
    isStatOfLeaveID: "",
    leave_rights: "",
    VL_accumulatedDays: "",
    VL_total: "",
    VL_lastLeave: "",
    VL_thisLeave: "",
    currentUseVL: "",
    VL_remaining: "",
    leave_count: "",
    SL_lastLeave: "",
    SL_thisLeave: "",
    SL_remaining: "",
    PL_lastLeave: "",
    PL_thisLeave: "",
    PL_remaining: "",
    ML_lastLeave: "",
    ML_thisLeave: "",
    ML_DayCount: "",
    OL_DayCount: "",
    STL_DayCount: "",
    total_leaveDay: "",
  });
  const [leaveData, setLeaveData] = useState([]);
  const [prevLeaveData, setPrevLeaveData] = useState([]);
  const [getSuperior, setGetSuperior] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchInspector = await currentUser(localStorage.getItem("token"));
        console.log("fetchInspector:", fetchInspector.data);
        setInspectorData(fetchInspector.data);

        const fetchUser = await userById(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchUser: ", fetchUser.data);
        setUserData(fetchUser.data);
        
        const fetchStat = await getStatById(
          prevStatisticID,
          localStorage.getItem("token")
        );
        console.log("fetchStat: ", fetchStat.data);
        setStatData(fetchStat.data);

        if (type != "cancel") {
          console.log("type: Not cancel");
          const fetchLeave = await prevLeave(
            citizenID,
            type,
            leaveID,
            fetchStat.data.fiscal_year,
            localStorage.getItem("token")
          );
          console.log("fetchLeave: ", fetchLeave.data);
          setLeaveData(fetchLeave.data);
        } else if (type === "cancel") {
          console.log("type: cancel");
          const fetchLeave = await cancelLeave(
            citizenID,
            leaveID,
            localStorage.getItem("token")
          );
          console.log("fetchLeave: ", fetchLeave.data);
          console.log("fetchLeave cancelID: ", fetchLeave.data[0].cancelID);
          setLeaveData(fetchLeave.data);

          console.log("type: Not cancel");

          const fetchPrevLeave = await prevLeave(
            citizenID,
            "vacationleave",
            fetchLeave.data[0].leaveID,
            fetchLeave.data[0].fiscal_year,
            localStorage.getItem("token")
          );
          console.log("fetchPrevLeave: ", fetchPrevLeave.data);
          setPrevLeaveData(fetchPrevLeave.data);
        }

        // const fetchCurrentStat = await getStatById(
        //   statisticID,
        //   localStorage.getItem("token")
        // );
        // console.log("fetchCurrentStat: ", fetchCurrentStat.data);
        // setCurrentStatData(fetchCurrentStat.data);

        const getSuperior = await axios.get(
          import.meta.env.VITE_APP_API+"/getSuperior"
        );
        console.log("getAllSuperior", getSuperior.data);
        setGetSuperior(getSuperior.data);

        const fetchLastStat = await getDataLastStatisticByid(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchLastStat :", fetchLastStat.data);
        setLastStatData(fetchLastStat.data);

        const fetchSuperior = await getAllHightSecondSuperior(
          localStorage.getItem("token")
        );
        console.log("fetchSuperior :", fetchSuperior.data);
        setHightSuperior(fetchSuperior.data);

        const fetchFirstSuperior = await getFirstSuperior(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchFirstSuperior :", fetchFirstSuperior.data);
        setFirstSuperior(fetchFirstSuperior.data);

        const fetchSomeSecondSuperior = await getAllSecondSuperiorInDivision(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchSomeSecondSuperior :", fetchSomeSecondSuperior.data);
        setSecondSuperior(fetchSomeSecondSuperior.data);

        const fetchSomeFirstSecondSuperior = await getAllFirstSuperior(
          localStorage.getItem("token")
        );
        console.log(
          "fetchSomeFirstSecondSuperior :",
          fetchSomeFirstSecondSuperior.data
        );
        setFSSuperior(fetchSomeFirstSecondSuperior.data);

        const fetchSecondUserByPosition = await getUserFromOnlyPosition(
          userData.position_second_supeior
        );
        if (fetchSecondUserByPosition.data) {
          setDefaultSecondSuperior(fetchSecondUserByPosition.data);
          setsecondSelectedSuperior(
            `${fetchSecondUserByPosition.data.prefix} ${fetchSecondUserByPosition.data.name} ${fetchSecondUserByPosition.data.surname} (${fetchSecondUserByPosition.data.position}) (${fetchSecondUserByPosition.data.citizenID})`
          );
          console.log(
            "fetchSecondUserByPosition.data: ",
            fetchSecondUserByPosition.data
          );
        } else {
          console.error("Error: fetchSecondUserByPosition data is undefined");
        }

        const fetchFirstUserByPosition = await getUserFromPosition(
          userData.position_first_supeior,
          userData.divisionName
        );
        if (fetchFirstUserByPosition.data) {
          setDefaultFirstSuperior(fetchFirstUserByPosition.data);
          setfirstSelectedSuperior(
            `${fetchFirstUserByPosition.data.prefix} ${fetchFirstUserByPosition.data.name} ${fetchFirstUserByPosition.data.surname} (${fetchFirstUserByPosition.data.position}) (${fetchFirstUserByPosition.data.citizenID})`
          );
          console.log(
            "fetchFirstUserByPosition.data: ",
            fetchFirstUserByPosition.data
          );
        } else {
          console.log("fetchFirstUserByPosition data is undefined");
          return null;
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [
    citizenID,
    type,
    leaveID,
    leaveData.leaveID,
    userData.position_first_supeior,
    userData.position_second_supeior,
  ]);

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const downloadFile = async (e) => {
    e.preventDefault();
    try {
      const response = await dowloadFiles(
        leaveData[0].sickleave.files,
        localStorage.getItem("token")
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "medical_files.zip");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันการตรวจสอบ",
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
        style: { color: "#edeef3", backgroundColor: "#B6594C" },
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

  const rendertype = () => {
    switch (leaveData[0].type) {
      case "sickleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {" "}
              เนื่องจาก {leaveData[0].sickleave.reason}{" "}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay}วัน
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ติดต่อได้ที่ {leaveData[0].contact}
            </p>
            {leaveData[0].sickleave.files && (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ดาวน์โหลดใบรับรองแพทย์
                  <Button
                    style={{
                      borderRadius: 50,
                      marginLeft: "15px",
                      backgroundColor: "#684929",
                      color: "#F4ECDC",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                    onClick={downloadFile}
                  >
                    <DownloadOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </p>
              </>
            )}
            {leaveData.length > 1 ? (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  ลาป่วยครั้งสุดท้าย ตั้งแต่วันที่
                  {formatLeaveDate(leaveData[1].firstDay)} ถึงวันที่{" "}
                  {formatLeaveDate(leaveData[1].lastDay)} มีกำหนด{" "}
                  {leaveData[1].numDay}วัน
                </p>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ลาป่วยครั้งสุดท้าย ตั้งแต่วันที่ - ถึงวันที่ - มีกำหนด - วัน
                </p>
              </>
            )}
            <br />
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาป่วยมาแล้ว: {statData.SL_remaining} ทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาป่วยครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.SL_remaining + leaveData[0].numDay} วันทำการ
            </p>
          </>
        );
      case "personalleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {" "}
              เนื่องจาก {leaveData[0].personalleave.reason}{" "}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay}วัน
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ติดต่อได้ที่ {leaveData[0].contact}
            </p>
            {leaveData.length > 1 ? (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  ลากิจครั้งสุดท้าย ตั้งแต่วันที่
                  {formatLeaveDate(leaveData[1].firstDay)} ถึงวันที่{" "}
                  {formatLeaveDate(leaveData[1].lastDay)} มีกำหนด{" "}
                  {leaveData[1].numDay}วัน
                </p>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ลากิจครั้งสุดท้าย ตั้งแต่วันที่ - ถึงวันที่ - มีกำหนด - วัน
                </p>
              </>
            )}
            <br />
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลากิจส่วนตัวมาแล้ว: {statData.PL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลากิจส่วนตัวครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.PL_remaining + leaveData[0].numDay} วันทำการ
            </p>
          </>
        );
      case "vacationleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay}วัน
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ติดต่อได้ที่ {leaveData[0].contact}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              มีวันลาพักผ่อนสะสม {statData.VL_accumulatedDays} วัน
              มีสิทธิ์ลาพักผ่อนประจำปีอีก {statData.leave_rights} วัน รวมเป็น{" "}
              {statData.VL_total} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ผู้ปฏิบัติหน้าที่แทน{" "}
              {leaveData[0].vacationleave.deputyName.split("(")[0].trim()} (
              {leaveData[0].vacationleave.deputyName.split("(")[1].trim()}
            </p>
            <br />
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลามาแล้ว: {statData.VL_total - statData.VL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              รวมเป็น:{" "}
              {statData.VL_total - statData.VL_remaining + leaveData[0].numDay}{" "}
              วันทำการ
            </p>
          </>
        );
      case "maternityleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay}วัน
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ติดต่อได้ที่ {leaveData[0].contact}
            </p>
            {leaveData.length > 1 ? (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  ลาคลอดครั้งสุดท้าย ตั้งแต่วันที่
                  {new Date(leaveData[1].firstDay).toLocaleDateString()}{" "}
                  ถึงวันที่{" "}
                  {new Date(leaveData[1].lastDay).toLocaleDateString()} มีกำหนด{" "}
                  {leaveData[1].numDay}
                  วัน
                </p>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ลาคลอดครั้งสุดท้าย ตั้งแต่วันที่ - ถึงวันที่ - มีกำหนด - วัน
                </p>
              </>
            )}
            <br />
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาคลอดบุตรมาแล้ว: {statData.ML_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาคลอดบุตรครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.ML_DayCount + leaveData[0].numDay} วันทำการ
            </p>
          </>
        );
      case "ordinationleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ระดับ {leaveData[0].ordinationleave.level}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              เกิดวันที่ {formatLeaveDate(userData.birthday)}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              เข้ารับราชการ เมื่อวันที่{" "}
              {formatLeaveDate(userData.start_of_work_on)}
            </p>
            <FormControl>
              <FormLabel
                sx={{
                  fontFamily: "Kodchasan",
                  fontSize: "18px",
                  textAlign: "left",
                }}
              >
                เคยอุปสมบทหรือไม่
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].ordinationleave.useTo === true}
                    />
                  }
                  label={
                    <Typography
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    >
                      เคย
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].ordinationleave.useTo === false}
                    />
                  }
                  label={
                    <Typography
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    >
                      ไม่เคย
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              อุปสมบท ณ วัด {leaveData[0].ordinationleave.nameTemple} ตั้งอยู่ ณ{" "}
              {leaveData[0].ordinationleave.addressTemple}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              กำหนดอุปสมบท วันที่{" "}
              {formatLeaveDate(leaveData[0].ordinationleave.dateOrdi)}{" "}
              และจำพรรษาอยู่ ณ วัด{leaveData[0].ordinationleave.stayTemple}{" "}
              และตั้งอยู่ ณ {leaveData[0].ordinationleave.addressStayTemple}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay}วัน
            </p>
            <br />
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาอุปสมบทมาแล้ว: {statData.OL_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาอุปสมบทครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.OL_DayCount + leaveData[0].numDay} วันทำการ
            </p>
          </>
        );
      case "studyleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ติดต่อได้ที่ {leaveData[0].contact}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {" "}
              ระดับ {leaveData[0].studyleave.level}{" "}
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {" "}
              เงินเดือน{" "}
              {addCommasToNumber(leaveData[0].studyleave.salaryNumber)} ({" "}
              {leaveData[0].studyleave.salaryAlphabet} )
            </p>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].studyleave.typeStudy === "ศึกษา"}
                    />
                  }
                  label={
                    <Typography
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    >
                      ศึกษา
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].studyleave.typeStudy === "ฝึกอบรม"}
                    />
                  }
                  label={
                    <Typography
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    >
                      ฝึกอบรม
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={
                        leaveData[0].studyleave.typeStudy === "ปฏิบัติการวิจัย"
                      }
                    />
                  }
                  label={
                    <Typography
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    >
                      ปฏิบัติการวิจัย
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].studyleave.typeStudy === "ดูงาน"}
                    />
                  }
                  label={
                    <Typography
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    >
                      ดูงาน
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>

            {leaveData[0].studyleave.typeStudy === "ศึกษา" && (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  วิชา {leaveData[0].studyleave.subject}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ขั้นปริญญา {leaveData[0].studyleave.degree}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  สถานศึกษา {leaveData[0].studyleave.academy}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ประเทศ {leaveData[0].studyleave.countrystudy}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ทุน {leaveData[0].studyleave.scholarshipstudy}
                </p>
              </>
            )}

            {(leaveData[0].studyleave.typeStudy === "ฝึกอบรม" ||
              leaveData[0].studyleave.typeStudy === "ปฏิบัติการวิจัย") && (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ณ {leaveData[0].studyleave.address}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ประเทศ {leaveData[0].studyleave.countrytrain}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ทุน {leaveData[0].studyleave.scholartrain}
                </p>
              </>
            )}

            {leaveData[0].studyleave.typeStudy === "ดูงาน" && (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ด้าน/หลักสูตร {leaveData[0].studyleave.course}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ณ {leaveData[0].studyleave.address}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ประเทศ {leaveData[0].studyleave.countrytrain}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ทุน {leaveData[0].studyleave.scholartrain}
                </p>
              </>
            )}
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay}วัน
            </p>
            <br />
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลามาแล้ว: {statData.STL_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              ลาครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.STL_DayCount + leaveData[0].numDay} วันทำการ
            </p>
          </>
        );
    }
  };

  const statusLeave = (firstSelectedSuperior, secondSelectedSuperior) => {
    const roleRegex = /\((.*?)\)/;
    const match = firstSelectedSuperior.match(roleRegex);
    const secondMatch = secondSelectedSuperior.match(roleRegex);
    if (match != null) {
      console.log("match", match);
      return `รอ${match[1]}`;
    } else {
      console.log("secondMatch", secondMatch);
      return `รอ${secondMatch[1]}`;
    }
  };

  const handleConfirm = async (e) => {
    const currentDate = new Date();
    console.log("In Updating leave status Process...");
    try {
      console.log("Updating leave status...");

      if (type === "cancel") {
        const response = await updateCancelLeave(
          leaveID,
          {
            status: statusLeave(firstSelectedSuperior, secondSelectedSuperior),
            who_inspector: `${inspectorData.prefix} ${inspectorData.name} ${inspectorData.surname} (${inspectorData.position}) (${inspectorData.citizenID})`,
            date_inspector: currentDate,
            who_first_supeior: firstSelectedSuperior,
            who_second_supeior: secondSelectedSuperior,
          },
          localStorage.getItem("token")
        );
        console.log("response in updateLeave", response);
      } else {
        const response = await updateLeaveStatus(
          leaveID,
          {
            status: statusLeave(firstSelectedSuperior, secondSelectedSuperior),
            who_inspector: `${inspectorData.prefix} ${inspectorData.name} ${inspectorData.surname} (${inspectorData.position}) (${inspectorData.citizenID})`,
            date_inspector: currentDate,
            who_first_supeior: firstSelectedSuperior,
            who_second_supeior: secondSelectedSuperior,
          },
          localStorage.getItem("token")
        );
        console.log("response in updateLeave", response);
      }

      navigate(`/inspector/request`);
    } catch (error) {
      console.error("Error handleConfirm:", error);
    }
  };

  function addCommasToNumber(number) {
    let numberString = number.toString();

    let parts = numberString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  }

  const handleChangeFirst = (value) => {
    console.log("Selected value:", value);
    if (value === undefined || value === null) {
      clear();
    } else {
      setfirstSelectedSuperior(value);
    }
  };

  const handleChangeSecond = (value) => {
    console.log("Selected value:", value);
    if (value === undefined || value === null) {
      clear();
    } else {
      setsecondSelectedSuperior(value);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <LeftOutlined onClick={() => navigate("/inspector/request")} />
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
            }}
          >
            <h1 className="topic-leave" style={{ textAlign: "center" }}>
              ตรวจสอบการแจ้งลา
            </h1>
            {leaveData && leaveData.length > 0 && (
              <React.Fragment>
                <form>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <h1
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "22px",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        {leaveData[0].topic}
                      </h1>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        เรียน {leaveData[0].to}
                      </p>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "bold",
                        }}
                      >
                        ข้าพเจ้า {userData.prefix} {userData.name}{" "}
                        {userData.surname}
                      </p>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        ตำแหน่ง {userData.position}
                      </p>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        สังกัด {userData.divisionName} {userData.sub_division}
                      </p>
                      {type != "cancel" ? (
                        <>{rendertype()}</>
                      ) : (
                        prevLeaveData && (
                          <>
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "bold",
                              }}
                            >
                              ได้รับอนุญาตให้ลาพักผ่อน ตั้งแต่วันที่{" "}
                              {formatLeaveDate(prevLeaveData[0]?.firstDay)}{" "}
                              ถึงวันที่{" "}
                              {formatLeaveDate(prevLeaveData[0]?.lastDay)} รวม{" "}
                              {prevLeaveData[0]?.numDay}วัน
                            </p>
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "normal",
                              }}
                            >
                              เนื่องจาก {leaveData[0].reason}
                            </p>
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "bold",
                              }}
                            >
                              จึงขอยกเลิกวันลาพักผ่อน จำนวน
                              {leaveData[0].cancelNumDay}วัน ตั้งแต่วันที่
                              {formatLeaveDate(
                                leaveData[0].cancelFirstDay
                              )}{" "}
                              ถึงวันที่{" "}
                              {formatLeaveDate(leaveData[0].cancelLastDay)}
                            </p>

                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "bold",
                              }}
                            >
                              สถิติการลาในปีงบประมาณนี้
                            </p>
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "normal",
                              }}
                            >
                              ลามาแล้ว:{" "}
                              {statData.VL_total - statData.VL_remaining}{" "}
                              วันทำการ
                            </p>
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "normal",
                              }}
                            >
                              ลาครั้งนี้: {leaveData[0].cancelNumDay} วันทำการ
                            </p>
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "normal",
                              }}
                            >
                              รวมเป็น:{" "}
                              {statData.VL_total -
                                statData.VL_remaining +
                                leaveData[0].cancelNumDay}{" "}
                              วันทำการ
                            </p>
                          </>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      {defaultFirstSuperior ? (
                        <>
                          <FormControl>
                            {(userData.role === "user" ||
                              userData.role === "inspector") && (
                              <>
                                <label
                                  style={{
                                    fontFamily: "Kodchasan",
                                    fontSize: "18px",
                                    textAlign: "left",
                                    fontWeight: "normal",
                                  }}
                                >
                                  ผู้บังคับบัญชาคนที่1 :
                                </label>
                                <ConfigProvider
                                  locale={locale}
                                  theme={{
                                    token: {
                                      borderRadius: "8px",
                                      fontFamily: "Kodchasan",
                                      colorText: "#684929",
                                      colorBgContainer: "#ebdbce",
                                      colorTextPlaceholder: "#684929",
                                      colorBgElevated: "#fcf3e9",
                                      colorPrimary: "#e09132",
                                    },
                                  }}
                                >
                                  <Select
                                    style={{
                                      width: "100%",
                                      fontFamily: "Kodchasan",
                                      fontSize: "20px",
                                      borderRadius: "8px",
                                    }}
                                    showSearch
                                    optionFilterProp="children"
                                    defaultValue={`${defaultFirstSuperior.prefix} ${defaultFirstSuperior.name} ${defaultFirstSuperior.surname} (${defaultFirstSuperior.position}) (${defaultFirstSuperior.citizenID})`}
                                    onChange={handleChangeFirst}
                                    filterOption={(input, option) =>
                                      (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={[
                                      ...firstSuperior.map((item) => ({
                                        label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                                        value: `${item.prefix} ${item.name} ${item.surname} (${item.position}) (${item.citizenID})`,
                                      })),
                                      { label: "ไม่มี", value: " " },
                                    ]}
                                  ></Select>
                                </ConfigProvider>
                                <br />
                              </>
                            )}
                          </FormControl>
                        </>
                      ) : (
                        <>
                          <FormControl>
                            {userData.role === "user" ||
                            userData.role === "inspector" ? (
                              <>
                                <label
                                  style={{
                                    fontFamily: "Kodchasan",
                                    fontSize: "18px",
                                    textAlign: "left",
                                    fontWeight: "normal",
                                  }}
                                >
                                  ผู้บังคับบัญชาคนที่1:
                                </label>
                                <ConfigProvider
                                  locale={locale}
                                  theme={{
                                    token: {
                                      borderRadius: "8px",
                                      fontFamily: "Kodchasan",
                                      colorText: "#684929",
                                      colorBgContainer: "#ebdbce",
                                      colorTextPlaceholder: "#684929",
                                      colorBgElevated: "#fcf3e9",
                                      colorPrimary: "#e09132",
                                    },
                                  }}
                                >
                                  <Select
                                    style={{
                                      width: "100%",
                                      fontFamily: "Kodchasan",
                                      fontSize: "20px",
                                      borderRadius: "8px",
                                    }}
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={handleChangeFirst}
                                    filterOption={(input, option) =>
                                      (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={[
                                      ...getSuperior.map((item) => ({
                                        label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                                        value: `${item.prefix} ${item.name} ${item.surname} (${item.position}) (${item.citizenID})`,
                                      })),
                                      { label: "ไม่มี", value: " " },
                                    ]}
                                  ></Select>
                                </ConfigProvider>
                              </>
                            ) : (
                              <></>
                            )}
                            <br />
                          </FormControl>
                        </>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      {defaultSecondSuperior ? (
                        <>
                          <label
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "18px",
                              textAlign: "left",
                              fontWeight: "normal",
                            }}
                          >
                            ผู้บังคับบัญชาคนที่2:
                          </label>
                          <br />
                          <ConfigProvider
                            locale={locale}
                            theme={{
                              token: {
                                borderRadius: "8px",
                                fontFamily: "Kodchasan",
                                colorText: "#684929",
                                colorBgContainer: "#ebdbce",
                                colorTextPlaceholder: "#684929",
                                colorBgElevated: "#fcf3e9",
                                colorPrimary: "#e09132",
                              },
                            }}
                          >
                            <Select
                              style={{
                                // width: "100%",
                                fontFamily: "Kodchasan",
                                fontSize: "20px",
                                borderRadius: "8px",
                              }}
                              showSearch
                              defaultValue={`${defaultSecondSuperior.prefix} ${defaultSecondSuperior.name} ${defaultSecondSuperior.surname} (${defaultSecondSuperior.position}) (${defaultSecondSuperior.citizenID})`}
                              optionFilterProp="children"
                              onChange={handleChangeSecond}
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              options={[
                                {
                                  label: "----ผู้บริหาร----",
                                },
                                ...hightSuperior.map((item) => ({
                                  label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                                  value: `${item.prefix} ${item.name} ${item.surname} (${item.position}) (${item.citizenID})`,
                                })),
                                {
                                  label: "----ผู้บัญคับบัญชาคนที่2----",
                                  option: [{}],
                                },
                                ...secondSuperior.map((item) => ({
                                  label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                                  value: `${item.prefix} ${item.name} ${item.surname} (${item.position}) (${item.citizenID})`,
                                })),
                                {
                                  label: "----ผู้บัญคับบัญชาคนที่1----",
                                },
                                ...fsSuperior.map((item) => ({
                                  label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                                  value: `${item.prefix} ${item.name} ${item.surname} (${item.position}) (${item.citizenID})`,
                                })),
                              ]}
                            ></Select>
                          </ConfigProvider>
                        </>
                      ) : (
                        <>
                          <>
                            <label
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "18px",
                                textAlign: "left",
                                fontWeight: "normal",
                              }}
                            >
                              ผู้บังคับบัญชาคนที่2:
                            </label>
                            <br />
                            <ConfigProvider
                              locale={locale}
                              theme={{
                                token: {
                                  borderRadius: "8px",
                                  fontFamily: "Kodchasan",
                                  colorText: "#684929",
                                  colorBgContainer: "#ebdbce",
                                  colorTextPlaceholder: "#684929",
                                  colorBgElevated: "#fcf3e9",
                                  colorPrimary: "#e09132",
                                },
                              }}
                            >
                              <Select
                                style={{
                                  // width: "100%",
                                  fontFamily: "Kodchasan",
                                  fontSize: "20px",
                                  borderRadius: "8px",
                                }}
                                showSearch
                                optionFilterProp="children"
                                onChange={handleChangeSecond}
                                filterOption={(input, option) =>
                                  (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                options={[
                                  ...getSuperior.map((item) => ({
                                    label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                                    value: `${item.prefix} ${item.name} ${item.surname} (${item.position}) (${item.citizenID})`,
                                  })),
                                  { label: "ไม่มี", value: " " },
                                ]}
                              ></Select>
                            </ConfigProvider>

                            <br />
                          </>
                        </>
                      )}
                    </Grid>
                  </Grid>

                  <br />
                  <br />
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      style={{
                        borderRadius: 50,
                        width: "50%",
                        marginLeft: "15px",
                        backgroundColor: "#B6594C",
                        color: "#FFFFE1",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      variant="contained"
                      onClick={showConfirm}
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

export default ConfirmRequest;
