const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  departmentName: {
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

  // 🔹 Geo Location (For Map / Nearby Search)
  

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

  parentDepartmentName: {
    type:String,
    default: null
  },

  // 🔹 Department Head
  assignDepartmentHead: {
    type: Boolean,
    default: false
  },
departmentheadId:{
  type:mongoose.Types.ObjectId,
  default:null
},
 departmentHead: {
    type:String,
    default: null
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
     employeeId: {
       type: mongoose.Types.ObjectId,
       ref: "employees",
       default:null
     },
    //  departmentId: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: "Department",
    //    default: null,
    //  },
    //  designationid: { type: mongoose.Types.ObjectId, ref: "Designation",default:null },
   },
  ],
  default: []   // ✅ empty array by default
}


}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);
