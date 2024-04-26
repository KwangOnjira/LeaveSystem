import React, { useEffect, useState } from "react";
import locale from "antd/locale/th_TH";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../../../function/auth";
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
import { intervalToDuration } from "date-fns";
import { Input, Table, ConfigProvider } from "antd";
const { Column, ColumnGroup } = Table;
import { calculateYear } from "../../../function/YearInWork";
import { getFiscalYear, getRange } from "../../../function/admin";
import {
  divisionOfficePAO,
  sameBothDivAndSubDiv,
  sameDivision,
} from "../../../function/inspector";

const EditStatistic = ({ userId }) => {
  const [currentuserData, setCurrentUserData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [fiscalYearData, setFiscalYearData] = useState([]);
  const [useFiscalYearData, setUseFiscalYearData] = useState("");
  const [rangeData, setRangeData] = useState([]);
  const [useRangeData, setUseRangeData] = useState("");
  const [searchData, setSearchData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await currentUser(localStorage.getItem("token"));
        console.log(fetchUser.data);
        setCurrentUserData(fetchUser.data);

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

        console.log("fetchUser.data", fetchUser.data.divisionName);
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

  const handleDetail = (citizenID, statisticID) => {
    navigate(`/inspector/edit/detail/${citizenID}/${statisticID}`);
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
      let editButton = null;
      editButton = (
        <Button
          style={{
            borderRadius: 50,
            marginLeft: "15px",
            width:"90%",
            backgroundColor: "#B6594C",
            color: "#FFFFE1",
          }}
          sx={{
            fontFamily: "Kodchasan",
          }}
          variant="contained"
          onClick={() =>
            handleDetail(user.citizenID, user.statistics[0].statisticID)
          }
        >
          แก้ไขข้อมูล
        </Button>
      );
      return {
        name: `${user.prefix} ${user.name} ${user.surname}`,
        yearInWork: calculateYear(user.start_of_work_on),
        position: user.position,
        VL_accumulatedDays: `${
          user.statistics.length > 0
            ? user.statistics[0].VL_accumulatedDays
            : "-"
        }`,
        VL_total: `${
          user.statistics.length > 0 ? user.statistics[0].VL_total : "-"
        }`,
        currentUseVL: `${
          user.statistics.length > 0 ? user.statistics[0].currentUseVL : "-"
        }`,
        VL_remaining: `${
          user.statistics.length > 0 ? user.statistics[0].VL_remaining : "-"
        }`,
        leaveCount: `${
          user.statistics.length > 0 ? user.statistics[0].leave_count : "-"
        }`,
        SL1Year: `${
          user.statistics.length > 0 ? user.statistics[0].SL_remaining : "-"
        }`,
        SLInRange: `${
          user.statistics.length > 0 ? user.statistics[0].SL_In_Range : "-"
        }`,
        PL1Year: `${
          user.statistics.length > 0 ? user.statistics[0].PL_remaining : "-"
        }`,
        PLInRange: `${
          user.statistics.length > 0 ? user.statistics[0].PL_In_Range : "-"
        }`,
        ML: `${
          user.statistics.length > 0 ? user.statistics[0].ML_In_Range : "-"
        }`,
        OL: `${
          user.statistics.length > 0 ? user.statistics[0].OL_In_Range : "-"
        }`,
        STL: `${
          user.statistics.length > 0 ? user.statistics[0].STL_In_Range : "-"
        }`,
        edit: editButton,
      };
    });
  }

  return (
    <div style={{ position: "relative", minHeight: "86vh" }}>
      <ThemeProvider theme={theme}>
        {/* <Container
          fixed
          sx={{
            position: "relative"
          }}
        > */}
        <LeftOutlined onClick={() => navigate("/inspector")} />
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
          <h1 className="topic-statistic">แก้ไขวันลาในสังกัด</h1>
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "right" }}
            >
              <ConfigProvider
                locale={locale}
                theme={{
                  token: {
                    borderRadius: "8px",
                    fontFamily: "Kodchasan",
                    colorBgContainer: "#e6d1d8",
                    colorBgBase: "#56373c",
                    colorPrimary: "#56373c",
                  },
                }}
              >
                <Input.Search
                  ch
                  placeholder="ค้นหาชื่อ-นามสกุล"
                  style={{ width: 300 }}
                  onSearch={(value) => {
                    setSearchData(value);
                  }}
                ></Input.Search>
              </ConfigProvider>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <ConfigProvider
              locale={locale}
                theme={{
                  token: {
                    borderRadius: "16px",
                    fontFamily: "Kodchasan",
                    colorBgContainer: "#e6d1d8",
                    fontSize: "16px",
                    colorPrimary: "#56373c",
                  },
                }}
              >
                <Table dataSource={datasource}>
                  <Column align="center"
                    width="30%"
                    fixed="left"
                    filteredValue={[searchData]}
                    onFilter={(value, record) => {
                      return String(record.name)
                        .toLowerCase()
                        .includes(value.toLowerCase());
                    }}
                    onChange={(e) => {
                      setSearchData(e.target.value);
                    }}
                    title="ชื่อ-นามสกุล"
                    dataIndex="name"
                    key="name"
                  />
                  <Column align="center"
                    width="10%"
                    title="อายุการทำงาน"
                    dataIndex="yearInWork"
                    key="yearInWork"
                  />
                  <Column align="center"
                    width="10%"
                    title="ตำแหน่ง"
                    dataIndex="position"
                    key="position"
                  />
                  <Column align="center"
                    width="5%"
                    title="วันลาพักผ่อนสะสม"
                    dataIndex="VL_accumulatedDays"
                    key="VL_accumulatedDays"
                  />
                  <Column align="center"
                    width="5%"
                    title="รวมมีวันลาพักผ่อน"
                    dataIndex="VL_total"
                    key="VL_total"
                  />
                  <Column align="center"
                    width="5%"
                    title="ลาพักผ่อนมาแล้ว"
                    dataIndex="currentUseVL"
                    key="currentUseVL"
                  />
                  <Column align="center"
                    width="5%"
                    title="คงเหลือวันลาพักผ่อน"
                    dataIndex="VL_remaining"
                    key="VL_remaining"
                  />
                  <Column align="center"
                    width="5%"
                    title="จำนวนครั้งที่ลา (ไม่รวมลาพักผ่อน)"
                    dataIndex="leaveCount"
                    key="leaveCount"
                  />
                  <Column align="center"
                    width="5%"
                    title="ลาป่วย (1ปีงบประมาณ)"
                    dataIndex="SL1Year"
                    key="SL1Year"
                  />
                  <Column align="center"
                    width="5%"
                    title={`ลาป่วย (ในช่วง${useRangeData})`}
                    dataIndex="SLInRange"
                    key="SLInRange"
                  />
                  <Column align="center"
                    width="5%"
                    title="ลากิจ (1ปีงบประมาณ)"
                    dataIndex="PL1Year"
                    key="PL1Year"
                  />
                  <Column align="center"
                    width="5%"
                    title={`ลากิจ (ในช่วง${useRangeData})`}
                    dataIndex="PLInRange"
                    key="PLInRange"
                  />
                  <Column align="center"
                    width="5%"
                    title={`ลาคลอดบุตร (ในช่วง${useRangeData})`}
                    dataIndex="ML"
                    key="ML"
                  />
                  <Column align="center"
                    width="5%"
                    title={`ลาอุปสมบท (ในช่วง${useRangeData})`}
                    dataIndex="OL"
                    key="OL"
                  />
                  <Column align="center"
                    width="5%"
                    title={`ลาไปศึกษาต่อ (ในช่วง${useRangeData})`}
                    dataIndex="STL"
                    key="STL"
                  />
                  <Column align="center"
                    width="10%"
                    title="แก้ไขข้อมูล"
                    dataIndex="edit"
                    key="edit"
                  />
                </Table>
              </ConfigProvider>
            </Grid>
          </Grid>
        </Box>
        {/* </Container> */}
      </ThemeProvider>
    </div>
  );
};

export default EditStatistic;
