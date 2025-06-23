require('dotenv').config();
const axios = require("axios");
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Health");

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Health details schema
const healthSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    bloodGroup: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    healthHistory: String,
    allergies: String,
    emergencyContacts: [String]
});


//fit bit token data schema
const fitbitTokenSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    access_token: String,
    refresh_token: String,
    user_id: String,
    expires_at: Number  // Token expiry time (timestamp)
});

const FitbitToken = mongoose.model("FitbitToken", fitbitTokenSchema);

//fit bit health data schema
const fitbitDataSchema = new mongoose.Schema({
    email: { type: String, required: true },
    heartRate: Number,
    steps: Number,
    calories: Number,
    sleepMinutes: Number,
    timestamp: { type: Date, default: Date.now }
});

const FitbitHealth = mongoose.model("FitbitHealth", fitbitDataSchema);


const User = mongoose.model("User", userSchema);
const HealthRecord = mongoose.model("HealthRecord", healthSchema);

// ✅ Registration form endpoint
app.post("/register-health", async (req, res) => {
    try {
        const newHealth = new HealthRecord(req.body);
        await newHealth.save();
        res.json({ message: "Health details saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving health data" });
    }
});

// ✅ Signup
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ message: "User registered successfully" });
});

// ✅ Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "User not found" });
    if (user.password !== password) return res.json({ message: "Invalid password" });

    res.json({ message: "Login Successful" });
});

// ✅ Fitbit auth redirect
app.get("/api/fitbit/auth", (req, res) => {
    const scope = "profile activity heartrate sleep";
    const email = req.query.email;

    const redirectURL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.FITBIT_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&prompt=login&expires_in=604800&state=${encodeURIComponent(email)}`;

    res.redirect(redirectURL);
});

// ✅ Fitbit callback (only redirects back to frontend)
// app.get("/api/fitbit/callback", async (req, res) => {
//     const { code, state } = req.query; // `state` carries email
//     const email = state;

//     if (!email) return res.status(400).send("Email missing in callback");

//     const authHeader = Buffer
//         .from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`)
//         .toString("base64");

//     try {
//         const tokenResponse = await axios.post("https://api.fitbit.com/oauth2/token",
//             new URLSearchParams({
//                 client_id: process.env.FITBIT_CLIENT_ID,
//                 grant_type: "authorization_code",
//                 redirect_uri: process.env.FITBIT_REDIRECT_URI,
//                 code
//             }), {
//                 headers: {
//                     "Authorization": `Basic ${authHeader}`,
//                     "Content-Type": "application/x-www-form-urlencoded"
//                 }
//             }
//         );

//         const { user_id } = tokenResponse.data;

//         // ✅ Just redirect to frontend, don’t store anything
//         res.redirect(`http://localhost:5173/register-health?fromFitbit=true&user=${user_id}`);
//     } catch (error) {
//         console.error("Fitbit callback error:", error?.response?.data || error.message);
//         res.status(500).send("Fitbit Authentication Failed");
//     }
// });

//modified one to store fit bit data also
app.get("/api/fitbit/callback", async (req, res) => {
    const { code, state } = req.query; // `state` has the email
    const email = state;

    if (!email) return res.status(400).send("Email missing in callback");

    const authHeader = Buffer
        .from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`)
        .toString("base64");

    try {
        const tokenResponse = await axios.post("https://api.fitbit.com/oauth2/token",
            new URLSearchParams({
                client_id: process.env.FITBIT_CLIENT_ID,
                grant_type: "authorization_code",
                redirect_uri: process.env.FITBIT_REDIRECT_URI,
                code
            }),
            {
                headers: {
                    "Authorization": `Basic ${authHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const { access_token, refresh_token, user_id, expires_in } = tokenResponse.data;

        // Save in MongoDB
        await FitbitToken.findOneAndUpdate(
            { email },
            {
                access_token,
                refresh_token,
                user_id,
                expires_at: Date.now() + expires_in * 1000  // expires_in is in seconds
            },
            { upsert: true } // create if not exist
        );


         // ✅ FETCH and STORE health data
        try {
            const headers = { Authorization: `Bearer ${access_token}` };
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

            // Heart Rate
            const heartRateRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d.json`, { headers });
            const heartRate = heartRateRes.data["activities-heart"]?.[0]?.value?.restingHeartRate || 0;

            // Steps
            const stepsRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/steps/date/${today}/1d.json`, { headers });
            const steps = parseInt(stepsRes.data["activities-steps"]?.[0]?.value || 0);

            // Calories
            const caloriesRes = await axios.get(`https://api.fitbit.com/1/user/-/activities/calories/date/${today}/1d.json`, { headers });
            const calories = parseInt(caloriesRes.data["activities-calories"]?.[0]?.value || 0);

            // Sleep
            const sleepRes = await axios.get(`https://api.fitbit.com/1.2/user/-/sleep/date/${today}.json`, { headers });
            const sleepMinutes = sleepRes.data.summary?.totalMinutesAsleep || 0;

            // Save to DB
            await FitbitHealth.create({
                email,
                heartRate,
                steps,
                calories,
                sleepMinutes
            });


            console.log(`✅ Fitbit health data stored for ${email}`);
        } catch (err) {
            console.error("❌ Fitbit health data fetch error:", err?.response?.data || err.message);
        }


        console.log(`Stored Fitbit token for: ${email}`);

        // Redirect back to frontend with user_id (optional)
        res.redirect(`http://localhost:5173/register-health?fromFitbit=true&user=${user_id}`);
    } catch (error) {
        console.error("Fitbit callback error:", error?.response?.data || error.message);
        res.status(500).send("Fitbit Authentication Failed");
    }
});


app.listen(3001, () => {
    console.log("server is running");
});
