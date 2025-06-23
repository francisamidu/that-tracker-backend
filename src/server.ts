import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: "You have exceeded the 100 requests in 24 hrs limit!",
  standardHeaders: true,
  legacyHeaders: false,
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000", // For local development of your React app
  "https://your-netlify-app-name.netlify.app", // Your actual Netlify domain
];

app.use(rateLimiterUsingThirdParty);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
    credentials: true, // Allow cookies to be sent with requests if needed
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // List any custom headers you send
  })
);

app.get("/api/track", async (req, res) => {
  const THIRD_PARTY_API_KEY = process.env.RAPID_API_KEY; // Stored securely on the server
  const THIRD_PARTY_API_HOST = process.env.RAPID_API_HOST;
  const THIRD_PARTY_API_AUTH = process.env.RAPID_API_AUTH;

  const SHIP_API_KEY = process.env.SHIP_API_KEY;

  // try {
  //   const response = await axios.get(
  //     `https://${THIRD_PARTY_API_HOST}/search?track=${req.query.tracking_number}`,
  //     {
  //       headers: {
  //         "x-rapidapi-key": THIRD_PARTY_API_KEY,
  //         "x-rapidapi-host": THIRD_PARTY_API_HOST,
  //         Authorization: `Bearer ${THIRD_PARTY_API_AUTH}`,
  //       },
  //     }
  //   );
  //   res.json(response.data);
  // } catch (error) {
  //   console.error("Error fetching data from third-party API:", error);
  //   res.status(500).json({ error: "Failed to fetch data" });
  // }
  try {
    console.log(req.query.tracking_number);
    const response = await axios.post(
      `https://api.ship24.com/public/v1/trackers/track`,
      {
        trackingNumber: req.query.tracking_number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SHIP_API_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from third-party API:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/api/webhook", async (req, res) => {
  console.dir(
    {
      message: "Webhook received:",
      body: req.body,
    },
    { depth: Infinity }
  );
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
