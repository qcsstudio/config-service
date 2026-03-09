const mongoose = require("mongoose");

const travelSettingsSchema = new mongoose.Schema({
    trainClass: [String],
    busClass: [String],
    airClass: [String]
});

const vehicleSettingsSchema = new mongoose.Schema({
    fuelType: [
        {
            type: String,
            enum: ["Diesel", "Petrol", "Electricity", "CNG"]
        }
    ],
    consumptionType: [
        {
            type: String,
            enum: ["Volume", "Distance"]
        }

    ]


});

const advanceSettingsSchema = new mongoose.Schema({
    advancePayment: Boolean,
    maxWithoutReceipt: Number,
    advanceRequest: Boolean,
    maxAdvance: Number,
    lowerLimit: Number
});
const assignedEmployeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees",
            required: true,
        },


    },
    { _id: false }
);

const expensePolicySchema = new mongoose.Schema(
    {
        policyName: {
            type: String,
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
        assignedEmployeeList: {
            type: [assignedEmployeeSchema],
            default: [],
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

        description: String,

        monthlyLimit: Number,

        categories: {
            allowance: Boolean,
            travel: Boolean,
            personalVehicle: Boolean,
            stay: Boolean,
            skillDevelopment: Boolean,
            mealsEntertainment: Boolean,
            utilities: Boolean,
            officeExpenses: Boolean,
            commute: Boolean
        },

        limits: {
            allowance: { limit: Number, amount: Number },
            travel: { limit: Number, amount: Number },
            personalVehicle: { limit: Number, amount: Number },
            stay: { limit: Number, amount: Number },
            skillDevelopment: { limit: Number, amount: Number },
            mealsEntertainment: { limit: Number, amount: Number },
            utilities: { limit: Number, amount: Number },
            officeExpenses: { limit: Number, amount: Number },
            commute: { limit: Number, amount: Number }
        },

        travelSettings: travelSettingsSchema,

        vehicleSettings: vehicleSettingsSchema,

        advanceSettings: advanceSettingsSchema,
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ExpensePolicy", expensePolicySchema);