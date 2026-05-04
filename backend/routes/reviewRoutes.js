const router      = require("express").Router();
const asyncH      = require("express-async-handler");
const Review      = require("../models/Review");
const Appointment = require("../models/Appointment");
const Service     = require("../models/Service");
const { protect, adminOnly } = require("../middleware/auth");
 
// GET /api/reviews – public, or filtered by service
router.get("/", asyncH(async (req, res) => {
  const { serviceId, limit = 20 } = req.query;
  const filter = { isApproved: true };
  if (serviceId) filter.service = serviceId;
  const reviews = await Review.find(filter)
    .populate("user", "name avatar")
    .populate("service", "name")
    .sort({ createdAt: -1 })
    .limit(Number(limit));
  res.json(reviews);
}));
 
// GET /api/reviews/my
router.get("/my", protect, asyncH(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate("service", "name icon")
    .sort({ createdAt: -1 });
  res.json(reviews);
}));
 
// POST /api/reviews
router.post("/", protect, asyncH(async (req, res) => {
  const { appointmentId, serviceId, rating, title, comment } = req.body;
  if (!rating || !comment)
    return res.status(400).json({ message: "Rating and comment are required" });
 
  // Check appointment belongs to user and is completed
  if (appointmentId) {
    const appt = await Appointment.findById(appointmentId);
    if (!appt || String(appt.user) !== String(req.user._id))
      return res.status(403).json({ message: "Access denied" });
    if (appt.status !== "Completed")
      return res.status(400).json({ message: "You can only review completed appointments" });
    if (appt.rated)
      return res.status(409).json({ message: "Already reviewed this appointment" });
    appt.rated = true;
    await appt.save();
  }
 
  const review = await Review.create({
    user:        req.user._id,
    appointment: appointmentId || undefined,
    service:     serviceId     || undefined,
    rating,
    title:   title   || "",
    comment,
  });
 
  // Update service rating average
  if (serviceId) {
    const all = await Review.find({ service: serviceId, isApproved: true });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Service.findByIdAndUpdate(serviceId, { rating: avg.toFixed(1), totalRatings: all.length });
  }
 
  res.status(201).json(await review.populate("user", "name avatar"));
}));
 
// DELETE /api/reviews/:id – admin or owner
router.delete("/:id", protect, asyncH(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  if (req.user.role !== "admin" && String(review.user) !== String(req.user._id))
    return res.status(403).json({ message: "Access denied" });
  await review.deleteOne();
  res.json({ message: "Review deleted" });
}));
 
module.exports = router;