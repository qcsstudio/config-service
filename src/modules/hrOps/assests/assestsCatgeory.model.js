const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        default: "",
    },

    type: {
        type: String,
        enum: ["text", "number", "date", "dropdown"],
        default: "text",
    },

    required: {
        type: Boolean,
        default: false,
    },

    multiple: {
        type: Boolean,
        default: false,
    },

    options: {
        type: [String],
        default: [],
    },
});

const assetCategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            default: "",
        },

        assetName: {
            type: String,
            default: "",
        },

        brand: {
            type: String,
            default: "",
        },

        condition: {
            type: String,
            enum: ["new", "used", "refurbished"],
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        // ✅ FIXED
        assetType: {
            type: String,
            enum: ["physical", "digital"],
            default: "physical",
        },

        acknowledgement: {
            type: Boolean,
            default: false,
        },

        warranty: {
            type: Boolean,
            default: false,
        },

        attributes: [attributeSchema],

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
        companyOfficeId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CompanyOffice",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("AssetCategory", assetCategorySchema);