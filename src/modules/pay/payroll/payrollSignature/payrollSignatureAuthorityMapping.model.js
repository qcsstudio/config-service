const mongoose = require("mongoose");

const authorityMappingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    fallbackAuthorityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayrollSignature",
      default: null,
    },

   signingAuthorityId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PayrollSignature",
      default: null,
    },

    effectiveFrom: {
      type: Date,
      default: null,
    },

    isPaySlipEnabled: {
      type: Boolean,
      default: false,
    },

    isForm16Enabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payrollSignatureAuthorityMapping", authorityMappingSchema);