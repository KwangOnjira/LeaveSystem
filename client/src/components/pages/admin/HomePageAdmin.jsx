import React, { useRef, useEffect, useState } from "react";
import { getAllUsers } from "../../../function/admin";
import { useNavigate } from "react-router-dom";
import { Table, ConfigProvider, Modal, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import {
  ExclamationCircleFilled,
  DeleteOutlined,
  FileSearchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import locale from "antd/locale/th_TH";
const { Column } = Table;
import { Button, Box, createTheme, ThemeProvider, Grid } from "@mui/material";
import { deleteUsers } from "../../../function/auth";

const HomePageAdmin = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);

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

  const formatLeaveDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "th-TH",
      options
    );
    return formattedDate;
  };

  const handleDetail = (citizenID) => {
    navigate(`/admin/detail/${citizenID}`);
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

  const handleDelete = async (citizenID) => {
    try {
      // Perform delete operation
      await deleteUsers(citizenID, localStorage.getItem("token"));
      console.log("Delete successful");
      window.location.reload();
    } catch (error) {
      console.log("Error deleting request: ", error);
    }
  };

  const showConfirm = (citizenID) => {
    confirm({
      title: "ยืนยันการลบผู้ใช้งาน",
      icon: <ExclamationCircleFilled />,
      content: "กดยืนยันเพื่อลบผู้ใช้งาน",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleDelete(citizenID);
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        className: "custom-modal-font",
        style: { color: "#edeef3", backgroundColor: "#c1012d" },
      },
      cancelButtonProps: {
        className: "custom-modal-font",
      },
    });
  };

  let dataSource = [];

  usersData.forEach((user, index) => {
    let detailButton = null;
    let deleteButton = null;

    detailButton = (
      <Button
        sx={{
          fontFamily: "Kodchasan",
          width: "90%",
          borderRadius: 50,
          backgroundColor: "#494268",
          color: "#faf1d6",
        }}
        variant="contained"
        onClick={() => {
          handleDetail(user.citizenID);
        }}
      >
        <FileSearchOutlined style={{ fontSize: "20px" }} />
      </Button>
    );
    deleteButton = (
      <Button
        sx={{
          fontFamily: "Kodchasan",
          width: "90%",
          borderRadius: 50,
          backgroundColor: "#b74248",
          color: "#faf1d6",
        }}
        variant="text"
        onClick={() => {
          showConfirm(user.citizenID);
        }}
      >
        <DeleteOutlined style={{ fontSize: "20px" }} />
      </Button>
    );

    dataSource.push({
      citizenID: `${user.citizenID}`,
      name: `${user.prefix} ${user.name} ${user.surname}`,
      role: `${user.role}`,
      division: `${user.divisionName}`,
      sub_division: `${user.sub_division}`,
      position: `${user.position}`,
      type: `${user.type_of_employee}`,
      start: `${formatLeaveDate(user.start_of_work_on)}`,
      superior1: `${
        user.position_first_supeior ? user.position_first_supeior : ""
      }`,
      superior2: `${user.position_second_supeior}`,
      detail: detailButton,
      delete: deleteButton,
    });
  });

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
    <>
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
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <style>
              {`
          .ant-table-thead th {
            font-size: 16px; 
          }
        `}
            </style>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "center" }}
            >
              <h1 className="topic-statistic">ข้อมูลผู้ใช้งานในระบบ</h1>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {usersData.length > 0 && (
                <>
                  <ConfigProvider
                    locale={locale}
                    theme={{
                      token: {
                        borderRadius: "16px",
                        fontFamily: "Kodchasan",
                        colorBgContainer: "#cddee5",
                        fontSize: "16px",
                        colorPrimary: "#7296a4",
                        colorBgBase: "#7296a4",
                        colorText: "#2f2557",
                      },
                    }}
                  >
                    <Table dataSource={dataSource}>
                      <Column
                        width="12%"
                        align="center"
                        title="หมายเลขประจำตัวประชาชน"
                        dataIndex="citizenID"
                        key="citizenID"
                      />
                      <Column
                        width="20%"
                        align="center"
                        title="ชื่อ-นามสกุล"
                        dataIndex="name"
                        key="name"
                        {...getColumnSearchProps("name")}
                      />

                      <Column
                        width="5%"
                        align="center"
                        title="บทบาท"
                        dataIndex="role"
                        key="role"
                        filters={[
                          { text: "user", value: "user" },
                          { text: "inspecter(ผู้ตรวจสอบ)", value: "inspector" },
                          {
                            text: "superior(ผู้บังคับบัญชา)",
                            value: "superior",
                          },
                          {
                            text: "admin(ผู้ดูแลระบบ)",
                            value: "admin",
                          },
                        ]}
                        onFilter={(value, record) =>
                          record.role.includes(value)
                        }
                      />

                      <Column
                        width="10%"
                        align="center"
                        title="กอง"
                        dataIndex="division"
                        key="division"
                        filters={[
                          {
                            text: "องค์การบริหารส่วนจังหวัดลำปาง",
                            value: "องค์การบริหารส่วนจังหวัดลำปาง",
                          },
                          { text: "สำนักปลัด อบจ.", value: "สำนักปลัด อบจ." },
                          {
                            text: "สำนักงานเลขานุการ อบจ.",
                            value: "สำนักงานเลขานุการ อบจ.",
                          },
                          {
                            text: "กองยุทธศาสตร์และงบประมาณ",
                            value: "กองยุทธศาสตร์และงบประมาณ",
                          },
                          { text: "กองคลัง", value: "กองคลัง" },
                          {
                            text: "กองช่าง",
                            value: "กองช่าง",
                          },
                          {
                            text: "กองการศึกษา ศาสนาและวัฒนธรรม",
                            value: "กองการศึกษา ศาสนาและวัฒนธรรม",
                          },
                          {
                            text: "กองพัสดุและทรัพย์สิน",
                            value: "กองพัสดุและทรัพย์สิน",
                          },
                          { text: "กองสาธารณสุข", value: "กองสาธารณสุข" },
                          {
                            text: "กองการเจ้าหน้าที่",
                            value: "กองการเจ้าหน้าที่",
                          },
                          {
                            text: "หน่วยตรวจสอบภายใน",
                            value: "หน่วยตรวจสอบภายใน",
                          },
                          { text: "อื่นๆ", value: `other` },
                        ]}
                        onFilter={(value, record) => {
                          if (value === "other") {
                            return (
                              !record.division.includes(
                                "องค์การบริหารส่วนจังหวัดลำปาง"
                              ) &&
                              !record.division.includes("สำนักปลัด อบจ.") &&
                              !record.division.includes(
                                "สำนักงานเลขานุการ อบจ."
                              ) &&
                              !record.division.includes(
                                "กองยุทธศาสตร์และงบประมาณ"
                              ) &&
                              !record.division.includes("กองคลัง") &&
                              !record.division.includes("กองช่าง") &&
                              !record.division.includes(
                                "กองการศึกษา ศาสนาและวัฒนธรรม"
                              ) &&
                              !record.division.includes(
                                "กองพัสดุและทรัพย์สิน"
                              ) &&
                              !record.division.includes("กองสาธารณสุข") &&
                              !record.division.includes("กองการเจ้าหน้าที่") &&
                              !record.division.includes("หน่วยตรวจสอบภายใน")
                            );
                          } else {
                            return record.division.includes(value);
                          }
                        }}
                      />
                      <Column
                        width="10%"
                        align="center"
                        title="ฝ่าย"
                        dataIndex="sub_division"
                        key="sub_division"
                      />
                      <Column
                        width="10%"
                        align="center"
                        title="ตำแหน่ง"
                        dataIndex="position"
                        key="position"
                      />
                      <Column
                        width="9%"
                        align="center"
                        title="ประเภทของลูกจ้าง"
                        dataIndex="type"
                        key="type"
                        filters={[
                          {
                            text: "ข้าราชการการเมือง",
                            value: "ข้าราชการการเมือง",
                          },
                          { text: "ข้าราชการ", value: "ข้าราชการ" },
                          { text: "ลูกจ้างประจำ", value: "ลูกจ้างประจำ" },
                          {
                            text: "พนักงานจ้างตามภารกิจ",
                            value: "พนักงานจ้างตามภารกิจ",
                          },
                          { text: "จ้างทั่วไป", value: "จ้างทั่วไป" },
                        ]}
                        onFilter={(value, record) =>
                          record.type.includes(value)
                        }
                      />
                      <Column
                        width="10%"
                        align="center"
                        title="วันที่เริ่มงาน"
                        dataIndex="start"
                        key="start"
                      />
                      <Column
                        width="25%"
                        align="center"
                        title="ผู้บังคับบัญชาคนที่1"
                        dataIndex="superior1"
                        key="superior1"
                      />
                      <Column
                        width="25%"
                        align="center"
                        title="ผู้บังคับบัญชาคนที่2"
                        dataIndex="superior2"
                        key="superior2"
                      />
                      <Column
                        width="20%"
                        align="center"
                        title="ดูรายละเอียด"
                        dataIndex="detail"
                        key="detail"
                      />
                      <Column
                        width="20%"
                        align="center"
                        title="ลบ"
                        dataIndex="delete"
                        key="delete"
                      />
                    </Table>
                  </ConfigProvider>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default HomePageAdmin;
