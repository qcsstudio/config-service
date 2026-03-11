const mongoose = require("mongoose");

const salaryStructureSchema = new mongoose.Schema(
    {
        // ==========================================
        // 🔹 COMMON FIELDS
        // ==========================================
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

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        // ==========================================
        // 🔹 INCOME COMPONENTS (Step 2 & 3)
        // ==========================================
        incomeComponents: [
            {
                componentId: {
                    type: mongoose.Types.ObjectId,
                    ref: "PayrollComponent",
                    default: null // "basic-pay", "hra", etc (from frontend)
                    //   required: true,
                },

                componentName: {
                    type: String,
                    default: ""
                },

                design: {
                    mode: {
                        type: String,
                        enum: ["Formula", "Fixed"],
                        default: "",
                    },

                    formulaValue: {
                        type: String, // "40% of Basic Pay", etc
                        default: "",
                    },

                    fixedAmount: {
                        type: Number,
                        default: 0,
                    },
                    annualProration: {
                        type: Number, // 16874
                        default: 0,
                    },

                    monthlyProration: {
                        type: Number, // 1406
                        default: 0,
                    },

                },
            },
        ],

        // ==========================================
        // 🔹 DEDUCTION COMPONENTS (Step 4 & 5)
        // ==========================================
        deductionComponents: [
            {
                componentId: {
                    type: mongoose.Types.ObjectId,
                    ref: "PayrollComponent",
                    default: null // "basic-pay", "hra", etc (from frontend)
                    //   required: true,
                },

                componentName: {
                    type: String,
                    default: ""
                    //   required: true,
                },

                design: {
                    mode: {
                        type: String,
                        enum: ["Formula", "Fixed"],
                        default: "",
                    },

                    formulaValue: {
                        type: String,
                        default: "",
                    },

                    fixedAmount: {
                        type: Number,
                        default: 0,
                    },
                    annualProration: {
                        type: Number, // 16874
                        default: 0,
                    },

                    monthlyProration: {
                        type: Number, // 1406
                        default: 0,
                    },

                },
            },
        ],

        // ==========================================
        // 🔹 LOP & ARREARS (Step 6)
        // ==========================================
        lopConfigurations:
        {
            componentName: {
                type: String,
                default: "",
                //   required: true,
            },

            lossOfPay: {
                type: Boolean,
                default: false,
            },

            lopArrears: {
                type: Boolean,
                default: false,
            },

            salaryArrears: {
                type: Boolean,
                default: false,
            },

            newJoinee: {
                type: Boolean,
                default: false,
            },

            fnf: {
                type: Boolean,
                default: false,
            },

        },


        // ==========================================
        // 🔹 TRIAL RUN (Step 7)
        // ==========================================
        trialRun: {

            type: Number,
            default: 0,

        },

        // ==========================================
        // 🔹 ASSIGNED EMPLOYEES
        // ==========================================
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
        updatedBy: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            default: [],
        },
        // ==========================================
        // 🔹 STATUS
        // ==========================================
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SalaryStructure", salaryStructureSchema);