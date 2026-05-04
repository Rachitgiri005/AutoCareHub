const router      = require("express").Router();
const asyncH      = require("express-async-handler");
const PDFDocument = require("pdfkit");
const Invoice     = require("../models/Invoice");
const Appointment = require("../models/Appointment");
const { protect, adminOnly } = require("../middleware/auth");
 
// ── GET /api/invoices ─────────────────────────────────────────────────────────
router.get("/", protect, asyncH(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  const invoices = await Invoice.find(filter)
    .populate("user", "name email phone")
    .populate("appointment")
    .sort({ createdAt: -1 });
  res.json(invoices);
}));
 
// ── POST /api/invoices  – admin creates invoice for appointment ───────────────
router.post("/", protect, adminOnly, asyncH(async (req, res) => {
  const { appointmentId, items, taxRate, paymentMethod, notes, dueDate } = req.body;
  const appt = await Appointment.findById(appointmentId).populate("user");
  if (!appt) return res.status(404).json({ message: "Appointment not found" });
 
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const taxAmount = subtotal * ((taxRate || 0) / 100);
  const total     = subtotal + taxAmount;
 
  const inv = await Invoice.create({
    appointment:   appointmentId,
    user:          appt.user._id,
    invoiceNumber: appt.invoiceNumber || "INV-" + Date.now().toString().slice(-8),
    items,
    subtotal,
    taxRate:  taxRate || 0,
    taxAmount,
    total,
    paymentMethod: paymentMethod || "Cash",
    notes: notes || "",
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 86400000),
    status: "Pending",
  });
 
  // Mark appointment paid
  appt.amount        = total;
  appt.paymentStatus = "Paid";
  appt.paymentMethod = paymentMethod || "Cash";
  await appt.save();
 
  res.status(201).json(inv);
}));
 
// ── PUT /api/invoices/:id ─────────────────────────────────────────────────────
router.put("/:id", protect, adminOnly, asyncH(async (req, res) => {
  const inv = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!inv) return res.status(404).json({ message: "Invoice not found" });
  if (req.body.status === "Paid") inv.paidAt = new Date();
  await inv.save();
  res.json(inv);
}));
 
