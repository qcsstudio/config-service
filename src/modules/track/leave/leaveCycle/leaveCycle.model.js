const mongoose = require("mongoose");

const leaveCycleSchema = new mongoose.Schema(
    {
        pendingLeaveOption: {
            type: String,
            //   enum: ["manual", "autoApprove", "autoReject"], // future safe
            default: "manual",
            required: true,
        },

        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "companies",
            default: null
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LeaveCycleSetting", leaveCycleSchema);