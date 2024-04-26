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
  // Select,
  RadioGroup,
  // MenuItem,
  ThemeProvider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { currentUser, updateUser } from "../../../function/auth";
import { useNavigate } from "react-router-dom";
import { resetPasswordForAdmin } from "../../../function/admin";
import ReactSignatureCanvas from "react-signature-canvas";
import "../../../Signature.css";
import locale from "antd/locale/th_TH";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ConfigProvider, Modal } from "antd";
import { Select } from "antd";
import axios from "axios";
import {
  getUserFromOnlyPosition,
  getUserFromPosition,
} from "../../../function/superior";

const Profile = () => {
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [userData, setUserData] = useState({
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
    signature: "",
    position_first_supeior: "",
    position_second_supeior: "",
  });
  console.log("userData", userData);
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
    signature: "",
    position_first_supeior: "",
    position_second_supeior: "",
  });

  const [formErrors, setFormErrors] = useState({
    prefix: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    divisionName: "",
    sub_division: "",
    position: "",
    birthday: "",
    type_of_employee: "",
    start_of_work_on: "",
  });
  console.log(formErrors);
  const [otherPrefix, setOtherPrefix] = useState(false);
  const [openBirthday, setOpenBirthday] = useState(false);
  const [openStartWork, setOpenStartWork] = useState(false);
  const [openResetPass, setOpenResetPass] = useState(false);
  const [openSignature, setOpenSignature] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [getSuperior, setGetSuperior] = useState([]);
  const [getFirstSuperior, setGetFirstSuperior] = useState([]);
  const [getNameFirstSup, setGetNameFirstSup] = useState("");
  const [getNameSecondSup, setGetNameSecondSup] = useState("");

  const [imageURL, setImageURL] = useState("");

  const sig = useRef({});

  const clear = (e) => {
    e.preventDefault();
    sig.current.clear();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await currentUser(localStorage.getItem("token"));
        console.log(response.data);
        setUserData(response.data);
        setIntiUserData(response.data);

        if (
          response.data.prefix != "นาย" &&
          response.data.prefix != "นาง" &&
          response.data.prefix != "นางสาว"
        ) {
          setOtherPrefix(true);
        }

        const getSuperior = await axios.get(
          "http://localhost:5432/getSuperior"
        );
        console.log("getSuperior", getSuperior.data);
        setGetSuperior(getSuperior.data);

        const getFirstSuperior = await axios.get(
          `http://localhost:5432/getAllSuperiorInSameDivision/${response.data.citizenID}`
        );
        console.log("getFirstSuperior", getFirstSuperior.data);
        setGetFirstSuperior(getFirstSuperior.data);

        const fetchFirstUserByPosition = await getUserFromPosition(
          userData.position_first_supeior,
          userData.divisionName
        );
        if (fetchFirstUserByPosition.data) {
          console.log(
            "fetchFirstUserByPosition ",
            fetchFirstUserByPosition.data
          );
          setGetNameFirstSup(fetchFirstUserByPosition.data);
        }

        const fetchSecondUserByPosition = await getUserFromOnlyPosition(
          userData.position_second_supeior
        );
        if (fetchSecondUserByPosition.data) {
          console.log(
            "fetchSecondUserByPosition ",
            fetchSecondUserByPosition.data
          );
          setGetNameSecondSup(fetchSecondUserByPosition.data);
        }
      } catch (err) {
        console.log("Error fetching user profile data: " + err);
      }
    };

    fetchUserData();
  }, [
    // userData.position_first_supeior,
    userData.divisionName,
    // userData.position_second_supeior,
  ]);

  const updateUserData = async (e) => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userData.prefix) {
      errors.prefix = "กรุณากรอกคำนำหน้า";
    }
    if (!userData.name) {
      errors.name = "กรุณากรอกชื่อ";
    }
    if (!userData.surname) {
      errors.surname = "กรุณากรอกนามสกุล";
    }
    if (!userData.position) {
      errors.position = "กรุณากรอกตำแหน่ง";
    }
    if (userData.divisionName === "") {
      errors.divisionName = "กรุณาเลือกกองที่สังกัด";
    }
    if (userData.sub_division === "") {
      errors.sub_division = "กรุณาเลือกฝ่ายที่สังกัด";
    }
    if (handleReset === true && !resetPassword) {
      errors.password = "กรุณากรอกรหัสผ่าน";
    }
    if (!userData.email) {
      errors.email = "กรุณากรอกอีเมล";
    } else if (!emailRegex.test(userData.email)) {
      errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!userData.phone) {
      errors.phone = "กรุณากรอกเบอร์โทร";
    }
    if (!userData.birthday) {
      errors.birthday = "กรุณาเลือกวันที่ท่านเกิด";
    }
    if (!userData.type_of_employee) {
      errors.type_of_employee = "กรุณาเลือกประเภทการว่าจ้าง";
    }
    if (
      userData.type_of_employee != "ข้าราชการการเมือง" &&
      !userData.start_of_work_on
    ) {
      errors.start_of_work_on = "กรุณาเลือกวันที่เริ่มทำงาน";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedUserData = openSignature
        ? {
            ...userData,
            imageURL: sig.current.getTrimmedCanvas().toDataURL("image/png"),
          }
        : { ...userData, imageURL: userData.signature };

      navigate("/");

      if (handleReset === true && resetPassword) {
        const [reset, response] = await Promise.all([
          resetPasswordForAdmin(
            userData.citizenID,
            { password: resetPassword },
            localStorage.getItem("token")
          ),
          updateUser(updatedUserData, localStorage.getItem("token")),
        ]);

        console.log("Success Update and reset UserData: ");
      } else {
        updateUser(updatedUserData, localStorage.getItem("token"));
        console.log("Success Update UserData: ");
      }
    } catch (err) {
      console.log("Error updating user profile data: " + err);
    }
  };

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
  const handleSignature = () => {
    if (openSignature === true) {
      setOpenSignature(false);
    } else {
      setOpenSignature(true);
    }
  };

  const selectRef = useRef();

  const handleTurnBackData = (e) => {
    e.preventDefault();
    setUserData(intiUserData);
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

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeFirst = (value) => {
    console.log("Selected value:", value);
    if (value === undefined || value === null) {
      clear();
    } else {
      setUserData((prevData) => ({
        ...prevData,
        position_first_supeior: value.split(" ")[0],
      }));
    }
  };

  const handleChangeSecond = (value) => {
    console.log("Selected value:", value);
    if (value === undefined || value === null) {
      clear();
    } else {
      setUserData((prevData) => ({
        ...prevData,
        position_second_supeior: value.split(" ")[0],
      }));
    }
  };

  const showConfirm = () => {
    confirm({
      title: "ยืนยันข้อมูลแก้ไขข้อมูลส่วนตัว",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        updateUserData();
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#495784" },
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
            <p className="topic-profile">ข้อมูลส่วนตัว</p>
            <form>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                  <FormControl sx={{ color: "#333" }}>
                    <FormLabel
                      sx={{ fontFamily: "Kodchasan", fontSize: "18px" }}
                    >
                      คำนำหน้า
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="prefix"
                      onChange={handleChange}
                      value={userData.prefix}
                      sx={{ color: "#656d4f" }}
                    >
                      <FormControlLabel
                        value="นางสาว"
                        control={<Radio sx={{ color: "#656d4f" }} />}
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
                        control={<Radio sx={{ color: "#656d4f" }} />}
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
                        control={<Radio sx={{ color: "#656d4f" }} />}
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
                        control={<Radio sx={{ color: "#656d4f" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            อื่นๆ
                          </Typography>
                        }
                        onClick={() => {
                          setOtherPrefix(true);
                        }}
                        checked={
                          userData.prefix !== "นาย" &&
                          userData.prefix !== "นาง" &&
                          userData.prefix !== "นางสาว"
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  {otherPrefix === true && (
                    <>
                      <br />
                      <label
                        style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                      >
                        อื่นๆ
                      </label>
                      <input
                        type="text"
                        name="prefix"
                        value={userData.prefix}
                        onChange={handleChange}
                        required
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxSizing: "border-box",
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                        }}
                      />
                      {formErrors.prefix && (
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
                      )}
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
                        }}
                      >
                        ชื่อ
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
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
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                        }}
                      >
                        นามสกุล
                      </label>
                      <input
                        type="text"
                        name="surname"
                        value={userData.surname}
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
                      {formErrors.surname && (
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
                      )}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                        }}
                      >
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={userData.position}
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
                      {formErrors.position && (
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
                      )}
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
                    }}
                  >
                    กอง
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="divisionName"
                    value={userData.divisionName}
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
                  {formErrors.divisionName && (
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
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    ฝ่าย
                  </label>
                  <input
                    type="text"
                    name="sub_division"
                    value={userData.sub_division}
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
                  {formErrors.sub_division && (
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
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    เบอร์โทร
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
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
                  {formErrors.phone && (
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
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    อีเมล
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
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
                  {formErrors.email && (
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
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                      }}
                    >
                      ผู้บังคับบัญชาคนที่1 :{" "}
                      {getNameFirstSup
                        ? `${getNameFirstSup.prefix} ${getNameFirstSup.name} ${getNameFirstSup.surname} (${getNameFirstSup.divisionName} ${getNameFirstSup.position})`
                        : "ไม่พบ"}{" "}
                    </p>
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
                      <Select
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "18px",
                          borderRadius: "8px",
                        }}
                        allowClear
                        showSearch
                        placeholder="เลือกผู้บังคับบัญชาคนที่1 (หากต้องการแก้ไข)"
                        optionFilterProp="children"
                        onChange={handleChangeFirst}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={getFirstSuperior.map((item) => ({
                          label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                          value: `${item.position} (${item.divisionName})`,
                        }))}
                      ></Select>
                    </ConfigProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <p
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "18px",
                      }}
                    >
                      ผู้บังคับบัญชาคนที่2 :{" "}
                      {getNameSecondSup
                        ? `${getNameSecondSup.prefix} ${getNameSecondSup.name} ${getNameSecondSup.surname} (${getNameSecondSup.divisionName} ${getNameSecondSup.position})`
                        : "ไม่พบ"}{" "}
                    </p>
                    <ConfigProvider
                      locale={locale}
                      theme={{
                        token: {
                          borderRadius: "8px",
                          fontFamily: "Kodchasan",
                          colorText: "#495784",
                          colorBgContainer: "#CDDEE5",
                          colorTextPlaceholder: "#495784",
                          colorBgElevated: "#E6F0F2",
                          colorPrimary: "#495784",
                        },
                      }}
                    >
                      <Select
                        allowClear
                        showSearch
                        placeholder="เลือกผู้บังคับบัญชาคนที่2 (หากต้องการแก้ไข)"
                        optionFilterProp="children"
                        onChange={handleChangeSecond}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={getSuperior.map((item) => ({
                          label: `${item.prefix} ${item.name} ${item.surname} (${item.position})`,
                          value: `${item.position} (${item.divisionName})`,
                        }))}
                      ></Select>
                    </ConfigProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <FormControl sx={{ color: "#333" }}>
                    <FormLabel
                      sx={{ fontFamily: "Kodchasan", fontSize: "18px" }}
                    >
                      ประเภทการว่าจ้าง
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="type_of_employee"
                      onChange={handleChange}
                      value={userData.type_of_employee}
                      sx={{ color: "#656d4f" }}
                    >
                      <FormControlLabel
                        value="ข้าราชการการเมือง"
                        control={<Radio sx={{ color: "#656d4f" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            ข้าราชการการเมือง
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="ข้าราชการ"
                        control={<Radio sx={{ color: "#656d4f" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            ข้าราชการ
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="ลูกจ้างประจำ"
                        control={<Radio sx={{ color: "#656d4f" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            ลูกจ้างประจำ
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="พนักงานจ้างตามภารกิจ"
                        control={<Radio sx={{ color: "#656d4f" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            พนักงานจ้างตามภารกิจ
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="จ้างทั่วไป"
                        control={<Radio sx={{ color: "#656d4f" }} />}
                        label={
                          <Typography
                            style={{
                              fontFamily: "Kodchasan",
                              fontSize: "14px",
                            }}
                          >
                            จ้างทั่วไป
                          </Typography>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <p
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "16px",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    วันที่เกิด {formatLeaveDate(userData.birthday)}
                    <Button
                      style={{
                        borderRadius: 50,
                        width: "40%",
                        marginLeft: "15px",
                        backgroundColor: "#868f74",
                        color: "#FFEFCD",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }}
                      onClick={handleBirthday}
                    >
                      เปลี่ยนวันเกิด
                    </Button>
                  </p>
                  {openBirthday === true && (
                    <>
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                        }}
                      >
                        แก้ไขวันที่เกิด(ระบุเป็นปีค.ศ.)
                      </label>
                      <input
                        type="date"
                        name="birthday"
                        value={userData.birthday}
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
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  {userData.start_of_work_on ? (
                    <>
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                        }}
                      >
                        วันที่เริ่มทำงาน{" "}
                        {formatLeaveDate(userData.start_of_work_on)}
                        <Button
                          color="primary"
                          size="medium"
                          variant="contained"
                          onClick={handleStartWork}
                          style={{
                            borderRadius: 50,
                            width: "30%",
                            marginLeft: "15px",
                            backgroundColor: "#868f74",
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
                            <input
                              type="date"
                              name="start_of_work_on"
                              value={userData.start_of_work_on}
                              onChange={handleChange}
                              style={{
                                width: "43%",
                                marginLeft: "15px",
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
                            marginLeft: "15px",
                            backgroundColor: "#868f74",
                            color: "#FFEFCD",
                          }}
                          sx={{
                            fontFamily: "Kodchasan",
                          }}
                        >
                          เปลี่ยนวันที่เริ่มทำงาน
                        </Button>
                      </p>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <Button
                    color="secondary"
                    size="medium"
                    variant="contained"
                    onClick={handleReset}
                    fullWidth
                    style={{
                      borderRadius: 50,
                      marginLeft: "15px",
                      backgroundColor: "#868f74",
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
                      <label
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          textAlign: "left",
                          display: "block",
                          padding: "6px",
                        }}
                      >
                        รหัสผ่าน
                        <input
                          type="password"
                          name="password"
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          style={{
                            width: "60%",
                            // marginLeft: "15px",
                            padding: "6px",

                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            boxSizing: "border-box",
                            fontFamily: "Kodchasan",
                            fontSize: "14px",
                          }}
                        />
                      </label>
                      <br />
                      <br />
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  <Button
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={handleSignature}
                    fullWidth
                    style={{
                      borderRadius: 50,
                      marginLeft: "15px",
                      backgroundColor: "#868f74",
                      color: "#FFEFCD",
                    }}
                    sx={{
                      fontFamily: "Kodchasan",
                    }}
                  >
                    แก้ไขลายเซ็น
                  </Button>
                  {openSignature === true && (
                    <>
                      <br />
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          padding: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        ลายเซ็นปัจจุบัน
                      </p>
                      <img
                        src={`http://localhost:5432/signatures/${userData.signature}`}
                      />
                      <p
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "16px",
                          padding: "6px",
                          fontWeight: "bold",
                        }}
                      >
                        ลายเซ็นใหม่
                      </p>
                      <ReactSignatureCanvas
                        ref={sig}
                        canvasProps={{ className: "signature" }}
                      ></ReactSignatureCanvas>
                      <br />
                      <Button
                        style={{
                          borderRadius: 50,
                          marginLeft: "15px",
                          backgroundColor: "#e5bd77",
                          color: "#684929",
                        }}
                        sx={{
                          fontFamily: "Kodchasan",
                        }}
                        onClick={clear}
                      >
                        ล้างลายเซ็น
                      </Button>

                      <br />
                    </>
                  )}
                </Grid>
              </Grid>
              <br />

              <Button
                style={{
                  borderRadius: 50,
                  width: "30%",
                  marginLeft: "15px",
                  backgroundColor: "#ca5a4b",
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
                  width: "30%",
                  borderRadius: 50,
                  marginLeft: "15px",
                  backgroundColor: "#aa7c57",
                  color: "#FFEFCD",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                onClick={showConfirm}
              >
                บันทึกข้อมูล
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Profile;
