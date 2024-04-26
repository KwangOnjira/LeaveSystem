import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserforEdit,
  getUsers,
  updateLastStatistic,
} from "../../../function/inspector";
import { ExclamationCircleFilled } from "@ant-design/icons";
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
import { Modal } from "antd";
import { calculateYear } from "../../../function/YearInWork";
import { FormControl } from "@mui/material";
import { LeftOutlined } from "@ant-design/icons";

const EditDetailStatistic = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const { citizenID, statisticID } = useParams();
  const [statData, setStatData] = useState({
    leave_rights: "",
    fiscal_year: "",
    VL_accumulatedDays: "",
    VL_total: "",
    VL_remaining: "",
    VL_lastLeave: "",
    currentUseVL: "",
    SL_remaining: "",
    SL_In_Range: "",
    PL_remaining: "",
    PL_In_Range: "",
    ML_DayCount: "",
    ML_In_Range: "",
    OL_DayCount: "",
    OL_In_Range: "",
    STL_DayCount: "",
    STL_In_Range: "",
    total_leaveDay: "",
    leave_count: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await getUserforEdit(
          citizenID,
          statisticID,
          localStorage.getItem("token")
        );
        console.log("fetchUser", fetchUser);
        setUserData(fetchUser);

        if (
          fetchUser &&
          fetchUser.statistics &&
          fetchUser.statistics.length > 0
        ) {
          setStatData({
            fiscal_year: fetchUser.statistics[0].fiscal_year,
            leave_rights: fetchUser.statistics[0].leave_rights,
            leave_count: fetchUser.statistics[0].leave_count,
            VL_accumulatedDays: fetchUser.statistics[0].VL_accumulatedDays,
            VL_total: fetchUser.statistics[0].VL_total,
            VL_lastLeave: fetchUser.statistics[0].VL_lastLeave,
            VL_remaining: fetchUser.statistics[0].VL_remaining,
            currentUseVL: fetchUser.statistics[0].currentUseVL,
            SL_remaining: fetchUser.statistics[0].SL_remaining,
            SL_In_Range: fetchUser.statistics[0].SL_In_Range,
            PL_remaining: fetchUser.statistics[0].PL_remaining,
            PL_In_Range: fetchUser.statistics[0].PL_In_Range,
            ML_DayCount: fetchUser.statistics[0].ML_DayCount,
            ML_In_Range: fetchUser.statistics[0].ML_In_Range,
            OL_DayCount: fetchUser.statistics[0].OL_DayCount,
            OL_In_Range: fetchUser.statistics[0].OL_In_Range,
            STL_DayCount: fetchUser.statistics[0].STL_DayCount,
            STL_In_Range: fetchUser.statistics[0].STL_In_Range,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [citizenID]);

  const updateStat = async () => {
    console.log("in updated");
    try {
      navigate("/inspector/edit");
      const response = await updateLastStatistic(
        citizenID,
        statisticID,
        statData,
        localStorage.getItem("token")
      );
      console.log("response.data in updateStat", response.data);
      setStatData(response.data);
    } catch (error) {
      console.log("Error updating Last statistic data: " + error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      const {
        SL_In_Range,
        PL_In_Range,
        ML_In_Range,
        OL_In_Range,
        STL_In_Range,
      } = updatedData;

      updatedData.total_leaveDay =
        parseFloat(SL_In_Range || 0) +
        parseFloat(PL_In_Range || 0) +
        parseFloat(ML_In_Range || 0) +
        parseFloat(OL_In_Range || 0) +
        parseFloat(STL_In_Range || 0);
      console.log("updatedData: ", updatedData);

      return updatedData;
    });
  };

  const showConfirm = (e) => {
    e.preventDefault();
    console.log("showConfirm function called");
    confirm({
      title: "ยืนยันการแก้ไขข้อมูล",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        updateStat();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#e4e1d0", backgroundColor: "#943d2c" },
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
        lg: 950,
        xl: 1620,
        xxl: 1500,
      },
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <LeftOutlined onClick={() => navigate("/inspector/edit")} />
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
            }}
          >
            <h1 className="topic-statistic">แก้ไขวันลา</h1>
            <h2
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              ปีงบประมาณ {statData.fiscal_year}
            </h2>
            {userData && (
              <>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  ชื่อ-นามสกุล: {userData.prefix} {userData.name}{" "}
                  {userData.surname}
                </p>
                <p
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "normal",
                  }}
                >
                  อายุการทำงาน: {calculateYear(userData.start_of_work_on)}
                </p>
                <form onSubmit={showConfirm}>
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
                        วันลาพักผ่อนสะสม
                        <input
                          type="number"
                          name="VL_accumulatedDays"
                          value={statData.VL_accumulatedDays}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        สิทธิวันลาพักผ่อน
                        <input
                          type="number"
                          name="leave_rights"
                          value={statData.leave_rights}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        รวมมีลาพักผ่อนทั้งหมด
                        <input
                          type="number"
                          name="VL_total"
                          value={statData.VL_total}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        ใช้ลาพักผ่อนไป
                        <input
                          type="number"
                          name="currentUseVL"
                          value={statData.currentUseVL}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "2rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        จำนวนครั้งที่ลา:{" "}
                        <input
                          type="number"
                          name="leave_count"
                          value={statData.leave_count}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "1rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาป่วย(1ปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="SL_remaining"
                          value={statData.SL_remaining}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาป่วย(ในช่วงปัจจุบันของปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="SL_In_Range"
                          value={statData.SL_In_Range}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "1rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        ใช้วันลากิจ(1ปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="PL_remaining"
                          value={statData.PL_remaining}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        ใช้วันลากิจ(ในช่วงปัจจุบันของปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="PL_In_Range"
                          value={statData.PL_In_Range}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "1rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        ใช้วันลาคลอด(ใน1ปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="ML_DayCount"
                          value={statData.ML_DayCount}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        ใช้วันลาคลอด(ในช่วงปัจจุบันของปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="ML_In_Range"
                          value={statData.ML_In_Range}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "1rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาไปศึกษาต่อ(ใน1ปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="STL_DayCount"
                          value={statData.STL_DayCount}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาไปศึกษาต่อ(ในช่วงปัจจุบันของปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="STL_In_Range"
                          value={statData.STL_In_Range}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "1rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาอุปสมบท(ใน1ปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="OL_DayCount"
                          value={statData.OL_DayCount}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "0.3rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาอุปสมบท(ในช่วงปัจจุบันของปีงบประมาณ):{" "}
                        <input
                          type="number"
                          name="OL_In_Range"
                          value={statData.OL_In_Range}
                          onChange={handleChange}
                          required
                          style={{
                            marginBottom: "1rem",
                            width: "50%",
                            padding: "6px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "17px",
                          }}
                        />
                      </label>
                      <br />
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          textAlign: "left",
                          fontWeight: "normal",
                        }}
                      >
                        วันลาทั้งหมด: {statData.total_leaveDay}
                      </label>
                    </Grid>
                    <br />
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <br />
                      <Button
                        type="submit"
                        style={{
                          borderRadius: 50,
                          width: "50%",
                          marginLeft: "15px",
                          backgroundColor: "#943d2c",
                          color: "#ffefcd",
                        }}
                        sx={{
                          fontFamily: "Kodchasan",
                        }}
                        onSubmit={showConfirm}
                      >
                        บันทึก
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                </form>
              </>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default EditDetailStatistic;
