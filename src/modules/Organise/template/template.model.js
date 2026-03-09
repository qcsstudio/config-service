const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null,
        },

        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        category: {
            type: String,
            default: "",
        },

        templateName: {
            type: String,
            default: "",
        },

        letterContent: {
            type: String,
            default: "",
        },

        email: {
            subject: {
                type: String,
                default: "",
            },

            body: {
                type: String,
                default: "",
            },
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

        status: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);