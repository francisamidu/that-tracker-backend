"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const router = express_1.default.Router();
const rateLimiterUsingThirdParty = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
    max: 100,
    message: "You have exceeded the 100 requests in 24 hrs limit!",
    standardHeaders: true,
    legacyHeaders: false,
});
// Parse JSON bodies and handle JSON parse errors
app.use(express_1.default.json({ strict: true }));
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ error: "Invalid JSON payload" });
    }
    next(err);
});
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://that-tracker.netlify.app", // Your actual Netlify domain
];
app.use(express_1.default.json({
    strict: true,
}));
app.use(rateLimiterUsingThirdParty);
app.use((req, res, next) => {
    (0, cors_1.default)({
        origin: (origin, callback) => {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })(req, res, (err) => {
        if (err) {
            return res.status(403).json({ error: err.message || "CORS error" });
        }
        next();
    });
});
router.get("/", (_req, res) => {
    res.json({ message: "Parcel Tracker API" });
});
router.post("/track", async (req, res) => {
    const SHIP_API_KEY = process.env.SHIP_API_KEY;
    const trackingNumber = req?.body?.trackingNumber;
    console.log(req.body);
    if (!trackingNumber) {
        return res
            .status(400)
            .json({ error: "Missing trackingNumber in query or body" });
    }
    try {
        const response = await axios_1.default.post(`https://api.ship24.com/public/v1/trackers/track`, {
            trackingNumber,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SHIP_API_KEY}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching data from third-party API:", error?.response?.data || error.message);
        const status = error?.response?.status || 500;
        return res.status(status).json({
            error: "Failed to fetch data from third-party API",
            details: error?.response?.data || error.message,
        });
    }
});
router.post("/webhook", async (req, res, next) => {
    try {
        console.dir({
            message: "Webhook received:",
            body: req.body,
        }, { depth: Infinity });
        res.status(200).json({ message: "Webhook received" });
    }
    catch (error) {
        next(error);
    }
});
// Mount router at /api
app.use("/api", router);
// Global error handler
app.use((err, req, res, _next) => {
    console.error("Global error handler:", err);
    if (res.headersSent) {
        return;
    }
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Internal Server Error",
        details: err.stack,
    });
});
exports.default = app;
