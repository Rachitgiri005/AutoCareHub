
Copy

require("dotenv").config();
const mongoose  = require("mongoose");
const bcrypt    = require("bcryptjs");
const connectDB = require("../config/db");
const User        = require("../models/User");
const Service     = require("../models/Service");
const Appointment = require("../models/Appointment");
const Invoice     = require("../models/Invoice");
const Review      = require("../models/Review");
 
const run = async () => {
  await connectDB();
  console.log("🌱 Seeding database…");
 
  await Promise.all([User.deleteMany(), Service.deleteMany(), Appointment.deleteMany(), Invoice.deleteMany(), Review.deleteMany()]);
  console.log("🗑️  Cleared all collections");
 
  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminPwd = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 12);
  const admin = await User.create({
    name: process.env.ADMIN_NAME || "Admin",
    email: process.env.ADMIN_EMAIL || "admin@autocare.com",
    password: adminPwd,
    phone: "+1 800 287 2273",
    role: "admin",
  });
  console.log(`👤 Admin  → ${admin.email}`);
 
  // ── Demo Customers ─────────────────────────────────────────────────────────
  const pwd = await bcrypt.hash("User@123", 12);
  const customers = await User.insertMany([
    { name: "Rahul Shah",     email: "rahul@example.com",  password: pwd, phone: "+91 98765 43210", address: "Ahmedabad, Gujarat" },
    { name: "Priya Patel",   email: "priya@example.com",  password: pwd, phone: "+91 98765 43211", address: "Surat, Gujarat" },
    { name: "John Smith",    email: "john@example.com",   password: pwd, phone: "+1 234 567 8900",  address: "New York, USA" },
    { name: "Anita Desai",   email: "anita@example.com",  password: pwd, phone: "+91 98765 43212", address: "Mumbai, Maharashtra" },
    { name: "Dev Kumar",     email: "dev@example.com",    password: pwd, phone: "+91 98765 43213", address: "Pune, Maharashtra" },
  ]);
  console.log(`👥 ${customers.length} customers created`);
 
  // ── Services ───────────────────────────────────────────────────────────────
  const services = await Service.insertMany([
    { name: "Oil Change",              price:  49, duration: "30 min",   category: "maintenance", icon: "🛢️", description: "Full synthetic oil change + filter replacement" },
    { name: "Brake Inspection",        price:  29, duration: "45 min",   category: "inspection",  icon: "🛑", description: "Complete brake system check – pads, rotors, fluid" },
    { name: "Tire Rotation",           price:  39, duration: "30 min",   category: "maintenance", icon: "🛞", description: "Rotate & balance all four tires for even wear" },
    { name: "Engine Diagnostic",       price:  89, duration: "1 hour",   category: "repair",      icon: "🔍", description: "Full computer diagnostic scan with printed report" },
    { name: "AC Service",              price:  99, duration: "1.5 hrs",  category: "repair",      icon: "❄️", description: "A/C check, refrigerant recharge & duct cleaning" },
    { name: "Battery Replacement",     price: 149, duration: "30 min",   category: "repair",      icon: "🔋", description: "Battery test + OEM replacement + terminal cleaning" },
    { name: "Wheel Alignment",         price:  59, duration: "1 hour",   category: "maintenance", icon: "🎯", description: "Four-wheel computerised alignment & adjustment" },
    { name: "Brake Pad Replacement",   price: 129, duration: "1.5 hrs",  category: "repair",      icon: "🔧", description: "Front & rear brake pad replacement with rotor check" },
    { name: "Transmission Service",    price: 179, duration: "2 hours",  category: "maintenance", icon: "⚙️", description: "Fluid flush + filter replacement for smooth shifts" },
    { name: "Full Car Wash",           price:  29, duration: "45 min",   category: "detailing",   icon: "✨", description: "Exterior hand-wash, interior vacuum & windows" },
    { name: "Full Car Detailing",      price: 199, duration: "4 hours",  category: "detailing",   icon: "🚘", description: "Complete interior & exterior premium detailing" },
    { name: "Annual Safety Inspection",price:  69, duration: "2 hours",  category: "inspection",  icon: "📋", description: "Comprehensive 120-point safety inspection + report" },
  ]);
  console.log(`🔧 ${services.length} services created`);
 
  // ── Appointments ───────────────────────────────────────────────────────────
  const today = new Date();
  const d = (offset) => new Date(today.getTime() + offset * 86400000);
 
  const appts = await Appointment.insertMany([
    { user: customers[0]._id, service: services[0]._id, serviceName: "Oil Change",          servicePrice: 49,  vehicleName: "Toyota Camry",    vehicleYear: "2021", licensePlate: "GJ01AB1234", date: d(2),   timeSlot: "10:00 AM", status: "Confirmed",    amount: 49,  paymentStatus: "Unpaid", mechanic: "David Wilson",  statusHistory: [{ status:"Pending" },{ status:"Confirmed" }] },
    { user: customers[1]._id, service: services[3]._id, serviceName: "Engine Diagnostic",   servicePrice: 89,  vehicleName: "Honda City",      vehicleYear: "2020", licensePlate: "MH02CD5678", date: d(-3),  timeSlot: "02:00 PM", status: "Completed",    amount: 89,  paymentStatus: "Paid",   mechanic: "Mike Johnson",  invoiceNumber: "INV-10001111", rated: true, statusHistory:[{ status:"Pending"},{ status:"Confirmed"},{ status:"In Progress"},{ status:"Completed"}] },
    { user: customers[2]._id, service: services[4]._id, serviceName: "AC Service",          servicePrice: 99,  vehicleName: "Ford Mustang",    vehicleYear: "2019", licensePlate: "DL03EF9012", date: d(5),   timeSlot: "11:00 AM", status: "Pending",      amount: 0,   paymentStatus: "Unpaid", statusHistory: [{ status:"Pending" }] },
    { user: customers[3]._id, service: services[1]._id, serviceName: "Brake Inspection",    servicePrice: 29,  vehicleName: "Maruti Swift",    vehicleYear: "2022", licensePlate: "MH04GH3456", date: d(-1),  timeSlot: "09:00 AM", status: "Completed",    amount: 29,  paymentStatus: "Paid",   mechanic: "Raj Mehta",     invoiceNumber: "INV-10002222", rated: false, statusHistory:[{ status:"Pending"},{ status:"Confirmed"},{ status:"Completed"}] },
    { user: customers[4]._id, service: services[6]._id, serviceName: "Wheel Alignment",     servicePrice: 59,  vehicleName: "Hyundai i20",     vehicleYear: "2023", licensePlate: "KA05IJ7890", date: d(1),   timeSlot: "03:00 PM", status: "Confirmed",    amount: 59,  paymentStatus: "Unpaid", mechanic: "Alex Brown",    statusHistory: [{ status:"Pending" },{ status:"Confirmed" }] },
    { user: customers[0]._id, service: services[5]._id, serviceName: "Battery Replacement", servicePrice: 149, vehicleName: "Toyota Camry",    vehicleYear: "2021", licensePlate: "GJ01AB1234", date: d(-7),  timeSlot: "01:00 PM", status: "Completed",    amount: 149, paymentStatus: "Paid",   mechanic: "David Wilson",  invoiceNumber: "INV-10003333", rated: true, statusHistory:[{ status:"Pending"},{ status:"Confirmed"},{ status:"Completed"}] },
    { user: customers[1]._id, service: services[10]._id,serviceName: "Full Car Detailing",  servicePrice: 199, vehicleName: "Honda City",      vehicleYear: "2020", licensePlate: "MH02CD5678", date: d(4),   timeSlot: "10:00 AM", status: "Pending",      amount: 0,   paymentStatus: "Unpaid", statusHistory: [{ status:"Pending" }] },
    { user: customers[2]._id, service: services[11]._id,serviceName: "Annual Safety Inspection", servicePrice: 69, vehicleName: "Ford Mustang", vehicleYear: "2019", licensePlate: "DL03EF9012", date: d(-14), timeSlot: "04:00 PM", status: "Completed",    amount: 69,  paymentStatus: "Paid",   mechanic: "Sarah Lee",     invoiceNumber: "INV-10004444", rated: true, statusHistory:[{ status:"Pending"},{ status:"Completed"}] },
  ]);
  console.log(`📅 ${appts.length} appointments created`);
 
  // ── Invoices ───────────────────────────────────────────────────────────────
  const completedAppts = appts.filter((a) => a.status === "Completed" && a.paymentStatus === "Paid");
  const invDocs = await Invoice.insertMany(completedAppts.map((a) => ({
    appointment:   a._id,
    user:          a.user,
    invoiceNumber: a.invoiceNumber,
    items: [{ description: a.serviceName, quantity: 1, price: a.amount }],
    subtotal:  a.amount,
    taxRate:   0,
    taxAmount: 0,
    total:     a.amount,
    status:    "Paid",
    paymentMethod: "Cash",
    paidAt: new Date(),
  })));
  console.log(`🧾 ${invDocs.length} invoices created`);
 
  // ── Reviews ────────────────────────────────────────────────────────────────
  const reviews = await Review.insertMany([
    { user: customers[0]._id, service: services[5]._id, appointment: appts[5]._id, rating: 5, title: "Excellent battery service!",    comment: "Quick, professional, and the technician David was very knowledgeable. Car starts perfectly now.", isApproved: true },
    { user: customers[1]._id, service: services[3]._id, appointment: appts[1]._id, rating: 5, title: "Great diagnostic service",       comment: "Found the issue immediately. Clear explanation, fair price. Highly recommend AutoCare Hub.", isApproved: true },
    { user: customers[2]._id, service: services[11]._id,appointment: appts[7]._id, rating: 4, title: "Thorough inspection",           comment: "Very detailed 120-point inspection. Only minor issue was a 20 min wait, but service was perfect.", isApproved: true },
    { user: customers[3]._id, service: services[1]._id, appointment: appts[3]._id, rating: 5, title: "Best auto service in town!",    comment: "Raj was super professional. Fixed my brakes in under an hour. Will definitely come back.", isApproved: true },
    { user: customers[4]._id, service: services[0]._id, rating: 5, title: "Fast oil change",                                          comment: "In and out in 25 minutes. Great value for money. The team is friendly and efficient.", isApproved: true },
  ]);
  console.log(`⭐ ${reviews.length} reviews created`);
 
  // Update service ratings
  for (const svc of services) {
    const svcReviews = reviews.filter((r) => r.service && String(r.service) === String(svc._id));
    if (svcReviews.length) {
      const avg = svcReviews.reduce((s, r) => s + r.rating, 0) / svcReviews.length;
      await Service.findByIdAndUpdate(svc._id, { rating: avg.toFixed(1), totalRatings: svcReviews.length });
    }
  }
 
  console.log("\n✅  DATABASE SEEDED SUCCESSFULLY!");
  console.log("─────────────────────────────────────────────────────");
  console.log(`  Admin Login  → ${admin.email}  /  ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
  console.log(`  User Login   → rahul@example.com  /  User@123`);
  console.log("─────────────────────────────────────────────────────\n");
  process.exit(0);
};
 
run().catch((e) => { console.error("❌ Seed Error:", e.message); process.exit(1); });