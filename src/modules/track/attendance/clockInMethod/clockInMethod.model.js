const mongoose = require("mongoose");

const assignedEmployeeSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    departmentName: {
      type: String,
      default: "",
      trim: true,
    },

    employeeid: { type: Number },
    employeename: { type: String, trim: true },
    employeecode: { type: String, trim: true },
    emailid: { type: String, trim: true },
    primarymobile: { type: String, trim: true },

    designationid: { type: Number },
    designationname: { type: String, trim: true },

    imagepath: { type: String, default: "" },
    probationperiodid: { type: Number },
  },
  { _id: false }
);

const clockInMethodSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // 🔹 Added By Info

    addedByName: {
      type: String,
    //   trim: true,
     default: "",
    },

    addedByImage: {
      type: String,
      default: "",
    },

    // 🔹 Step 1
    deviceName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 🔹 Step 2
    clockType: {
      type: String,
      enum: ["both", "only"],
      default: "only",
    },

    trackBreak: {
      type: Boolean,
      default: false,
    },

    breakDuration: {
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
     hybrid: {
      type: Boolean,
      default: false,
    },

    // 🔹 Step 3
    biometric: {
      type: Boolean,
      required: true,
    },

    directionalDevice: {
      type: Boolean,
      default: false,
    },

    webAttendance: {
      type: Boolean,
      default: false,
    },

    ipRestriction: {
      type: Boolean,
      default: false,
    },

    mobileAttendance: {
      type: Boolean,
      default: false,
    },

    gpsAttendance: {
      type: Boolean,
      default: false,
    },

    // 🔹 Assigned Employees
    assignedEmployeeList: {
      type: [assignedEmployeeSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClockInMethod", clockInMethodSchema);
