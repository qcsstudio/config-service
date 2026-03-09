const mongoose = require("mongoose");

const payrollMiscSchema = new mongoose.Schema(
    {
        // =====================================================
        // 🔹 COMMON
        // =====================================================
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

        // =====================================================
        // 1️⃣ ROUNDING OPTIONS
        // =====================================================
        roundingOption: {
            type: String,
            enum: ["two-decimal", "round-up", "round-down"],
            default: "two-decimal",
        },

        // =====================================================
        // 2️⃣ VARIABLE / VPF SETTINGS
        // =====================================================
        variableDashboardDaysBeforeRun: {
            type: Number,
            default: 0,
        },

        allowVPF: {
            type: Boolean,
            default: false,
        },

        // =====================================================
        // 3️⃣ FLEXIBLE BENEFITS PLAN (FBP)
        // =====================================================
        fbp: {
            RunPayrollenabled: {
                type: Boolean,
                default: false,
            },

            earlyPayrollRun: {
                type: Boolean,
                default: false,
            },

            variableDashboardDays: {
                type: Number,
                default: 0,
            },

            cutOffDay: {
                type: Number,
                default: null,
            },

            // 🔹 Main Calculation Selection
            paidEveryMonth: {
                type: Boolean,
                default: false,
            },

            // 🔹 Only when paidEveryMonth = false
            billSubmission: {
                billSubmissionEnabled: {
                    type: Boolean,
                    default: false,
                },

                taxableBalancing: {
                    type: Boolean,
                    default: false,
                },

                carryForwardUnused: {
                    type: Boolean,
                    default: false,
                },
            },
        },

        // =====================================================
        // 4️⃣ SALARY SLIP DESIGN
        // =====================================================
        salarySlip: {

            logoPlacement: {
                type: Boolean,
                default: true, // true = show logo, false = hide logo
            },

            bodyLayout: {
                type: Boolean,
                default: true, // true = double layout, false = single layout
            },
            showEmployeeDeduction: {
                type: Boolean,
                default: true,
            },

            showEmployerDeduction: {
                type: Boolean,
                default: true,
            },

            showBankDetails: {
                type: Boolean,
                default: true,
            },

            cutOffDay: {
                type: Number,
                default: null,
            },

            showBusinessAddress: {
                type: Boolean,
                default: true,
            },

            showBusinessLogo: {
                type: Boolean,
                default: true,
            },

            // signingAuthority: {
            //     type: String,
            //     enum: ["digital", "none"],
            //     default: "digital",
            // },
            signingAuthority: {
                digitalSignature: {
                    type: Boolean,
                    default: true,
                },
                none: {
                    type: Boolean,
                    default: false,
                },
            },
        },

        // =====================================================
        // 5️⃣ LOAN SETTINGS
        // =====================================================
        loanSettings: {
            loanEnabled: {
                type: Boolean,
                default: false,
            },

            eligibilityType: {
                probationConfirmation:{
                    type:Boolean,
                    default:false
                },
                showEmployerDeduction: {
                    type: Boolean,
                    default: false,
                },
                showBankDetails: {      
                type:Boolean,
                default:false
                }
            },
            SetCuffOffDay:{
                type:String,
                default:""
            },
            UponProbationConfirmation:{
                type:Boolean,
                default:false
            },

            eligibilityDaysAfterJoining: {
                type: Number,
                default: null,
            },

            allowDuringNoticePeriod: {
                type: Boolean,
                default: true,
            },

            minimumPackageAmount: {
                type: Number,
                default: null,
            },

            minimumPackageType: {
                type: String,
                // enum: ["annual", "monthly"],
                default: "",
            },

            loanLimitType: {
                type: String,
                enum: ["percentage", "Fixed"],
                default: "",
            },

            loanLimitValue: {
                type: Number,
                default: null,
            },

            maxInstallments: {
                type: Number,
                default: null,
            },

            defaultInterestRate: {
                type: Number,
                default: 0,
            },

            interestMethod: {
                type: String,
                default: "Reducing interest rate",
            },
        },

        // =====================================================
        // 6️⃣ IT DECLARATION
        // =====================================================
        itDeclaration: {
            existingEmployeesWindow: {
                from: Date,
                to: Date,
            },

            newEmployeesDaysAfterJoining: {
                type: Number,
                default: null,
            },

            requireApproval: {
                type: Boolean,
                default: true,
            },

            allowMidYearChange: {
                type: Boolean,
                default: true,
            },

            effectiveWindow: {
                from: Date,
                to: Date,
            },

            requireEffectiveApproval: {
                type: Boolean,
                default: true,
            },
        },

        // =====================================================
        // 7️⃣ IT SUBMISSION
        // =====================================================
        itSubmission: {
            standardWindow: {
                from: Date,
                to: Date,
            },

            extendedWindow: {
                from: Date,
                to: Date,
            },

            requireProof: {
                type: Boolean,
                default: true,
            },

            allowTaxRegimeChange: {
                type: Boolean,
                default: true,
            },

            taxRegimeChangeDaysOpen: {
                type: Number,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("payrollMiscSettings", payrollMiscSchema);