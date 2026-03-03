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
   companyOfficeId: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyOffice"
      }
    ],
    default: []   // empty array
  },

  // 🔹 Assign Team Lead? (From Image)
  assignTeamLead: {
    type: Boolean,
    default: false
  },

  // 🔹 Team Lead Info (If Yes Selected)
  teamLeadId: {
    type: mongoose.Schema.Types.ObjectId,
     ref: "employees",
     default:null
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
