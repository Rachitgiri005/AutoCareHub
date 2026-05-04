const mongoose = require("mongoose");
 
const invoiceSchema = new mongoose.Schema(
  {
    appointment:   { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    items: [
      {
        description: { type: String, required: true },
        quantity:    { type: Number, default: 1 },
        price:       { type: Number, required: true },
      },
    ],
    subtotal:      { type: Number, default: 0 },
    taxRate:       { type: Number, default: 0 },   // percentage
    taxAmount:     { type: Number, default: 0 },
    total:         { type: Number, required: true },
    status:        { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
    paymentMethod: { type: String, default: "" },
    dueDate:       { type: Date },
    paidAt:        { type: Date },
    notes:         { type: String, default: "" },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Invoice", invoiceSchema);