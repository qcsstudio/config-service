const mongoose = require("mongoose");

const employeeIdConfigSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null
    },


    // Manual or Automatic
    assignType: {
      type: String,
      enum: ["manual", "automatic"],
      default: "automatic",
    },
    preview:{
      type: String,
        default: "",
    },


    // Existing employee logic
    assignToExistingEmployees: {
    type: Boolean,
    default: false, // false = No, true = Yes
    },
    includeDeactivatedEmployees: {
      type: Boolean,
      default: false, // false = No, true = Yes
    },
    continueSeriesForFutureEmployees: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EmployeeIdConfig",
  employeeIdConfigSchema
);
