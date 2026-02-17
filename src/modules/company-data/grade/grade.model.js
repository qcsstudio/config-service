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

module.exports = mongoose.model("Grade", gradeSchema);
