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
              ref:"User",
              default: null,
            },
            companyId:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"Company",
              default: null,
            },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LeaveCycleSetting", leaveCycleSchema);