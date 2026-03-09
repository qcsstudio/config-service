const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
    {
        policyName: {
            type: String,
            // required: true,
            default:""
        },

        description: {
            type: String,
            trim: true,
        },

        file: {
            type: String,
            default:"" // file path or filename
        },

        AssignPolicy: {
            type: String, // BusinessUnit | Department
            enum: ["BusinessUnit", "Department"],
            required: true,
        },

        cluster: {
            businessUnits: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "BusinessUnit",
                },
            ],

            departments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Department",
                },
            ],
        },

        visibleFrom: {
            type: Date,
        },

        visibleTo: {
            type: Date,
        },

        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);