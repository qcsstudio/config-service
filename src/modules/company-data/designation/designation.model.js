const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema({

  // 🔹 Admin Owner
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  // 🔹 Designation Name
  designationName: {
    type: String,
  },

  // 🔹 Is Part Of Specific Department? (From Image)
  isPartOfDepartment: {
    type: Boolean,
    default: false
  },

  // 🔹 Department Info (Only if Yes Selected)
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },

  departmentName: {
    type: String,
    default: ""
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

module.exports = mongoose.model("Designation", designationSchema);
