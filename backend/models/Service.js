const mongoose = require("mongoose");
 
const serviceSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price:       { type: Number, required: true, min: 0 },
    duration:    { type: String, default: "1 hour" },
    category:    {
      type: String,
      enum: ["maintenance", "repair", "inspection", "detailing", "other"],
      default: "maintenance",
    },
    icon:     { type: String, default: "🔧" },
    isActive: { type: Boolean, default: true },
    rating:   { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Service", serviceSchema);
 