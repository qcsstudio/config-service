const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ─────────────────────────────────────────────
   HOLIDAY ENTRY SUB-SCHEMA  (Step 3 — Calendar)
───────────────────────────────────────────── */
const HolidayEntrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["mandatory", "optional"],
      required: true,
    },
  },
  { _id: false }
);

/* ─────────────────────────────────────────────
   ASSIGNED EMPLOYEE SUB-SCHEMA
───────────────────────────────────────────── */
const AssignedEmployeeSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    designationId: {
      type: Schema.Types.ObjectId,
      ref: "Designation",
      default: null,
    },
  },
  { _id: false }
);

/* ─────────────────────────────────────────────
   MAIN HOLIDAY PLAN SCHEMA
───────────────────────────────────────────── */
const HolidayPlanSchema = new Schema(
  {
    /* ─────────────────────────────
       STEP 1 — Describe
    ───────────────────────────── */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    /* ─────────────────────────────
       STEP 2 — Preferences
    ───────────────────────────── */
    year: {
      type: Number,
      required: true,
    },

    // "yes" = employees get mandatory holidays
    mandatoryHolidays: {
      type: String,
      enum: ["yes", "no"],
      default: "yes",
    },

    // "yes" = employees get optional holidays
    optionalHolidays: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },

    /* ─────────────────────────────
       STEP 3 — Plan (Calendar)
    ───────────────────────────── */
    holidays: {
      type: [HolidayEntrySchema],
      default: [],
    },

    /* ─────────────────────────────
       STEP 4 — Approval
       Mandatory holiday date rules
       (shown when mandatoryHolidays === "yes")
    ───────────────────────────── */

    // Deadline for existing employees to select mandatory holidays
    existingEmployeeDate: {
      type: Date,
      default: null,
    },

    // true = send email to manager if existing employee misses mandatory deadline
    sendEmailExisting: {
      type: Boolean,
      default: true,   // true
    },

    // New employees must select mandatory holidays within N days of joining
    newEmployeeDays: {
      type: Number,
      min: 0,
      default: null,
    },

    // true = send email to manager if new employee misses mandatory window
    sendEmailNew: {
      type: Boolean,
      default: true,   // true
    },

    /* ─────────────────────────────
       STEP 4 — Approval
       Optional holiday date rules
       (shown when optionalHolidays === "yes")
    ───────────────────────────── */

    // Deadline for existing employees to select optional holidays
    existingOptionalDate: {
      type: Date,
      default: null,
    },

    // true = send email to manager if existing employee misses optional deadline
    sendEmailExistingOptional: {
      type: Boolean,
      default: true,   // true
    },

    // New employees must select optional holidays within N days of joining
    newOptionalDays: {
      type: Number,
      min: 0,
      default: null,
    },

    // true = send email to manager if new employee misses optional window
    sendEmailNewOptional: {
      type: Boolean,
      default: true,   // true
    },

    // Max number of optional holidays an employee can select
    maxOptionalHolidays: {
      type: Number,
      min: 0,
      default: null,
    },

    /* ─────────────────────────────
       ASSIGNMENT SECTION
    ───────────────────────────── */
    assignedEmployeeList: {
      type: [AssignedEmployeeSchema],
      default: [],
    },

    /* ─────────────────────────────
       SYSTEM FIELDS
    ───────────────────────────── */
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    companyOfficeId: {
      type: [{ type: Schema.Types.ObjectId, ref: "CompanyOffice" }],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

/* ─────────────────────────────────────────────
   CONDITIONAL VALIDATION
]

/* ─────────────────────────────────────────────
   INDEX — Prevent duplicate plan per company per year
───────────────────────────────────────────── */
HolidayPlanSchema.index({ companyId: 1, year: 1 }, { unique: true });

/* ─────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────── */
module.exports = mongoose.model("HolidayPlan", HolidayPlanSchema);