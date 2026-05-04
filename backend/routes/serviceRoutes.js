


const router  = require("express").Router();
const asyncH  = require("express-async-handler");
const Service = require("../models/Service");
const { protect, adminOnly } = require("../middleware/auth");
 
// GET  /api/services  – public
router.get("/", asyncH(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category && category !== "all") filter.category = category;
  res.json(await Service.find(filter).sort({ category: 1, name: 1 }));
}));
 
// GET /api/services/:id
router.get("/:id", asyncH(async (req, res) => {
  const s = await Service.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Service not found" });
  res.json(s);
}));
 
// POST /api/services  – admin
router.post("/", protect, adminOnly, asyncH(async (req, res) => {
  const s = await Service.create(req.body);
  res.status(201).json(s);
}));
 
// PUT /api/services/:id  – admin
router.put("/:id", protect, adminOnly, asyncH(async (req, res) => {
  const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!s) return res.status(404).json({ message: "Service not found" });
  res.json(s);
}));
 
// DELETE /api/services/:id  – admin (soft delete)
router.delete("/:id", protect, adminOnly, asyncH(async (req, res) => {
  await Service.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "Service deactivated" });
}));
 
// POST /api/services/seed  – admin
router.post("/seed", protect, adminOnly, asyncH(async (req, res) => {
  await Service.deleteMany({});
  const services = await Service.insertMany([
    { name: "Oil Change",             price: 49,  duration: "30 min",   category: "maintenance", icon: "🛢️",  description: "Full synthetic oil change + filter replacement" },
    { name: "Brake Inspection",       price: 29,  duration: "45 min",   category: "inspection",  icon: "🛑",  description: "Complete brake system check – pads, rotors, fluid" },
    { name: "Tire Rotation",          price: 39,  duration: "30 min",   category: "maintenance", icon: "🛞",  description: "Rotate & balance all four tires for even wear" },
    { name: "Engine Diagnostic",      price: 89,  duration: "1 hour",   category: "repair",      icon: "🔍",  description: "Full computer diagnostic scan with printed report" },
    { name: "AC Service",             price: 99,  duration: "1.5 hrs",  category: "repair",      icon: "❄️",  description: "A/C check, refrigerant recharge & duct cleaning" },
    { name: "Battery Replacement",    price: 149, duration: "30 min",   category: "repair",      icon: "🔋",  description: "Battery test + OEM replacement + terminal cleaning" },
    { name: "Wheel Alignment",        price: 59,  duration: "1 hour",   category: "maintenance", icon: "🎯",  description: "Four-wheel computerised alignment & adjustment" },
    { name: "Brake Pad Replacement",  price: 129, duration: "1.5 hrs",  category: "repair",      icon: "🔧",  description: "Front & rear brake pad replacement with rotor check" },
    { name: "Transmission Service",   price: 179, duration: "2 hours",  category: "maintenance", icon: "⚙️",  description: "Fluid flush + filter replacement for smooth shifts" },
    { name: "Full Car Wash",          price: 29,  duration: "45 min",   category: "detailing",   icon: "✨",  description: "Exterior hand-wash, interior vacuum & windows" },
    { name: "Full Car Detailing",     price: 199, duration: "4 hours",  category: "detailing",   icon: "🚘",  description: "Complete interior & exterior premium detailing" },
    { name: "Annual Safety Inspection",price: 69, duration: "2 hours",  category: "inspection",  icon: "📋",  description: "Comprehensive 120-point safety inspection + report" },
  ]);
  res.json({ message: `✅ ${services.length} services seeded`, count: services.length });
}));
 
module.exports = router;