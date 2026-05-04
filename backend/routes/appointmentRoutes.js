const router      = require("express").Router();
const asyncH      = require("express-async-handler");
const Appointment = require("../models/Appointment");
const { protect, adminOnly } = require("../middleware/auth");
 
// ── GET /api/appointments ─────────────────────────────────────────────────────
router.get("/", protect, asyncH(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  if (status && status !== "all") filter.status = status;
 
  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate("user", "name email phone address")
    .populate("service", "name price icon category")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
 
  res.json({ appointments, total, page: Number(page) });
}));
 
// ── GET /api/appointments/slots?date=YYYY-MM-DD ───────────────────────────────
router.get("/slots", protect, asyncH(async (req, res) => {
  const ALL = ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];
  const { date } = req.query;
  if (!date) return res.json(ALL);
  const booked = await Appointment.find({
    date: new Date(date),
    status: { $in: ["Pending", "Confirmed", "In Progress"] },
  }).select("timeSlot");
  const taken = booked.map((a) => a.timeSlot);
  res.json(ALL.filter((s) => !taken.includes(s)));
}));
 
// ── GET /api/appointments/:id ─────────────────────────────────────────────────
router.get("/:id", protect, asyncH(async (req, res) => {
  const appt = await Appointment.findById(req.params.id)
    .populate("user", "name email phone address")
    .populate("service");
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  if (req.user.role !== "admin" && String(appt.user._id) !== String(req.user._id))
    return res.status(403).json({ message: "Access denied" });
  res.json(appt);
}));
 
// ── POST /api/appointments ────────────────────────────────────────────────────
router.post("/", protect, asyncH(async (req, res) => {
  const { serviceId, serviceName, servicePrice, vehicleName, vehicleYear, licensePlate, date, timeSlot, notes } = req.body;
  if (!serviceName || !vehicleName || !date || !timeSlot)
    return res.status(400).json({ message: "Service, vehicle, date and time slot are required" });
 
  // No double-booking
  const conflict = await Appointment.findOne({
    date: new Date(date),
    timeSlot,
    status: { $in: ["Pending", "Confirmed", "In Progress"] },
  });
  if (conflict) return res.status(409).json({ message: "That time slot is already taken. Please pick another." });
 
  const appt = await Appointment.create({
    user: req.user._id,
    service: serviceId || undefined,
    serviceName,
    servicePrice: servicePrice || 0,
    vehicleName,
    vehicleYear:  vehicleYear  || "",
    licensePlate: licensePlate || "",
    date: new Date(date),
    timeSlot,
    notes: notes || "",
    statusHistory: [{ status: "Pending", note: "Appointment created" }],
  });
  res.status(201).json(appt);
}));
 
// ── PUT /api/appointments/:id ─────────────────────────────────────────────────
router.put("/:id", protect, asyncH(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
 
  const isAdmin = req.user.role === "admin";
  const isOwner = String(appt.user) === String(req.user._id);
  if (!isAdmin && !isOwner) return res.status(403).json({ message: "Access denied" });
 
  const { status, amount, mechanic, paymentStatus, paymentMethod, notes, statusNote, rated } = req.body;
 
  if (status && status !== appt.status) {
    appt.statusHistory.push({ status, note: statusNote || "" });
    appt.status = status;
  }
  if (amount        !== undefined) appt.amount        = amount;
  if (mechanic      !== undefined) appt.mechanic      = mechanic;
  if (paymentStatus !== undefined) appt.paymentStatus = paymentStatus;
  if (paymentMethod !== undefined) appt.paymentMethod = paymentMethod;
  if (notes         !== undefined) appt.notes         = notes;
  if (rated         !== undefined) appt.rated         = rated;
 
  await appt.save();
  res.json(await appt.populate("user", "name email phone"));
}));
 
// ── DELETE /api/appointments/:id  (cancel – soft) ────────────────────────────
router.delete("/:id", protect, asyncH(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  const isAdmin = req.user.role === "admin";
  const isOwner = String(appt.user) === String(req.user._id);
  if (!isAdmin && !isOwner) return res.status(403).json({ message: "Access denied" });
 
  appt.status = "Cancelled";
  appt.statusHistory.push({ status: "Cancelled", note: "Cancelled by user" });
  await appt.save();
  res.json({ message: "Appointment cancelled" });
}));
 
module.exports = router;