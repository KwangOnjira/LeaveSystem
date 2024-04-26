import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers } from "../../../function/inspector";
import {
  Box,
  Button,
  Container,
  createTheme,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  Select,
  RadioGroup,
  MenuItem,
  ThemeProvider,
  Grid,
  Typography,
} from "@mui/material";
import { resetPasswordForAdmin, updateDataUser } from "../../../function/admin";
import { ConfigProvider, Modal } from "antd";

const AdminEditDetail = () => {
  const navigate = useNavigate();
  const [otherPrefix, setOtherPrefix] = useState(false);
  const [openBirthday, setOpenBirthday] = useState(false);
  const [openStartWork, setOpenStartWork] = useState(false);
  const [openResetPass, setOpenResetPass] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [usersData, setUsersData] = useState({
    citizenID: "",
    prefix: "",
    name: "",
    surname: "",
    role: "",
    email: "",
    phone: "",
    divisionName: "",
    sub_division: "",
    position: "",
    password: "",
    birthday: "",
    type_of_employee: "",
    start_of_work_on: "",
    position_first_supeior: "",
    position_second_supeior: "",
    signature: "",
  });
  const { citizenID } = useParams();
  console.log("citizenID", citizenID);
  const [intiUserData, setIntiUserData] = useState({
    citizenID: "",
    prefix: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    divisionName: "",
    sub_division: "",
    position: "",
    password: "",
    birthday: "",
    type_of_employee: "",
    start_of_work_on: "",
    position_first_supeior: "",
    position_second_supeior: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUsers(citizenID, localStorage.getItem("token"));
        console.log("user", user);
        setUsersData(user);
        setIntiUserData(user);

        if (
          user.prefix != "นาย" &&
          user.prefix != "นาง" &&
          user.prefix != "นางสาว"
        ) {
          setOtherPrefix(true);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  const handleBirthday = () => {
    if (openBirthday === true) {
      setOpenBirthday(false);
    } else {
      setOpenBirthday(true);
    }
  };
  const handleStartWork = () => {
    if (openStartWork === true) {
      setOpenStartWork(false);
    } else {
      setOpenStartWork(true);
    }
  };
  const handleReset = () => {
    if (openResetPass === true) {
      setOpenResetPass(false);
    } else {
      setOpenResetPass(true);
    }
  };

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if (name === "password") {
    //   setResetPassword(value);
    // } else {
    setUsersData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // }
  };

  const updateUserData = async () => {
    try {
      navigate("/admin");
      const [reset, response] = await Promise.all([
        resetPasswordForAdmin(
          citizenID,
          { password: resetPassword },
          localStorage.getItem("token")
        ),
        updateDataUser(citizenID, usersData, localStorage.getItem("token")),
      ]);

      console.log("Success Update UserData: " + err);
    } catch (err) {
      console.log("Error updating user profile data: " + err);
    }
  };

  const handleTurnBackData = (e) => {
    e.preventDefault();
    setUsersData(intiUserData);
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
        <Container
          fixed
          sx={{
            position: "relative",
            // backgroundColor: "#c11",
          }}
        >
          <Box
            sx={{
              display: "grid",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <p className="topic-statistic" style={{ color: "#495784" }}>
              ข้อมูลส่วนตัวของ{usersData.prefix} {usersData.name}{" "}
              {usersData.surname}
            </p>
            <form>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                  <FormControl sx={{ color: "#495784" }}>
                    <FormLabel
                      sx={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                        color: "#495784",
                      }}
                    >
                      คำนำหน้า
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="prefix"
                      onChange={handleChange}
                      value={usersData?.prefix}
                      sx={{ color: "#495784" }}
                    >
                      <FormControlLabel
                        value="นางสาว"
                        control={<Radio sx={{ color: "#495784" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            นางสาว
                          </Typography>
                        }
                        onClick={() => {
                          setOtherPrefix(false);
                        }}
                      />
                      <FormControlLabel
                        value="นาง"
                        control={<Radio sx={{ color: "#495784" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            นาง
                          </Typography>
                        }
                        onClick={() => {
                          setOtherPrefix(false);
                        }}
                      />
                      <FormControlLabel
                        value="นาย"
                        control={<Radio sx={{ color: "#495784" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            นาย
                          </Typography>
                        }
                        onClick={() => {
                          setOtherPrefix(false);
                        }}
                      />
                      <FormControlLabel
                        control={<Radio sx={{ color: "#495784" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                              color: "#495784",
                            }}
                          >
                            อื่นๆ
                          </Typography>
                        }
                        onClick={() => {
                          setOtherPrefix(true);
                        }}
                        checked={
                          usersData?.prefix !== "นาย" &&
                          usersData?.prefix !== "นาง" &&
                          usersData?.prefix !== "นางสาว"
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {otherPrefix === true && (
                    <>
                      <br />
                      <label
                        style={{
                          color: "#495784",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      >
                        อื่นๆ{" "}
                      </label>
                      <input
                        type="text"
                        name="prefix"
                        value={usersData?.prefix}
                        onChange={handleChange}
                        required
                        style={{
                          color: "#495784",
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      {/* {formErrors.prefix && (
                        <span
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            color: "#c1012D",
                            fontWeight: "bold",
                          }}
                        >
                          {formErrors.prefix}
                        </span>
                      )} */}
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                          color: "#495784",
                        }}
                      >
                        ชื่อ
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={usersData.name}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      {/* {formErrors.name && (
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
                    )} */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                          color: "#495784",
                        }}
                      >
                        นามสกุล
                      </label>
                      <input
                        type="text"
                        name="surname"
                        value={usersData.surname}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      {/* {formErrors.surname && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.surname}
                      </span>
                    )} */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                          color: "#495784",
                        }}
                      >
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={usersData.position}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "6px",
                          marginTop: "0.5rem",

                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      {/* {formErrors.position && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.position}
                      </span>
                    )} */}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    กอง
                  </label>
                  <input
                    type="text"
                    name="divisionName"
                    value={usersData.divisionName}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "0.5rem",

                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {/* {formErrors.divisionName && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.divisionName}
                    </span>
                  )} */}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    ฝ่าย
                  </label>
                  <input
                    type="text"
                    name="sub_division"
                    value={usersData.sub_division}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "0.5rem",

                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {/* {formErrors.sub_division && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.sub_division}
                    </span>
                  )} */}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    เบอร์โทร
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={usersData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "0.5rem",

                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {/* {formErrors.phone && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.phone}
                    </span>
                  )} */}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    อีเมล
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={usersData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "0.5rem",

                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {/* {formErrors.email && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.email}
                    </span>
                  )} */}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    ตำแหน่งผู้บังคับบัญชาคนที่1
                  </label>
                  <input
                    type="text"
                    name="position_first_supeior"
                    value={usersData?.position_first_supeior}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "0.5rem",

                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {/* {formErrors.email && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.email}
                    </span>
                  )} */}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    ตำแหน่งผู้บังคับบัญชาคนที่2
                  </label>
                  <input
                    type="text"
                    name="position_second_supeior"
                    value={usersData?.position_second_supeior}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "6px",
                      marginTop: "0.5rem",

                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      boxSizing: "border-box",
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                    }}
                  />
                  {/* {formErrors.email && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.email}
                    </span>
                  )} */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  style={{ textAlign: "left" }}
                >
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    บทบาท
                  </label>
                  <Select
                    name="role"
                    value={usersData?.role}
                    onChange={handleChange}
                    sx={{
                      width: "100%",
                      marginTop: "0.5rem",
                      marginBottom: "1rem",
                      fontFamily: "Kodchasan",
                      textAlign: "left",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                  >
                    <MenuItem value="user" sx={{ fontFamily: "Kodchasan" }}>
                      user (ผู้ใช้งานทั่วไป)
                    </MenuItem>
                    <MenuItem
                      value="inspector"
                      sx={{ fontFamily: "Kodchasan" }}
                    >
                      inspector (ผู้ตรวจสอบ)
                    </MenuItem>
                    <MenuItem value="superior" sx={{ fontFamily: "Kodchasan" }}>
                      superior (ผู้บังคับบัญชา)
                    </MenuItem>
                    <MenuItem value="admin" sx={{ fontFamily: "Kodchasan" }}>
                      admin (ผู้ดูแลระบบ)
                    </MenuItem>
                  </Select>
                  {/* {formErrors.email && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.email}
                    </span>
                  )} */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  style={{ textAlign: "left" }}
                >
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    ประเภทการว่าจ้าง
                  </label>
                  <Select
                    name="type_of_employee"
                    value={usersData?.type_of_employee}
                    onChange={handleChange}
                    sx={{
                      width: "100%",
                      marginTop: "0.5rem",
                      marginBottom: "1rem",
                      fontFamily: "Kodchasan",
                      textAlign: "left",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                  >
                    <MenuItem
                      value="ข้าราชการการเมือง"
                      sx={{ fontFamily: "Kodchasan" }}
                    >
                      ข้าราชการการเมือง
                    </MenuItem>
                    <MenuItem
                      value="ข้าราชการ"
                      sx={{ fontFamily: "Kodchasan" }}
                    >
                      ข้าราชการ
                    </MenuItem>
                    <MenuItem
                      value="ลูกจ้างประจำ"
                      sx={{ fontFamily: "Kodchasan" }}
                    >
                      ลูกจ้างประจำ
                    </MenuItem>
                    <MenuItem
                      value="พนักงานจ้างตามภารกิจ"
                      sx={{ fontFamily: "Kodchasan" }}
                    >
                      พนักงานจ้างตามภารกิจ
                    </MenuItem>
                    <MenuItem
                      value="จ้างทั่วไป"
                      sx={{ fontFamily: "Kodchasan" }}
                    >
                      จ้างทั่วไป
                    </MenuItem>
                  </Select>
                  {/* {formErrors.email && (
                    <span
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        color: "#c1012D",
                        fontWeight: "bold",
                      }}
                    >
                      {formErrors.email}
                    </span>
                  )} */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  style={{ textAlign: "left" }}
                >
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    วันที่เกิด {formatLeaveDate(usersData.birthday)}
                  </p>
                  <Button
                    style={{
                      borderRadius: 50,
                      width: "40%",
                      backgroundColor: "#925946",
                      color: "#FFEFCD",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                    variant="contained"
                    onClick={handleBirthday}
                  >
                    เปลี่ยนวันเกิด
                  </Button>
                  {openBirthday === true && (
                    <>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          marginTop: "1rem",
                          fontSize: "14px",
                          textAlign: "left",
                          display: "block",
                          color: "#495784",
                        }}
                      >
                        แก้ไขวันเกิด(ปีค.ศ.)
                      </label>
                      <input
                        type="date"
                        name="birthday"
                        value={usersData?.birthday}
                        onChange={handleChange}
                        required
                        style={{
                          width: "100%",
                          padding: "6px",

                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      <br />
                      <br />
                    </>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  style={{ textAlign: "left" }}
                >
                  {usersData.start_of_work_on ? (
                    <>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                          color: "#495784",
                        }}
                      >
                        วันที่เริ่มทำงาน{" "}
                        {formatLeaveDate(usersData.start_of_work_on)}
                        <br />
                        <Button
                          color="primary"
                          size="medium"
                          variant="contained"
                          onClick={handleStartWork}
                          style={{
                            borderRadius: 50,
                            marginTop: "1rem",
                            backgroundColor: "#ca8462",
                            color: "#FFEFCD",
                          }}
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                        >
                          เปลี่ยนวันที่เริ่มทำงาน
                        </Button>
                        {openStartWork === true && (
                          <>
                            <label
                              style={{
                                fontFamily: "Kodchasan",
                                marginTop: "1rem",
                                fontSize: "14px",
                                textAlign: "left",
                                display: "block",
                                color: "#495784",
                              }}
                            >
                              แก้ไขวันที่เริ่มทำงาน(ปีค.ศ.)
                            </label>
                            <input
                              type="date"
                              name="start_of_work_on"
                              value={usersData.start_of_work_on}
                              onChange={handleChange}
                              style={{
                                width: "100%",
                                padding: "6px",
                                borderRadius: "8px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box",
                                fontFamily: "Kodchasan",
                                fontSize: "14px",
                              }}
                            />
                          </>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                        }}
                      >
                        ไม่ระบุวันที่เริ่มทำงาน
                        <Button
                          disabled
                          color="primary"
                          size="medium"
                          variant="contained"
                          onClick={handleStartWork}
                          style={{
                            borderRadius: 50,
                            width: "30%",
                            backgroundColor: "#ca8462",
                            color: "#FFEFCD",
                          }}
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                        >
                          เปลี่ยนวันที่เริ่มทำงาน(ปีค.ศ.)
                        </Button>
                      </p>
                    </>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={6}
                  xl={6}
                  style={{ textAlign: "left" }}
                >
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                      color: "#495784",
                    }}
                  >
                    เปลี่ยนรหัสผ่าน
                    <br />
                    <Button
                      color="primary"
                      size="medium"
                      variant="contained"
                      onClick={handleReset}
                      style={{
                        borderRadius: 50,
                        marginTop: "0.5rem",
                        backgroundColor: "#c55f4e",
                        color: "#FFEFCD",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                    >
                      เปลี่ยนรหัสผ่าน
                    </Button>
                    {openResetPass === true && (
                      <>
                        <br />
                        <label
                          style={{
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                            textAlign: "left",
                            display: "block",
                            padding: "6px",
                            marginTop: "1rem",
                          }}
                        >
                          รหัสผ่านใหม่
                        </label>
                        <input
                          type="text"
                          name="password"
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
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
                  style={{ textAlign: "center" }}
                >
                  <Button
                    style={{
                      borderRadius: 50,
                      width: "30%",
                      marginLeft: "15px",
                      backgroundColor: "#cc889d",
                      color: "#FFEFCD",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                    onClick={(e) => handleTurnBackData(e)}
                  >
                    ล้างการแก้ไขข้อมูล
                  </Button>
                  <Button
                    style={{
                      width: "50%",
                      borderRadius: 50,
                      marginLeft: "15px",
                      backgroundColor: "#5d7599",
                      color: "#FFEFCD",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                    onClick={updateUserData}
                  >
                    แก้ไขข้อมูล
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default AdminEditDetail;
