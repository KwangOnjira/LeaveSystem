import locale from "antd/locale/th_TH";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { findBusinessDays } from "../../../function/BusinessDay";
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
import { getLastStatistic } from "../../../function/statistic";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { postPLLeave, prevLeaveOfUserID } from "../../../function/leave";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, DatePicker, Modal } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const PersonalLeave = () => {
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
    leave_count: 0,
    PL_lastLeave: "",
    PL_thisLeave: "",
    PL_remaining: "",
    total_leaveDay: 0,
  });
  const [formPersonal, setFormPersonal] = useState({
    citizenID: "",
    statisticID: "",
    type: "personalleave",
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
    reason: "",
    typeCount: "all",
  });
  const [prevPersonal, setPrevPersonal] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
    type: "personalleave",
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
    reason: "",
    typeCount: null,
  });
  console.log(formPersonal);
  const [formErrors, setFormErrors] = useState({
    to: "",
    reason: "",
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
        console.log(fetchStat.data);
        setStatData(fetchStat.data);

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        const fetchPrevLeave = await prevLeaveOfUserID(
          formPersonal.type,
          fetchStat.data.fiscal_year,
          localStorage.getItem("token")
        );
        console.log(fetchPrevLeave.data);
        setPrevPersonal(fetchPrevLeave.data);

        setStatData((prevData) => ({
          ...prevData,
          // leave_count: fetchStat.data.leave_count,
          PL_remaining: fetchStat.data.PL_remaining,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormPersonal((prevData) => ({
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
          PL_remaining: fetchStat.data.PL_remaining,
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

      let newNumDay = 0;
      try {
        if (
          formPersonal.typeCount === "morning" ||
          formPersonal.typeCount === "afternoon"
        ) {
          newNumDay = businessDays * 0.5;
        } else if (formPersonal.typeCount === "all") {
          newNumDay = businessDays;
        }
      } catch (error) {
        console.log(error);
      }

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
        setFormPersonal((prevData) => ({
          ...prevData,
          numDay: newNumDay,
          firstDay: formattedFirstDay,
          lastDay: formattedLastDay,
        }));
      } else {
        console.log("Invalid dates provided");
      }
      console.log("selectfirstDay", firstDay);
      console.log("selectlastDay", lastDay);
      console.log("numDay", newNumDay);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.includes("Day") && value && value.$d instanceof Date
        ? value.$d
        : value;

    setFormPersonal((prevData) => {
      //clear numDay
      if (name === "typeCount") {
        console.log("Type Count Value:", value);
        return {
          ...prevData,
          numDay: "",
          firstDay: "",
          lastDay: "",
          [name]: value || "",
        };
      } else {
        return {
          ...prevData,
          [name]: parsedValue || "",
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!formPersonal.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formPersonal.firstDay) {
      errors.firstDay = "กรุณาระบุช่วงวันที่ลา";
    }
    if (!formPersonal.contact) {
      errors.contact = "กรุณาระบุข้อมูลที่ติดต่อได้";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = dayjs().toDate();
    console.log("formPersonal:", formPersonal);

    try {
      const response = await postPLLeave(
        {
          ...formPersonal,
          topic: "ขอลากิจ",
          date: currentDate,
          status: "รอผู้ตรวจสอบ",
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormPersonal(response.data);
    } catch (error) {
      console.log("Post Form Personal Failed: " + error);
    }
    navigate("/");
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งลากิจส่วนตัว",
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
        style: { color: "#495784", backgroundColor: "#C3D6D2" },
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
            <h2 className="topic-leave">--ลากิจส่วนตัว--</h2>

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
                        value={formPersonal?.to}
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
                      }}
                    >
                      ลากิจส่วนตัว เนื่องจาก:{" "}
                      <input
                        type="text"
                        name="reason"
                        value={formPersonal.reason}
                        onChange={handleChange}
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
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                      }}
                    >
                      ประเภทการลา{" "}
                    </label>

                    <Select
                      sx={{
                        width: "50%",
                        marginTop: "0.5rem",
                        marginBottom: "1rem",
                        fontFamily: "Kodchasan",
                        textAlign: "left",
                        backgroundColor: "#fff",
                        borderRadius: "18px",
                      }}
                      name="typeCount"
                      onChange={(e) => handleChange(e)}
                      value={formPersonal?.typeCount}
                      // defaultValue={"morning"}
                    >
                      <MenuItem
                        value="morning"
                        sx={{ fontFamily: "Kodchasan" }}
                      >
                        ครึ่งเช้า
                      </MenuItem>
                      <MenuItem
                        value="afternoon"
                        sx={{ fontFamily: "Kodchasan" }}
                      >
                        ครึ่งบ่าย
                      </MenuItem>
                      <MenuItem value="all" sx={{ fontFamily: "Kodchasan" }}>
                        ทั้งวัน
                      </MenuItem>
                    </Select>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#c11",
                        marginTop: "-1rem",
                      }}
                    >
                      หากเปลี่ยนประเภทการลา กรุณาเลือกช่วงวันที่ลาใหม่
                    </p>
                    {/* <br /> */}
                    {formPersonal?.typeCount != null && (
                      <>
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
                          colorText: "#485778",
                          colorBgContainer: "#cddee5",
                          colorTextPlaceholder: "#485778",
                          colorBgElevated: "#e6f0f2",
                          colorPrimary: "#5d7599",
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
                      </>
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
                      {formPersonal?.firstDay && formPersonal?.lastDay ? (
                        <>
                          <input
                            type="text"
                            name="to"
                            value={`${formPersonal?.numDay} วัน`}
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
                        value={formPersonal.contact}
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
                    {prevPersonal != null ? (
                      <>
                        <h4
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            // textAlign: "left",
                            fontWeight: "normal",
                          }}
                        >
                          ลากิจครั้งสุดท้าย ตั้งแต่วันที่
                          {formatLeaveDate(
                            prevPersonal.firstDay
                          )} ถึงวันที่ {formatLeaveDate(prevPersonal.lastDay)}{" "}
                          มีกำหนด {prevPersonal.numDay} วัน
                        </h4>
                      </>
                    ) : (
                      <>
                        <h4
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            // textAlign: "left",
                            fontWeight: "normal",
                          }}
                        >
                          ลากิจครั้งสุดท้าย ตั้งแต่วันที่ - ถึงวันที่ - มีกำหนด
                          - วัน{" "}
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
                        backgroundColor: "#cddee5",
                        color: "#485778",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      // type="submit"
                    >
                      แจ้งลากิจ
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

export default PersonalLeave;
