import React from 'react'
import "../styles/Navbar_landing_page.css"
import { NavLink } from "react-router-dom";
// import logo from "../assets/main_logo.png";
import logo from "../assets/main-logo_purple.png";


const Navbar_landing_page = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="HealthMonitor Logo" className="logo-img" />
        <h2 className="logo-text">HealthTrack</h2>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact Us</NavLink></li>
      </ul>
      <NavLink to="/login_signup" className="get-started" onClick={() => console.log("Redirecting to Signup/Login")}>
  Get Started
</NavLink>
    </nav>
  )

}

export default Navbar_landing_page
