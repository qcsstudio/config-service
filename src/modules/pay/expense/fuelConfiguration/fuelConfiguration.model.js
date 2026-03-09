const mongoose = require("mongoose");

// Common schema for fuel details
const fuelDetailsSchema = {
  distancePerKm: {
    type: Number,
    required: true
  },
  fuelRate: {
    type: Number,
    required: true
  },
  rateUnit: {
    type: String,
    // enum: ["per liter", "per kWh", "per KG"],
    required: true
  }
};

// Main fuel configuration schema
const fuelConfigurationSchema = new mongoose.Schema(
  {
    petrol: fuelDetailsSchema,

    diesel: fuelDetailsSchema,

    electricVehicle: fuelDetailsSchema,

    cng: fuelDetailsSchema,

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
  },
  {
    timestamps: true
  }
);

const FuelConfiguration = mongoose.model(
  "FuelConfiguration",
  fuelConfigurationSchema
);

module.exports = FuelConfiguration;