const express = require("express");
const cors = require("cors");
const app = express();

/* ===================== CORS ===================== */
// ... your CORS code remains the same ...

/* ===================== BODY PARSERS ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== DEBUG ===================== */
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

/* ===================== ROUTES ===================== */
const brandingRoutes = require("./modules/accountmanagement/branding-setup/branding.routes");
const companyRoutes = require("./modules/accountmanagement/company-office/company.routes");
const globalRoutes = require("./modules/accountmanagement/global-defaults/global.routes");
const incorporationRoutes = require("./modules/accountmanagement/incorporation-details/incorporation.routes"); // corrected path

app.use("/config", brandingRoutes);
app.use("/config", companyRoutes);
app.use("/config", globalRoutes);
app.use("/config", incorporationRoutes);

/* ===================== HEALTH ===================== */
app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

/* ===================== 404 ===================== */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ===================== ERROR ===================== */
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ error: "CORS blocked" });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

module.exports = app;
