const mongoose = require("mongoose");

/* ================= ACTIVITIES ================= */

const activitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                "Task",
                "Message",
                "Media File",
                "Link",
                "Upload Request",
                "Dependency Task",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        dueDays: {
            type: Number,
            default: 0,
        },

        file: {
            type: String,
            default: "",
        },

        link: {
            type: String,
            default: "",
        },
    },
    { _id: true }
);

/* ================= ASSIGNED EMPLOYEES ================= */

const employeeAssignSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees",
        },
        assignedDate: {
            type: Date,
        },
    },
    { _id: true }
);

/* ================= CHECKLIST MAIN ================= */

const checklistSchema = new mongoose.Schema(
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

        checkType: {
            type: Number,
            //   enum: ["Automatic", "Manual"],
            default: 0
        },

        checklistType: {
            type: String,
            enum: ["Automatic", "Manual"],
        },

        title: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: "",
        },

        purpose: {
            type: String,
            enum: ["Onboarding", "Offboarding", "Promotion"],
        },

        /* ================= AUTOMATIC CHECKLIST FILTERS ================= */

        businessUnit: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BusinessUnit",
            },
        ],

        department: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Department",
            },
        ],

        designation: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Designation",
            },
        ],

        team: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Team",
            },
        ],

        location: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CompanyOffice",
            },
        ],

        /* ================= MANUAL ASSIGNMENT ================= */

        assignedEmployees: [employeeAssignSchema],

        /* ================= ACTIVITIES ================= */

        activities: [activitySchema],
         isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Checklist", checklistSchema);