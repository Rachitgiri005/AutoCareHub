const router      = require("express").Router();
const asyncH      = require("express-async-handler");
const User        = require("../models/User");
const Appointment = require("../models/Appointment");
const Service     = require("../models/Service");
const Invoice     = require("../models/Invoice");
const Review      = require("../models/Review");
const { protect, adminOnly } = require("../middleware/auth");
 
router.use(protect, adminOnly);
 
// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get("/stats", asyncH(async (req, res) => {
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);  // 1st of month
 
  const [
    totalUsers, totalAppointments, pendingCount, confirmedCount,
    inProgressCount, completedCount, cancelledCount,
    revenueArr, monthRevArr, todayCount,
    topServicesArr, newUsersThisMonth,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "Pending" }),
    Appointment.countDocuments({ status: "Confirmed" }),
    Appointment.countDocuments({ status: "In Progress" }),
    Appointment.countDocuments({ status: "Completed" }),
    Appointment.countDocuments({ status: "Cancelled" }),
    Appointment.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Appointment.aggregate([
      { $match: { paymentStatus: "Paid", updatedAt: { $gte: start } } },
      { $group: { _id: { $month: "$updatedAt" }, revenue: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    Appointment.countDocuments({
      date: { $gte: new Date(now.setHours(0,0,0,0)), $lte: new Date(now.setHours(23,59,59,999)) },
      status: { $in: ["Pending","Confirmed","In Progress"] },
    }),
    Appointment.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: "$serviceName", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
      { $sort: { count: -1 } }, { $limit: 5 },
    ]),
    User.countDocuments({ role: "user", createdAt: { $gte: start } }),
  ]);
 
  res.json({
    totalUsers, totalAppointments, pendingCount, confirmedCount,
    inProgressCount, completedCount, cancelledCount, todayCount,
    totalRevenue:     revenueArr[0]?.total || 0,
    monthRevenue:     monthRevArr,
    topServices:      topServicesArr,
    newUsersThisMonth,
  });
}));
 
// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get("/users", asyncH(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = { role: "user" };
  if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
 
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 })
    .skip((page - 1) * limit).limit(Number(limit));
 
  // Attach appointment counts
  const enriched = await Promise.all(users.map(async (u) => {
    const [apptCount, totalSpent] = await Promise.all([
      Appointment.countDocuments({ user: u._id }),
      Appointment.aggregate([
        { $match: { user: u._id, paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);
    return { ...u.toObject(), apptCount, totalSpent: totalSpent[0]?.total || 0 };
  }));
 
  res.json({ users: enriched, total, page: Number(page), pages: Math.ceil(total / limit) });
}));
 
// ── PUT /api/admin/users/:id ──────────────────────────────────────────────────
router.put("/users/:id", asyncH(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}));
 
// ── GET /api/admin/recent ─────────────────────────────────────────────────────
router.get("/recent", asyncH(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 }).limit(10);
  res.json(appointments);
}));
 
// ── GET /api/admin/reviews ────────────────────────────────────────────────────
router.get("/reviews", asyncH(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("service", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
}));
 
// ── PUT /api/admin/reviews/:id ────────────────────────────────────────────────
router.put("/reviews/:id", asyncH(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json(review);
}));
 
module.exports = router;