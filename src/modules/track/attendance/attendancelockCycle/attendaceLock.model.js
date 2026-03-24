const mongoose = require("mongoose");

const attendanceLockCycleSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default:null
    },

    // Enable / Disable attendance lock
    isAttendanceLocked: {
      type: Boolean,
      default: false,
    },

    // Start day of lock cycle (1–31)
    lockStartDay: {
      type: Number,
      min: 1,
      max: 31,
      required: function () {
        return this.isAttendanceLocked;
      },
    },

    // End day of lock cycle (1–31)
    lockEndDay: {
      type: Number,
      min: 1,
      max: 31,
      required: function () {
        return this.isAttendanceLocked;
      },
    },

    // Buffer days after cycle end
    regularizationCutOffDays: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },

    // Allow bypass after cutoff
    isCycleBypassEnabled: {
      type: Boolean,
      default: false,
    },

    // Optional description
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AttendanceLockCycle",
  attendanceLockCycleSchema
);