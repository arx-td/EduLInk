const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

const app = express();
const Routes = require("./routes/route.js");

dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/", Routes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ⚡ Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);
