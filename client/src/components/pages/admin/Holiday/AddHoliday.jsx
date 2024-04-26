import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createHoliday } from "../../../../function/holiday";
import dayjs from "dayjs";
import { Button, Box, createTheme, ThemeProvider, Grid } from "@mui/material";
import locale from "antd/locale/th_TH";
import { ConfigProvider, DatePicker } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const AddHoliday = () => {
  const navigate = useNavigate();
  const [holidaydata, setHolidayData] = useState({ name: "", date: "" });
  console.log(holidaydata);

  const [formErrors, setFormErrors] = useState({
    name: "",
    date: "",
  });
  console.log(formErrors);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHolidayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

        setHolidayData((prevData) => ({
          ...prevData,
          date: formattedDateLocal,
        }));
      } else {
        console.log("Invalid dates provided");
      }
    }
  };

  const handleSubmit = async (e) => {
    let errors = {};
    if (!holidaydata.name) {
      errors.name = "กรุณาระบุชื่อวัน";
    }
    if (!holidaydata.date) {
      errors.date = "กรุณาระบุวันที่";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      createHoliday(holidaydata, localStorage.getItem("token"));
      console.log("Add holiday Successful");
      navigate("/admin/holiday");
    } catch (error) {
      console.log("Registration Failed: " + error);
    }
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
        <LeftOutlined onClick={() => navigate("/admin/holiday")} />
        <Box
          sx={{
            display: "grid",
            padding: "1rem",
            [theme.breakpoints.down("xl")]: {
              // maxHeight: "100vh",
              overflowY: "auto",
            },
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "center" }}
            >
              <h1 className="topic-statistic">เพิ่มข้อมูลวันหยุดราชการ</h1>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "center" }}
            >
              <form>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    // textAlign: "left",
                    fontWeight: "normal",
                    color: "#111",
                  }}
                >
                  วัน :{" "}
                  <input
                    type="text"
                    name="name"
                    value={holidaydata.name}
                    onChange={handleChange}
                    required
                    placeholder="ระบุชื่อวัน"
                    style={{
                      width: "40%",
                      padding: "6px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "17px",
                    }}
                  />
                  <br />
                  {formErrors.name && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.name}
                    </span>
                  )}
                </p>

                <br />
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    // textAlign: "left",
                    fontWeight: "normal",
                    color: "#111",
                  }}
                >
                  วันที่ :{" "}
                  <ConfigProvider
                    locale={locale}
                    theme={{
                      token: {
                        borderRadius: "8px",
                        fontFamily: "Kodchasan",
                        colorText: "#75625e",
                        colorBgContainer: "#fff8e6",
                        colorTextPlaceholder: "#75625e",
                        colorBgElevated: "#fff8e6",
                        colorPrimary: "#a59284",
                      },
                    }}
                  >
                    <DatePicker onChange={handleDate}></DatePicker>
                  </ConfigProvider>
                  <br />
                  {formErrors.date && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.date}
                    </span>
                  )}
                </p>
                <br />
                <Button
                  style={{
                    borderRadius: 50,
                    width: "30%",
                    marginLeft: "15px",
                    backgroundColor: "#474344",
                    color: "#e5bd77",
                  }}
                  sx={{
                    fontFamily: "Kodchasan",
                  }}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  เพิ่ม
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default AddHoliday;
