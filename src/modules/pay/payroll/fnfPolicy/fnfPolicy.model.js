const mongoose = require("mongoose");

const assignedEmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // designationId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Designation",
    //   default: null,
    // },
  },
  { _id: false }
);

const fnfPolicySchema = new mongoose.Schema(
  {
    /* -------------------------
       BASIC POLICY INFO
    ------------------------- */

    policyName: {
      type: String,
      required: true,
      trim: true,
    },

    /* -------------------------
       BASIC PAY
    ------------------------- */

    basicPayDuringNotice: {
      type: Boolean,
      default: true,
    },

    /* -------------------------
       FNF PROCESS DAYS
    ------------------------- */

    fnfProcessDays: {
      type: Number,
      default: 0,
    },

    /* -------------------------
       GRATUITY SETTINGS
    ------------------------- */

    payGratuity: {
      type: Boolean,
      default: true,
    },

    gratuityThresholdYears: {
      type: Number,
      default: 0,
    },

    gratuityThresholdMonths: {
      type: Number,
      default: 0,
    },

    gratuityNonCTC: {
      type: Boolean,
      default: true,
    },

    /* -------------------------
       COMPANY RELATIONS
    ------------------------- */

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    companyOfficeId: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CompanyOffice",
        },
      ],
      default: [],
    },

    /* -------------------------
       ASSIGNED EMPLOYEES
    ------------------------- */

    assignedEmployeeList: {
      type: [assignedEmployeeSchema],
      default: [],
    },

    /* -------------------------
       STATUS
    ------------------------- */

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FnfPolicy", fnfPolicySchema);