// ── GET /api/invoices/:id/pdf  – stream PDF ───────────────────────────────────
router.get("/:id/pdf", protect, asyncH(async (req, res) => {
  const inv = await Invoice.findById(req.params.id)
    .populate("user", "name email phone address")
    .populate({ path: "appointment", populate: { path: "user" } });
  if (!inv) return res.status(404).json({ message: "Invoice not found" });
  if (req.user.role !== "admin" && String(inv.user._id) !== String(req.user._id))
    return res.status(403).json({ message: "Access denied" });
 
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${inv.invoiceNumber}.pdf`);
  doc.pipe(res);
 
  const PRI = "#E94560", DARK = "#1A1A2E", GREY = "#555555", LGREY = "#F5F6FA";
 
  // Header band
  doc.rect(0, 0, doc.page.width, 110).fill(DARK);
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(26).text("🔧 AutoCare Hub", 50, 30);
  doc.font("Helvetica").fontSize(10).fillColor("#AAAAAA");
  doc.text("Professional Auto Service Center", 50, 62);
  doc.text("Brainybeam Info-Tech PVT LTD  |  admin@autocare.com  |  +1 800 AUTO CARE", 50, 78);
 
  // INVOICE label
  doc.fillColor(PRI).font("Helvetica-Bold").fontSize(22).text("INVOICE", 50, 130);
  doc.fillColor(DARK).font("Helvetica").fontSize(10);
  doc.text(`Invoice #:   ${inv.invoiceNumber}`, 350, 130);
  doc.text(`Date:          ${new Date().toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" })}`, 350, 148);
  doc.text(`Status:        ${inv.status.toUpperCase()}`, 350, 166);
  doc.text(`Payment:     ${inv.paymentMethod}`, 350, 184);
 
  // Bill to + vehicle
  doc.rect(50, 210, 235, 100).fillAndStroke(LGREY, "#E0E0E0");
  doc.fillColor(PRI).font("Helvetica-Bold").fontSize(9).text("BILL TO", 65, 224);
  doc.fillColor(DARK).font("Helvetica").fontSize(11).text(inv.user.name, 65, 240);
  doc.fillColor(GREY).fontSize(9);
  doc.text(inv.user.email, 65, 256);
  if (inv.user.phone)   doc.text(inv.user.phone, 65, 271);
  if (inv.user.address) doc.text(inv.user.address, 65, 286, { width: 210 });
 
  const appt = inv.appointment;
  doc.rect(300, 210, 250, 100).fillAndStroke(LGREY, "#E0E0E0");
  doc.fillColor(PRI).font("Helvetica-Bold").fontSize(9).text("SERVICE DETAILS", 315, 224);
  doc.fillColor(DARK).font("Helvetica").fontSize(11).text(appt?.serviceName || "-", 315, 240);
  doc.fillColor(GREY).fontSize(9);
  doc.text(`Vehicle: ${appt?.vehicleName || "-"} ${appt?.vehicleYear || ""}`, 315, 256);
  doc.text(`Date:    ${appt ? new Date(appt.date).toLocaleDateString() : "-"}`, 315, 271);
  doc.text(`Slot:    ${appt?.timeSlot || "-"}`, 315, 286);
 
  // Items table
  const tTop = 330;
  doc.rect(50, tTop, 500, 30).fill(DARK);
  doc.fillColor("#FFF").font("Helvetica-Bold").fontSize(9);
  doc.text("DESCRIPTION", 65, tTop + 10);
  doc.text("QTY", 340, tTop + 10);
  doc.text("UNIT PRICE", 390, tTop + 10);
  doc.text("AMOUNT", 465, tTop + 10);
 
  let y = tTop + 30;
  inv.items.forEach((item, i) => {
    const bg = i % 2 === 0 ? "#FFFFFF" : LGREY;
    doc.rect(50, y, 500, 30).fill(bg);
    doc.fillColor(DARK).font("Helvetica").fontSize(10);
    doc.text(item.description, 65, y + 9, { width: 260 });
    doc.text(String(item.quantity), 345, y + 9);
    doc.text(`$${item.price.toFixed(2)}`, 392, y + 9);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 467, y + 9);
    y += 30;
  });
 
  // Totals
  y += 10;
  doc.rect(350, y, 200, 80).fillAndStroke(LGREY, "#E0E0E0");
  doc.fillColor(GREY).font("Helvetica").fontSize(10);
  doc.text("Subtotal:", 365, y + 12);
  doc.text(`$${inv.subtotal.toFixed(2)}`, 495, y + 12, { align: "right", width: 45 });
  doc.text(`Tax (${inv.taxRate}%):`, 365, y + 28);
  doc.text(`$${inv.taxAmount.toFixed(2)}`, 495, y + 28, { align: "right", width: 45 });
  doc.moveTo(365, y + 46).lineTo(545, y + 46).stroke("#CCC");
  doc.fillColor(PRI).font("Helvetica-Bold").fontSize(13);
  doc.text("TOTAL:", 365, y + 52);
  doc.text(`$${inv.total.toFixed(2)}`, 490, y + 52, { align: "right", width: 50 });
 
  // Mechanic / notes
  if (appt?.mechanic) {
    doc.fillColor(GREY).font("Helvetica").fontSize(9);
    doc.text(`Mechanic: ${appt.mechanic}`, 60, y + 20);
  }
  if (inv.notes) {
    doc.text(`Notes: ${inv.notes}`, 60, y + 35, { width: 260 });
  }
 
  // Footer
  doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill(DARK);
  doc.fillColor("#AAAAAA").font("Helvetica").fontSize(9);
  doc.text("Thank you for choosing AutoCare Hub – Brainybeam Info-Tech PVT LTD", 50, doc.page.height - 42, { align: "center", width: 495 });
 
  doc.end();
}));
 
module.exports = router;