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

        // Unpaidleavessss
        unpaidLeaveName: { type: String, default: "" },
        //                 Usage Policy
        // Let's configure the leave usage limits
        leaveUsageLimit: {
            type: String,
            default: ""
        },
        leaveMaximumDays: {
            type: Number,
            default: 0
        },
        maximumLeaves: {
            type: Number,
            default: 0
        },

        // Would you like to allow half-day leave applications?
        halfDayLeave: {
            type: Boolean, default: false
        },
        //    Do you want to limit leave applications for future dates?

        leaveApplications: {
            type: Boolean,
            default: false
        },
        leaveduration: {
            type: Number,
            default: 0,
        },
        Employee: {
            type: Number,
            default: 0,
        },
        earlier: {
            type: Number,
            default: 0,
        },
        // Do you want to allow leave application for past dates?
        leaveApplication: {
            type: Boolean,
            default: false
        },
        leaveApplicationDays: {
            type: Number,
            default: 0,
        },
        //                 Sandwiched/Intervening Leaves
        // If leaves are applied next to or in-between holidays/weekly-offs, should there be additional leave deductions?
        deductLeave: {
            type: Boolean,
            default: false
        },
        // if yes. the this fiods. required 
        deductMandatory: {
            BetweenLeaves: {
                type: Boolean,
                default: false
            },
            beforeLeaves: {
                type: Boolean,
                default: false
            },
            afterLeaves: {
                type: Boolean,
                default: false
            }
        },
        deductOptional: {
            BetweenLeaves: {
                type: Boolean,
                default: false
            },
            beforeLeaves: {
                type: Boolean,
                default: false
            },
            afterLeaves: {
                type: Boolean,
                default: false
            },

        },
        deductWeekly: {
            BetweenLeaves: {
                type: Boolean,
                default: false
            },
            beforeLeaves: {
                type: Boolean,
                default: false
            },
            afterLeaves: {
                type: Boolean,
                default: false
            },
        },

        //                 Leave Clubbing
        // Allow employees to apply for different types of leaves, adjacent to each other
        LeavesClubbing: {
            type: Boolean,
            default: false
        },
        typeleaves: {
            type: Number,
            default: 0
        },

        // ===============================
        // HOURLY LEAVE  (s3)

        hourlyLeave: [
            {
                hourlyleaveName: { type: String, default: "" },
                // hourlyName: { type: String, default: "" },
                maxHours: { type: Number, default: 0 },
                employmentType: { type: String, default: "" },


                //How will the leave balance be calculated?
                prorateFromJoiningDate: { type: Boolean, default: false },
                joinMonthCalc: { type: Boolean, default: true },
                halfMonthCalc: { type: Boolean, default: true },
                joinAfterDays: { type: Number, default: 0 },
                proratefromPrabationEndDate: { type: Boolean, default: false },
                includeExtend: { type: Boolean, default: false },
                calcLeaveEndMonth: { type: Boolean, default: false },
                calcHalfLeaves: { type: Boolean, default: false },
                endMonthDays: { type: Number, default: 0 },
                doNotprobationRate: { type: Boolean, default: false },

                donotProRate: {
                    donotSelectRate: { type: Number, default: 0 },
                    donotDays: { type: Number, default: 0 },
                    donotMonths: { type: String, default: "" },
                    elseEmployee: {
                        type: String, default: ""
                    },
                },

                //When will the leave balance be available?
                leaveBalanceStartMonth: { type: Boolean, default: false },
                leaveBalanceCred: { type: Boolean, default: false },  // "monthly" | "annual"
                //  Carry Forward
                carryUnsendLeaves: { type: Boolean, default: false },
                carryForward: { type: Boolean, default: false },  // true = carry
                minHoursPerDay: { type: Number, default: 0 },
                leaveHours: { type: Number, default: 0 },

                // Approval Workflow. 
                //How do you want to process an application of Hourly Leave?
                leaveApproval: { type: Boolean, default: false },  // false = bypass
                leaveBypass: { type: Boolean, default: false },
                AutoApprove: { type: Boolean, default: false },
            }
        ],
        ////////////
        // MEdical leave 

        medicalLeave: [
            {
                MedicalleaveName: { type: String, default: "" },

                // Leave Allocation
                // How do you want to define annual allotment of leave balance?
                automaticallyLeaveBalance: {
                    type: Boolean, default: false
                },
                Days: {
                    type: Number
                },
                manuallyLeaveBalance: {
                    type: Boolean, default: false
                },

                // Who, How & When (Calculations & Disbursal)
                // Who can avail this leave balance?
                gender: {
                    type: String,
                    default: ""
                },
                employmentType: {
                    type: String,
                    default: ""
                },
                maritalStatus: {
                    type: String,
                    default: ""
                },
                //How will the leave balance be calculated?
                prorateFromJoiningDate: { type: Boolean, default: false },
                joinMonthCalc: { type: Boolean, default: true },
                halfMonthCalc: { type: Boolean, default: true },
                joinAfterDays: { type: Number, default: 0 },
                proratefromPrabationEndDate: { type: Boolean, default: false },
                includeExtend: { type: Boolean, default: false },
                calcLeaveEndMonth: { type: Boolean, default: false },
                calcHalfLeaves: { type: Boolean, default: false },
                endMonthDays: { type: Number, default: 0 },
                doNotprobationRate: { type: Boolean, default: false },

                donotProRate: {
                    donotSelectRate: { type: Number, default: 0 },
                    donotDays: { type: Number, default: 0 },
                    donotMonths: { type: String, default: "" },
                    elseEmployee: {
                        type: String, default: ""
                    },
                },
                // When will the leave balance be available?
                leaveBalanceAccured: {
                    type: Boolean,
                    default: false
                },
                leaveBalanceCredit: {
                    type: Boolean,
                    default: false
                },

                // Do you want to limit credit during probation?
                creditDuring: {
                    type: Boolean,
                    default: false
                },
                creditDays: {
                    type: Number,
                    default: 0
                },

                // Usage Policy
                // Do you want to keep attachments compulsory for this leave?

                compulsoryLeave: {
                    type: Boolean,
                    default: false
                },
                documentRequiredLeaveDays: {
                    type: Number,
                    default: 0,
                },
                descriptionEmployee: {
                    type: String,
                    default: ""
                },

                //                 During Probation

                // Allow only a maximum of days leave in a probation month
                MaximumDays: {
                    type: Number,
                    default: 0,
                },

                // Allow accumulation of balance in probation period
                accumaltionBalance: {
                    type: Boolean,
                    default: false
                },
                // Do you want to allow employees to apply this leave during probation?
                employeesProbation: {
                    type: Boolean,
                    default: false
                },
                // After Confirmation
                period: {
                    type: String,
                    default: ""
                },
                maximumLeaves: {
                    type: Number,
                    default: 0,
                },
                consecutiveLeaves: {
                    type: Number,
                    default: 0,
                },
                // Would you like to allow half-day leave applications?
                halfDay: {
                    type: Boolean,
                    default: false
                },
                // Do you want to limit leave applications for future dates?/
                leaveApplications: {
                    type: Boolean,
                    default: false
                },
                leaveduration: {
                    type: Number,
                    default: 0,
                },
                Employee: {
                    type: Number,
                    default: 0,
                },
                earlier: {
                    type: Number,
                    default: 0,
                },
                // Do you want to allow leave application for past dates?
                leaveApplication: {
                    type: Boolean,
                    default: false
                },
                leaveApplicationDays: {
                    type: Number,
                    default: 0,
                },
                //                 Sandwiched/Intervening Leaves
                // If leaves are applied next to or in-between holidays/weekly-offs, should there be additional leave deductions?
                deductLeave: {
                    type: Boolean,
                    default: false
                },
                // if yes. the this fiods. required 
                deductMandatory: {
                    BetweenLeaves: {
                        type: Boolean,
                        default: false
                    },
                    beforeLeaves: {
                        type: Boolean,
                        default: false
                    },
                    afterLeaves: {
                        type: Boolean,
                        default: false
                    }
                },
                deductOptional: {
                    BetweenLeaves: {
                        type: Boolean,
                        default: false
                    },
                    beforeLeaves: {
                        type: Boolean,
                        default: false
                    },
                    afterLeaves: {
                        type: Boolean,
                        default: false
                    },

                },
                deductWeekly: {
                    BetweenLeaves: {
                        type: Boolean,
                        default: false
                    },
                    beforeLeaves: {
                        type: Boolean,
                        default: false
                    },
                    afterLeaves: {
                        type: Boolean,
                        default: false
                    },
                },

                //                 Carry Forward & Encashment
                // What do we do about unused leave balance, at the end of a leave cycle/year?
                balanceLapse: {
                    type: Boolean,
                    default: false
                },
                carryForward: {
                    carrySelect: {
                        type: String,
                        default: ""
                    },
                    UnusedLeaves: {
                        type: Number,
                        default: 0
                    }
                },
                enCash: {
                    carrySelect: {
                        type: String,
                        default: ""
                    },
                    UnusedLeaves: {
                        type: Number,
                        default: 0
                    }
                },
                //                 Gift A Leave
                // How about allowing employees to "Gift" their leave balance to colleagues?
                employeeGift: {
                    type: Boolean,
                    default: false
                },
                giftPerYear: {
                    type: Number,
                    default: 0
                },
                receivedGiftLeaves: {
                    type: Boolean,
                    default: false
                }

            }
        ],

        customLeave: [
             {
                customleaveName: { type: String, default: "" },

                // Leave Allocation
                // How do you want to define annual allotment of leave balance?
                automaticallyLeaveBalance: {
                    type: Boolean, default: false
                },
                Days: {
                    type: Number
                },
                manuallyLeaveBalance: {
                    type: Boolean, default: false
                },

                // Who, How & When (Calculations & Disbursal)
                // Who can avail this leave balance?
                gender: {
                    type: String,
                    default: ""
                },
                employmentType: {
                    type: String,
                    default: ""
                },
                maritalStatus: {
                    type: String,
                    default: ""
                },
                //How will the leave balance be calculated?
                prorateFromJoiningDate: { type: Boolean, default: false },
                joinMonthCalc: { type: Boolean, default: true },
                halfMonthCalc: { type: Boolean, default: true },
                joinAfterDays: { type: Number, default: 0 },
                proratefromPrabationEndDate: { type: Boolean, default: false },
                includeExtend: { type: Boolean, default: false },
                calcLeaveEndMonth: { type: Boolean, default: false },
                calcHalfLeaves: { type: Boolean, default: false },
                endMonthDays: { type: Number, default: 0 },
                doNotprobationRate: { type: Boolean, default: false },

                donotProRate: {
                    donotSelectRate: { type: Number, default: 0 },
                    donotDays: { type: Number, default: 0 },
                    donotMonths: { type: String, default: "" },
                    elseEmployee: {
                        type: String, default: ""
                    },
                },
                // When will the leave balance be available?
                leaveBalanceAccured: {
                    type: Boolean,
                    default: false
                },
                leaveBalanceCredit: {
                    type: Boolean,
                    default: false
                },

                // Do you want to limit credit during probation?
                creditDuring: {
                    type: Boolean,
                    default: false
                },
                creditDays: {
                    type: Number,
                    default: 0
                },

                // Usage Policy
                // Do you want to keep attachments compulsory for this leave?

                compulsoryLeave: {
                    type: Boolean,
                    default: false
                },
                documentRequiredLeaveDays: {
                    type: Number,
                    default: 0,
                },
                descriptionEmployee: {
                    type: String,
                    default: ""
                },

                //                 During Probation

                // Allow only a maximum of days leave in a probation month
                MaximumDays: {
                    type: Number,
                    default: 0,
                },

                // Allow accumulation of balance in probation period
                accumaltionBalance: {
                    type: Boolean,
                    default: false
                },
                // Do you want to allow employees to apply this leave during probation?
                employeesProbation: {
                    type: Boolean,
                    default: false
                },
                // After Confirmation
                period: {
                    type: String,
                    default: ""
                },
                maximumLeaves: {
                    type: Number,
                    default: 0,
                },
                consecutiveLeaves: {
                    type: Number,
                    default: 0,
                },
                // Would you like to allow half-day leave applications?
                halfDay: {
                    type: Boolean,
                    default: false
                },
                // Do you want to limit leave applications for future dates?/
                leaveApplications: {
                    type: Boolean,
                    default: false
                },
                leaveduration: {
                    type: Number,
                    default: 0,
                },
                Employee: {
                    type: Number,
                    default: 0,
                },
                earlier: {
                    type: Number,
                    default: 0,
                },
                // Do you want to allow leave application for past dates?
                leaveApplication: {
                    type: Boolean,
                    default: false
                },
                leaveApplicationDays: {
                    type: Number,
                    default: 0,
                },
                //                 Sandwiched/Intervening Leaves
                // If leaves are applied next to or in-between holidays/weekly-offs, should there be additional leave deductions?
                deductLeave: {
                    type: Boolean,
                    default: false
                },
                // if yes. the this fiods. required 
                deductMandatory: {
                    BetweenLeaves: {
                        type: Boolean,
                        default: false
                    },
                    beforeLeaves: {
                        type: Boolean,
                        default: false
                    },
                    afterLeaves: {
                        type: Boolean,
                        default: false
                    }
                },
                deductOptional: {
                    BetweenLeaves: {
                        type: Boolean,
                        default: false
                    },
                    beforeLeaves: {
                        type: Boolean,
                        default: false
                    },
                    afterLeaves: {
                        type: Boolean,
                        default: false
                    },

                },
                deductWeekly: {
                    BetweenLeaves: {
                        type: Boolean,
                        default: false
                    },
                    beforeLeaves: {
                        type: Boolean,
                        default: false
                    },
                    afterLeaves: {
                        type: Boolean,
                        default: false
                    },
                },

                //                 Carry Forward & Encashment
                // What do we do about unused leave balance, at the end of a leave cycle/year?
                balanceLapse: {
                    type: Boolean,
                    default: false
                },
                carryForward: {
                    carrySelect: {
                        type: String,
                        default: ""
                    },
                    UnusedLeaves: {
                        type: Number,
                        default: 0
                    }
                },
                enCash: {
                    carrySelect: {
                        type: String,
                        default: ""
                    },
                    UnusedLeaves: {
                        type: Number,
                        default: 0
                    }
                },
                //                 Gift A Leave
                // How about allowing employees to "Gift" their leave balance to colleagues?
                employeeGift: {
                    type: Boolean,
                    default: false
                },
                giftPerYear: {
                    type: Number,
                    default: 0
                },
                receivedGiftLeaves: {
                    type: Boolean,
                    default: false
                }

            }
        ],
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
        isDeleted:{
            type:Boolean,
            default:false
        },
          deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LeavePolicy", LeavePolicySchema);