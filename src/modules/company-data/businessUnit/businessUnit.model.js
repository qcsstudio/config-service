const mongoose = require("mongoose");
const businessUnitSchema = new mongoose.Schema({

    adminId: {
        type: mongoose.Schema.Types.ObjectId,
    },

    businessUnitName: {
        type: String,
        required: true
    },
      locationName: {
    type: String,
    required: true
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
        type: String   // store image path or URL
    },

    assignBusinessHead: {
        type: Boolean,
        default: false
    },

    businessHead: {
      type:String
        // imagepath: String
    },

    addedById: {
        type: mongoose.Schema.Types.ObjectId,
    },

    addedByName: {
        type: String
    },

    addedByImage: {
        type: String
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
