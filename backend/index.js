const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes import
const routes = require("./routes");
app.use("/api", routes);

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);
