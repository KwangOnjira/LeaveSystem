import locale from "antd/locale/th_TH";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { findBusinessDays } from "../../../function/BusinessDay";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { postMLLeave, prevLeaveOfUserID } from "../../../function/leave";
import {
  Box,
  Button,
  Container,
  createTheme,
  Select,
  MenuItem,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, DatePicker, Modal } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const MaternityLeave = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    divisionName: "",
    sub_division: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    ML_DayCount: "",
    total_leaveDay: 0,
  });
  const [formMaternity, setFormMaternity] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
    type: "maternityleave",
    topic: "",
    to: "",
    date: "",
    contact: "",
    firstDay: "",
    lastDay: "",
    numDay: "",
    status: "",
    allow: "",
    comment: "",
  });
  const [prevMaternity, setPrevMaternity] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
    type: "maternityleave",
    topic: "",
    to: "",
    date: "",
    contact: "",
    firstDay: "",
    lastDay: "",
    numDay: "",
    status: "",
    allow: "",
    comment: "",
  });
  console.log(formMaternity);
  const [formErrors, setFormErrors] = useState({
    to: "",
    firstDay: "",
    contact: "",
  });
  console.log(formErrors);

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setUserData(fetchUser.data);

        const fetchStat = await getLastStatistic(localStorage.getItem("token"));
        console.log("fetchStat.data",fetchStat.data);
        setStatData(fetchStat.data);

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        const fetchPrevLeave = await prevLeaveOfUserID(
          formMaternity.type,
          fetchStat.data.fiscal_year,
          localStorage.getItem("token")
        );
        console.log(fetchPrevLeave.data);
        setPrevMaternity(fetchPrevLeave.data);

        setStatData((prevData) => ({
          ...prevData,
          // leave_count: fetchStat.data.leave_count,
          ML_DayCount: fetchStat.data.ML_DayCount,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormMaternity((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          fiscal_year: fetchStat.data.fiscal_year,
          range: fetchStat.data.range,
          name: fetchUser.data.name,
          status: fetchUser.data.status,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          // leave_count: fetchStat.data.leave_count,
          ML_DayCount: fetchStat.data.ML_DayCount,
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
      const lastDay = dates[1] ? dayjs(dates[1]).startOf("day").toDate() : null;

      // Convert to local timezone
      const firstDayLocal = firstDay
        ? dayjs(firstDay).locale("th_TH").toDate()
        : null;
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
        const formattedLastDay = lastDayLocal
          ? lastDayLocal.replace(/-/g, "/")
          : "";

        // Update state with formatted dates
        setFormMaternity((prevData) => ({
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

    setFormMaternity((prevData) => {
      return {
        ...prevData,
        [name]: parsedValue || "",
      };
    });
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!formMaternity.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formMaternity.firstDay) {
      errors.firstDay = "กรุณาระบุช่วงวันที่ลา";
    }
    if (!formMaternity.contact) {
      errors.contact = "กรุณาระบุข้อมูลที่ติดต่อได้";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = dayjs().toDate();
    console.log("formMaternity:", formMaternity);

    try {
      const response = await postMLLeave(
        {
          ...formMaternity,
          topic: "ขอลาคลอด",
          date: currentDate,
          status: "รอผู้ตรวจสอบ",
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormMaternity(response.data);
    } catch (error) {
      console.log("Post Form Maternity Failed: " + error);
    }

    navigate("/");
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งลาคลอด",
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
        style: { color: "#edeef3", backgroundColor: "#d0637c" },
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
            <h2 className="topic-leave">--ลาคลอด--</h2>
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
                    >ชื่อ-นามสกุล:{" "}
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
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                      }}
                    >
                      เรียน:{" "}
                      <input
                        type="text"
                        name="to"
                        value={formMaternity?.to}
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
                        <ConfigProvider locale={locale} theme={{
                        token: {
                          borderRadius: "8px",
                          fontFamily: "Kodchasan",
                          colorText: "#D7878A",
                          colorBgContainer: "#fcd5ce",
                          colorTextPlaceholder: "#D7878A",
                          colorBgElevated: "#f8edeb",
                          colorPrimary: "#dd7b88",
                        },
                      }}>
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
                      {formMaternity?.firstDay && formMaternity?.lastDay ? (
                        <>
                          <input
                            type="text"
                            name="to"
                            value={`${formMaternity?.numDay} วัน`}
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
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                        value={formMaternity.contact}
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
                    {prevMaternity != null ? (
                  <>
                    <h4 style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            // textAlign: "left",
                            fontWeight: "normal",
                          }}>
                      ลาคลอดครั้งสุดท้าย ตั้งแต่วันที่
                      {formatLeaveDate(prevMaternity.firstDay)} ถึงวันที่{" "}
                      {formatLeaveDate(prevMaternity.lastDay)} มีกำหนด{" "}
                      {prevMaternity.numDay} วัน
                    </h4>
                  </>
                ) : (
                  <>
                    <h4 style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            // textAlign: "left",
                            fontWeight: "normal",
                          }}>
                      ลาคลอดครั้งสุดท้าย ตั้งแต่วันที่ - ถึงวันที่ - มีกำหนด -
                      วัน{" "}
                    </h4>
                  </>
                )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                      onClick={showConfirm}
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
                      // type="submit"
                    >
                      แจ้งลาคลอด
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

export default MaternityLeave;
