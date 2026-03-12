const mongoose = require("mongoose");
const businessUnitSchema = new mongoose.Schema({

    adminId: {
       type: mongoose.Schema.Types.ObjectId,
       ref:"User",
       default: null,
     },
     companyId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Company",
       default: null,
     },

    businessUnitName: {
        type: String,
        default:""
    },
      locationName: {
    type: String,
     default:""
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

    location: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: {
            type: [Number], // [lng, lat]
            default: [0, 0],
        },
    },

    logo: {
        type: String ,
         default:""  // store image path or URL
    },

    assignBusinessHead: {
        type: Boolean,
        default: false
    },

    businessHead: {
      type:String,
       default:""
        // imagepath: String
    },
    

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
        // designationid: { type: mongoose.Types.ObjectId, ref: "Designation",default:null },
      },
    ],
    default: [] // ✅ empty by default
  }

}, { timestamps: true });

module.exports = mongoose.model("BusinessUnit", businessUnitSchema);
