import React, { useEffect, useState, useRef } from "react";
import { deleteHoliday, getHoliday } from "../../../../function/holiday";
import { useNavigate } from "react-router-dom";
import { Table, ConfigProvider, Modal, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import {
  ExclamationCircleFilled,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined 
} from "@ant-design/icons";
import locale from "antd/locale/th_TH";
const { Column } = Table;
import { Button, Box, createTheme, ThemeProvider, Grid } from "@mui/material";


const AdminHoliday = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [holiday, setHoliday] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchHoliday = await getHoliday(localStorage.getItem("token"));
        console.log("fetchHoliday", fetchHoliday.data);
        setHoliday(fetchHoliday.data);
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

  const handleAdd = async (e) => {
    e.preventDefault();
    navigate("/admin/createholiday");
  };
  const handleEdit = async (id) => {
    navigate(`/admin/updateholiday/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHoliday(id, localStorage.getItem("token"));
      console.log("success delete");
      window.location.reload();
    } catch (error) {
      console.log("handleAdd: " + error);
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

  const showConfirm = (name,id) => {
    confirm({
      title: `ยืนยันการลบวัน${name}`,
      icon: <ExclamationCircleFilled />,
      content: "กดยืนยันเพื่อวันหยุดราชการ",
      okText: "ยืนยัน",
      className: "custom-modal-font",
      cancelText: "ยกเลิก",
      onOk() {
        handleDelete(id);
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

  let dataSource = [];

  holiday.forEach((day) => {
    let editButton = null;
    let deleteButton = null;

    editButton = (
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
          handleEdit(day.id);
        }}
      >
        <EditOutlined style={{ fontSize: "20px" }}/>
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
        variant="contained"
        onClick={() => {
          showConfirm(day.name,day.id);
        }}
      >
        <DeleteOutlined style={{ fontSize: "20px" }} />
      </Button>
    );
    dataSource.push({
      name: `${day.name}`,
      date: formatLeaveDate(day.date),
      edit: editButton,
      delete: deleteButton,
    });
  });

  const parseDate = (dateString) => {
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const parts = dateString.split(" ");
    const day = parseInt(parts[0]);
    const monthIndex = thaiMonths.indexOf(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, monthIndex, day);
  };

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
              <h1 className="topic-statistic">ข้อมูลวันหยุดราชการ</h1>
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
              <Button
                sx={{
                  fontFamily: "Kodchasan",
                  width: "10%",
                  borderRadius: 50,
                  backgroundColor: "#b74248",
                  color: "#faf1d6",
                }}
                variant="contained"
                onClick={handleAdd}
              >
                เพิ่ม
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {holiday.length > 0 && (
                <>
                  <ConfigProvider
                    locale={locale}
                    theme={{
                      token: {
                        borderRadius: "16px",
                        fontFamily: "Kodchasan",
                        colorBgContainer: "#f5dde0",
                        fontSize: "16px",
                        colorPrimary: "#7296a4",
                        colorBgBase: "#7296a4",
                        colorText: "#2f2557",
                      },
                    }}
                  >
                    <Table dataSource={dataSource}>
                      <Column
                        width="40%"
                        align="center"
                        title="วันหยุด"
                        dataIndex="name"
                        key="name"
                        {...getColumnSearchProps("name")}
                      />
                      <Column
                        width="40"
                        align="center"
                        title="วันที่"
                        dataIndex="date"
                        key="date"
                        defaultSortOrder="ascend"
                        sorter={(a, b) => {
                          const dateA = parseDate(a.date);
                          const dateB = parseDate(b.date);
                          return dateA - dateB;
                        }}
                      />
                      <Column
                        width="10%"
                        align="center"
                        title="แก้ไข"
                        dataIndex="edit"
                        key="edit"
                      />
                      <Column
                        width="10%"
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

export default AdminHoliday;
