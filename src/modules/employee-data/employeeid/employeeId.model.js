const mongoose = require("mongoose");

const employeeIdConfigSchema = new mongoose.Schema(
  {
    adminId: mongoose.Schema.Types.ObjectId,


    // Manual or Automatic
    assignType: {
      type: String,
      enum: ["manual", "automatic"],
      default: "automatic",
    },

    // Separator Dropdown
    separator: {
      type: String,
      enum: ["-", "/", "\\", "_", "none"],
      default: "_",
    },

    // PREFIX SECTION
    prefix: {
      enabled: { type: Boolean, default: false },

      type: {
        type: String,
        enum: ["custom_text"],
      },

      customText: {
        type: String,
        trim: true,
      },

      upperCase: {
        type: Boolean,
        default: false,
      },
    },

    // MID TEXT SECTION
    midText: {
      enabled: { type: Boolean, default: false },

      type: {
        type: String,
        enum: [
          "company_name",
          "business_unit_name",
          "office_location_name",
          "department_name",
          "custom_text",
          "numerical_series",
        ],
      },

      customText: {
        type: String,
        trim: true,
      },

      numberOfCharacters: {
        type: Number,
      },

      startFrom: {
        type: Number,
      },

      currentNumber: {
        type: Number,
      },

      upperCase: {
        type: Boolean,
        default: false,
      },
    },

    // SUFFIX SECTION
    suffix: {
      enabled: { type: Boolean, default: false },

      type: {
        type: String,
        enum: ["numerical_series", "custom_text"],
      },

      customText: {
        type: String,
        trim: true,
      },

      startFrom: {
        type: Number,
      },

      currentNumber: {
        type: Number,
      },

      upperCase: {
        type: Boolean,
        default: false,
      },
    },

    // Existing employee logic
    assignToExistingEmployees: {
      type: String,
      enum: ["oldest_joining_date", "future_only"],
      default: "oldest_joining_date",
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
