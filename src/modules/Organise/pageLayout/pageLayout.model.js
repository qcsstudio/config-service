const mongoose = require("mongoose");

const pageLayoutSchema = new mongoose.Schema(
{
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null,
  },

  headerImage: {
    url: {
      type: String,
    },
    fileName: String,
    fileSize: Number,
    fileType: {
      type: String,
      enum: ["png", "jpeg", "jpg", "svg"]
    }
  },

  footerImage: {
    url: {
      type: String,
    },
    fileName: String,
    fileSize: Number,
    fileType: {
      type: String,
      enum: ["png", "jpeg", "jpg", "svg"]
    }
  },

  previewEnabled: {
    type: Boolean,
    default: false
  },

  pageMargins: {
    type: {
      type: String,
      enum: ["narrow", "moderate", "wide"],
      default: "moderate"},

    top: {
      type: Number,
      default: 0
    },

    bottom: {
      type: Number,
      default: 0
    },

    left: {
      type: Number,
      default: 0
      
    },

    right: {
      type: Number,
      default: 0
    }
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("PageLayout", pageLayoutSchema);