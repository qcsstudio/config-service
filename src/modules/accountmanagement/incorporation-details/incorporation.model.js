const mongoose = require("mongoose");

const IncorporationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      unique: true, // one incorporation per company
    },

    companyAdminId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    companyLegalName: {
      type: String,
      trim: true,
      required: true,
    },

    incorporationDate: {
      type: Date,
    },

    companyType: {
      type: String,
      enum: ["Private Limited", "Public Limited", "LLP"],
    },

    cin: {
      type: String,
      trim: true,
    },

    gstin: {
      type: String,
      trim: true,
    },

    pan: {
      type: String,
      trim: true,
    },

    tan: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncorporationModel", IncorporationSchema);
