const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({

  // Same as image
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  shiftCategory: {
    type: String,
    enum: ["one", "two", "three"],
    required: true
  },

  // ✅ shiftTimings ARRAY (inside same schema)
  shiftTimings: [
    {
      startTime: {
        type: String,
        required: true
      },

      endTime: {
        type: String,
        required: true
      },

      startOff: {
        hours: {
          type: Number,
          default: 0
        },
        minutes: {
          type: Number,
          default: 0
        }
      },

      cutOff: {
        hours: {
          type: Number,
          default: 0
        },
        minutes: {
          type: Number,
          default: 0
        }
      }
    }
  ],

  colorCode: {
    type: String,
    default: "#000000"
  },

  isActive: {
    type: Boolean,
    default: true
  },

  
   addedByName: {
      type: String,
    //   trim: true,
     default: "",
    },

    addedByImage: {
      type: String,
      default: "",
    },
    // 🔹 Assigned Employees
   assignedEmployeeList: {
    type: [
     {
        employeeId: {
          type: mongoose.Types.ObjectId,
          ref: "employees",
          default:null
        },
        departmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
          default: null,
        },
        designationid: { type: mongoose.Types.ObjectId, ref: "Designation",default:null },
      },
    ],
   }
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);
