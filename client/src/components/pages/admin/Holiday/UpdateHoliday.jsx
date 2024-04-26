import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getHolidayById, updateHoliday } from "../../../../function/holiday";
import dayjs from "dayjs";
import { Button, Box, createTheme, ThemeProvider, Grid } from "@mui/material";
import locale from "antd/locale/th_TH";
import { ConfigProvider, DatePicker } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";

const UpdateHoliday = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("id", id);
  const [holidaydata, setHolidayData] = useState({ name: "", date: "" });
  console.log(holidaydata);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHolidayById(
          id,
          localStorage.getItem("token")
        );
        console.log("response", response.data);
        setHolidayData(response.data);
      } catch (e) {
        console.log("Error fetchData: " + e);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHolidayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const updateData = async () => {
    try {
      const response = await updateHoliday(
        id,
        holidaydata,
        localStorage.getItem("token")
      );
      setHolidayData(response.data);
      console.log("Update Success");
      navigate("/admin/holiday");
    } catch (err) {
      console.log("Error updating HolidayData: " + err);
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

        setHolidayData((prevData) => ({
          ...prevData,
          date: formattedDateLocal,
        }));
      } else {
        console.log("Invalid dates provided");
      }
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

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

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
              <h1 className="topic-statistic">แก้ไขข้อมูลวันหยุดราชการ</h1>
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
                  วันที่ {formatLeaveDate(holidaydata.date)}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    // textAlign: "left",
                    fontWeight: "normal",
                    color: "#111",
                  }}
                >
                  แก้ไขวันที่ :{" "}
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
                </p>
                <br />
                <Button
                  style={{
                    borderRadius: 50,
                    width: "20%",
                    marginLeft: "15px",
                    backgroundColor: "#684929",
                    color: "#F4ECDC",
                  }}
                  sx={{
                    fontFamily: "Kodchasan",
                  }}
                  variant="contained"
                  onClick={updateData}
                >
                  แก้ไข
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default UpdateHoliday;
