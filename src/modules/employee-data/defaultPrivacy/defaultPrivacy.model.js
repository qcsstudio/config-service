const mongoose = require("mongoose");

const visibilityEnum = [
  "Self-Admin",
  "team",
  "department",
  "employeedecide",
  ""
];

const defaultPrivacySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    permissions: {
      personalData: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      about: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      address: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      contact: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      biodata: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      importantDates: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      dependents: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      medical: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      identity: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      banking: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      skills: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      language: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      workExperienceDetails: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      educationDetails: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
      documents: {
        type: String,
        enum: visibilityEnum,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DefaultPrivacy", defaultPrivacySchema);