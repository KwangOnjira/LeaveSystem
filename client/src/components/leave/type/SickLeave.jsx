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
import {
  // createStat,
  // getCheckLastStatistic,
  getLastStatistic,
} from "../../../function/statistic";
import { getHoliday } from "../../../function/holiday";
import { postSLLeave, prevLeaveOfUserID } from "../../../function/leave";
import { currentUser } from "../../../function/auth";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, DatePicker, Modal } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const SickLeave = () => {
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
    SL_lastLeave: "",
    SL_thisLeave: "",
    SL_remaining: "",
    total_leaveDay: 0,
  });
  const [formSick, setFormSick] = useState({
    citizenID: "",
    statisticID: "",
    type: "sickleave",
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
    files: null,
  });
  const [prevSick, setPrevSick] = useState({
    citizenID: "",
    leaveID: "",
    statisticID: "",
    type: "sickleave",
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
  console.log(formSick);

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
        console.log("fetchStat.data", fetchStat.data);
        setStatData(fetchStat.data);

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        const fetchPrevLeave = await prevLeaveOfUserID(
          formSick.type,
          fetchStat.data.fiscal_year,
          localStorage.getItem("token")
        );
        console.log(fetchPrevLeave.data);
        setPrevSick(fetchPrevLeave.data);

        setStatData((prevData) => ({
          ...prevData,
          // leave_count: fetchStat.data.leave_count,
          SL_remaining: fetchStat.data.SL_remaining,
          total_leaveDay: fetchStat.data.total_leaveDay,
        }));

        setFormSick((prevData) => ({
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
          SL_remaining: fetchStat.data.SL_remaining,
        }));
      } catch (err) {
        console.log("Error fetching user data: " + err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.includes("Day") && value && value.$d instanceof Date
        ? value.$d
        : value;

    setFormSick((prevData) => {
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
          formSick.typeCount === "morning" ||
          formSick.typeCount === "afternoon"
        ) {
          newNumDay = businessDays * 0.5;
        } else if (formSick.typeCount === "all") {
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
        setFormSick((prevData) => ({
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

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormSick((prevData) => ({
      ...prevData,
      files: Array.from(files),
    }));
    console.log("files", files);
    console.log("files[0]", files[0].name);
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!formSick.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formSick.firstDay) {
      errors.firstDay = "กรุณาระบุช่วงวันที่ลา";
    }
    if (!formSick.contact) {
      errors.contact = "กรุณาระบุข้อมูลที่ติดต่อได้";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = dayjs().toDate();
    console.log("formSick:", formSick);

    try {
      const formData = new FormData();
      // Append other form fields
      formData.append("citizenID", formSick.citizenID);
      formData.append("statisticID", formSick.statisticID);
      formData.append("fiscal_year", formSick.fiscal_year);
      formData.append("range", formSick.range);
      formData.append("type", formSick.type);
      formData.append("topic", "ขอลาป่วย");
      formData.append("to", formSick.to);
      formData.append("date", currentDate);
      formData.append("contact", formSick.contact);
      formData.append("firstDay", formSick.firstDay);
      formData.append("lastDay", formSick.lastDay);
      formData.append("numDay", formSick.numDay);
      formData.append("status", "รอผู้ตรวจสอบ");
      formData.append("reason", formSick.reason);
      formData.append("typeCount", formSick.typeCount);
      formData.append("allow", formSick.allow);

      if (formSick.files && Array.isArray(formSick.files)) {
        for (let i = 0; i < formSick.files.length; i++) {
          formData.append("files", formSick.files[i]);
          // console.log(`formSick.files[${i}]`,formSick.files[i])
        }
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log(formData);

      const response = await postSLLeave(
        formData,
        localStorage.getItem("token")
      );

      console.log("response.data From PostSick:", response.data);
      setFormSick(response.data);
    } catch (error) {
      console.log("Post Form Sick Failed: " + error);
    }
    navigate("/");
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งลาป่วย",
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
        style: { color: "#e4e1d0", backgroundColor: "#684929" },
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
            <h2 className="topic-leave">--ลาป่วย--</h2>
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
                        name="name"
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
                        name="position"
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
                        name="division"
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
                        value={formSick?.to}
                        onChange={handleChange}
                        required
                        style={{
                          width: "60%",
                          marginTop: "1rem",
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
                      ลาป่วย เนื่องจาก:{" "}
                      <input
                        type="text"
                        name="reason"
                        value={formSick.reason}
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
                      value={formSick?.typeCount}
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
                    {formSick?.typeCount != null && (
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
                          colorText: "#684929",
                          colorBgContainer: "#ebdbce",
                          colorTextPlaceholder: "#684929",
                          colorBgElevated: "#fcf3e9",
                          colorPrimary: "#e09132",
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
                      {formSick?.firstDay && formSick?.lastDay ? (
                        <>
                          <input
                            type="text"
                            name="to"
                            value={`${formSick?.numDay} วัน`}
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
                        value={formSick.contact}
                        onChange={handleChange}
                        required
                        style={{
                          width: "60%",
                          padding: "6px",
                          marginTop:"-0.5rem",
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
                      แนบเอกสารรับรองแพทย์(ถ้ามี):
                      <label
                        htmlFor="file-upload"
                        className="custom-file-input"
                      >
                        เลือกไฟล์
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        name="files"
                        onChange={handleFileChange}
                        multiple
                      />
                      {formSick.files && (
                        <>
                          <p
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "16px",
                              marginLeft: "1rem",
                            }}
                          >
                            ไฟล์ที่แนบมา:
                          </p>
                          {formSick.files.map((file, index) => (
                            <p
                              style={{
                                fontFamily: "Kodchasan",
                                fontSize: "16px",
                                marginLeft: "2rem",
                              }}
                              key={index}
                            >
                              {file.name}
                            </p>
                          ))}
                        </>
                      )}
                    </p>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {prevSick != null ? (
                      <>
                        <h4
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            // textAlign: "left",
                            fontWeight: "normal",
                          }}
                        >
                          ลาป่วยครั้งสุดท้าย ตั้งแต่วันที่
                          {formatLeaveDate(prevSick.firstDay)} ถึงวันที่{" "}
                          {formatLeaveDate(prevSick.lastDay)} มีกำหนด{" "}
                          {prevSick.numDay} วัน
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
                          ลาป่วยครั้งสุดท้าย ตั้งแต่วันที่ - ถึงวันที่ - มีกำหนด
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
                        backgroundColor: "#684929",
                        color: "#F4ECDC",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      // type="submit"
                    >
                      แจ้งลาป่วย
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

export default SickLeave;
