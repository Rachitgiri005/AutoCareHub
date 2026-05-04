const mongoose = require("mongoose");
 
const reviewSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    service:     { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    title:       { type: String, default: "" },
    comment:     { type: String, required: true },
    isApproved:  { type: Boolean, default: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Review", reviewSchema);
 

