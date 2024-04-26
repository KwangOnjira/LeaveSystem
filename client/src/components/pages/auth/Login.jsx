import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../../store/userSlice";
import { currentUser, login } from "../../../function/auth";
import { createStat, getLastStatistic } from "../../../function/statistic";
import { updateFirstSuperior } from "../../../function/superior";
import logo from "../../../assets/lppao-logo.png";
import Button from "@mui/material/Button";
import {
  createTheme,
  ThemeProvider,
  Container,
  Box,
  Grid,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    citizenID: "",
    password: "",
    role: "",
    position_first_supeior: "",
  });

  const [statData, setStatdata] = useState({
    fiscal_year: null,
    range: null,
    leave_rights: null,
    VL_accumulatedDays: null,
    VL_total: null,
    VL_lastLeave: null,
    VL_thisLeave: null,
    currentUseVL: null,
    VL_remaining: null,
    leave_count: null,
    SL_lastLeave: null,
    SL_thisLeave: null,
    SL_remaining: null,
    SL_In_Range: null,
    PL_lastLeave: null,
    PL_thisLeave: null,
    PL_remaining: null,
    PL_In_Range: null,
    ML_thisleave: null,
    ML_lastleave: null,
    ML_DayCount: null,
    ML_In_Range: null,
    OL_DayCount: null,
    OL_In_Range: null,
    STL_DayCount: null,
    STL_In_Range: null,
    total_leaveDay: 0,
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.role === "admin") {
      console.log("Navigating to admin");
      navigate("/admin");
    } else if (formData.role === "user") {
      console.log("Navigating to user homepage");
      navigate("/");
    } else if (formData.role === "inspector") {
      console.log("Navigating to inspector homepage");
      navigate("/inspector");
    } else if (formData.role === "superior") {
      console.log("Navigating to superior homepage");
      navigate("/superior");
    }
  }, [formData.role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const token = response.data.accessToken;
      dispatch(
        loginRedux({
          citizenID: response.data.citizenID,
          prefix: response.data.prefix,
          name: response.data.name,
          surname: response.data.surname,
          role: response.data.role,
          email: response.data.email,
          phone: response.data.phone,
          divisionName: response.data.divisionName,
          sub_division: response.data.sub_division,
          position: response.data.position,
          password: response.data.password,
          birthday: response.data.birthday,
          type_of_employee: response.data.type_of_employee,
          start_of_work_on: response.data.start_of_work_on,
          position_first_supeior: response.data.position_first_supeior,
          position_second_supeior: response.data.position_second_supeior,
          token: token,
        })
      );

      localStorage.setItem("token", token);
      setError("");

      const fetchUserData = async () => {
        try {
          const response = await currentUser(localStorage.getItem("token"));
          setFormData(
            (prevData) => ({
              ...prevData,
              role: String(response.data.role),
            }),
            () => {
              console.log(formData);
            }
          );
        } catch (error) {
          console.log("Error Fetching user profile data: " + error);
        }
      };
      fetchUserData();

      const fetchStateData = async () => {
        try {
          const responseStat = await getLastStatistic(
            localStorage.getItem("token")
          );
          console.log("Response from server:", responseStat);

          if (formData.role != "admin") {
            if (responseStat === null) {
              const currentDate = new Date();
              const currentMonth = currentDate.getMonth(); //0-11
              const currentYear = currentDate.getFullYear() + 543;
              console.log("currentMonth: ", currentMonth);
              console.log("currentYear: ", currentYear);
              try {
                if (
                  currentMonth === 9 ||
                  currentMonth === 10 ||
                  currentMonth === 11
                ) {
                  const createInit = await createStat(
                    {
                      fiscal_year: currentYear,
                      range: 1,
                      leave_rights: 10,
                      VL_accumulatedDays: 0,
                      VL_total: 10,
                      VL_lastLeave: 0,
                      VL_thisLeave: 0,
                      currentUseVL: 0,
                      VL_remaining: 10,
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
                    },
                    localStorage.getItem("token")
                  );
                  console.log("createInit: ", createInit);
                  console.log("in first range currentYear");
                  setStatdata(createInit);
                } else if (
                  currentMonth === 0 ||
                  currentMonth === 1 ||
                  currentMonth === 2
                ) {
                  const createInit = await createStat(
                    {
                      fiscal_year: currentYear - 1,
                      range: 1,
                      leave_rights: 10,
                      VL_accumulatedDays: 0,
                      VL_total: 10,
                      VL_lastLeave: 0,
                      VL_thisLeave: 0,
                      currentUseVL: 0,
                      VL_remaining: 10,
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
                    },
                    localStorage.getItem("token")
                  );
                  console.log("createInit: ", createInit);
                  console.log("in first range currentYear-1");
                } else if (
                  currentMonth === 3 ||
                  currentMonth === 4 ||
                  currentMonth === 5 ||
                  currentMonth === 6 ||
                  currentMonth === 7 ||
                  currentMonth === 8
                ) {
                  const createInit = await createStat(
                    {
                      fiscal_year: currentYear - 1,
                      range: 2,
                      leave_rights: 10,
                      VL_accumulatedDays: 0,
                      VL_total: 10,
                      VL_lastLeave: 0,
                      VL_thisLeave: 0,
                      currentUseVL: 0,
                      VL_remaining: 10,
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
                    },
                    localStorage.getItem("token")
                  );

                  console.log("createInit: ", createInit);
                  console.log("in second range");
                }
              } catch (error) {
                console.error("Error creating initial statistics:", error);
              }
            } else {
              const lastStatisticID = responseStat.statisticID;
              console.log("Last Statistic ID:", lastStatisticID);
              setStatdata(responseStat);
            }
          }
        } catch (error) {
          console.log("Error Fetching user statistic data: " + error);
        }
      };

      fetchStateData();
    } catch (error) {
      console.log("Login Failed: " + error);
      setErrorMessage("หมายเลขประจำตัวประชาชนหรือรหัสผ่านของท่านไม่ถูกต้อง");
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchEditsuperior = async () => {
      try {
        if (
          formData.role === "superior" &&
          formData.position_first_supeior != null
        ) {
          const updateSuperior = await updateFirstSuperior(
            { position_first_supeior: null },
            localStorage.getItem("token")
          );
          console.log("updateSuperior ", updateSuperior);

          setFormData((prevData) => ({
            ...prevData,
            position_first_supeior: null,
          }));
          console.log("formData", formData);
        }
      } catch (error) {
        "Error updating" + error;
      }
    };
    fetchEditsuperior();
  }, [formData.role, formData.position_first_supeior]);

  document.body.style.backgroundColor = "#A4C195";

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
        <Container
          fixed
          sx={{
            position: "relative",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              padding: "2rem",
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#F3F3EA",
              height: "70vh",
              width: "60%",
              borderRadius: "8px",
              maxHeight: "90vh", // Adjusted height to 90% of viewport height
            overflowY: "auto",
              [theme.breakpoints.up("xl")]: {
                width: "100%",
                height: "70%",
              },
              [theme.breakpoints.only("lg")]: {
                width: "90%",
                height: "80%",
              },
              [theme.breakpoints.down("xl")]: {
                width: "100%",
                height: "80%",
              },
            }}
          >
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <img
                  src={logo}
                  alt="Logo"
                  width="30%"
                ></img>
                <p className="topic">
                  เข้าสู่ระบบการลาอิเล็กทรอนิกส์
                  <br />
                  ขององค์การบริหารส่วนจังหวัดลำปาง
                </p>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                <form>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      fontStyle: "normal",
                      color: "#333",
                    }}
                  >
                    หมายเลขประจำตัวประชาชน
                  </label>
                  <br></br>
                  <input
                    type="text"
                    name="citizenID"
                    value={formData.citizenID}
                    onChange={handleChange}
                    required
                    placeholder="CitizenID"
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "0.5rem",
                      marginBottom: "1.2rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      fontStyle: "normal",
                      color: "#333",
                    }}
                  >
                    รหัสผ่าน
                  </label>
                  <br></br>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    style={{
                      width: "100%",
                      padding: "8px",
                      marginTop: "0.5rem",
                      // marginBottom: "0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {errorMessage && (
                    <>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {errorMessage}
                      </p>
                    </>
                  )}
                  <br />
                  <br />
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                        <Button
                          style={{
                            borderRadius: 50,
                            width: "100%",
                            backgroundColor: "#E09132",
                            color: "#FFF8EF",
                          }}
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                          onClick={() => {
                            navigate("/register");
                          }}
                        >
                          ลงทะเบียน
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                        <Button
                          onClick={handleSubmit}
                          style={{
                            borderRadius: 50,
                            width: "100%",
                            // margin: "15px",
                            backgroundColor: "#87986A",
                            color: "#FFFDD5",
                          }}
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                        >
                          เข้าสู่ระบบ
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};
export default Login;
