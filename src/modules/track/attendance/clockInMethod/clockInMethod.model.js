const mongoose = require("mongoose");

const assignedEmployeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Types.ObjectId,
            ref: "employees",
            default: null,
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null,
        },
        designationid: {
            type: mongoose.Types.ObjectId,
            ref: "Designation",
            default: null,
        },
    },
    { _id: false }
);

const clockInMethodSchema = new mongoose.Schema(
    {
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


        // 🔹 Added By Info
        addedByName: {
            type: String,
            default: "",
        },

        addedByImage: {
            type: String,
            default: "",
        },

        // ─────────────────────────────────────────
        // 🔹 Step 1 — Describe
        // ─────────────────────────────────────────

        deviceName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        // ─────────────────────────────────────────
        // 🔹 Step 2 — Input Type
        // ─────────────────────────────────────────

        // "Clock-in and clock-out both required" OR "Only Clock-in required"
        clockType: {
            type: String,
            enum: ["both", "only"],
            default: "only",
        },

        // "Would you like to track break durations between Clock-out and Clock-in times?"
        trackBreak: {
            type: Boolean,
            default: false,
        },

        // "How much time is allocated to employee as break-time?"
        // always stored regardless of trackBreak (shown always in UI — image 2)
        breakDuration: {
            hours: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 },
        },

        // "Would you like to enable Hybrid attendance mode?"
        hybrid: {
            type: Boolean,
            default: false,
        },

        // ─────────────────────────────────────────
        // 🔹 Step 3 — Biometric
        // ─────────────────────────────────────────

        // "Would you like to enable biometric attendance?"
        biometric: {
            type: Boolean,
            required: true,
        },

        // "Do you wish to track attendance with separate device for in-time and out-time?"
        directionalDevice: {
            type: Boolean,
            default: false,
        },

        // ─────────────────────────────────────────
        // 🔹 Step 4 — Web
        // ─────────────────────────────────────────

        // "Would you like to enable web based attendance via Windows Linux Mac browser?"
        webAttendance: {
            type: Boolean,
            default: false,
        },

        // "Would you like to enforce IP Network restrictions as well?"
        ipRestriction: {
            type: Boolean,
            default: false,
        },

        // Selected IP addresses — "Select IPs" (image 4)
        ipList: {
            type: [String],
            default: [],
        },

        // ─────────────────────────────────────────
        // 🔹 Step 5 — Mobile
        // ─────────────────────────────────────────

        // "Would you like to enable mobile based attendance (via Android/iOS app)?"
        mobileAttendance: {
            type: Boolean,
            default: false,
        },

        // "Would you like to enforce GPS location based attendance?"
        gpsAttendance: {
            type: Boolean,
            default: false,
        },

        // Selected GPS locations — "Select GPS"
        gpsList: {
            type: [String],
            default: [],
        },

        // ─────────────────────────────────────────
        // 🔹 Assigned Employees
        // ─────────────────────────────────────────

        assignedEmployeeList: {
            type: [assignedEmployeeSchema],
            default: [],
        },

        isActive: {
            type: Boolean,
            default: true,
        },
        companyOfficeId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CompanyOffice"
                }
            ],
            default: []
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ClockInMethod", clockInMethodSchema);