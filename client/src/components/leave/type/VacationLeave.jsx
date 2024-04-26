import locale from "antd/locale/th_TH";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
import { postVLLeave } from "../../../function/leave";
import { getUserinSameDivision } from "../../../function/deputy";
import { ConfigProvider, DatePicker, Modal } from "antd";
const { RangePicker } = DatePicker;
import { LeftOutlined } from "@ant-design/icons";

const VacationLeave = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [selectedDeputy, setSelectedDeputy] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    position: "",
  });
  const [deputyData, setDeputyData] = useState([]);
  const [holiData, setHoliData] = useState({
    name: "",
    date: "",
  });
  const [statData, setStatData] = useState({
    leave_count: "",
    leave_rights: "",
    VL_accumulatedDays: "",
    VL_total: "",
    VL_lastLeave: "",
    VL_thisLeave: "",
    currentUseVL: "",
    VL_remaining: "",
  });
  const [formVacation, setFormVacation] = useState({
    leaveID: "",
    citizenID: "",
    statisticID: "",
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
    typeCount: "all",
    accumulatedDays: "",
    leaveRights: "",
    totalDay: "",
  });
  console.log(formVacation);

  const [formErrors, setFormErrors] = useState({
    to: "",
    typeCount: "",
    firstDay: "",
    lastDay: "",
    contact: "",
    deputyName: "",
  });
  console.log(formErrors);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setUserData(fetchUser.data);

        const fetchStat = await getLastStatistic(localStorage.getItem("token"));
        console.log("Fetch Stat Response:", fetchStat.data);
        if (fetchStat) {
          setStatData(fetchStat.data);
          console.log("Updated statData:", fetchStat.data);
        } else {
          console.log("No statistics found for the user");
        }

        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log(fetchHoliday.data);
        setHoliData(fetchHoliday.data);

        const fetchDeputy = await getUserinSameDivision(
          localStorage.getItem("token")
        );
        console.log("fetchDeputy: ", fetchDeputy.data);
        setDeputyData(fetchDeputy.data);

        setStatData((prevData) => ({
          ...prevData,
          // leave_count: fetchStat.data.leave_count,
          leave_rights: fetchStat.data.leave_rights,
          VL_accumulatedDays: fetchStat.data.VL_accumulatedDays,
          VL_total: fetchStat.data.VL_total,
          VL_lastLeave: fetchStat.data.VL_lastLeave,
          VL_thisLeave: fetchStat.data.VL_thisLeave,
          currentUseVL: fetchStat.data.currentUseVL,
          VL_remaining: fetchStat.data.VL_remaining,
        }));

        setFormVacation((prevData) => ({
          ...prevData,
          citizenID: fetchUser.data.citizenID,
          statisticID: fetchStat.data.statisticID,
          fiscal_year: fetchStat.data.fiscal_year,
          range: fetchStat.data.range,
          name: fetchUser.data.name,
          status: fetchUser.data.status,
          position: fetchUser.position,
          // leave_count: fetchStat.data.leave_count,
          leave_rights: fetchStat.data.leave_rights,
          VL_accumulatedDays: fetchStat.data.VL_accumulatedDays,
          VL_total: fetchStat.data.VL_total,
          VL_lastLeave: fetchStat.data.VL_lastLeave,
          VL_thisLeave: fetchStat.data.VL_thisLeave,
          currentUseVL: fetchStat.data.currentUseVL,
          VL_remaining: fetchStat.data.VL_remaining,
        }));
      } catch (err) {
        console.log("Error fetching data: " + err);
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

    setFormVacation((prevData) => {
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
          formVacation.typeCount === "morning" ||
          formVacation.typeCount === "afternoon"
        ) {
          newNumDay = businessDays * 0.5;
        } else if (formVacation.typeCount === "all") {
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
        setFormVacation((prevData) => ({
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

  const handleSubmit = async (e) => {
    let errors = {};
    if (!formVacation.to) {
      errors.to = "กรุณาระบุว่าต้องการเรียนถึงใคร";
    }
    if (!formVacation.firstDay) {
      errors.firstDay = "กรุณาระบุช่วงวันที่ลา";
    }
    if (!formVacation.contact) {
      errors.contact = "กรุณาระบุข้อมูลที่ติดต่อได้";
    }
    if (!selectedDeputy) {
      errors.deputyName = "กรุณาระบุชื่อผู้รับมอบงาน";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentDate = dayjs().toDate();
    console.log("formVacation:", formVacation);
    navigate("/");
    try {
      const response = await postVLLeave(
        {
          ...formVacation,
          topic: "ขอลาพักผ่อน",
          date: currentDate,
          status: "รอผู้ปฏิบัติหน้าที่แทน",
          deputyName: selectedDeputy,
        },
        localStorage.getItem("token")
      );

      console.log("sent", response.data);
      setFormVacation(response.data);
    } catch (error) {
      console.log("Post Form Vacation Failed: " + error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลการแจ้งลาพักผ่อน",
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
        style: { color: "#e4e1d0", backgroundColor: "#274625" },
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
            <h2 className="topic-leave">--ลาพักผ่อน--</h2>
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
                      มีวันลาสะสม:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${statData.VL_accumulatedDays} วัน`}
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
                      สิทธิ์วันลาที่มี:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${statData.leave_rights} วัน`}
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
                      รวมเป็น:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${statData.VL_total} วัน`}
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
                        // marginTop:"-1rem",
                      }}
                    >
                      ลาพักผ่อนไปแล้ว:{" "}
                      <input
                        type="text"
                        name="to"
                        value={`${
                          statData.VL_total - statData.VL_remaining
                        } วัน`}
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
                        value={formVacation?.to}
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
                        textAlign: "left",
                        marginTop: "1rem",
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
                      value={formVacation?.typeCount}
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
                    <br />
                    {formVacation?.typeCount != null && (
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
                          colorText: "#274625",
                          colorBgContainer: "#acbb90",
                          colorTextPlaceholder: "#424530",
                          colorBgElevated: "#f3f3ea",
                          colorPrimary: "#84a725",
                        },
                      }}>
                          <RangePicker
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "18px",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              width:"30%"
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
                      จำนวนวันที่ลา:
                      {formVacation?.firstDay && formVacation?.lastDay ? (
                        <>
                          <input
                            type="text"
                            name="to"
                            value={`${formVacation?.numDay} วัน`}
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
                          />{" "}
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
                          />{" "}
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
                        value={formVacation?.contact}
                        onChange={handleChange}
                        required
                        // placeholder="Enter your contact"
                        style={{
                          width: "50%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      <br />
                      {formErrors.contact && (
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
                        marginTop: "1rem",
                      }}
                    >
                      ผู้รับมอบ:
                    </label>
                    <Select
                      sx={{
                        width: "100%",
                        margin: "0.5rem",
                        fontFamily: "Kodchasan",
                        backgroundColor: "#fff",
                        borderRadius: "18px",
                      }}
                      defaultValue={null}
                      value={selectedDeputy}
                      onChange={(e) => {
                        e.preventDefault(), setSelectedDeputy(e.target.value);
                      }}
                    >
                      {Array.isArray(deputyData) &&
                        deputyData.length > 0 &&
                        deputyData.map((deputy) => (
                          <MenuItem
                            sx={{
                              fontFamily: "Kodchasan",
                            }}
                            key={deputy.id}
                            value={`${deputy.prefix} ${deputy.name} ${deputy.surname} (${deputy.position}) (${deputy.citizenID})`}
                          >
                            {deputy.prefix} {deputy.name} {deputy.surname}
                          </MenuItem>
                        ))}
                    </Select>
                    {formErrors.deputyName && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.deputyName}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      onClick={showConfirm}
                      style={{
                        borderRadius: 50,
                        width: "50%",
                        marginTop: "2rem",
                        marginLeft: "15px",
                        backgroundColor: "#274625",
                        color: "#FFEFCD",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      // type="submit"
                    >
                      แจ้งลาพักผ่อน
                    </Button>
                  </Grid>
                </Grid>
                <br />
                {/* <SubmitButtonAndModal
            open={open}
            setOpen={setOpen}
            handleSubmit={handleSubmit}
            msg={"ลาพักผ่อนสำเร็จ"}
            msgdetail={"ข้อมูลการลาของคุณถูกส่งไปให้ผู้ตรวจสอบแล้ว"}
          /> */}
              </form>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default VacationLeave;
