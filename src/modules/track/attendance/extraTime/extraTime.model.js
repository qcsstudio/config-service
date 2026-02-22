const mongoose = require("mongoose");
const { Schema } = mongoose;

// ─────────────────────────────────────────────
// STEP 2 — WORKING DAY BENEFITS
// ─────────────────────────────────────────────
const WorkingDayBenefitSchema = new Schema(
  {
    benefitEnabled: {
      type: Boolean,
      default: false,
    },

    earnType: {
      type: String,
    //   enum: ["hours", "each-hour", null],
      default: null,
    },

    // When earnType = "hours"
    minimumHoursRequired: {
      type: Number,
      min: 0,
      default: null,
    },

    leavesEarnedPerCycle: {
      type: Number,
      min: 0,
      default: null,
    },

    canAccumulateHours: {
      type: Boolean,
      default: false,
    },

    accumulationOverMonths: {
      type: Number,
      min: 0,
      default: null,
    },

    compOffLimitPerDay: {
      type: Number,
      min: 0,
      default: null,
    },

    // When earnType = "each-hour"
    leavesPerHourOfOT: {
      type: Number,
      min: 0,
      default: null,
    },

    compOffLimitPerDayEachHour: {
      type: Number,
      min: 0,
      default: null,
    },

    // Minimum threshold
    minimumThresholdEnabled: {
      type: Boolean,
      default: false,
    },

    minimumThresholdMinutes: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// STEP 3 — NON-WORKING DAY BENEFITS
// ─────────────────────────────────────────────
const NonWorkingDayBenefitSchema = new Schema(
  {
    benefitEnabled: {
      type: Boolean,
      default: false,
    },

    earnType: {
      type: String,
      enum: ["both", "each-hour", null],
      default: null,
    },

    // When earnType = "both"
    minimumHoursRequired: {
      type: Number,
      min: 0,
      default: null,
    },

    leavesEarnedPerCycle: {
      type: Number,
      min: 0,
      default: null,
    },

    canAccumulateHours: {
      type: Boolean,
      default: false,
    },

    accumulationOverMonths: {
      type: Number,
      min: 0,
      default: null,
    },

    compOffLimitPerDay: {
      type: Number,
      min: 0,
      default: null,
    },

    // When earnType = "each-hour"
    leavesPerHourOfOT: {
      type: Number,
      min: 0,
      default: null,
    },

    compOffLimitPerDayEachHour: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// STEP 4 — EXTRA TIME POLICY SETTINGS
// ─────────────────────────────────────────────
const ExtraTimePolicySettingsSchema = new Schema(
  {
    approvalRequired: {
      type: Boolean,
      default: false,
    },

    creditApprovalRequired: {
      type: Boolean,
      default: false,
    },

    unusedBalanceHandling: {
      type: String,
    //   enum: ["lapse", "retain", "leave-cycle"],
      default: "lapse",
    },

    lapseDays: {
      type: Number,
      min: 0,
      default: null,
    },

    attachmentsRequired: {
      type: Boolean,
      default: false,
    },

    attachmentRequiredIfDaysGreaterThan: {
      type: Number,
      min: 0,
      default: null,
    },

    attachmentInstructions: {
      type: String,
      trim: true,
      default: "",
    },

    allowPastDateApplications: {
      type: Boolean,
      default: false,
    },

    pastDateApplicationDaysLimit: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────
// ASSIGNED EMPLOYEE SUBDOCUMENT
// ─────────────────────────────────────────────
const AssignedEmployeeSchema = new Schema(
   {
      employeeId: {
        type: mongoose.Types.ObjectId,
        ref: "employees",
        default:null
      },
      departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null,
      },
      designationid: { type: mongoose.Types.ObjectId, ref: "Designation",default:null },
    },
  { _id: false }
);

// ─────────────────────────────────────────────
// ROOT — EXTRA TIME POLICY
// ─────────────────────────────────────────────
const ExtraTimeSchema = new Schema(
  {
    policyName: {
      type: String,
      required: [true, "Extra time name is required"],
      trim: true,
      maxlength: [200, "Name must be under 200 characters"],
    },

    policyDescription: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must be under 2000 characters"],
      default: "",
    },

    workingDayBenefits: {
      type: WorkingDayBenefitSchema,
      default: () => ({}),
    },

    nonWorkingDayBenefits: {
      type: NonWorkingDayBenefitSchema,
      default: () => ({}),
    },

    extraTimePolicy: {
      type: ExtraTimePolicySettingsSchema,
      default: () => ({}),
    },

    addedByName: {
      type: String,
      default: "",
    },

    addedByImage: {
      type: String,
      default: "",
    },

    assignedEmployeeList: {
      type: [AssignedEmployeeSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },

    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        default:null
      },
         companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"companies",
         default:null
      },

    updatedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─────────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────────
ExtraTimeSchema.index({ policyName: 1 }, { unique: true });
ExtraTimeSchema.index({ status: 1 });
ExtraTimeSchema.index({ createdAt: -1 });

// ─────────────────────────────────────────────
// MODEL EXPORT
// ─────────────────────────────────────────────
const ExtraTime = mongoose.model("ExtraTime", ExtraTimeSchema);

module.exports = ExtraTime;