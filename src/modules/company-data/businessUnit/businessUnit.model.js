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
        employeeid: Number,
        employeename: String,
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
        departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        default:null
      },

      departmentName: {
        type: String,
      },
        employeeid: { type:Number},
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
    default: [] // ✅ empty by default
  }

}, { timestamps: true });

module.exports = mongoose.model("BusinessUnit", businessUnitSchema);
