

const express  = require("express");
const cors     = require("cors");
const morgan   = require("morgan");
const dotenv   = require("dotenv");
const path     = require("path");
const connectDB = require("./config/db");
 
dotenv.config();
connectDB();
 
const app = express();
 
// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
 
// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/services",     require("./routes/serviceRoutes"));
app.use("/api/invoices",     require("./routes/invoiceRoutes"));
app.use("/api/admin",        require("./routes/adminRoutes"));
app.use("/api/reviews",      require("./routes/reviewRoutes"));
 
// ── Health ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) =>
  res.json({ status: "ok", message: "🔧 AutoCare Hub API v1.0" })
);
 
// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
 
// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀  Server running → http://localhost:${PORT}`)
);