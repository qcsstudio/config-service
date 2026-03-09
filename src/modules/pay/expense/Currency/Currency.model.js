const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
{
    currency: {
        type: String,
        required: true
    },
      symbol: {
    type: String
  },


    conversionRate: {
        type: Number,
        required: true
    },

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
                ref: "CompanyOffice"
            }
        ],
        default: []
    },

    updatedAt: {
        type: Date,
        default: null
    }

},
{
    timestamps: { createdAt: true, updatedAt: false }
}
);

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;