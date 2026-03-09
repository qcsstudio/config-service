const mongoose = require("mongoose");

const payrollMethodSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    packageType: {
      type: String,
      enum: ["annual", "monthly"],
      default: "monthly",
    },

    salaryMethod: {
      type: String,
      enum: ["ctc", "gross", "proration"],
      default: "gross",
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PayrollMethod", payrollMethodSchema);