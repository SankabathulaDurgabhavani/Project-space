import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar_landing_page";
import HomeSection from "./components/Home_landing_page";
import AboutUsSection from "./components/About_us";
import ContactUsSection from "./components/Contact_us";
import LoginSignUp from "./components/login_signup";
import RegistrationForm from "./components/RegistrationForm";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeSection />} />
        <Route path="/about" element={<AboutUsSection />} />
        <Route path="/contact" element={<ContactUsSection />} />
        <Route path="/login_signup" element={<LoginSignUp />} />
        <Route path="/register-health" element={<RegistrationForm />} />
        {/* Route to login uses LoginSignUp component */}
        <Route path="/login" element={<LoginSignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
