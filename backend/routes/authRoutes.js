const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const asyncH  = require("express-async-handler");
const User    = require("../models/User");
const { protect } = require("../middleware/auth");
 
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
 
// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/register", asyncH(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });
 
  if (await User.findOne({ email }))
    return res.status(409).json({ message: "Email already registered" });
 
  const hashed = await bcrypt.hash(password, 12);
  const user   = await User.create({ name, email, password: hashed, phone: phone || "" });
 
  res.status(201).json({
    token: signToken(user._id),
    user:  { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
}));
 
// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", asyncH(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });
 
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid email or password" });
  if (!user.isActive)
    return res.status(403).json({ message: "Account disabled. Contact support." });
 
  user.lastLogin = new Date();
  await user.save();
 
  res.json({
    token: signToken(user._id),
    user:  { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role, avatar: user.avatar },
  });
}));
 
// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get("/me", protect, asyncH(async (req, res) => {
  res.json(await User.findById(req.user._id).select("-password"));
}));
 
// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
router.put("/profile", protect, asyncH(async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, address },
    { new: true, runValidators: true }
  ).select("-password");
  res.json({ user, token: signToken(user._id) });
}));
 
// ── PUT /api/auth/change-password ─────────────────────────────────────────────
router.put("/change-password", protect, asyncH(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Both passwords are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "New password must be at least 6 characters" });
 
  const user = await User.findById(req.user._id);
  if (!(await bcrypt.compare(currentPassword, user.password)))
    return res.status(400).json({ message: "Current password is incorrect" });
 
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ message: "Password changed successfully" });
}));
 
module.exports = router;