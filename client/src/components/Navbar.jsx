import React from "react";
import { Link } from "react-router-dom";

const Navbar =({loggedIn,handleLogout})=>{

    return(
        <div className="navbar">
            <Link to="/">Home</Link>
            {!loggedIn && <Link to="/login">Login</Link>}
            {!loggedIn && <Link to="/register">Register</Link>}
            {loggedIn && <Link to="/profile">Profile</Link>}
            {loggedIn && <Link to="/getProfile">Get Profile</Link>}
            {loggedIn && <Link to="/statistics">Statistics</Link>}
            {loggedIn && <Link to="/leave">Leave</Link>}
            {loggedIn && <Link to="/logout" onClick={handleLogout}>Logout</Link>}
        </div>
    )
}
export default Navbar;