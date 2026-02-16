const mongoose = require("mongoose");

const CustomDataSectionSchema = new mongoose.Schema(
{
  // 🔹 Admin Info
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  addedbyid: {
    type: mongoose.Schema.Types.ObjectId,
  },

  addedbyname: {
    type: String,
  },

  addedbyimagepath: {
    type: String,
  },

  // 🔹 Section Info
  sectionName: {
    type: String,
    required: true,
    trim: true,
  },

  classifyUnderEmployeeIdentity: {
    type: Boolean,
    default: false,
  },

  includeMandatoryExpiryDate: {
    type: Boolean,
    default: false,
  },

  pushNotificationOnExpiry: {
    type: Boolean,
    default: false,
  },

  editRights: {
    type: String,
    enum: ["admin_only", "employee_editable", "manager_editable"],
    default: "admin_only",
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  // 🔹 Custom Fields (Structure)
  customFields: [
    {
      fieldLabel: {
        type: String,
        required: true,
        trim: true,
      },

      fieldKey: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      inputValueType: {
        type: String,
        // enum: ["text", "number", "date", "dropdown"],
        required: true,
      },

      isMandatory: {
        type: Boolean,
        default: false,
      }
    }
  ],

  // 🔥 Dynamic Key-Value Data (Preview Saved Here)
  fieldValues: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }

},
{ timestamps: true }
);

module.exports = mongoose.model(
  "CustomDataSection",
  CustomDataSectionSchema
);
