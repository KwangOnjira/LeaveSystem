import React, { useEffect, useState } from "react";
import locale from "antd/locale/th_TH";
import { useNavigate, useParams } from "react-router-dom";
import { currentUser } from "../../../function/auth";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from 'moment';
import {
  getLeavebyUserID,
  postCancel,
  updateAllowLeave,
} from "../../../function/cancel";
import {
  Box,
  Button,
  Container,
  createTheme,
  Select,
  MenuItem,
  ThemeProvider,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { findBusinessDays } from "../../../function/BusinessDay";
import { getHoliday } from "../../../function/holiday";
import dayjs from "dayjs";
import { ConfigProvider, DatePicker, Modal } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const CancelLeave = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const { leaveID } = useParams();
  const [userData, setUserData] = useState({
    prefix: "",
    name: "",
    surname: "",
    position: "",
    divisionName: "",
  });
  const [vacationData, setVacationData] = useState([]);
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [formCancel, setFormCancel] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
    topic: "ขอยกเลิกวันลา",
    to: "",
    reason: "",
    date: "",
    cancelFirstDay: null,
    cancelLastDay: null,
    cancelNumDay: "",
    status: "",
    allow: "",
    comment: "",
    typeCount: "all",
  });
  console.log(formCancel);
  const [formErrors, setFormErrors] = useState({
    to: "",
    reason: "",
    cancelFirstDay: "",
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

        const fetchLeave = await getLeavebyUserID(
          leaveID,
          localStorage.getItem("token")
        );
        console.log(fetchLeave.data);
        setVacationData(fetchLeave.data);

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);
      } catch (error) {
        console.log("Error fetching data: " + error);
      }
    };
    fetchData();
  }, []);
  console.log("vacationDT", vacationData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name.includes("Day") && value && value.$d instanceof Date
        ? value.$d
        : value;

    setFormCancel((prevData) => {
      if (name === "typeCount") {
        console.log("Type Count Value:", value);
        return {
          ...prevData,
          cancelNumDay: "",
          cancelFirstDay: "",
          cancelLastDay: "",
          [name]: value || "",
        };
      }

      if (name === "cancelFirstDay" || name === "cancelLastDay") {
        const businessDays = findBusinessDays(
          name === "cancelFirstDay"
            ? parsedValue || new Date()
            : prevData.cancelFirstDay,
          name === "cancelLastDay"
            ? parsedValue || new Date()
            : prevData.cancelLastDay,
          holiData
        );

        let newNumDay = 0;
        try {
          if (
            formCancel.typeCount == "morning" ||
            formCancel.typeCount == "afternoon"
          ) {
            newNumDay = businessDays * 0.5;
            console.log("newNumDay:", newNumDay);
          } else if (formCancel.typeCount == "all") {
            newNumDay = businessDays;
            console.log("newNumDay:", newNumDay);
          }
        } catch (error) {
          console.log(error);
        }

        return {
          ...prevData,
          cancelNumDay: newNumDay,
          [name]: parsedValue || null,
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
    if (!formCancel.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formCancel.reason) {
      errors.reason = "กรุณาระบุเหตุผล";
    }
    if (!formCancel.cancelFirstDay) {
      errors.cancelFirstDay = "กรุณาระบุวันที่จะยกเลิกลา";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = dayjs().toDate();
    console.log("formCancel:", formCancel);
    try {
      const response = await postCancel(
        {
          ...formCancel,
          leaveID: leaveID,
          topic: "ขอยกเลิกวันลา",
          date: currentDate,
          status: "รอผู้ตรวจสอบ",
          statisticID: vacationData[0].statisticID,
        },
        localStorage.getItem("token")
      );
      console.log(response.data);
      setFormCancel(response.data);

      const update = await updateAllowLeave(
        leaveID,
        { cancelOrNot: true },
        localStorage.getItem("token")
      );
      console.log("response in updateLeave", update);
      navigate("/");
    } catch (error) {
      console.log("Post Form Sick Failed: " + error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งยกเลิกลา",
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
          formCancel.typeCount === "morning" ||
          formCancel.typeCount === "afternoon"
        ) {
          newNumDay = businessDays * 0.5;
        } else if (formCancel.typeCount === "all") {
          newNumDay = businessDays;
        }
      } catch (error) {
        console.log(error);
      }

      if (firstDay && lastDay) {
        const firstDayLocal = firstDay.toLocaleDateString("en-US");
        const lastDayLocal = lastDay.toLocaleDateString("en-US");

        const formattedFirstDay = firstDayLocal
          ? firstDayLocal.replace(/-/g, "/")
          : "";
        const formattedLastDay = lastDayLocal
          ? lastDayLocal.replace(/-/g, "/")
          : "";

        // Update state with formatted dates
        setFormCancel((prevData) => ({
          ...prevData,
          cancelNumDay: newNumDay,
          cancelFirstDay: formattedFirstDay,
          cancelLastDay: formattedLastDay,
        }));
      } else {
        console.log("Invalid dates provided");
      }
      // console.log("selectfirstDay", cancelFirstDay);
      // console.log("selectlastDay", cancelLastDay);
      console.log("numDay", newNumDay);
    }
  };

  const disabledDate = (current) => {
    const firstDay = vacationData[0]?.firstDay;
    const lastDay = vacationData[0]?.lastDay;
    
    if (firstDay && lastDay) {
      return current < moment(firstDay) || current > moment(lastDay);
    }
    
    return false;
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
              // textAlign: "center",
            }}
          >
            <h1 className="topic-leave" style={{ textAlign: "center" }}>
              ขอยกเลิกวันลา
            </h1>
            {userData && (
              <form>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      เรียน:{" "}
                    </label>
                    <input
                      type="text"
                      name="to"
                      value={formCancel.to}
                      onChange={handleChange}
                      required
                      style={{
                        width: "80%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                      placeholder="เรียน"
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

                    <h3
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      ได้รับอนุญาตให้ลาพักผ่อนตั้งแต่วันที่{" "}
                      {vacationData.length > 0 &&
                        formatLeaveDate(vacationData[0].firstDay)}{" "}
                      ถึงวันที่
                      {vacationData.length > 0 &&
                        formatLeaveDate(vacationData[0].lastDay)}{" "}
                      รวม {vacationData.length > 0 && vacationData[0].numDay}{" "}
                      วัน
                    </h3>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      เนื่องจาก:{" "}
                    </label>
                    <input
                      type="text"
                      name="reason"
                      value={formCancel.reason}
                      onChange={handleChange}
                      required
                      placeholder="ระบุเหตุผล"
                      style={{
                        width: "60%",
                        marginTop: "1rem",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "17px",
                      }}
                    />
                    <br/>
                    {formErrors.reason && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.reason}
                        </span>
                      )}
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "normal",
                      }}
                    >
                      จึงขอยกเลิกวันลาพักผ่อน
                    </p>
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
                      value={formCancel?.typeCount}
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
                    {formCancel.typeCount != null && (
                      <>
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            fontWeight: "normal",
                          }}
                          for="cancelFirstDay"
                        >
                          ช่วงวันที่ลา(ระบุเป็นปีค.ศ.):{" "}
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
                          <RangePicker disabledDate={disabledDate}
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
                        {formErrors.cancelFirstDay && (
                          <span
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              color: "#c1012D",
                              fontWeight: "bold",
                            }}
                          >
                            {formErrors.cancelFirstDay}
                          </span>
                        )}
                        <p
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "18px",
                            fontWeight: "normal",
                          }}
                        >
                          จำนวนวันที่ลา:{" "}
                          {formCancel.cancelFirstDay &&
                          formCancel.cancelLastDay ? (
                            <>
                              <input
                                type="text"
                                name="to"
                                value={`${formCancel?.cancelNumDay} วัน`}
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
                      แจ้งยกเลิกลา
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

export default CancelLeave;
