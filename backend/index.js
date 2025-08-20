const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://<YOUR-FRONTEND-DOMAIN>.vercel.app",
      "https://<YOUR-FRONTEND-DOMAIN>.netlify.app",
    ],
    credentials: true,
  })
);

// optional: quick health
app.get("/health", (_req, res) => res.status(200).send("OK"));

// --- DB connect (reuse in serverless) ---
let connPromise;
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!connPromise) {
    const uri = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URL missing");
    connPromise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
  }
  await connPromise;
}

// --- Routes ---
const Routes = require("./routes/route.js");
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    console.error("DB Connect Error:", e);
    res.status(500).json({ error: "DB error" });
  }
});
app.use("/", Routes);

// Export for Vercel (no app.listen)
module.exports = app;
module.exports.handler = serverless(app);
