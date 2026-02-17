const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

  // 🔹 Admin Owner
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  // 🔹 Team Name
  teamName: {
    type: String,
  },

  // 🔹 Assign Team Lead? (From Image)
  assignTeamLead: {
    type: Boolean,
    default: false
  },

  // 🔹 Team Lead Info (If Yes Selected)
  teamLead: {
    employeeid: {
      type: Number,
      default: null
    },
    employeename: {
      type: String,
      default: ""
    },
    employeecode: String,
    emailid: String,
    primarymobile: String,
  },

  // 🔹 Added By Info
  addedById: {
    type: mongoose.Schema.Types.ObjectId,
  },

  addedByName: {
    type: String
  },

  addedByImage: {
    type: String
  },

  // 🔹 Assigned Employees List
  assignedEmployeeList: {
    type: [
      {
        departmentId: {
          type: mongoose.Schema.Types.ObjectId,
          default: null
        },

        departmentName: {
          type: String,
          default: ""
        },

        employeeid: Number,
        employeename: String,
        employeecode: String,
        emailid: String,
        primarymobile: String,
        designationid: Number,
        designationname: String,
        imagepath: String,
        probationperiodid: Number,
      }
    ],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
