import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { currentUser, userById } from "../../../function/auth";
import { dowloadFiles, prevLeave } from "../../../function/leave";
import {
  createStatByid,
  getDataLastStatisticByid,
} from "../../../function/inspector";
import {
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import { updateCompleteStatus } from "../../../function/superior";
import {
  cancelLeave,
  createStatisticByidCancel,
  getLastLeavebyUserID,
  getStatisticLastLeavebyUserID,
  updateCompleteStatusCancel,
} from "../../../function/cancel";
import { getStatById } from "../../../function/statistic";
import { LeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { ConfigProvider, Modal, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const SecondSuperior = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const { citizenID, type, leaveID } = useParams();
  const [superior, setSuperior] = useState();
  const [userData, setUserData] = useState();
  const [leaveData, setLeaveData] = useState();
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
  const [prevLeaveData, setPrevLeaveData] = useState([]);
  const [vacaLeaveData, setVacaLeaveData] = useState([]);
  const [lastStatData, setLastStatData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchSuperior = await currentUser(localStorage.getItem("token"));
        console.log("fetchSuperior: ", fetchSuperior.data);
        setSuperior(fetchSuperior.data);

        const fetchUser = await userById(
          citizenID,
          localStorage.getItem("token")
        );
        console.log("fetchUser: ", fetchUser.data);
        setUserData(fetchUser.data);

        const fetchStat = await getDataLastStatisticByid(
          citizenID,
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

          const fetchLastStat = await getStatById(
            fetchPrevLeave.data[0].statisticID,
            localStorage.getItem("token")
          );
          console.log("fetchLastStat: ", fetchLastStat.data);
          setLastStatData(fetchLastStat.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

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

  function addCommasToNumber(number) {
    let numberString = number.toString();

    let parts = numberString.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  }

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
                  <Button style={{
                      borderRadius: 50,
                      marginLeft: "15px",
                      backgroundColor: "#9ba986",
                      color: "#F4ECDC",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }} onClick={downloadFile}><DownloadOutlined style={{ fontSize: "20px" }} /></Button>
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาป่วยมาแล้ว: {statData.SL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาป่วยครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.SL_remaining + leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()} <br />(
              ตำแหน่ง {leaveData[0].who_inspector.split("(")[1].trim()}
              <br /> วันที่ {formatLeaveDate(leaveData[0].date_inspector)}
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลากิจส่วนตัวมาแล้ว: {statData.PL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลากิจส่วนตัวครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.PL_remaining + leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()} <br />(
              ตำแหน่ง {leaveData[0].who_inspector.split("(")[1].trim()}
              <br /> วันที่ {formatLeaveDate(leaveData[0].date_inspector)}
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
              มีวันลาพักผ่อนสะสม {leaveData[0].vacationleave.accumulatedDays}วัน
              มีสิทธิ์ลาพักผ่อนประจำปีอีก{" "}
              {leaveData[0].vacationleave.leaveRights}วัน รวมเป็น{" "}
              {leaveData[0].vacationleave.totalDay}วันทำการ
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลามาแล้ว: {statData.VL_total - statData.VL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              รวมเป็น:{" "}
              {statData.VL_total - statData.VL_remaining + leaveData[0].numDay}{" "}
              วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()} <br />(
              ตำแหน่ง {leaveData[0].who_inspector.split("(")[1].trim()}
              <br /> วันที่ {formatLeaveDate(leaveData[0].date_inspector)}
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาคลอดบุตรมาแล้ว: {statData.ML_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาคลอดบุตรครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.ML_DayCount + leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()} <br />(
              ตำแหน่ง {leaveData[0].who_inspector.split("(")[1].trim()}
              <br /> วันที่ {formatLeaveDate(leaveData[0].date_inspector)}
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
              <FormLabel id="demo-row-radio-buttons-group-label">
                เคยอุปสมบทมั้ย
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
                  label="เคย"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].ordinationleave.useTo === false}
                    />
                  }
                  label="ไม่เคย"
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาอุปสมบทมาแล้ว: {statData.OL_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาอุปสมบทครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.OL_DayCount + leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()} <br />(
              ตำแหน่ง {leaveData[0].who_inspector.split("(")[1].trim()}
              <br /> วันที่ {formatLeaveDate(leaveData[0].date_inspector)}
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              สถิติการลาในปีงบประมาณนี้
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลามาแล้ว: {statData.STL_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลาครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              รวม: {statData.STL_DayCount + leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "normal",
              }}
            >
              ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()} <br />(
              ตำแหน่ง {leaveData[0].who_inspector.split("(")[1].trim()}
              <br /> วันที่ {formatLeaveDate(leaveData[0].date_inspector)}
            </p>
          </>
        );
    }
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

  const handleNotApprove = async (e) => {
    try {
      if (type === "cancel") {
        const response = await updateCompleteStatusCancel(
          leaveID,
          { allow: false, status: "ไม่อนุมัติ" },
          localStorage.getItem("token")
        );
        console.log("response in updateLeave", response);
      } else {
        const response = await updateCompleteStatus(
          leaveID,
          { allow: false, status: "ไม่อนุมัติ" },
          localStorage.getItem("token")
        );
        console.log("response in updateLeave", response);
      }

      navigate("/superior");
    } catch (error) {
      console.error("Error handleConfirm:", error);
    }
  };

  const handleSubmit = async (e) => {
    const currentDate = new Date();
    console.log("In Updating leave status Process...");
    try {
      if (type === "cancel") {
        const response = await updateCompleteStatusCancel(
          leaveID,
          {
            allow: true,
            status: "เสร็จสิ้น",
            date_second_supeior: currentDate,
          },
          localStorage.getItem("token")
        );
        console.log("response in updateLeave", response);

        const createNewStatVL = await createStatisticByidCancel(
          citizenID,
          {
            ...statData,
            isStatOfLeaveID: leaveData[0].leaveID,
            isStatOfCancelID: leaveID,
            VL_lastLeave: statData.VL_lastLeave,
            VL_thisLeave: statData.VL_thisLeave - leaveData[0].cancelNumDay,
            currentUseVL: statData.currentUseVL - leaveData[0].cancelNumDay,
            VL_remaining: statData.VL_remaining + leaveData[0].cancelNumDay,
          },
          localStorage.getItem("token")
        );
        console.log("createNewStatPL: ", createNewStatVL);
      } else {
        const response = await updateCompleteStatus(
          leaveID,
          {
            allow: true,
            status: "เสร็จสิ้น",
            date_second_supeior: currentDate,
          },
          localStorage.getItem("token")
        );
        console.log("response in updateLeave", response);

        switch (leaveData[0]?.type) {
          case "sickleave":
            const createNewStatSL = await createStatByid(
              citizenID,
              {
                ...statData,
                isStatOfLeaveID: leaveID,
                leave_count: statData.leave_count + 1,
                SL_lastLeave: statData.SL_remaining,
                SL_thisLeave: leaveData[0].numDay,
                SL_remaining: statData.SL_remaining + leaveData[0].numDay,
                SL_In_Range: statData.SL_In_Range + leaveData[0].numDay,
                total_leaveDay: statData.total_leaveDay + leaveData[0].numDay,
              },
              localStorage.getItem("token")
            );
            console.log("createNewStat: ", createNewStatSL);
            break;

          case "personalleave":
            const createNewStatPL = await createStatByid(
              citizenID,
              {
                ...statData,
                isStatOfLeaveID: leaveID,
                leave_count: statData.leave_count + 1,
                PL_lastLeave: statData.PL_remaining,
                PL_thisLeave: leaveData[0].numDay,
                PL_remaining: statData.PL_remaining + leaveData[0].numDay,
                PL_In_Range: statData.PL_In_Range + leaveData[0].numDay,
                total_leaveDay: statData.total_leaveDay + leaveData[0].numDay,
              },
              localStorage.getItem("token")
            );
            console.log("createNewStatPL: ", createNewStatPL);
            break;

          case "vacationleave":
            const createNewStatVL = await createStatByid(
              citizenID,
              {
                ...statData,
                isStatOfLeaveID: leaveID,
                VL_lastLeave: statData.VL_lastLeave + statData.VL_thisLeave,
                VL_thisLeave: leaveData[0].numDay,
                currentUseVL:
                  statData.VL_lastLeave +
                  statData.VL_thisLeave +
                  leaveData[0].numDay,
                VL_remaining:
                  statData.VL_total -
                  (statData.VL_lastLeave +
                    statData.VL_thisLeave +
                    leaveData[0].numDay),
              },
              localStorage.getItem("token")
            );
            console.log("createNewStatPL: ", createNewStatVL);
            break;

          case "maternityleave":
            const createNewStatML = await createStatByid(
              citizenID,
              {
                ...statData,
                isStatOfLeaveID: leaveID,
                leave_count: statData.leave_count + 1,
                ML_lastLeave: statData.ML_DayCount,
                ML_thisLeave: leaveData[0].numDay,
                ML_DayCount: statData.ML_DayCount + leaveData[0].numDay,
                ML_In_Range: statData.ML_In_Range + leaveData[0].numDay,
                total_leaveDay: statData.total_leaveDay + leaveData[0].numDay,
              },
              localStorage.getItem("token")
            );
            console.log("createNewStatML: ", createNewStatML);
            break;

          case "ordinationleave":
            const createNewStatOL = await createStatByid(
              citizenID,
              {
                ...statData,
                isStatOfLeaveID: leaveID,
                leave_count: statData.leave_count + 1,
                OL_DayCount: statData.OL_DayCount + leaveData[0].numDay,
                OL_In_Range: statData.OL_In_Range + leaveData[0].numDay,
                total_leaveDay: statData.total_leaveDay + leaveData[0].numDay,
              },
              localStorage.getItem("token")
            );
            console.log("createNewStatOL: ", createNewStatOL);
            break;

          case "studyleave":
            const createNewStatSTL = await createStatByid(
              citizenID,
              {
                ...statData,
                isStatOfLeaveID: leaveID,
                leave_count: statData.leave_count + 1,
                STL_DayCount: statData.STL_DayCount + leaveData[0].numDay,
                STL_In_Range: statData.STL_In_Range + leaveData[0].numDay,
                total_leaveDay: statData.total_leaveDay + leaveData[0].numDay,
              },
              localStorage.getItem("token")
            );
            console.log("createNewStatSTL: ", createNewStatSTL);
            break;

          default:
            break;
        }
      }

      navigate("/superior");
    } catch (error) {
      console.error("Error handleConfirm:", error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: `อนุมัติการลาของ${userData.prefix} ${userData.name} ${userData.surname}`,
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleSubmit();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#274625" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };

  const showConfirmNotApprove = () => {
    confirm({
      title: `ไม่อนุมัติการลาของ${userData.prefix} ${userData.name} ${userData.surname}`,
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleNotApprove();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#274625" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <LeftOutlined onClick={() => navigate("/superior")} />
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
              textAlign: "left",
            }}
          >
            <h1 className="topic-leave" style={{ textAlign: "center" }}>
              อนุมัติคำร้อง
            </h1>
            {leaveData && (
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
                          </>
                        )
                      )}
                    </Grid>
                  </Grid>

                  <br />
                  {leaveData[0].comment ? (
                    <>
                      <p
                        style={{
                          // marginTop:"1rem",
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        ความคิดเห็นผู้บังคับบัญชา
                      </p>
                      <ConfigProvider
                        theme={{
                          token: {
                            colorBgContainer: "#efefef",
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                          },
                        }}
                      >
                        <Input
                          style={{
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                          }}
                          readOnly
                          value={leaveData[0].comment}
                        ></Input>
                      </ConfigProvider>

                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "center",
                          fontWeight: "normal",
                        }}
                      >
                        ลงชื่อ{" "}
                        {leaveData[0].who_first_supeior.split("(")[0].trim()}{" "}
                        <br />( ตำแหน่ง{" "}
                        {leaveData[0].who_first_supeior.split("(")[1].trim()}
                        <br /> วันที่{" "}
                        {formatLeaveDate(leaveData[0].date_first_supeior)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        ความคิดเห็นผู้บังคับบัญชา
                      </p>
                      <ConfigProvider
                        theme={{
                          token: {
                            colorBgContainer: "#efefef",
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                          },
                        }}
                      >
                        <Input
                          style={{
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                          }}
                          readOnly
                          value="-"
                        ></Input>
                      </ConfigProvider>
                    </>
                  )}
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
                        width: "30%",
                        margin: "15px",
                        marginLeft: "15px",
                        backgroundColor: "#274625",
                        color: "#FFFFE1",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      onClick={showConfirm}
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      style={{
                        borderRadius: 50,
                        width: "30%",
                        margin: "15px",
                        marginLeft: "15px",
                        backgroundColor: "#751102",
                        color: "#FFFFE1",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      onClick={showConfirmNotApprove}
                    >
                      ไม่อนุมัติ
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

export default SecondSuperior;
