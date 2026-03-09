const mongoose = require("mongoose");

const bifurcationSchema = new mongoose.Schema(
  {
    startHours: {
      type: Number,
      default: 0,
    },
    startMin: {
      type: Number,
      default: 0,
    },
    endHours: {
      type: Number,
      default: 0,
    },
    endMin: {
      type: Number,
      default: 0,
    },
    paymentCalc: {
      type: String,
    //   enum: ["1x Basic Pay", "1.5x Basic Pay", "2x Basic Pay"],
      default: "",
    },
  },
  { _id: false }
);

const overtimeSectionSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },

    minHours: {
      type: Number,
      default: 0,
    },

    minMin: {
      type: Number,
      default: 0,
    },

    bifurcations: [bifurcationSchema],
  },
  { _id: false }
);

const overtimePaymentPolicySchema = new mongoose.Schema(
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

    policyName: {
      type: String,
      required: true,
      trim: true,
    },

    workDay: overtimeSectionSchema,

    nonWorkDay: overtimeSectionSchema,

    calcMethod: {
      type: String,
    //   enum: ["Punch Based", "Shift Based", "Manual Entry"],
      default: "",
    },

    approval: {
      type: String,
    //   enum: [
    //     "Yes, Only for Current & Future Dates",
    //     "Yes, for Past, Current & Future Dates",
    //     "No, approval is not required",
    //   ],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OvertimePaymentPolicy",
  overtimePaymentPolicySchema
);