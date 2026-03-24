const mongoose = require("mongoose");

const assignedEmployeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees",
            required: true,
        },
        assignedDate: {
            type: Date,
        },

    },
    { _id: false }
);

const compensatorConfigurationSchema = new mongoose.Schema(
    {
        assignedEmployeeList: {
            type: [assignedEmployeeSchema],
            default: [],
        },

        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null
        },
        employeeId:{
            type:mongoose.Types.ObjectId,
                ref: "employees",
        },
        businessUnitId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "BusinessUnit",
                },
            ],
            default: [],
        },

        departmentId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Department",
                },
            ],
            default: [],
        },

        locationId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CompanyOffice",
                },
            ],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "CompensatorConfiguration",
    compensatorConfigurationSchema
);