// backend/index.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get("/health", (_req, res) => res.status(200).send("OK"));

// ensure DB connection is reused across invocations
let conn = null;
async function connectDB() {
  if (conn && mongoose.connection.readyState === 1) return;
  const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;
  if (!MONGO_URL) throw new Error("MONGO_URL missing");
  conn = mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });
  await conn;
}

// Example route that ensures DB is connected
app.post("/AdminLogin", async (req, res) => {
  try {
    await connectDB();
    // TODO: replace with your real login logic (Admin model)
    // const admin = await Admin.findOne({ email: req.body.email });
    return res.json({ ok: true, message: "AdminLogin reached (test)" });
  } catch (err) {
    console.error("DBERR:", err.message || err);
    return res.status(500).json({ error: "DB error" });
  }
});

const handler = serverless(app);
module.exports = handler;
