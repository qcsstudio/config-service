const mongoose = require("mongoose");

const GlobalSchema = new mongoose.Schema(
  {
    adminId:  mongoose.Schema.Types.ObjectId,
  
    subdomain: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    country: {
      name: { type: String, required: true },
      code: { type: String, required: true },
    },
    currency: {
      type: String,
      required: true,
    },
    callingCode: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    weekStart: {
      type: String,
      enum: ["Monday", "Sunday"],
      default: "Monday",
    },
    leaveCycleStartMonth: {
      type: String,
      enum: [
        "January","February","March","April","May","June","July","August","September","October","November","December"
      ],
      required: true,
    },
    financialYearStartMonth: {
      type: String,
      enum: [
        "January","February","March","April","May","June","July","August","September","October","November","December"
      ],
      required: true,
    },
    dateFormat: {
      type: String,
      enum: ["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"],
      default: "DD-MM-YYYY",
    },
    timeFormat: {
      type: String,
      enum: ["12", "24"],
      default: "24",
    },
  },
  { timestamps: true }
);

const GlobalModel = mongoose.model("GlobalModel", GlobalSchema);

module.exports = GlobalModel;
