const mongoose = require("mongoose");

// 🔹 Assigned Employee Schema
const assignedEmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// 🔹 Main Exit Policy Schema
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

    // 🔹 Company Offices
    companyOfficeId: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CompanyOffice",
        },
      ],
      default: [],
    },

    // 🔹 Assigned Employees
    assignedEmployeeList: {
      type: [assignedEmployeeSchema],
      default: [],
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

    // ── Status (Active / Draft)
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

    // ── Employee notice change
    changeNotice: {
      type: Boolean,
      default: true,
    },

    // ── Manager-Initiated Separation
    managerInitiate: {
      type: Boolean,
      default: true,
    },

    // ── Manager notice change
    managerChangeNotice: {
      type: Boolean,
      default: true,
    },

    // ── Notification target
    notifyOn: {
      type: String,
      enum: ["employee", "approvers"],
      default: "employee",
    },

    // 🔹 Active flag
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExitPolicy", exitPolicySchema);