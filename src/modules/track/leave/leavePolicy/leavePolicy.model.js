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
        // USAGE POLICY  (s2 — Unpaid Leave)
        // ===============================
        leaveName: { type: String, default: "" },
        usageLimitType: { type: String, default: "" },
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

        // ✅ ADDED: sandwichSubTypes — frontend stores per-key arrays
        // (mandatory / optional / weeklyoff → each holds sub-type strings)
        sandwichSubTypes: {
            type: Schema.Types.Mixed,  // { mandatory: [], optional: [], weeklyoff: [] }
            default: { mandatory: [], optional: [], weeklyoff: [] },
        },

        clubbingTypes: { type: String, default: "" },

        // ===============================
        // HOURLY LEAVE  (s3)
        // ===============================
        hourlyName: { type: String, default: "" },
        maxHours: { type: Number, default: 0 },
        employmentType: { type: String, default: "" },

        calcType: {
            type: String,
            enum: ["monthly", "fixed"],   // normalised from prorate/noprorate
            default: "monthly",
        },

        prorateFrom: { type: String, default: "" },
        joinMonthCalc: { type: Boolean, default: true },   // true = irrespective
        joinAfterDays: { type: Number, default: 0 },

        includeExtendedProbation: { type: Boolean, default: false },
        probationMonthCalc: { type: Boolean, default: true },   // true = full month
        probationAfterDays: { type: Number, default: 0 },

        noProRateType: { type: String, default: "" },
        joinsOnOrBefore: { type: Boolean, default: false },
        joinsOnOrBeforeDays: { type: Number, default: 0 },
        joinsOnOrBeforeMonth: { type: Number, default: 0 },
        elseCalcFrom: { type: String, default: "" },

        disbursal: { type: String, default: "" },  // "monthly" | "annual"

        carryForward: { type: Boolean, default: false },  // true = carry
        carryType: { type: String, default: "" },
        minHoursPerDay: { type: Number, default: 0 },
        leaveHours: { type: Number, default: 0 },

        approval: { type: Boolean, default: false },  // false = bypass

        // ===============================
        // ADVANCED LEAVE CONFIG  (s4)
        // ===============================

        // — Leave name for this config —
        // ✅ ADDED: leaveName4 sent as a separate named field
        leaveName4: { type: String, default: "" },

        allocation: { type: String, default: "" },   // "annual" | "manual"
        annualDays: { type: Number, default: 0 },

        gender: { type: String, default: "all" },
        empType: { type: String, default: "all" },
        marital: { type: String, default: "all" },

        // — s4 calculation fields (parallel to s3 but for leave config) —
        // ✅ ADDED: all four s4-specific calc fields missing from original schema
        calcType4: {
            type: String,
            enum: ["monthly", "fixed"],
            default: "monthly",
        },
        prorateFrom4: { type: String, default: "" },
        joinCalc4: { type: String, default: "" },           // "irrespective" | "half"
        joinAfterDays4: { type: Number, default: 0 },
        extProbation4: { type: Boolean, default: false },
        probCalc4: { type: String, default: "" },           // "full" | "half"
        probAfterDays4: { type: Number, default: 0 },
        noProRate4: { type: String, default: "" },
        joinsOnOrBefore4: { type: String, default: "" },
        joinsOnOrBeforeDays4: { type: Number, default: 0 },
        joinsMonth4: { type: String, default: "" },
        elseCalcFrom4: { type: String, default: "" },
        disbursal4: { type: String, default: "" },

        // — Probation credit limits (s4) —
        // ✅ ADDED: all three probation-credit fields missing
        limitProbationCredit: { type: String, default: "yes" },
        creditUntilProbationSel: { type: String, default: "" },
        creditUntilProbationDays: { type: Number, default: 0 },

        // — Attachments —
        attachments: { type: String, default: "yes" },
        attachmentDays: { type: Number, default: 0 },
        attachmentNote: { type: String, default: "" },

        // — During Probation —
        // ✅ ADDED: maxProbationDays, accumProbation, applyDuringProbation1/2 all missing
        maxProbationDays: { type: Number, default: 0 },
        accumProbation: { type: String, default: "yes" },
        applyDuringProbation1: { type: String, default: "yes" },
        applyDuringProbation2: { type: String, default: "yes" },

        // — After Confirmation —
        // ✅ ADDED: afterConfirmPeriod and afterConfirmMax missing
        afterConfirmPeriod: { type: String, default: "" },
        afterConfirmMax: { type: String, default: "" },

        // — s4 Usage fields (parallel to s2) —
        // ✅ ADDED: maxConsecutive4, halfDay4, limitFuture4, futureDuration4,
        //           futureApplyAtLeast4, futureNotEarlier4, allowPast4, pastDays4 all missing
        maxConsecutive4: { type: Number, default: 0 },
        halfDay4: { type: Boolean, default: true },
        limitFuture4: { type: Boolean, default: true },
        futureDuration4: { type: Number, default: 0 },
        futureApplyAtLeast4: { type: Number, default: 0 },
        futureNotEarlier4: { type: Number, default: 0 },
        allowPast4: { type: Boolean, default: true },
        pastDays4: { type: Number, default: 0 },

        // — s4 Sandwich —
        // ✅ ADDED: sandwiched4, sandwichTypes4, sandwichSubTypes4 all missing
        sandwiched4: { type: Boolean, default: true },
        sandwichTypes4: [{ type: String }],
        sandwichSubTypes4: {
            type: Schema.Types.Mixed,
            default: { mandatory: [], optional: [], weeklyoff: [] },
        },

        // — s4 Clubbing —
        // ✅ ADDED: clubbing4, clubbingTypes4 missing
        clubbing4: { type: Boolean, default: true },
        clubbingTypes4: { type: String, default: "" },

        // — Overutilization —
        overutil: { type: Boolean, default: false },
        overutilType: { type: String, default: "" },
        deductFrom: { type: String, default: "" },

        // — Carry Forward —
        carryForwardEnabled: { type: Boolean, default: false },
        carryFwdLimit: { type: String, default: "" },
        carryFwdUnused: { type: Number, default: 0 },

        // — Encashment —
        encashEnabled: { type: Boolean, default: false },
        encashLimit: { type: String, default: "" },
        encashUnused: { type: Number, default: 0 },

        // — Gift A Leave —
        giftLeave: { type: Boolean, default: false },
        giftLeavesPerYear: { type: Number, default: 0 },
        giftReceive: { type: String, default: "" },

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
                }
            ],
            default: [],
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