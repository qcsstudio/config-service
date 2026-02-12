const mongoose = require("mongoose");

const BrandingSchema = new mongoose.Schema(
  {
    adminId: mongoose.Schema.Types.ObjectId,

    brandLogo: {
      type: String,
      default: "",
    },
    loginCoverImage: {
      type: String,
      default: "",
    },
    welcomeTitle: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    welcomeMessage: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true }
);

const BrandingModel = mongoose.model("BrandingModel", BrandingSchema);

module.exports = BrandingModel;
