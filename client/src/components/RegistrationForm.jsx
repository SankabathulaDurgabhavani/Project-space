import React, { useState } from 'react';
import "../styles/login_signup.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const RegistrationForm = () => {

    const location = useLocation();
    const prefilledEmail = location.state?.email || "";  // get passed email or fallback

    useEffect(() => {
        const saved = localStorage.getItem("healthFormData");

        // Detect if it's a redirect from Fitbit
        const isFitbitRedirect = window.location.pathname.includes("register-health") && window.location.search.includes("user=");

        if (saved && isFitbitRedirect) {
            const parsed = JSON.parse(saved);
            setFormData(parsed);
        }

        // Always clear the data once loaded (optional)
        return () => localStorage.removeItem("healthFormData");
    }, []);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: prefilledEmail,
        bloodGroup: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        healthHistory: "",
        allergies: "",
        emergencyContacts: [""]
    });

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === "emergencyContacts") {
            const updated = [...formData.emergencyContacts];
            updated[index] = value;
            setFormData({ ...formData, emergencyContacts: updated });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addEmergencyContact = () => {
        setFormData({
            ...formData,
            emergencyContacts: [...formData.emergencyContacts, ""]
        });
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:3001/register-health", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            alert(data.message);

            navigate("/login");

        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleConnectSmartwatch = () => {
        localStorage.setItem("healthFormData", JSON.stringify(formData)); //local storage to save data 
        const userEmail = formData.email;
        window.location.href = `http://localhost:3001/api/fitbit/auth?email=${encodeURIComponent(userEmail)}`;
    };

    return (
        <div className="container" style={{ borderRadius: "10px" }}>
            <div className="header">
                <div className="text">Health Details</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {[
                    { label: "First Name", name: "firstName" },
                    { label: "Last Name", name: "lastName" },
                    { label: "Phone", name: "phone" },
                    { label: "Email", name: "email" },
                    { label: "Blood Group", name: "bloodGroup" },
                    { label: "Age", name: "age" },
                    { label: "Gender", name: "gender" },
                    { label: "Height (cm)", name: "height" },
                    { label: "Weight (kg)", name: "weight" },
                    { label: "Health History", name: "healthHistory" },
                    { label: "Allergies", name: "allergies" }
                ].map(({ label, name }) => (
                    <div className="input" key={name}>
                        <input
                            type="text"
                            placeholder={label}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            style={{ marginLeft: "14px" }}
                        />
                    </div>
                ))}

                <label style={{ marginLeft: "80px", marginTop: "5px", color: "#555", fontWeight: "bold" }}>
                    Emergency Contacts:
                </label>

                {formData.emergencyContacts.map((contact, i) => (
                    <div className="input" key={i} style={{ display: "flex", alignItems: "center", marginLeft: "70px" }}>
                        <input
                            type="text"
                            placeholder={`Emergency Contact ${i + 1}`}
                            name="emergencyContacts"
                            value={contact}
                            onChange={(e) => handleChange(e, i)}
                            style={{ flex: 1, marginLeft: "14px" }}
                        />
                        {i === formData.emergencyContacts.length - 1 && (
                            <div
                                className="submit"
                                onClick={addEmergencyContact}
                                style={{ borderRadius: "0px", marginLeft: "10px", padding: "0px 10px", width: "auto", fontSize: "12px" }}
                            >
                                + Add Contact
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="submit-container" style={{ flexDirection: "column", gap: "10px" }}>
                <div
                    className="submit"
                    style={{
                        backgroundColor: "#4c00b4",
                        width: "100%",
                        fontSize: "12px",
                        borderRadius: "3%"
                    }}
                    onClick={handleConnectSmartwatch}
                >
                    Connect to Smartwatch
                </div>
                <div className="submit" onClick={handleSubmit} style={{ marginTop: "20px" }}>Submit</div>
            </div>
        </div>
    );
};

export default RegistrationForm;
