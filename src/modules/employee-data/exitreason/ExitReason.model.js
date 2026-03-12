const mongoose = require("mongoose");

const ExitReasonSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
    },
     companyId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    exitType: {
      type: String,
      // enum: ["resignation", "termination"],
      required: true
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
    description: {
      type: String,
      required: true,
      trim: true
    },

    timeUsed: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    addedById: {
      type: mongoose.Types.ObjectId,
   
    },

    addedByName: {
      type: String,
      required: true
    },

    addedByImagePath: {
      type: String,
      default: null
    },

    addedDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExitReason", ExitReasonSchema);