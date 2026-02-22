const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ─────────────────────────────────────────────
   ASSIGNED EMPLOYEE SUB-SCHEMA
───────────────────────────────────────────── */
const AssignedEmployeeSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee", // must match your Employee model name
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

        mandatoryHolidays: {
            type: String,
            enum: ["yes", "no"],
            default: "yes",
        },

        optionalHolidays: {
            type: String,
            enum: ["yes", "no"],
            default: "no",
        },

        /* ─────────────────────────────
           STEP 3 — Plan
        ───────────────────────────── */
        existingEmployeeDate: {
            type: Date,
            default: null,
        },

        sendEmailExisting: {
            type: Boolean,
            default: true,
        },

        newEmployeeDays: {
            type: Number,
            default: null,
        },

        sendEmailNew: {
            type: Boolean,
            default: true,
        },

        maxOptionalHolidays: {
            type: Number,
            default: null,
        },

        /* ─────────────────────────────
           STEP 4 — Approval
        ───────────────────────────── */
        approvalRequired: {
            type: String,
            enum: ["yes", "no"],
            default: "no",
        },

        approver: {
            type: String,
            enum: ["manager", "hr", "admin"],
            default: null,
        },

        notifyApprover: {
            type: String,
            enum: ["yes", "no"],
            default: "no",
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
            default: null
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
───────────────────────────────────────────── */
// HolidayPlanSchema.pre("validate", function (next) {
//   // If optional holidays enabled → maxOptionalHolidays required
//   if (this.optionalHolidays === "yes" && !this.maxOptionalHolidays) {
//     return next(new Error("Max optional holidays is required"));
//   }

//   // If approval required → approver required
//   if (this.approvalRequired === "yes" && !this.approver) {
//     return next(new Error("Approver is required"));
//   }

//   next();
// });

/* ─────────────────────────────────────────────
   EXPORT MODEL
───────────────────────────────────────────── */
module.exports = mongoose.model("HolidayPlan", HolidayPlanSchema);