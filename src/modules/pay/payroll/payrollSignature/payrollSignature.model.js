const mongoose = require("mongoose");

const payrollSignatureSchema = new mongoose.Schema(
    {
        // 🔹 Common Relations
        adminId: {
              type: mongoose.Schema.Types.ObjectId,
              ref:"User",
              default: null,
            },
            companyId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"Company",
              default: null,
            },


        // 🔹 Employee Type
        employeeType: {
            type: Boolean,
            default: false
        },

        // 🔹 If Existing Employee
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees",
            default: null,
        },

        // 🔹 If New Employee
        employeeName: {
            type: String,
            trim: true,
            default: null,
        },

        fatherName: {
            type: String,
            trim: true,
            default: null,
        },


        designationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Designation",
            default: null,
        },
        designation: {
            type: String,
            trim: true,
            default: null,
        },

        gender: {
            type: String,
            default: null,
        },
        companyOfficeId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CompanyOffice"
                }
            ],
            default: []   // empty array
        },
        // 🔹 Assign Authority Section
        effectiveFrom: {
            type: Date,
            required: true,
        },

        signingAuhorityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PayrollSignature",
            default: null,
        },

         fallbackAuthorityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PayrollSignature",
            default: null,
        },
        // 🔹 Document Permissions
        isPaySlipEnabled: {
            type: Boolean,
            default: false,
        },

        isForm16Enabled: {
            type: Boolean,
            default: false,
        },

        // 🔹 Status
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PayrollSignature", payrollSignatureSchema);