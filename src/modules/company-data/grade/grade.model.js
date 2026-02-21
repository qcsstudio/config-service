const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({

  // 🔹 Admin Owner
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  // 🔹 Grade Name (From Image)
  gradeName: {
    type: String,
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

module.exports = mongoose.model("Grade", gradeSchema);
