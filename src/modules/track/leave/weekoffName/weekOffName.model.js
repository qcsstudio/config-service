const mongoose = require("mongoose");
const { Schema } = mongoose;

const DAY_STATUS = ["off", "half", "full"];

const WeeklyOffSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        grid: {
            type: [
                [
                    {
                        type: String,
                        enum: DAY_STATUS,
                        default: "off",
                    },
                ],
            ],
            validate: {
                validator: function (val) {
                    return val.length === 5 && val.every((week) => week.length === 7);
                },
                message: "Grid must contain 5 weeks and 7 days per week",
            },
            //   required: true,
        },

        specifyLastWeek: {
            type: Boolean,
            default: false,
        },

        lastWeekRow: {
            type: [
                {
                    type: String,
                    enum: DAY_STATUS,
                    default: "off",
                },
            ],
            validate: {
                validator: function (val) {
                    if (!this.specifyLastWeek) return true;
                    return val.length === 7;
                },
                message: "Last week must contain 7 days",
            },
            default: undefined,
        },

        accumulation: {
            type: Boolean,
            default: false,
        },

        accType: {
            type: String,
            //   enum: ["unlimited", "limited"],
            default: null,
        },

        refreshAcc: {
            type: Boolean,
            default: null,
        },

        refreshType: {
            type: String,
            //   enum: ["monthly", "yearly"],
            default: null,
        },

        limitCount: {
            type: Number,
            default: null,
            min: 0,
        },

        isDraft: {
            type: Boolean,
            default: false,
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
    { timestamps: true }
);

module.exports = mongoose.model("WeeklyOff", WeeklyOffSchema);