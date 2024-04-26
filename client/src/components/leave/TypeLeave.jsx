import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  createTheme,
  ThemeProvider,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const TypeLeave = () => {
  const navigate = useNavigate();
  const [selectType, setSelectType] = useState("vacationleave");

  const handleChange = (e) => {
    setSelectType(e.target.value);
  };

  const handleNext = () => {
    navigate(`/leave/${selectType}`);
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 300,
        md: 660,
        lg: 980,
        xl: 1620,
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
            height: "30vh",
          }}
        >
          <Box
            sx={{
              display: "grid",
              padding: "3rem",
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxHeight: "90vh", // Adjusted height to 90% of viewport height
              overflowY: "auto", // Ensure scrolling for overflow
              width: "80%", // Adjusted width for responsiveness
              [theme.breakpoints.up("xl")]: {
                width: "60%", // Adjusted width for extra-large screens
              },
              [theme.breakpoints.down("xl")]: {
                width: "100%",
                height: "auto",
              },
            }}
          >
            <FormControl fullWidth></FormControl>
            <InputLabel
              sx={{
                fontFamily: "Kodchasan",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
              id="leaveType"
            >
              เลือกประเภทการลา
            </InputLabel>
            <Select
              sx={{
                fontFamily: "Kodchasan",
                backgroundColor: "#fff",
                borderRadius: "18px",
                fontSize:"20px"
              }}
              labelId="leaveType"
              id="leaveType"
              name="leaveType"
              value={selectType}
              onChange={handleChange}
              defaultValue="vacationleave"
            >
              <MenuItem
                sx={{
                  fontFamily: "Kodchasan",
                }}
                value="vacationleave"
              >
                ลาพักผ่อน
              </MenuItem>
              <MenuItem
                sx={{
                  fontFamily: "Kodchasan",
                }}
                value="sickleave"
              >
                ลาป่วย
              </MenuItem>
              <MenuItem
                sx={{
                  fontFamily: "Kodchasan",
                }}
                value="personalleave"
              >
                ลากิจส่วนตัว
              </MenuItem>
              <MenuItem
                sx={{
                  fontFamily: "Kodchasan",
                }}
                value="maternityleave"
              >
                ลาคลอด
              </MenuItem>
              <MenuItem
                sx={{
                  fontFamily: "Kodchasan",
                }}
                value="ordinationleave"
              >
                ลาอุปสมบท
              </MenuItem>
              <MenuItem
                sx={{
                  fontFamily: "Kodchasan",
                }}
                value="studyleave"
              >
                ลาไปศึกษาต่อ
              </MenuItem>
            </Select>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{
                  borderRadius: 50,
                  width: "50%",
                  margin: "15px",
                  padding: "10px",
                  backgroundColor: "#708160",
                  color: "#f3f3ea",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                onClick={handleNext}
                disabled={!selectType}
              >
                ยืนยันประเภทการลา
              </Button>
            </div>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default TypeLeave;
