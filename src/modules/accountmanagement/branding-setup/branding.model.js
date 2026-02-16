const mongoose = require("mongoose");

const BrandingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    // index: true,
    // unique: true
  },

  adminId: mongoose.Schema.Types.ObjectId,

  brandLogo: String,
  loginCoverImage: String,
  welcomeTitle: String,
  welcomeMessage: String,
}, { timestamps: true });


const BrandingModel = mongoose.model("BrandingModel", BrandingSchema);

module.exports = BrandingModel;
