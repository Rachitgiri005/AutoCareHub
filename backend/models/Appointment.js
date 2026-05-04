const mongoose = require("mongoose");
 
const appointmentSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service:     { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    serviceName: { type: String, required: true },
    servicePrice:{ type: Number, default: 0 },
    vehicleName: { type: String, required: true },
    vehicleYear: { type: String, default: "" },
    licensePlate:{ type: String, default: "" },
    date:        { type: Date, required: true },
    timeSlot:    { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes:         { type: String, default: "" },
    mechanic:      { type: String, default: "" },
    amount:        { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid", "Partial"], default: "Unpaid" },
    paymentMethod: { type: String, default: "" },
    invoiceNumber: { type: String, default: "" },
    rated:         { type: Boolean, default: false },
    statusHistory: [
      {
        status:    String,
        note:      String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
 
// Auto invoice number on completion
appointmentSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Completed" && !this.invoiceNumber) {
    this.invoiceNumber = "INV-" + Date.now().toString().slice(-8).toUpperCase();
  }
  next();
});
 
module.exports = mongoose.model("Appointment", appointmentSchema);