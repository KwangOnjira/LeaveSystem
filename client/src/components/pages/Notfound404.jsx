import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';

const primary = "#332E30"; 

export default function Notfound404({text}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white',fontFamily: "Kodchasan",
                        fontSize: "60px",
                        textAlign: "center",
                        fontWeight: "normal", }}>
        ขออภัย
      </Typography>
      <br/>
      <Typography variant="h6" style={{ color: 'white',fontFamily: "Kodchasan",
                        fontSize: "28px",
                        textAlign: "center",
                        fontWeight: "normal", }}>
        {text}
      </Typography>
      <Link to={'/login'}>
      <Button style={{
                        borderRadius: 24,
                        width: "100%",
                        marginTop: "30px",
                        backgroundColor: "#B74248",
                        color: "#FFFFE1",
                      }}
                      sx={{
                        fontFamily: "Kodchasan",
                      }} variant="contained">กลับสู่หน้าเข้าสู่ระบบ</Button>
      </Link>
      
    </Box>
  );
}