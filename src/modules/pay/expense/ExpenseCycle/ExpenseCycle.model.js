const mongoose = require("mongoose");

const expenseCycleSchema = new mongoose.Schema(
  {
    // 🔹 Admin & Company Info
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

    companyOfficeId: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CompanyOffice",
        },
      ],
      default: [],
    },

    // 🔹 Expense Cycle Fields
    endDate: {
      type: Number,default:"" // e.g. 30 or 31 (day of month)
    },

    processingDate: {
      type: Number, 
      default:""// e.g. 5 (5th day of next month)
    },

    transitionPeriod: {
      type: Number, // number of days employees can submit previous expenses
      default: 0,
    },

    // 🔹 Status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExpenseCycle", expenseCycleSchema);