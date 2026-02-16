const mongoose = require("mongoose");

const ProbationPlanSchema = new mongoose.Schema(
  {
    // 🔹 Policy Basic Info
     adminId: mongoose.Schema.Types.ObjectId,
    policyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    probationDurationDays: {
      type: Number,
      required: true,
    },

    isEarlyConfirmationAllowed: {
      type: Boolean,
      default: false,
    },

    isAutoConfirm: {
      type: Boolean,
      default: false,
    },

    // 🔹 Notify Section
    notifyEmployee: {
      type: Boolean,
      default: false,
    },

    notifySettings: {
      notifyDaysBeforeCompletion: {
        type: Boolean,
        default: false,
      },

      daysBeforeCompletion: {
        type: Number,
        default: 0,
      },

      notifyOnExtension: {
        type: Boolean,
        default: false,
      },

      notifyOnConfirmation: {
        type: Boolean,
        default: false,
      },
    },

    // 🔹 Assigned Employees
    assignedEmployeeList: [
      {
        employeeid: { type: Number, required: true },
        employeename: { type: String, required: true },
        employeecode: { type: String },
        emailid: { type: String },
        primarymobile: { type: String },
        designationid: { type: Number },
        designationname: { type: String },
        imagepath: { type: String },
        probationperiodid: { type: Number },
      },
    ],

    fullcount: {
      type: Number,
      default: 0,
    },

    // 🔹 Created By
    addedbyid: {
      type:mongoose.Types.ObjectId,
    },

    addedbyname: {
      type: String,
    },

    addedbyimagepath: {
      type: String,
    },

    addeddate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProbationPlan", ProbationPlanSchema);