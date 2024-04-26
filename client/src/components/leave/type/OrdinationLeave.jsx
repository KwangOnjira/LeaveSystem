import locale from "antd/locale/th_TH";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import { findBusinessDays } from "../../../function/BusinessDay";
import { getLastStatistic } from "../../../function/statistic";
import { currentUser } from "../../../function/auth";
import { getHoliday } from "../../../function/holiday";
import { postOLLeave } from "../../../function/leave";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, DatePicker, Modal, Radio } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const OrdinationLeave = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    position: "",
    divisionName: "",
    sub_division: "",
    birthday: "",
    start_of_work_on: "",
  });
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    OL_DayCount: "",
    total_leaveDay: 0,
  });
  const [formOrdination, setFormOrdination] = useState({
    citizenID: "",
    statisticID: "",
    level: "",
    type: "",
    topic: "",
    to: "",
    date: "",
    firstDay: "",
    lastDay: "",
    numDay: "",
    status: "",
    allow: "",
    comment: "",
    useTo: "0",
    nameTemple: "",
    addressTemple: "",
    dateOrdi: "",
    stayTemple: "",
    addressStayTemple: "",
  });
  console.log(formOrdination);
  const [formErrors, setFormErrors] = useState({
    to: "",
    firstDay: "",
    level: "",
    nameTemple: "",
    addressTemple: "",
    dateOrdi: "",
    stayTemple: "",
    addressStayTemple: "",
  });
  console.log(formErrors);

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
          OL_DayCount: fetchStat.data.OL_DayCount,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormOrdination((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          fiscal_year: fetchStat.data.fiscal_year,
          range: fetchStat.data.range,
          start_of_work_on: fetchUser.data.start_of_work_on,
          name: fetchUser.data.name,
          status: fetchUser.data.status,
          position: fetchUser.position,
          divisionName: fetchUser.data.divisionName,
          sub_division: fetchUser.data.sub_division,
          // leave_count: fetchStat.data.leave_count,
          OL_DayCount: fetchStat.data.OL_DayCount,
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
        setFormOrdination((prevData) => ({
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
  const handleDate = (date) => {
    dayjs.locale("th_TH");
    if (date) {
      const Date = date ? dayjs(date).startOf("day").toDate() : null;
      console.log("Date", Date);

      const DateLocal = Date ? dayjs(Date).locale("th_TH").toDate() : null;
      console.log("DateLocal", DateLocal);

      if (Date) {
        // Convert dates to strings with desired format
        const DateLocal = Date.toLocaleDateString("en-US");
        console.log("DateLocal", DateLocal);

        const formattedDateLocal = DateLocal
          ? DateLocal.replace(/-/g, "/")
          : "";
        console.log("formattedDateLocal", formattedDateLocal);

        setFormOrdination((prevData) => ({
          ...prevData,
          dateOrdi: formattedDateLocal,
        }));
      } else {
        console.log("Invalid dates provided");
      }
    }
  };

  const handleChangeUseTo = (e) => {
    const value = e.target.value;
    console.log("in handleChangeUseTo", value);
    setFormOrdination((prevData) => ({
      ...prevData,
      useTo: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.includes("Day") && value && value.$d instanceof Date
        ? value.$d
        : value;

    setFormOrdination((prevData) => {
      return {
        ...prevData,
        [name]: parsedValue || "",
      };
    });
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!formOrdination.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formOrdination.firstDay) {
      errors.firstDay = "กรุณาระบุช่วงวันที่ลา";
    }
    if (!formOrdination.level) {
      errors.level = "กรุณาระบุระดับ";
    }
    if (!formOrdination.nameTemple) {
      errors.nameTemple = "กรุณาระบุชื่อวัด";
    }
    if (!formOrdination.addressTemple) {
      errors.addressTemple = "กรุณาระบุที่ตั้งวัด";
    }
    if (!formOrdination.dateOrdi) {
      errors.dateOrdi = "กรุณาระบุวันที่อุปสมบท";
    }
    if (!formOrdination.stayTemple) {
      errors.stayTemple = "กรุณาระบุชื่อวัดที่จำพรรษา";
    }
    if (!formOrdination.addressStayTemple) {
      errors.addressStayTemple = "กรุณาระบุที่ตั้งวัดที่จำพรรษา";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = dayjs().toDate();
    console.log("formOrdination:", formOrdination);

    try {
      const response = await postOLLeave(
        {
          ...formOrdination,
          topic: "ขอลาอุปสมบท",
          date: currentDate,
          status: "รอผู้ตรวจสอบ",
        },
        localStorage.getItem("token")
      );

      console.log(response.data);
      setFormOrdination(response.data);
    } catch (error) {
      console.log("Post Form Ordination Failed: " + error);
    }
    navigate("/");
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งลาอุปสมบท",
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
        style: { color: "#F7F0C6", backgroundColor: "#dd7631" },
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
            <h2 className="topic-leave">--ลาอุปสมบท--</h2>
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
                        value={formOrdination.level || ""}
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
                      <><br/>
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.level}
                        </span></>
                      )}</p>
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
                        value={formOrdination?.to}
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
                    <div
                      style={{
                        marginTop: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ConfigProvider
                        theme={{
                          token: { borderRadius: 8, colorPrimary: "#cc7952" },
                          components: {
                            Radio: {
                              buttonBg: "#f3f3ea",
                              buttonSolidCheckedBg: "#dd7631",
                              buttonSolidCheckedHoverBg: "#dd7631",
                            },
                          },
                        }}
                      >
                        <Radio.Group
                          onChange={handleChangeUseTo}
                          defaultValue="0"
                          buttonStyle="solid"
                          style={{
                            textAlign: "left",
                            display: "block",
                          }}
                        >
                          <Radio.Button
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "18px",
                              fontWeight: "normal",
                            }}
                            value="1"
                          >
                            เคย
                          </Radio.Button>
                          <Radio.Button
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "18px",
                              fontWeight: "normal",
                            }}
                            value="0"
                          >
                            ไม่เคย
                          </Radio.Button>
                        </Radio.Group>
                      </ConfigProvider>{" "}
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          fontWeight: "normal",
                          marginLeft: "0.6rem",
                        }}
                      >
                        อุปสมบท
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <label
                      style={{
                        marginTop: "0.5rem",
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        display: "block",
                        fontWeight: "normal",
                      }}
                    >
                      ณ วัด:{" "}
                      <input
                        type="text"
                        name="nameTemple"
                        value={formOrdination.nameTemple}
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
                      {formErrors.nameTemple && (
                      <><br/>
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.nameTemple}
                        </span></>
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
                      ตั้งอยู่ ณ:{" "}
                      <input
                        type="text"
                        name="addressTemple"
                        value={formOrdination.addressTemple}
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
                      {formErrors.addressTemple && (
                      <><br/>
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.addressTemple}
                        </span></>
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
                      กำหนดอุปสมบทวันที่:{" "}
                      <ConfigProvider
                        locale={locale}
                        theme={{
                          token: {
                            borderRadius: "8px",
                            fontFamily: "Kodchasan",
                            colorText: "#dd7631",
                          colorBgContainer: "#F7F0C6",
                          colorTextPlaceholder: "#dd7631",
                          colorBgElevated: "#F7F0C6",
                          colorPrimary: "#ce796B",
                          },
                        }}
                      >
                        <DatePicker
                          onChange={handleDate}
                          style={{}}
                        ></DatePicker>
                      </ConfigProvider>
                      {formErrors.dateOrdi && (
                      <><br/>
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.dateOrdi}
                        </span></>
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
                      จำพรรษาอยู่ ณ:{" "}
                      <input
                        type="text"
                        name="stayTemple"
                        value={formOrdination.stayTemple}
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
                      {formErrors.stayTemple && (
                      <><br/>
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.stayTemple}
                        </span></>
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
                      ตั้งอยู่ ณ:{" "}
                      <input
                        type="text"
                        name="addressStayTemple"
                        value={formOrdination.addressStayTemple}
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
                      {formErrors.addressStayTemple && (
                      <><br/>
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.addressStayTemple}
                        </span></>
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
                    <ConfigProvider
                      locale={locale}
                      theme={{
                        token: {
                          borderRadius: "8px",
                          fontFamily: "Kodchasan",
                          colorText: "#dd7631",
                          colorBgContainer: "#F7F0C6",
                          colorTextPlaceholder: "#dd7631",
                          colorBgElevated: "#F7F0C6",
                          colorPrimary: "#ce796B",
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
                      {formOrdination?.firstDay && formOrdination?.lastDay ? (
                        <>
                          <input
                            type="text"
                            name="to"
                            value={`${formOrdination?.numDay} วัน`}
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
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    onClick={showConfirm}
                    style={{
                      borderRadius: 50,
                      width: "50%",
                      marginLeft: "15px",
                      backgroundColor: "#e5bd77",
                      color: "#943d2c",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                    // type="submit"
                  >
                    แจ้งลาอุปสมบท
                  </Button>
                </Grid>
              </form>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default OrdinationLeave;
