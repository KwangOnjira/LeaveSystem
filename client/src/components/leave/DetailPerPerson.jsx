import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { currentUser } from "../../function/auth";
import { dowloadFiles, getLeavebyId, prevLeave } from "../../function/leave";
import {
  Box,
  Button,
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
import { cancelLeave } from "../../function/cancel";
import { getStatById } from "../../function/statistic";
import { LeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { ConfigProvider, Input } from "antd";

const DetailPerPerson = () => {
  const navigate = useNavigate();
  const { type, leaveID, fiscal_year } = useParams();
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    divisionName: "",
  });
  const [cancelData, setCancelData] = useState();
  const [statData, setStatData] = useState();
  const [prevLeaveData, setPrevLeaveData] = useState();
  const [leaveData, setLeaveData] = useState({
    type: "",
    topic: "",
    to: "",
    date: "",
    contact: "",
    firstDay: null,
    lastDay: null,
    numDay: "",
    status: "",
    allow: "",
    comment: "",
    deputyName: "",
    reason: "",
    typeCount: null,
    useTo: "",
    nameTemple: "",
    addressTemple: "",
    dateOrdi: "",
    stayTemple: "",
    addressStayTemple: "",
    level: "",
    salaryNumber: "",
    salaryAlphabet: "",
    typeStudy: "",
    subject: "",
    degree: "",
    academy: "",
    countrystudy: "",
    scholarshipstudy: "",
    course: "",
    address: "",
    countrytrain: "",
    scholartrain: "",
    accumulatedDays: "",
    leaveRights: "",
    totalDay: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log("fetchUser: ", fetchUser.data);
        setUserData(fetchUser.data);

        const fetchLeave = await getLeavebyId(
          type,
          leaveID,
          fiscal_year,
          localStorage.getItem("token")
        );
        console.log("fetchLeave", fetchLeave.data);
        setLeaveData(fetchLeave.data);

        const fetchCancel = await cancelLeave(
          fetchUser.data.citizenID,
          leaveID,
          localStorage.getItem("token")
        );
        console.log("fetchCancel", fetchCancel.data);
        setCancelData(fetchCancel.data);

        if (type === "cancel") {
          const fetchPrevLeave = await prevLeave(
            fetchCancel.data[0].citizenID,
            "vacationleave",
            fetchCancel.data[0].leaveID,
            fiscal_year,
            localStorage.getItem("token")
          );
          console.log("fetchPrevLeave", fetchPrevLeave.data);
          setPrevLeaveData(fetchPrevLeave.data);

          const fetchStat = await getStatById(
            fetchCancel.data[0].statisticID,
            localStorage.getItem("token")
          );
          console.log("fetchStat", fetchStat.data);
          setStatData(fetchStat.data);
        } else {
          const fetchStat = await getStatById(
            fetchLeave.data[0].statisticID,
            localStorage.getItem("token")
          );
          console.log("fetchStat", fetchStat.data);
          setStatData(fetchStat.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [type, leaveID]);

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
                fontWeight: "normal",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay} วัน
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
                    fontWeight: "normal",
                  }}
                >
                  ลาป่วยครั้งสุดท้าย ตั้งแต่วันที่{" "}
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
                fontWeight: "normal",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay} วัน
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
                    fontWeight: "normal",
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
                fontWeight: "normal",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay} วัน
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
              มีวันลาพักผ่อนสะสม {statData?.VL_accumulatedDays}วัน
              มีสิทธิ์ลาพักผ่อนประจำปีอีก {statData?.leave_rights}วัน รวมเป็น{" "}
              {statData?.VL_total}วันทำการ
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
                fontWeight: "normal",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay} วัน
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
                    fontWeight: "normal",
                  }}
                >
                  ลาคลอดครั้งสุดท้าย ตั้งแต่วันที่{" "}
                  {formatLeaveDate(leaveData[1].firstDay)} ถึงวันที่{" "}
                  {formatLeaveDate(leaveData[1].lastDay)} มีกำหนด{" "}
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
            <div style={{ display: "flex", justifyContent: "left" }}>
              <FormControl>
                <FormLabel
                  style={{
                    color:"#111",
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                  id="demo-row-radio-buttons-group-label"
                >
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
                    label={
                      <Typography
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
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
                          fontSize: "18px",
                        }}
                      >
                        ไม่เคย
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </div>
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
                fontWeight: "normal",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay} วัน
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
                  label="ศึกษา"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].studyleave.typeStudy === "ฝึกอบรม"}
                    />
                  }
                  label="ฝึกอบรม"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={
                        leaveData[0].studyleave.typeStudy === "ปฏิบัติการวิจัย"
                      }
                    />
                  }
                  label="ปฏิบัติการวิจัย"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={leaveData[0].studyleave.typeStudy === "ดูงาน"}
                    />
                  }
                  label="ดูงาน"
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
                fontWeight: "normal",
              }}
            >
              ตั้งแต่วันที่ {formatLeaveDate(leaveData[0].firstDay)} ถึงวันที่{" "}
              {formatLeaveDate(leaveData[0].lastDay)} มีกำหนด{" "}
              {leaveData[0].numDay} วัน
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
          </>
        );
    }
  };

  const lastStat = () => {
    switch (leaveData[0].type) {
      case "sickleave":
        return (
          <>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลาป่วยมาแล้ว: {statData?.SL_remaining} ทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลาป่วยครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              รวม: {statData?.SL_remaining + leaveData[0].numDay} วันทำการ
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
                fontWeight: "normal",
              }}
            >
              ลากิจส่วนตัวมาแล้ว: {statData?.PL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลากิจส่วนตัวครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              รวม: {statData?.PL_remaining + leaveData[0].numDay} วันทำการ
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
                fontWeight: "normal",
              }}
            >
              ลามาแล้ว: {statData?.VL_total - statData?.VL_remaining} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลาครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              รวมเป็น:{" "}
              {statData?.VL_total -
                statData?.VL_remaining +
                leaveData[0].numDay}{" "}
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
                fontWeight: "normal",
              }}
            >
              ลาคลอดบุตรมาแล้ว: {statData?.ML_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลาคลอดบุตรครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              รวม: {statData?.ML_DayCount + leaveData[0].numDay} วันทำการ
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
                fontWeight: "normal",
              }}
            >
              ลาอุปสมบทมาแล้ว: {statData?.OL_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลาอุปสมบทครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              รวม: {statData?.OL_DayCount + leaveData[0].numDay} วันทำการ
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
                fontWeight: "normal",
              }}
            >
              ลามาแล้ว: {statData?.STL_DayCount} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              ลาครั้งนี้: {leaveData[0].numDay} วันทำการ
            </p>
            <p
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                fontWeight: "normal",
              }}
            >
              รวม: {statData?.STL_DayCount + leaveData[0].numDay} วันทำการ
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

  return (
    <div>
      <ThemeProvider theme={theme}>
        <LeftOutlined onClick={() => navigate("/statistics")} />
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
            <h1 className="topic-leave" style={{ textAlign: "center" }}>
              รายละเอียดข้อมูลการลา
            </h1>

            {leaveData && leaveData.length > 0 && (
              <React.Fragment>
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
                        fontWeight: "normal",
                      }}
                    >
                      ข้าพเจ้า {userData.name}
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
                  </Grid>
                </Grid>

                {rendertype()}
                <br />
                {leaveData[0].who_inspector && (
                  <>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      สถิติการลาในปีงบประมาณนี้{lastStat()}
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "center",
                          fontWeight: "normal",
                        }}
                      >
                        ลงชื่อ {leaveData[0].who_inspector.split("(")[0].trim()}{" "}
                        <br />( ตำแหน่ง{" "}
                        {leaveData[0].who_inspector.split("(")[1].trim()}
                        <br /> วันที่{" "}
                        {formatLeaveDate(leaveData[0].date_inspector)}
                      </span>
                    </p>
                  </>
                )}
                <br />
                {leaveData[0].date_first_supeior != null &&
                  (leaveData[0].comment != null ? (
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
                  ))}
                <br />
                {((leaveData[0].allow === true &&
                  leaveData[0].status === "เสร็จสิ้น") ||
                  (leaveData[0].allow === false &&
                    leaveData[0].status === "ไม่อนุมัติ")) && (
                  <>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      คำสั่ง
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="allow"
                          value={leaveData[0].allow}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label={
                              <Typography
                                style={{
                                  fontFamily: "Kodchasan",
                                  fontSize: "18px",
                                }}
                              >
                                อนุมัติ
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label={
                              <Typography
                                style={{
                                  fontFamily: "Kodchasan",
                                  fontSize: "18px",
                                }}
                              >
                                ไม่อนุมัติ
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>

                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "normal",
                      }}
                    >
                      ลงชื่อ{" "}
                      {leaveData[0].who_second_supeior.split("(")[0].trim()}{" "}
                      <br />( ตำแหน่ง{" "}
                      {leaveData[0].who_second_supeior.split("(")[1].trim()}
                      <br /> วันที่{" "}
                      {formatLeaveDate(leaveData[0].date_second_supeior)}
                    </p>
                  </>
                )}
              </React.Fragment>
            )}
            {cancelData && cancelData.length > 0 && (
              <React.Fragment>
                <h1
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  {cancelData[0].topic}
                </h1>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  เรียน {cancelData[0].to}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ข้าพเจ้า {userData.name}
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
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  ตั้งแต่วันที่{" "}
                  {formatLeaveDate(
                    prevLeaveData ? prevLeaveData[0].firstDay : ""
                  )}{" "}
                  ถึงวันที่{" "}
                  {formatLeaveDate(
                    prevLeaveData ? prevLeaveData[0].lastDay : ""
                  )}{" "}
                  มีกำหนด {prevLeaveData ? prevLeaveData[0].numDay : ""} วัน
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  เนื่องจาก {cancelData[0].reason}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  จึงขอยกเลิกวันลาพักผ่อน จำนวน {cancelData[0].cancelNumDay} วัน
                  ตั้งแต่วันที่{formatLeaveDate(cancelData[0].cancelFirstDay)}{" "}
                  ถึงวันที่ {formatLeaveDate(cancelData[0].cancelLastDay)}
                </p>
                <br />
                {cancelData[0].comment && (
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
                        value={cancelData[0].comment}
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
                      {cancelData[0].who_first_supeior.split("(")[0].trim()}{" "}
                      <br />( ตำแหน่ง{" "}
                      {cancelData[0].who_first_supeior.split("(")[1].trim()}
                      <br /> วันที่{" "}
                      {formatLeaveDate(cancelData[0].date_first_supeior)}
                    </p>
                  </>
                )}
                <br />
                {cancelData[0].allow === true && (
                  <>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      คำสั่ง
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="allow"
                          value={cancelData[0].allow}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label={
                              <Typography
                                style={{
                                  fontFamily: "Kodchasan",
                                  fontSize: "18px",
                                }}
                              >
                                อนุมัติ
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label={
                              <Typography
                                style={{
                                  fontFamily: "Kodchasan",
                                  fontSize: "18px",
                                }}
                              >
                                ไม่อนุมัติ
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "center",
                        fontWeight: "normal",
                      }}
                    >
                      ลงชื่อ{" "}
                      {cancelData[0]?.who_second_supeior.split("(")[0].trim()}{" "}
                      <br />( ตำแหน่ง{" "}
                      {cancelData[0]?.who_second_supeior.split("(")[1].trim()}
                      <br /> วันที่{" "}
                      {formatLeaveDate(cancelData[0]?.date_second_supeior)}
                    </p>
                  </>
                )}
              </React.Fragment>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default DetailPerPerson;
