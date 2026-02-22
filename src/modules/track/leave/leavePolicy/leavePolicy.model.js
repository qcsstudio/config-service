const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ─────────────────────────────────────────────
   ASSIGNED EMPLOYEE SCHEMA
───────────────────────────────────────────── */
const AssignedEmployeeSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "employees",
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
   MAIN LEAVE POLICY SCHEMA (FLAT STRUCTURE)
───────────────────────────────────────────── */
const LeavePolicySchema = new Schema(
    {
        // ===============================
        // BASIC POLICY INFO
        // ===============================
        policyName: { type: String, required: true, trim: true },
        description: { type: String, default: "", trim: true },
        selectedTypes: [{ type: String, trim: true }],

        // ===============================
        // USAGE POLICY
        // ===============================
        leaveName: String,
        usageLimitType: String,
        maxDaysLeave: { type: Number, default: 0 },
        maxConsecutive: { type: Number, default: 0 },

        halfDay: { type: Boolean, default: true },
        limitFuture: { type: Boolean, default: true },
        allowPast: { type: Boolean, default: true },
        sandwiched: { type: Boolean, default: true },
        clubbing: { type: Boolean, default: true },

        futureDuration: { type: Number, default: 0 },
        futureApplyAtLeast: { type: Number, default: 0 },
        futureNotEarlier: { type: Number, default: 0 },
        pastDays: { type: Number, default: 0 },

        sandwichTypes: [{ type: String }],
        clubbingTypes: String,

        // ===============================
        // HOURLY LEAVE
        // ===============================
        hourlyName: String,
        maxHours: { type: Number, default: 0 },
        employmentType: String,

        calcType: {
            type: String,
            enum: ["prorate", "noprorate"],
            default: "prorate",
        },

        prorateFrom: String,
        joinMonthCalc: String,
        joinAfterDays: { type: Number, default: 0 },

        includeExtendedProbation: { type: Boolean, default: false },
        probationMonthCalc: String,
        probationAfterDays: { type: Number, default: 0 },

        noProRateType: String,
        joinsOnOrBefore: String,
        joinsOnOrBeforeDays: { type: Number, default: 0 },
        joinsOnOrBeforeMonth: String,
        elseCalcFrom: String,

        disbursal: String,

        carryForward: String,
        carryType: String,
        minHoursPerDay: { type: Number, default: 0 },
        leaveHours: { type: Number, default: 0 },

        approval: String,

        // ===============================
        // ADVANCED LEAVE CONFIG
        // ===============================
        allocation: String,
        annualDays: { type: Number, default: 0 },

        gender: String,
        empType: String,
        marital: String,

        attachments: String,
        attachmentDays: { type: Number, default: 0 },
        attachmentNote: String,

        overutil: { type: Boolean, default: false },
        overutilType: String,
        deductFrom: String,

        carryForwardEnabled: { type: Boolean, default: false },
        carryFwdLimit: String,
        carryFwdUnused: { type: Number, default: 0 },

        encashEnabled: { type: Boolean, default: false },
        encashLimit: String,
        encashUnused: { type: Number, default: 0 },

        giftLeave: { type: Boolean, default: false },
        giftLeavesPerYear: { type: Number, default: 0 },
        giftReceive: String,

        // ===============================
        // ASSIGNED EMPLOYEES
        // ===============================
        assignedEmployeeList: {
            type: [AssignedEmployeeSchema],
            default: [],
        },

        // ===============================
        // SYSTEM FIELDS
        // ===============================
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
    { timestamps: true }
);

module.exports = mongoose.model("LeavePolicy", LeavePolicySchema);