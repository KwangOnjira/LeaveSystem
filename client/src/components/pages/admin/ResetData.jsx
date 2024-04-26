import { Button, Box, createTheme, ThemeProvider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../function/admin";
import { useNavigate } from "react-router-dom";
import { createStatByid } from "../../../function/inspector";
import { intervalToDuration } from "date-fns";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ConfigProvider, Modal } from "antd";

const ResetData = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [newFiscalData, setNewFiscalData] = useState("");

  const [formErrors, setFormErrors] = useState({
    fiscal_year: "",
  });
  console.log(formErrors);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await getAllUsers(localStorage.getItem("token"));
        console.log("fetchUser", fetchUser.data);
        setUsersData(fetchUser.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const showConfirmSixMonth = () => {
    confirm({
      title: "ยืนยันการรีเซ็ตข้อมูล 6 เดือน",
      icon: <ExclamationCircleFilled />,
      content: "รีเซ็ตข้อมูล6เดือน เพื่อขึ้นช่วงที่2ของปีงบประมาณ",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        resetSixMonth();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#B6594C" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };

  const resetSixMonth = async () => {
    try {
      for (const user of usersData) {
        const newStatistic = {
          citizenID: user.citizenID,
          fiscal_year: user.statistics[0]?.fiscal_year,
          range: 2,
          leave_rights: user.statistics[0]?.leave_rights,
          VL_accumulatedDays: user.statistics[0]?.VL_accumulatedDays,
          VL_total: user.statistics[0]?.VL_total,
          VL_lastLeave: user.statistics[0]?.VL_lastLeave,
          VL_thisLeave: user.statistics[0]?.VL_thisLeave,
          currentUseVL: user.statistics[0]?.currentUseVL,
          VL_remaining: user.statistics[0]?.VL_remaining,
          leave_count: 0,
          SL_lastLeave: user.statistics[0]?.SL_lastLeave,
          SL_thisLeave: user.statistics[0]?.SL_thisLeave,
          SL_remaining: user.statistics[0]?.SL_remaining,
          SL_In_Range: 0,
          PL_lastLeave: user.statistics[0]?.PL_lastLeave,
          PL_thisLeave: user.statistics[0]?.PL_thisLeave,
          PL_remaining: user.statistics[0]?.PL_remaining,
          PL_In_Range: 0,
          ML_thisleave: user.statistics[0]?.ML_thisleave,
          ML_lastleave: user.statistics[0]?.ML_lastleave,
          ML_DayCount: user.statistics[0]?.ML_DayCount,
          ML_In_Range: 0,
          OL_DayCount: user.statistics[0]?.OL_DayCount,
          OL_In_Range: 0,
          STL_DayCount: user.statistics[0]?.STL_DayCount,
          STL_In_Range: 0,
          total_leaveDay: 0,
        };

        const createNewStat = await createStatByid(
          user.citizenID,
          newStatistic,
          localStorage.getItem("token")
        );
        console.log("createNewStat: ", createNewStat);
      }
    } catch (error) {
      console.error("Error resetSixMonth:", error);
    }
  };

  const showConfirmOneYear = () => {
    confirm({
      title: "ยืนยันการรีเซ็ตข้อมูล 1 ปี",
      icon: <ExclamationCircleFilled />,
      content: "รีเซ็ตข้อมูล1ปี เพื่อขึ้นปีงบประมาณใหม่",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        resetOneFiscalYear();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#B6594C" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };

  const resetOneFiscalYear = async () => {
    let errors = {};
    if (!newFiscalData) {
      errors.fiscal_year = "กรุณาระบุปีงบประมาณ";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setOpen(false);

    try {
      for (const user of usersData) {
        const currentDate = new Date();

        const duration = intervalToDuration({
          start: user.start_of_work_on,
          end: currentDate,
        });
        console.log("duration.years: ", duration.years);

        let calculateVLAccumulated = 0;
        if (duration.years === undefined || duration.years < 10) {
          console.log("in loop duration.years: less than 10 years");
          if (user.statistics[0]?.VL_remaining > 10) {
            calculateVLAccumulated = 10;
            console.log("remaining more than 10");
          } else {
            calculateVLAccumulated = user.statistics[0]?.VL_remaining;
            console.log("remaining less than or equal 10");
          }
        } else if (duration.years >= 10) {
          console.log("in loop duration.years: more than or equal 10 years");
          if (user.statistics[0]?.VL_remaining > 20) {
            calculateVLAccumulated = 20;
            console.log("remaining more than 20");
          } else {
            calculateVLAccumulated = user.statistics[0]?.VL_remaining;
            console.log("remaining less than or equal 20");
          }
        }

        const newStatistic = {
          citizenID: user.citizenID,
          fiscal_year: newFiscalData,
          range: 1,
          leave_rights: user.statistics[0]?.leave_rights,
          VL_accumulatedDays: calculateVLAccumulated,
          VL_total: user.statistics[0]?.leave_rights + calculateVLAccumulated,
          VL_lastLeave: 0,
          VL_thisLeave: 0,
          currentUseVL: 0,
          VL_remaining:
            user.statistics[0]?.leave_rights + calculateVLAccumulated,
          leave_count: 0,
          SL_lastLeave: 0,
          SL_thisLeave: 0,
          SL_remaining: 0,
          SL_In_Range: 0,
          PL_lastLeave: 0,
          PL_thisLeave: 0,
          PL_remaining: 0,
          PL_In_Range: 0,
          ML_thisleave: 0,
          ML_lastleave: 0,
          ML_DayCount: 0,
          ML_In_Range: 0,
          OL_DayCount: 0,
          OL_In_Range: 0,
          STL_DayCount: 0,
          STL_In_Range: 0,
          total_leaveDay: 0,
        };

        const createNewStat = await createStatByid(
          user.citizenID,
          newStatistic,
          localStorage.getItem("token")
        );
        console.log("createNewStat: ", createNewStat);
      }
    } catch (error) {
      console.error("Error resetSixMonth:", error);
    }
  };

  const handleFiscalYearChange = (value) => {
    setNewFiscalData(value);
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
              <p>
                <h2 className="topic-leave">รีเซ็ตข้อมูล</h2>
              </p>
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
              <Button
                style={{
                  borderRadius: 50,
                  width: "30%",
                  padding: "1rem",
                  backgroundColor: "#424530",
                  color: "#F4ECDC",
                  fontSize: "18px",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={showConfirmSixMonth}
              >
                รีเซ็ตข้อมูล 6 เดือน
              </Button>
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
              <br />
              <br />
              <Button
                style={{
                  borderRadius: 50,
                  width: "30%",
                  padding: "1rem",
                  backgroundColor: "#e09132",
                  color: "#F4ECDC",
                  fontSize: "18px",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                variant="contained"
                onClick={() => setOpen(true)}
              >
                รีเซ็ตข้อมูล ขึ้นปีงบประมาณใหม่
              </Button>
              <br />
              <br />
              {open === true && (
                <>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      // textAlign: "left",
                      fontWeight: "normal",
                      color: "#111",
                    }}
                  >
                    ปีงบประมาณ:{" "}
                  </label>
                  <input
                    type="number"
                    name="fiscal_year"
                    value={newFiscalData}
                    onChange={(e) => handleFiscalYearChange(e.target.value)}
                    required
                    placeholder="ระบุปีงบประมาณ"
                    style={{
                      padding: "6px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "17px",
                    }}
                  />{" "}
                  <Button
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={showConfirmOneYear}
                    style={{
                      borderRadius: 50,
                      backgroundColor: "#75625e",
                      color: "#F4ECDC",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                  >
                    รีเซ็ตปีงบประมาณ
                  </Button>
                  <br />
                  {formErrors.fiscal_year && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.fiscal_year}
                    </span>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default ResetData;
