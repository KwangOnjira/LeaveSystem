import React, { useEffect, useState } from "react";
import { currentUser, userById } from "../../../function/auth";
import { useNavigate, useParams } from "react-router-dom";
import { dowloadFiles, prevLeave } from "../../../function/leave";
import { getStatById } from "../../../function/statistic";
import { getDataLastStatisticByid } from "../../../function/inspector";
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
  TextField,
  Typography,
} from "@mui/material";
import { updateComment } from "../../../function/superior";
import { cancelLeave, updateCommentCancel } from "../../../function/cancel";
import { LeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { CloseSquareFilled } from "@ant-design/icons";
import { Mentions, ConfigProvider, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const FirstSuperior = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const { citizenID, type, leaveID } = useParams();
  const [superior, setSuperior] = useState();
  const [userData, setUserData] = useState();
  const [leaveData, setLeaveData] = useState();
  const [prevLeaveData, setPrevLeaveData] = useState([]);
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

  const [formErrors, setFormErrors] = useState({
    comment: "",
  });
  console.log(formErrors);

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
            fetchStat.data.fiscal_year,
            localStorage.getItem("token")
          );
          console.log("fetchPrevLeave: ", fetchPrevLeave.data);
          setPrevLeaveData(fetchPrevLeave.data);
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
                  <Button
                    style={{
                      borderRadius: 50,
                      marginLeft: "15px",
                      backgroundColor: "#9ba986",
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

  const statusLeave = (secondSuperior) => {
    const roleRegex = /\((.*?)\)/;
    const match = secondSuperior.match(roleRegex);
    console.log("match", match);
    return `รอ${match[1]}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prevData) =>
      prevData.map((item, index) =>
        index === 0 ? { ...item, [name]: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!leaveData[0].comment) {
      errors.comment = "กรุณาระบุความคิดเห็น";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = new Date();
    console.log("In Updating leave status Process...");
    try {
      console.log("Updating leave comment...");

      if (type === "cancel") {
        const response = await updateCommentCancel(
          leaveID,
          {
            comment: leaveData[0].comment,
            status: statusLeave(leaveData[0].who_second_supeior),
            date_first_supeior: currentDate,
          },
          localStorage.getItem("token")
        );
        setLeaveData([response]);
      } else {
        const response = await updateComment(
          leaveID,
          {
            comment: leaveData[0].comment,
            status: statusLeave(leaveData[0].who_second_supeior),
            date_first_supeior: currentDate,
          },
          localStorage.getItem("token")
        );
        setLeaveData([response]);
      }

      navigate("/superior");
    } catch (error) {
      console.log("Error updating user profile data: " + error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: `ยืนยันข้อมูลการแจ้งลาของ ${userData.prefix} ${userData.name} ${userData.surname}`,
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
        style: { color: "#edeef3", backgroundColor: "#708160" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
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
            }}
          >
            <h1 className="topic-leave" style={{ textAlign: "center" }}>
              รายละเอียด
            </h1>
            {leaveData && (
              <React.Fragment>
                <form onSubmit={handleSubmit}>
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "22px",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {leaveData[0].topic}
                  </p>
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
                    สังกัด {userData.divisionName}
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
                          ถึงวันที่ {formatLeaveDate(prevLeaveData[0]?.lastDay)}{" "}
                          รวม {prevLeaveData[0]?.numDay}วัน
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
                          {formatLeaveDate(leaveData[0].cancelFirstDay)}{" "}
                          ถึงวันที่{" "}
                          {formatLeaveDate(leaveData[0].cancelLastDay)}
                        </p>
                      </>
                    )
                  )}
                  <br />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                        marginBottom: "0.5rem",
                        marginTop: "1rem",
                      }}
                    >
                      ความคิดเห็น{" "}
                    </label>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <textarea
                      style={{
                        backgroundColor: "#efefef",
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        width: "100%",
                        height: 100,
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                      type="text"
                      name="comment"
                      value={leaveData[0].comment}
                      onChange={(e) => handleChange(e)}
                      required
                      placeholder="กรอกความคิดเห็นของผู้บังคับบัญชา"
                    ></textarea>
                    <br />
                  </div>
                  {formErrors.comment && (
                    <>
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.comment}
                      </span>
                      <br />
                    </>
                  )}
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
                      onClick={showConfirm}
                      style={{
                        borderRadius: 50,
                        width: "50%",
                        marginLeft: "15px",
                        backgroundColor: "#708160",
                        color: "#FFFFE1",
                        fontSize: "16px",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      // type="submit"
                    >
                      ยืนยัน
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

export default FirstSuperior;
