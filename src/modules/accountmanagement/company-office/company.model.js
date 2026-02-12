const mongoose = require("mongoose");

const CompanyOfficeSchema = new mongoose.Schema(
  {
    adminId: mongoose.Schema.Types.ObjectId,
    

    locationName: {
      type: String,
      trim: true,
      required: true,
    },

    addressType: {
      type: String,
      enum: ["primary", "branch", "remote"],
      required: true,
    },

    address: {
      location2dSpare: {
        type: String,
        trim: true,
      },

      addressLine1: {
        type: String,
        trim: true,
        required: true,
      },

      addressLine2: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        trim: true,
        required: true,
      },

      state: {
        type: String,
        trim: true,
        required: true,
      },

      city: {
        type: String,
        trim: true,
        required: true,
      },

      postalCode: {
        type: String,
        trim: true,
        required: true,
      },

      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [lng, lat]
          default: [0, 0],
        },
      },
    },

    geoRadius: {
      type: Number,
      default: 10,
    },

    timeZone: {
      type: String,
      default: "Asia/Kolkata",
    },

    ipAddress: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 2dsphere index
CompanyOfficeSchema.index({ "address.location": "2dsphere" });

// ✅ Force collection name = company_offices
const CompanyOfficeModel = mongoose.model(
  "CompanyOffice",       // <- Model name
  CompanyOfficeSchema,   // <- Schema
  "company_offices"      // <- Optional: specify exact collection name
);

module.exports = CompanyOfficeModel;
