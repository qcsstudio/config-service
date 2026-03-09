const mongoose = require("mongoose")

const rolePermissionSchema = new mongoose.Schema({

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    role: {
        type: String,
        required: true
    },

    permissions: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            featureId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Feature"
            },

            permission: {
                type: String,
                enum: ["view", "full", "deny"],
                default: "deny"
            }
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model("RolePermission", rolePermissionSchema)