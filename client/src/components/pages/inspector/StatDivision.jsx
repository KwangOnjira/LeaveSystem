import React, { useEffect, useState, useRef } from "react";
import locale from "antd/locale/th_TH";
import Highlighter from "react-highlight-words";
import axios from "axios";
import {
  Button,
  Box,
  Container,
  createTheme,
  ThemeProvider,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { EditOutlined, SearchOutlined,FileSearchOutlined } from "@ant-design/icons";
import { Input, Table, ConfigProvider, FloatButton, Space, Modal } from "antd";
const { Column, ColumnGroup } = Table;
import { useNavigate } from "react-router-dom";
import { currentUser } from "../../../function/auth";
import { getFiscalYear, getRange } from "../../../function/admin";
import {
  divisionOfficePAO,
  divisionOfficePAOTypeEmployee,
  sameBothDivAndSubDiv,
  sameBothDivAndSubDivTypeEmployee,
  sameDivision,
  samedivisionTypeEmployee,
} from "../../../function/inspector";
import ExcelGenerator from "../exports/ExcelGenerator";

const StatDivision = ({ userId }) => {
  const [currentuserData, setCurrentUserData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const navigate = useNavigate();
  const [fiscalYearData, setFiscalYearData] = useState([]);
  const [useFiscalYearData, setUseFiscalYearData] = useState("");
  const [rangeData, setRangeData] = useState([]);
  const [useRangeData, setUseRangeData] = useState("");
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setCurrentUserData(fetchUser.data);
        console.log("fetchUser.data", fetchUser.data.divisionName);

        const fetchFiscalYear = await getFiscalYear(
          localStorage.getItem("token")
        );
        console.log("fetchFiscalYear", fetchFiscalYear.data);
        setFiscalYearData(fetchFiscalYear.data);

        if (useFiscalYearData === "") {
          setUseFiscalYearData(fetchFiscalYear.data[0].fiscal_year);
        } else {
          const fetchRange = await getRange(
            useFiscalYearData,
            localStorage.getItem("token")
          );
          console.log("fetchRange", fetchRange.data);
          setRangeData(fetchRange.data);
          if (useRangeData === "") {
            setUseRangeData(fetchRange.data[0].range);
            console.log("fetchRange.data[0].range", fetchRange.data[0].range);
          }
        }

        if (fetchUser.data.divisionName === "กองช่าง") {
          const usersResponse = await sameBothDivAndSubDiv(
            useFiscalYearData,
            useRangeData,
            localStorage.getItem("token")
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);
        } else if (fetchUser.data.divisionName === "สำนักปลัด อบจ.") {
          const usersResponse = await divisionOfficePAO(
            useFiscalYearData,
            useRangeData,
            localStorage.getItem("token")
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);
        } else {
          const usersResponse = await sameDivision(
            useFiscalYearData,
            useRangeData,
            localStorage.getItem("token")
          );
          console.log("usersResponse: ", usersResponse.data);
          setUsersData(usersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, [userId, useFiscalYearData, useRangeData]);

  const handleNavigate = () => {
    navigate("/inspector/edit");
  };

  const handleDetail = (citizenID, fiscal_year) => {
    navigate(`/inspector/detail/${citizenID}/${fiscal_year}`);
  };

  const exportExcelGovernmentOfficer = async (fiscal_year, range) => {
    let fetchUserGVM;
    if (currentuserData.divisionName === "กองช่าง") {
      fetchUserGVM = await sameBothDivAndSubDivTypeEmployee(
        fiscal_year,
        range,
        "ข้าราชการ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลข้าราชการ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "ข้าราชการ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName} ฝ่าย${currentuserData.sub_division}`,
      });
    } else if (currentuserData.divisionName === "สำนักปลัด อบจ.") {
      fetchUserGVM = await divisionOfficePAOTypeEmployee(
        fiscal_year,
        range,
        "ข้าราชการ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลข้าราชการ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "ข้าราชการ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    } else {
      fetchUserGVM = await samedivisionTypeEmployee(
        fiscal_year,
        range,
        "ข้าราชการ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลข้าราชการ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "ข้าราชการ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    }
  };

  const exportExcelPermanentEmployee = async (fiscal_year, range) => {
    let fetchUserGVM;
    if (currentuserData.divisionName === "กองช่าง") {
      fetchUserGVM = await sameBothDivAndSubDivTypeEmployee(
        fiscal_year,
        range,
        "ลูกจ้างประจำ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลลูกจ้างประจำ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "ลูกจ้างประจำ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName} ฝ่าย${currentuserData.sub_division}`,
      });
    } else if (currentuserData.divisionName === "สำนักปลัด อบจ.") {
      fetchUserGVM = await divisionOfficePAOTypeEmployee(
        fiscal_year,
        range,
        "ลูกจ้างประจำ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลลูกจ้างประจำ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "ลูกจ้างประจำ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    } else {
      fetchUserGVM = await samedivisionTypeEmployee(
        fiscal_year,
        range,
        "ลูกจ้างประจำ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลลูกจ้างประจำ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "ลูกจ้างประจำ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    }
  };
  document.body.style.backgroundColor = "#F3F3EA";

  const exportExcelMissionEmployee = async (fiscal_year, range) => {
    let fetchUserGVM;
    if (currentuserData.divisionName === "กองช่าง") {
      fetchUserGVM = await sameBothDivAndSubDivTypeEmployee(
        fiscal_year,
        range,
        "พนักงานจ้างตามภารกิจ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลพนักงานจ้างตามภารกิจ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "พนักงานจ้างตามภารกิจ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName} ฝ่าย${currentuserData.sub_division}`,
      });
    } else if (currentuserData.divisionName === "สำนักปลัด อบจ.") {
      fetchUserGVM = await divisionOfficePAOTypeEmployee(
        fiscal_year,
        range,
        "พนักงานจ้างตามภารกิจ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลพนักงานจ้างตามภารกิจ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "พนักงานจ้างตามภารกิจ",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    } else {
      fetchUserGVM = await samedivisionTypeEmployee(
        fiscal_year,
        range,
        "พนักงานจ้างตามภารกิจ",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: 'ไม่พบข้อมูล',
          content: 'ไม่พบข้อมูลพนักงานจ้างตามภารกิจ',
          style:{fontFamily:"Kodchasan"}
        });
        return; 
    
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "พนักงานจ้าง",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    }
  };

  const exportExcelGeneralEmployee = async (fiscal_year, range) => {
    let fetchUserGVM;
    if (currentuserData.divisionName === "กองช่าง") {
      fetchUserGVM = await sameBothDivAndSubDivTypeEmployee(
        fiscal_year,
        range,
        "จ้างทั่วไป",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: "ไม่พบข้อมูล",
          content: "ไม่พบข้อมูลพนักงานจ้างทั่วไป",
          style: { fontFamily: "Kodchasan" },
        });
        return;
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "จ้างทั่วไป",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName} ฝ่าย${currentuserData.sub_division}`,
      });
    } else if (currentuserData.divisionName === "สำนักปลัด อบจ.") {
      fetchUserGVM = await divisionOfficePAOTypeEmployee(
        fiscal_year,
        range,
        "จ้างทั่วไป",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: "ไม่พบข้อมูล",
          content: "ไม่พบข้อมูลพนักงานจ้างทั่วไป",
          style: { fontFamily: "Kodchasan" },
        });
        return;
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "จ้างทั่วไป",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
    } else {
      fetchUserGVM = await samedivisionTypeEmployee(
        fiscal_year,
        range,
        "จ้างทั่วไป",
        localStorage.getItem("token")
      );
      console.log("fetchUserGVM ", fetchUserGVM.data);

      if (fetchUserGVM.data.length === 0) {
        Modal.error({
          title: "ไม่พบข้อมูล",
          content: "ไม่พบข้อมูลพนักงานจ้างทั่วไป",
          style: { fontFamily: "Kodchasan" },
        });
        return;
      }

      const generateExcel = ExcelGenerator({
        userData: fetchUserGVM.data,
        range: range,
        type: "จ้างทั่วไป",
        inspector: currentuserData,
        inspectorSignature: import.meta.env.VITE_APP_API+`/signatures/${currentuserData.signature}`,
        title: `กอง${currentuserData.divisionName}`,
      });
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

  let datasource = [];
  if (usersData.length > 0) {
    datasource = usersData.map((user) => {
      let detailButton = null;
      detailButton = (
        <Button
          style={{
            borderRadius: 50,
            width: "90%",
            marginLeft: "15px",
            backgroundColor: "#8497b5",
            color: "#FFFFE1",
          }}
          sx={{
            fontFamily: "Kodchasan",
          }}
          variant="contained"
          onClick={() => handleDetail(user.citizenID, useFiscalYearData)}
        >
          <FileSearchOutlined style={{ fontSize: "20px" }} />
        </Button>
      );
      return {
        name: `${user.prefix} ${user.name} ${user.surname}`,
        subDivision: user.sub_division,
        position: user.position,
        type_of_employee: user.type_of_employee,
        leaveCount: `${
          user.statistics.length > 0 ? user.statistics[0].leave_count : "-"
        } ครั้ง`,
        sickleave: `${
          user.statistics.length > 0 ? user.statistics[0].SL_In_Range : "-"
        }`,
        personalleave: `${
          user.statistics.length > 0 ? user.statistics[0].PL_In_Range : "-"
        }`,
        maternityleave: `${
          user.statistics.length > 0 ? user.statistics[0].ML_In_Range : "-"
        }`,
        ordinationleave: `${
          user.statistics.length > 0 ? user.statistics[0].OL_In_Range : "-"
        }`,
        studyleave: `${
          user.statistics.length > 0 ? user.statistics[0].STL_In_Range : "-"
        }`,
        totalleave: `${
          user.statistics.length > 0 ? user.statistics[0].total_leaveDay : "-"
        } วัน`,
        detail: detailButton,
      };
    });
  }

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={` ค้นหา`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "90%",
              borderRadius: 50,
              backgroundColor: "#e09132",
              color: "#faf1d6",
            }}
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            ค้นหา
          </Button>
          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "90%",
              borderRadius: 50,
              backgroundColor: "#aa7c57",
              color: "#faf1d6",
            }}
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "90%",
              borderRadius: 50,
              backgroundColor: "#ce796b",
              color: "#faf1d6",
            }}
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            รีเซ็ต
          </Button>

          <Button
            sx={{
              fontFamily: "Kodchasan",
              width: "90%",
              borderRadius: 50,
              backgroundColor: "#b74248",
              color: "#faf1d6",
            }}
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            ปิด
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  return (
    <div style={{ position: "relative", minHeight: "86vh" }}>
      <ThemeProvider theme={theme}>
        {/* <Container
          fixed
          sx={{
            position: "relative",
          }}
        > */}
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
          <h1 className="topic-statistic">สถิติวันลาในสังกัด</h1>
          {currentuserData.divisionName === "กองช่าง" ? (
            <h2
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              {currentuserData.divisionName} {currentuserData.sub_division}{" "}
            </h2>
          ) : (
            <h2
              style={{
                fontFamily: "Kodchasan",
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "normal",
              }}
            >
              กอง {currentuserData.divisionName}
            </h2>
          )}
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {fiscalYearData && fiscalYearData.length > 0 && (
                <>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "left",
                      fontWeight: "normal",
                    }}
                  >
                    ปีงบประมาณ{" "}
                  </label>
                  <Select
                    sx={{
                      width: "20%",
                      margin: "0.5rem",
                      fontFamily: "Kodchasan",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                    defaultValue={fiscalYearData[0].fiscal_year}
                    value={useFiscalYearData}
                    onChange={(e) => {
                      e.preventDefault(), setUseFiscalYearData(e.target.value);
                    }}
                  >
                    {fiscalYearData.map((year) => (
                      <MenuItem
                        sx={{
                          fontFamily: "Kodchasan",
                        }}
                        key={year.fiscal_year}
                        value={year.fiscal_year}
                      >
                        ปี{year.fiscal_year}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {rangeData && rangeData.length > 0 && (
                <>
                  <label
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "18px",
                      textAlign: "left",
                      fontWeight: "normal",
                    }}
                  >
                    ช่วง{" "}
                  </label>
                  <Select
                    sx={{
                      height: "60%",
                      width: "30%",
                      margin: "0.5rem",
                      fontFamily: "Kodchasan",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                    defaultValue={rangeData[0].range}
                    value={useRangeData}
                    onChange={(e) => {
                      e.preventDefault(), setUseRangeData(e.target.value);
                    }}
                  >
                    {rangeData.map((ranges) => (
                      <MenuItem
                        sx={{
                          fontFamily: "Kodchasan",
                        }}
                        key={ranges.range}
                        value={ranges.range}
                      >
                        {ranges.range === 1 && (
                          <>
                            <p>ช่วงที่ 1 (1 ต.ค. - 31 มี.ค.)</p>
                          </>
                        )}
                        {ranges.range === 2 && (
                          <>
                            <p>ช่วงที่ 2 (1 เม.ย. - 30 ก.ย.)</p>
                          </>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </Grid>

            <style>
              {`
          .ant-table-thead th {
            font-size: 18px; 
          }
        `}
            </style>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <ConfigProvider
                locale={locale}
                theme={{
                  token: {
                    borderRadius: "16px",
                    fontFamily: "Kodchasan",
                    colorBgContainer: "#dddfd1",
                    fontSize: "16px",
                    colorBgBase: "#9ba986",
                    colorPrimary: "#708160",
                  },
                }}
              >
                <Table
                  style={{
                    flexDirection: "column",
                    flex: "1 1 auto",
                    alignContent: "center",
                  }}
                  dataSource={datasource}
                  // scroll={{
                  //   x: 1500,
                  // }}
                >
                  <Column
                    align="center"
                    width="30%"
                    title="ชื่อ-นามสกุล"
                    dataIndex="name"
                    key="name"
                    fixed="left"
                    {...getColumnSearchProps("name")}
                  />
                  <Column
                    align="center"
                    width="20%"
                    title="ฝ่าย"
                    dataIndex="subDivision"
                    key="subDivision"
                  />
                  <Column
                    align="center"
                    width="20%"
                    title="ตำแหน่ง"
                    dataIndex="position"
                    key="position"
                  />
                  <Column
                    align="center"
                    width="20%"
                    title="ชนิดลูกจ้าง"
                    dataIndex="type_of_employee"
                    key="type_of_employee"
                    onFilter={(value, record) =>
                      record.type_of_employee.startsWith(value)
                    }
                    filters={[
                      {
                        text: "ข้าราชการการเมือง",
                        value: "ข้าราชการการเมือง",
                      },
                      {
                        text: "ข้าราชการ",
                        value: "ข้าราชการ",
                      },
                      {
                        text: "ลูกจ้างประจำ",
                        value: "ลูกจ้างประจำ",
                      },
                      {
                        text: "พนักงานจ้างตามภารกิจ",
                        value: "พนักงานจ้างตามภารกิจ",
                      },
                      {
                        text: "จ้างทั่วไป",
                        value: "จ้างทั่วไป",
                      },
                    ]}
                  />
                  <Column
                    align="center"
                    title="จำนวนครั้งที่ลา"
                    dataIndex="leaveCount"
                    key="leaveCount"
                    width="15%"
                  />
                  <Column
                    align="center"
                    title="ลาป่วย"
                    dataIndex="sickleave"
                    key="sickleave"
                    width="10%"
                  />
                  <Column
                    align="center"
                    title="ลากิจส่วนตัว"
                    dataIndex="personalleave"
                    key="personalleave"
                    width="10%"
                  />
                  <Column
                    align="center"
                    title="ลาคลอดบุตร"
                    dataIndex="maternityleave"
                    key="maternityleave"
                    width="10%"
                  />
                  <Column
                    align="center"
                    title="ลาอุปสมบท"
                    dataIndex="ordinationleave"
                    key="ordinationleave"
                    width="10%"
                  />
                  <Column
                    align="center"
                    title="ลาไปศึกษาต่อ"
                    dataIndex="studyleave"
                    key="studyleave"
                    width="10%"
                  />
                  <Column
                    align="center"
                    title={`รวมวันลาในช่วงที่${useRangeData} ของปีงบประมาณ`}
                    dataIndex="totalleave"
                    key="totalleave"
                    width="10%"
                  />
                  <Column
                    align="center"
                    title="ดูรายละเอียด"
                    dataIndex="detail"
                    key="detail"
                    width="20%"
                  />
                </Table>
              </ConfigProvider>
            </Grid>
          </Grid>
        </Box>
        <br />
        <Grid
          justifyContent="center"
          alignItems="center"
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Button
              style={{
                width: "90%",
                borderRadius: 50,
                marginLeft: "15px",
                backgroundColor: "#Efaf96",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
              variant="contained"
              onClick={() => {
                exportExcelGovernmentOfficer(useFiscalYearData, useRangeData);
              }}
            >
              พิมพ์บัญชีแสดงวันลาของข้าราชการ
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Button
              style={{
                width: "90%",
                borderRadius: 50,
                marginLeft: "15px",
                backgroundColor: "#ea9087",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
              variant="contained"
              onClick={() => {
                exportExcelPermanentEmployee(useFiscalYearData, useRangeData);
              }}
            >
              พิมพ์บัญชีแสดงวันลาของลูกจ้างประจำ
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Button
              style={{
                width: "90%",
                borderRadius: 50,
                marginLeft: "15px",
                backgroundColor: "#cb8d9a",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
              variant="contained"
              onClick={() => {
                exportExcelMissionEmployee(useFiscalYearData, useRangeData);
              }}
            >
              พิมพ์บัญชีแสดงวันลาของพนักงานจ้างตามภารกิจ
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Button
              style={{
                width: "90%",
                borderRadius: 50,
                marginLeft: "15px",
                backgroundColor: "#9d98ae",
                color: "#FFFFE1",
              }}
              sx={{
                fontFamily: "Kodchasan",
              }}
              variant="contained"
              onClick={() => {
                exportExcelGeneralEmployee(useFiscalYearData, useRangeData);
              }}
            >
              พิมพ์บัญชีแสดงวันลาของพนักงานจ้างทั่วไป
            </Button>
          </Grid>
        </Grid>
        {/* </Container> */}
      </ThemeProvider>

      <ConfigProvider
        theme={{
          token: {
            colorBgElevated: "#708160",
            colorText: "#efefef",
            fontSize: "22px",
            margin: "2px",
          },
        }}
      >
        <FloatButton icon={<EditOutlined />} onClick={handleNavigate} />
      </ConfigProvider>
    </div>
  );
};

export default StatDivision;
