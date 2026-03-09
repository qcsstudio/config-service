const mongoose = require("mongoose");

const payrollTagSchema = new mongoose.Schema(
    {
        // 🔹 Common Fields
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

        // 🔹 Tag Basic Info
        tagName: {
            type: String,
            required: true,
            trim: true,
        },

        valueType: {
            type: String,
            enum: ["Boolean", "Drop Down"],
            required: true,
        },

        // 🔹 Country & Office Info
        companyOfficeId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CompanyOffice"
                }
            ],
            default: []   // empty array
        },

        // 🔹 Assigned Employees
        assignedEmployeeList: {
            type: [
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
            ],
            default: [],
        },

        // 🔹 Status
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PayrollTag", payrollTagSchema);