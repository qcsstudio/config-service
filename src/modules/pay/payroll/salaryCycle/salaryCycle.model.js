const mongoose = require("mongoose");

const salaryCycleSchema = new mongoose.Schema(
    {
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
        salaryCycle: {
            cycleName: {
                type: String,
                default: "",
            },

            // TABLE OPTIONS
            configurations: [
                {
                    selectType: {
                        type: Boolean,
                        default: false,
                    },

                    monthToMonthPayroll: {
                        type: Boolean,
                        default: false,
                    },

                    definedWorkdays: {
                        type: Boolean,
                        default: false,
                    },

                    excludeWeeklyOff: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],

            payrollCycleName: {
                type: String,
                default: "",
            },

            customizeAttendace: {
                type: Boolean,
                default: false,
            },
        },
        EarlyRunPayrollSettings: {
            currentMonth: {
                type: Boolean,
                default: false,
            },
            priorSchedules: {
                type: Number,
                default: 0, 
        },
        logs: [
            {
                Months:{
                    type:Boolean,
                    default:false
                },
                EarlyBy:{
                    type: Boolean,
                    default: false,
                },
                Schedulepayroll:{
                    type: Boolean,
                    default: false,
                }
            },
        ],
    },

        noAttendancePayroll: {
            skipAttendance: {
                type: Boolean,
                default: false,
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SalaryCycle", salaryCycleSchema);