const mongoose = require("mongoose");

const exitPolicySchema = new mongoose.Schema(
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

    // ── Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ── Notice period in days
    notice: {
      type: Number,
      required: true,
    },

    // ── Status (Active / Draft tab)
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
    },

    // ── Employee Resignation
    selfResign: {
      type: Boolean,
      default: true,
    },

    // ── Employee notice period change request (only relevant if selfResign = true)
    changeNotice: {
      type: Boolean,
      default: true,
    },

    // ── Manager-Initiated Separation
    managerInitiate: {
      type: Boolean,
      default: true,
    },

    // ── Manager notice period change request (only relevant if managerInitiate = true)
    managerChangeNotice: {
      type: Boolean,
      default: true,
    },

    // ── Approval Notification target
    notifyOn: {
      type: String,
      enum: ["employee", "approvers"],
      default: "employee",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExitPolicy", exitPolicySchema);