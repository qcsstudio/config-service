const mongoose = require("mongoose");

const CommonAccessSchema = new mongoose.Schema(
{
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  whosInToday: {
    department: {
      enabled: { type: Boolean, default: false },        
      showClockInTime: { type: Boolean, default: false } 
    },
    organization: {
      enabled: { type: Boolean, default: false },        
      showClockInTime: { type: Boolean, default: false } 
    }
  },

  calendarDataLevel: {
    department: { type: Boolean, default: false },
    organization: { type: Boolean, default: false }
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("CommonAccess", CommonAccessSchema);
