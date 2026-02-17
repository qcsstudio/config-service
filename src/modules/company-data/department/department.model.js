const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  departmentName: {
    type: String,
  },

  // 🔹 Business Unit Relation
  isPartOfBusinessUnit: {
    type: Boolean,
    default: false
  },

  businessUnitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessUnit",
    default: null
  },

  // 🔹 Sub Department Relation
  isSubDepartment: {
    type: Boolean,
    default: false
  },

  parentDepartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },

  // 🔹 Department Head
  assignDepartmentHead: {
    type: Boolean,
    default: false
  },

  departmentHead: {
    employeeid: Number,
    employeename: String,
    // imagepath: String
  },

  // 🔹 Added By Info
  addedById: {
    type: mongoose.Schema.Types.ObjectId,
  },

  addedByName: String,
  addedByImage: String,

  // 🔹 Assigned Employees
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

      employeeid: { type: Number },
      employeename: { type: String },
      employeecode: String,
      emailid: String,
      primarymobile: String,
      designationid: Number,
      designationname: String,
      imagepath: String,
      probationperiodid: Number,
    }
  ],
  default: []   // ✅ empty array by default
}


}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);
