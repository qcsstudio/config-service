const mongoose = require("mongoose");
const { Schema } = mongoose;

const LeaveTypeSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "companies",
    //   required: true,
    },
     adminId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    //   required: true,
    },

    // ───── General Types ─────
    customLeave: { type: Boolean, default: false },
    hourlyLeave: { type: Boolean, default: false },
    medicalLeave: { type: Boolean, default: false },
    unpaidLeave: { type: Boolean, default: false },

    // ───── Important Days ─────
    birthdayLeave: { type: Boolean, default: false },
    marriageAnniversaryLeave: { type: Boolean, default: false },
    spouseBirthdayLeave: { type: Boolean, default: false },

    // ───── Long Leaves ─────
    sabbaticalLeave: { type: Boolean, default: false },
    vacationLeave: { type: Boolean, default: false },

    // ───── Parental ─────
    maternityLeave: { type: Boolean, default: false },
    paternityLeave: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaveType", LeaveTypeSchema);