import react, { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const HeaderBar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/logout");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNav = (event) => {
    handleClose();
    navigate("/getProfile");
  };
  const handleUser = (event) => {
    handleClose();
    navigate("/admin");
  };
  const handleHoliday = (event) => {
    handleClose();
    navigate("/admin/holiday");
  };
  const handleStat = (event) => {
    handleClose();
    navigate("/admin/statistics");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* search  */}
      <Box display="flex" borderRadius="3px" backgroundColor="#F0D0C1">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* icons */}
      <Box display="flex">
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon onClick={handleMenu} />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Link to="/admin" className="menu-bars">
              <MenuItem onClick={handleUser}>ข้อมูลผู้ใช้งาน</MenuItem>
            </Link>
            
            <Link to="/admin/holiday" className="menu-bars">
              <MenuItem onClick={handleHoliday}>ข้อมูลวันหยุด</MenuItem>
            </Link>
            
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeaderBar;
