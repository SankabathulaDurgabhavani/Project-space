import React from "react";
import "../styles/About_us.css";

const cardData = [
  { title: "Prediction", description: "Detect early signs and forecast future health risks with AI-driven insights.", image: "/assets/prediction.png" },
  { title: "Natural Healing", description: "Heal naturally with safe, organic, and holistic treatment methods.", image: "/assets/natural_healing.png" },
  { title: "Monitor & Track", description: "Track vital health markers in real time with zero hassle.", image: "/assets/monitor_track.png" },
  { title: "Personalized Guidance", description: "Get 24x7 tailored advice based on your unique health data.", image: "/assets/personalized_guidance.png" }
];

const About_us = () => {
  return (
    <div className="about-us">
      <h1 className="main-heading">Why AI HealthTech?</h1>
      <h2 className="sub-heading">Ancient Wisdom Meets Cutting-Edge AI: A New Era in Health Diagnostics</h2>

      <div className="cards-container">
        {cardData.map((card, index) => (
          <div key={index} className={`card card-${index}`}>
            <img src={card.image} alt={card.title} className="card-image" />
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default About_us;