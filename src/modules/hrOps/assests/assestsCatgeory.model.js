const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        default: ""
    },

    type: {
        type: String,
        enum: ["text", "number", "date", "dropdown"],
        default: ""
    },

    required: {
        type: Boolean,
        default: false,
    },

    multiple: {
        type: Boolean,
        default: false,
    },

    options: [
        {
            type: String,
            default: ""
        }
    ]

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
        },

        condition: {
            type: String,
            enum: ["new", "used", "refurbished"],
            default: "",
        },

        description: {
            type: String,
        },

        assetType: {
            phisycal: {
                type: Boolean,
                default: false,
            },
            digital: {
                type: Boolean,
                default: false,
            },
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
        companyOfficeId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CompanyOffice"
                }
            ],
            default: []
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("AssetCategory", assetCategorySchema);