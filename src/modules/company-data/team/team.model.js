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
      //  designationid: { type: mongoose.Types.ObjectId, ref: "Designation",default:null },
     },
    ],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);
