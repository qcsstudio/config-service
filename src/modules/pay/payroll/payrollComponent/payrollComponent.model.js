const mongoose = require("mongoose");

const payrollComponentSchema = new mongoose.Schema(
    {
        // 🔹 Common Fields
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

        // 🔹 Basic Info
        componentName: {
            type: String,
            required: true,
            trim: true,
        },

        componentCode: {
            type: String,
            trim: true,
            uppercase: true,
        },

        useReadymade: {
            type: Boolean,
            default: false,
        },

        readymadeComponent: {
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

        // 🔹 Component Type
             Income: {
                type: Boolean,
                default:false
            },
            employeeDeduction: {
                type: Boolean,
                default: false,
            },
             employerDeduction: {
                type: Boolean,
                default: false,
            },
            CTC: {
                type: Boolean,
                default: false,
            },
            Non_Ctc:{
                type: Boolean,
                default: false,
        
            },
            isVariable: {
                type: Boolean,
                default: false,
            },

            isExtraPayment: {
                type: Boolean,
                default: false,
            },
            isTaxable: {
                type: Boolean,
                default: true,
            },
            taxGroup: {
                type: String,
                default: null,
            },
            willAccrue: {
                type: Boolean,
                default: false,
            },

        // 🔹 Deduction Extra Recover
        recoverExtraDeduction: {
            type: Boolean,
            default: false,
        },

        // 🔹 Statutory Flags (important for your "Choose Statutory" view)
        isStatutory: {
            type: Boolean,
            default: false,
        },

        isStatutoryDeduction: {
            type: Boolean,
            default: false,
        },

        // 🔹 Journal
        journalVoucher: {
            type: String,
            trim: true,
            default: null,
        },

        // 🔹 Status
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PayrollComponent", payrollComponentSchema);