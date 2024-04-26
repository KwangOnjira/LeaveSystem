import locale from "antd/locale/th_TH";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  MenuItem,
  Container,
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
  Grid,
  Select,
  Typography,
} from "@mui/material";
import { findBusinessDays } from "../../../function/BusinessDay";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { getHoliday } from "../../../function/holiday";
import { postSTLLeave } from "../../../function/leave";
import { currentUser } from "../../../function/auth";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, DatePicker, Modal } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const StudyLeave = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    phone: "",
    divisionName: "",
    sub_division: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    STL_DayCount: "",
    total_leaveDay: 0,
  });
  const [formStudy, setFormStudy] = useState({
    citizenID: "",
    statisticID: "",
    type: "",
    topic: "",
    to: "",
    date: "",
    contact: "",
    firstDay: "",
    lastDay: "",
    numDay: 0,
    status: "",
    allow: "",
    comment: "",
    level: "",
    salaryNumber: "",
    salaryAlphabet: "",
    typeStudy: "ศึกษา",
    subject: "",
    degree: "",
    academy: "",
    countrystudy: "",
    scholarshipstudy: "",
    course: "",
    address: "",
    countrytrain: "",
    scholartrain: "",
  });
  console.log(formStudy);
  const [formErrors, setFormErrors] = useState({
    to: "",
    contact: "",
    firstDay: "",
    level: "",
    salaryNumber: "",
    salaryAlphabet: "",
    subject: "",
    degree: "",
    academy: "",
    countrystudy: "",
    scholarshipstudy: "",
    course: "",
    address: "",
    countrytrain: "",
    scholartrain: "",
  });
  console.log(formErrors);

  const calculateDateDifference = () => {
    if (formStudy.firstDay && formStudy.lastDay) {
      const startDate = dayjs(formStudy.firstDay);
      const endDate = dayjs(formStudy.lastDay);

      const diffMonths = endDate.diff(startDate, "month", true); // Use 'true' to get a floating-point result

      const years = Math.floor(diffMonths / 12);
      const remainingMonthsAfterYears = diffMonths % 12;
      const months = Math.floor(remainingMonthsAfterYears);
      const days =
        Math.round(
          (remainingMonthsAfterYears - months) * endDate.daysInMonth()
        ) + 1;
      return {
        years,
        months,
        days,
      };
    }

    return {
      years: 0,
      months: 0,
      days: 0,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setUserData(fetchUser.data);

        const fetchStat = await getLastStatistic(localStorage.getItem("token"));
        console.log(fetchStat.data);
        setStatData(fetchStat.data);

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        setStatData((prevData) => ({
          ...prevData,
          // leave_count: fetchStat.data.leave_count,
          STL_DayCount: fetchStat.data.STL_DayCount,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormStudy((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          fiscal_year: fetchStat.data.fiscal_year,
          range: fetchStat.data.range,
          name: fetchUser.data.name,
          status: fetchUser.data.status,
          phone: fetchUser.data.phone,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          // leave_count: fetchStat.data.leave_count,
          STL_DayCount: fetchStat.data.STL_DayCount,
        }));
      } catch (err) {
        console.log("Error fetching user data: " + err);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (dates) => {
    dayjs.locale("th_TH");
    console.log("onCalendarChange", dates);
    console.log("firstDay", dates[0]);
    console.log("lastDay", dates[1]);
    if (dates && dates.length === 2) {
      const firstDay = dates[0]
        ? dayjs(dates[0]).startOf("day").toDate()
        : null;
      console.log(" firstDay", firstDay);
      const lastDay = dates[1] ? dayjs(dates[1]).startOf("day").toDate() : null;

      // Convert to local timezone
      const firstDayLocal = firstDay
        ? dayjs(firstDay).locale("th_TH").toDate()
        : null;
      console.log(" firstDayLocal", firstDayLocal);
      const lastDayLocal = lastDay
        ? dayjs(lastDay).locale("th_TH").toDate()
        : null;

      const businessDays = findBusinessDays(
        firstDayLocal,
        lastDayLocal,
        holiData
      );

      if (firstDay && lastDay) {
        // Convert dates to strings with desired format
        const firstDayLocal = firstDay.toLocaleDateString("en-US");
        const lastDayLocal = lastDay.toLocaleDateString("en-US");

        // Replace dashes with slashes in the formatted strings
        const formattedFirstDay = firstDayLocal
          ? firstDayLocal.replace(/-/g, "/")
          : "";
        console.log("formattedFirstDay", formattedFirstDay);
        const formattedLastDay = lastDayLocal
          ? lastDayLocal.replace(/-/g, "/")
          : "";

        // Update state with formatted dates
        setFormStudy((prevData) => ({
          ...prevData,
          numDay: businessDays,
          firstDay: formattedFirstDay,
          lastDay: formattedLastDay,
        }));
      } else {
        console.log("Invalid dates provided");
      }
      console.log("selectfirstDay", firstDay);
      console.log("selectlastDay", lastDay);
      console.log("numDay", businessDays);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.includes("Day") && value && value.$d instanceof Date
        ? value.$d
        : value;

    setFormStudy((prevData) => {
      return {
        ...prevData,
        [name]: parsedValue || "",
      };
    });
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!formStudy.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formStudy.firstDay) {
      errors.firstDay = "กรุณาระบุช่วงวันที่ลา";
    }
    if (!formStudy.level) {
      errors.level = "กรุณาระบุระดับ";
    }
    if (!formStudy.contact) {
      errors.contact = "กรุณาระบุข้อมูลติดต่อ";
    }
    if (!formStudy.salaryNumber) {
      errors.salaryNumber = "กรุณาระบุเงินเดือนเป็นตัวเลข";
    }
    if (!formStudy.salaryAlphabet) {
      errors.salaryAlphabet = "กรุณาระบุเงินเดือนเป็นตัวหนังสือ";
    }
    if (formStudy.typeStudy === "ศึกษา" && !formStudy.subject) {
      errors.subject = "กรุณาระบุชื่อวิชา";
    }
    if (formStudy.typeStudy === "ศึกษา" && !formStudy.degree) {
      errors.degree = "กรุณาระบุขั้นปริญญา";
    }
    if (formStudy.typeStudy === "ศึกษา" && !formStudy.academy) {
      errors.academy = "กรุณาระบุสถานศึกษา";
    }
    if (formStudy.typeStudy === "ศึกษา" && !formStudy.countrystudy) {
      errors.countrystudy = "กรุณาระบุประเทศ";
    }
    if (formStudy.typeStudy === "ศึกษา" && !formStudy.scholarshipstudy) {
      errors.scholarshipstudy = "กรุณาระบุทุน";
    }
    if (formStudy.typeStudy === "ดูงาน" && !formStudy.course) {
      errors.course = "กรุณาระบุด้านหรือหลักสูตร";
    }
    if (
      (formStudy.typeStudy === "ดูงาน" ||
        formStudy.typeStudy === "ฝึกอบรม" ||
        formStudy.typeStudy === "ปฏิบัติการวิจัย") &&
      !formStudy.address
    ) {
      errors.address = "กรุณาระบุสถานที่";
    }
    if (
      (formStudy.typeStudy === "ดูงาน" ||
        formStudy.typeStudy === "ฝึกอบรม" ||
        formStudy.typeStudy === "ปฏิบัติการวิจัย") &&
      !formStudy.countrytrain
    ) {
      errors.countrytrain = "กรุณาระบุประเทศ";
    }
    if (
      (formStudy.typeStudy === "ดูงาน" ||
        formStudy.typeStudy === "ฝึกอบรม" ||
        formStudy.typeStudy === "ปฏิบัติการวิจัย") &&
      !formStudy.scholartrain
    ) {
      errors.scholartrain = "กรุณาระบุทุน";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const currentDate = dayjs().toDate();
    console.log("formStudy:", formStudy);
    try {
      const response = await postSTLLeave(
        {
          ...formStudy,
          topic: "ขอลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน",
          date: currentDate,
          status: "รอผู้ตรวจสอบ",
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormStudy(response.data);
    } catch (error) {
      console.log("Post Form Study Failed: " + error);
    }
    navigate("/");
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งลาไปศึกษาต่อ หรือดูงาน",
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
        style: { color: "#e4e1d0", backgroundColor: "#495784" },
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

  const thaiMonthAbbreviations = {
    Jan: "ม.ค.",
    Feb: "ก.พ.",
    Mar: "มี.ค.",
    Apr: "เม.ย.",
    May: "พ.ค.",
    Jun: "มิ.ย.",
    Jul: "ก.ค.",
    Aug: "ส.ค.",
    Sep: "ก.ย.",
    Oct: "ต.ค.",
    Nov: "พ.ย.",
    Dec: "ธ.ค.",
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <LeftOutlined onClick={() => navigate("/leave")} />
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
            <h2 className="topic-leave">--ลาไปศึกษาต่อ--</h2>
            {userData && (
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      ชื่อ-นามสกุล:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${userData.prefix} ${userData.name} ${userData.surname}`}
                        disabled
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      />
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      ตำแหน่ง:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${userData.position}`}
                        disabled
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      />
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      สังกัด:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${userData.divisionName} ${userData.sub_division}`}
                        disabled
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      />
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      ระดับ:{" "}
                      <input
                        type="text"
                        name="level"
                        value={formStudy.level || ""}
                        onChange={handleChange}
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      ></input>
                      {formErrors.level && (
                        <>
                          <br />
                          <span
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              color: "#c1012D",
                              fontWeight: "bold",
                            }}
                          >
                            {formErrors.level}
                          </span>
                        </>
                      )}
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      วันเกิด:{" "}
                      <input
                        type="text"
                        name="to"
                        value={dayjs(userData.birthday)
                          .add(543, "year")
                          .locale("th")
                          .format(
                            `D ${
                              thaiMonthAbbreviations[
                                dayjs(userData.birthday).format("MMM")
                              ]
                            } พ.ศ.YYYY`
                          )}
                        disabled
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      />
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      วันที่เข้ารับราชการ:{" "}
                      <input
                        type="text"
                        name="to"
                        value={dayjs(userData.start_of_work_on)
                          .add(543, "year")
                          .locale("th")
                          .format(
                            `D ${
                              thaiMonthAbbreviations[
                                dayjs(userData.birthday).format("MMM")
                              ]
                            } พ.ศ.YYYY`
                          )}
                        disabled
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      />
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                        marginTop: "2rem",
                      }}
                    >
                      เรียน:{" "}
                      <input
                        type="text"
                        name="to"
                        value={formStudy?.to}
                        onChange={handleChange}
                        required
                        style={{
                          width: "60%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      <br />
                      {formErrors.to && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.to}
                        </span>
                      )}
                    </label>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                        // marginTop: "2rem",
                      }}
                    >
                      เงินเดือน:{" "}
                      <input
                        type="text"
                        name="salaryNumber"
                        value={formStudy.salaryNumber}
                        onChange={handleChange}
                        required
                        placeholder="กรอกเงินเดือนเป็นตัวเลข"
                        style={{
                          width: "20%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />{" "}
                      (
                      <input
                        type="text"
                        name="salaryAlphabet"
                        value={formStudy.salaryAlphabet}
                        onChange={handleChange}
                        required
                        placeholder="กรอกเงินเดือนเป็นตัวอักษร"
                        style={{
                          width: "40%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      )
                      {formErrors.salaryNumber && (
                        <>
                          <br />
                          <span
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              color: "#c1012D",
                              fontWeight: "bold",
                            }}
                          >
                            {formErrors.salaryNumber}
                          </span>
                        </>
                      )}
                      {formErrors.salaryAlphabet && (
                        <>
                          <br />
                          <span
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              color: "#c1012D",
                              fontWeight: "bold",
                            }}
                          >
                            {formErrors.salaryAlphabet}
                          </span>
                        </>
                      )}
                    </label>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                        // marginTop: "2rem",
                      }}
                    >
                      มีความประสงค์ขอลาไป:{" "}
                      <Select
                        sx={{
                          width: "40%",
                          fontFamily: "Kodchasan",
                          backgroundColor: "#fff",
                          borderRadius: "18px",
                        }}
                        type="text"
                        name="typeStudy"
                        onChange={handleChange}
                        value={formStudy.typeStudy || ""}
                      >
                        <MenuItem
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                          value="ศึกษา"
                        >
                          ศึกษา
                        </MenuItem>
                        <MenuItem
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                          value="ฝึกอบรม"
                        >
                          ฝึกอบรม
                        </MenuItem>
                        <MenuItem
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                          value="ปฏิบัติการวิจัย"
                        >
                          ปฏิบัติการวิจัย
                        </MenuItem>
                        <MenuItem
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                          value="ดูงาน"
                        >
                          ดูงาน
                        </MenuItem>
                      </Select>
                      <br />
                    </label>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {formStudy.typeStudy === "ศึกษา" && (
                      <>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          วิชา:{" "}
                          <input
                            type="text"
                            name="subject"
                            value={formStudy.subject || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          />
                          <br />
                          {formErrors.subject && (
                            <span
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "14px",
                                color: "#c1012D",
                                fontWeight: "bold",
                              }}
                            >
                              {formErrors.subject}
                            </span>
                          )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ขั้นปริญญา:{" "}
                          <input
                            type="text"
                            name="degree"
                            value={formStudy.degree || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.degree && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.degree}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          สถานศึกษา:{" "}
                          <input
                            type="text"
                            name="academy"
                            value={formStudy.academy || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.academy && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.academy}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ประเทศ:{" "}
                          <input
                            type="text"
                            name="countrystudy"
                            value={formStudy.countrystudy || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.countrystudy && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.countrystudy}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ทุน:{" "}
                          <input
                            type="text"
                            name="scholarshipstudy"
                            value={formStudy.scholarshipstudy || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop:"0.3rem"
                            }}
                          />
                          <br />
                          {formErrors.scholarshipstudy && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.scholarshipstudy}
                        </span>
                      )}
                        </label>
                      </>
                    )}

                    {(formStudy.typeStudy === "ฝึกอบรม" ||
                      formStudy.typeStudy === "ปฏิบัติการวิจัย") && (
                      <>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ณ:{" "}
                          <input
                            type="text"
                            name="address"
                            value={formStudy.address || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              
                            }}
                          />
                          <br />
                          {formErrors.address && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.address}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ประเทศ:{" "}
                          <input
                            type="text"
                            name="countrytrain"
                            value={formStudy.countrytrain || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.countrytrain && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.countrytrain}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ทุน:{" "}
                          <input
                            type="text"
                            name="scholartrain"
                            value={formStudy.scholartrain || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.scholartrain && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.scholartrain}
                        </span>
                      )}
                        </label>
                      </>
                    )}

                    {formStudy.typeStudy === "ดูงาน" && (
                      <>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ด้าน/หลักสูตร:{" "}
                          <input
                            type="text"
                            name="course"
                            value={formStudy.course || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          />
                          <br />
                          {formErrors.course && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.course}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ณ:{" "}
                          <input
                            type="text"
                            name="address"
                            value={formStudy.address || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.address && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.address}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ประเทศ:{" "}
                          <input
                            type="text"
                            name="countrytrain"
                            value={formStudy.countrytrain || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.countrytrain && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.countrytrain}
                        </span>
                      )}
                        </label>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            textAlign: "left",
                            display: "block",
                            fontWeight: "normal",
                            // marginTop: "2rem",
                          }}
                        >
                          ทุน:{" "}
                          <input
                            type="text"
                            name="scholartrain"
                            value={formStudy.scholartrain || ""}
                            onChange={handleChange}
                            required
                            style={{
                              width: "60%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              marginTop: "0.3rem",
                            }}
                          />
                          <br />
                          {formErrors.scholartrain && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.scholartrain}
                        </span>
                      )}
                        </label>
                      </>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ textAlign: "left" }}
                  >
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        fontWeight: "normal",
                      }}
                      for="firstDay"
                    >
                      ช่วงวันที่ลา(ระบุเป็นปีค.ศ.):{" "}
                    </label>
                    <ConfigProvider
                      locale={locale}
                      theme={{
                        token: {
                          borderRadius: "8px",
                          fontFamily: "Kodchasan",
                          colorText: "#2f2557",
                          colorBgContainer: "#d6e7fc",
                          colorTextPlaceholder: "#2f2557",
                          colorBgElevated: "#f3f7f8",
                          colorPrimary: "#9db6cf",
                        },
                      }}
                    >
                      <RangePicker
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                        }}
                        onCalendarChange={handleDateChange}
                      />
                    </ConfigProvider>
                    <br />
                    {formErrors.firstDay && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.firstDay}
                      </span>
                    )}
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        // textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      จำนวนวันที่ลา:{" "}
                      {formStudy?.firstDay && formStudy?.lastDay ? (
                        <>
                          <input
                            type="text"
                            name="to"
                            value={`${formStudy.numDay} (${
                              calculateDateDifference().years > 0
                                ? `${calculateDateDifference().years} ปี`
                                : ``
                            }${
                              calculateDateDifference().months > 0
                                ? ` ${calculateDateDifference().months} เดือน`
                                : ``
                            }${
                              calculateDateDifference().days > 0
                                ? ` ${calculateDateDifference().days} วัน`
                                : ``
                            })`}
                            disabled
                            style={{
                              width: "70%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "17px",
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            name="to"
                            disabled
                            style={{
                              width: "70%",
                              padding: "6px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                              boxSizing: "border-box",
                              fontFamily: "Kodchasan",
                              fontSize: "17px",
                            }}
                          />
                        </>
                      )}
                    </p>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ textAlign: "left" }}
                  >
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                      }}
                    >
                      ติดต่อได้ที่:{" "}
                      <input
                        type="text"
                        name="contact"
                        value={formStudy.contact}
                        onChange={handleChange}
                        required
                        style={{
                          width: "60%",
                          padding: "6px",
                          marginTop: "-0.5rem",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      {formErrors.contact && (
                        <>
                          <br />
                          <span
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              color: "#c1012D",
                              fontWeight: "bold",
                            }}
                          >
                            {formErrors.contact}
                          </span>
                        </>
                      )}
                    </label>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      หมายเลขโทรศัพท์:{" "}
                      <input
                        type="text"
                        name="to"
                        value={userData.phone}
                        disabled
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "17px",
                        }}
                      />
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      onClick={showConfirm}
                      style={{
                        borderRadius: 50,
                        width: "50%",
                        marginLeft: "15px",
                        backgroundColor: "#494B67",
                        color: "#f3f7f8",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      // type="submit"
                    >
                      แจ้งลาศึกษาต่อ
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default StudyLeave;
