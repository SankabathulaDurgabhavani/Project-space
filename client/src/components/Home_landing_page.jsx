import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import "../styles/Home_landing_page.css";
import land_image from "../assets/landing_page_bg.png";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="left-section">
        <h1 className="project-title">HealthMonitor</h1>
        <h2 className="tagline">
          Unlock the Future of <span className="highlight">Personalized</span> Health Diagnostics
        </h2>
        <p className="description">
          Discover a new way to understand your body: blending cutting-edge AI diagnostics with 
          ancient wellness intelligence.
        </p>
        <div className="buttons">
          <NavLink to="/about" className="learn-more">
            Learn More
          </NavLink>
        </div>
      </div>
      <div className="right-section">
        <img src={land_image} alt="HealthMonitor Overview" className="home-image" />
      </div>
    </div>
  );
};

export default HomePage;