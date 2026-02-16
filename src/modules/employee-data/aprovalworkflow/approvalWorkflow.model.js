const mongoose = require("mongoose");

const SingleWorkflowSchema = new mongoose.Schema(
  {
    workflowType: {
      type: String,
      enum: ["full_trust", "free_flow", "all_hands_in", "level_based"],
      required: true
    },

    hierarchyPositionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    autoHandleInaction: {
      type: Boolean,
      default: false
    },

    forwardAfterDays: {
      type: Number,
      default: 0
    },

    inactionAction: {
      type: String,
      enum: ["auto_approve", "auto_reject", "forward_next"],
      default: null
    },

    backupDecisionType: {
      type: String,
      enum: ["self_approval", "backup_person"],
      default: null
    },

    backupEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    transferOnManagerChange: {
      type: String,
      enum: ["transfer_all", "transfer_pending_only"],
      default: null
    }
  },
  { _id: false }
);

const ApprovalWorkflowSchema = new mongoose.Schema(
  {
    // ✅ Outside Tabs
    adminId: mongoose.Schema.Types.ObjectId,


    addedById: {
      type: mongoose.Schema.Types.ObjectId,

    },

    addedByName: {
      type: String,

    },

    addedByImagePath: {
      type: String,
    },

    addedDate: {
      type: Date,
      default: Date.now
    },

    // ✅ Tabs Section
    tabs: {
      defineWorkflow: {
        type: [SingleWorkflowSchema],
        default: []
      },
      hrisWorkflow: {
        type: [SingleWorkflowSchema],
        default: []
      },
      attendanceWorkflow: {
        type: [SingleWorkflowSchema],
        default: []
      },
      leaveWorkflow: {
        type: [SingleWorkflowSchema],
        default: []
      },
      expenseWorkflow: {
        type: [SingleWorkflowSchema],
        default: []
      },
      exitWorkflow: {
        type: [SingleWorkflowSchema],
        default: []
      }
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("ApprovalWorkflow", ApprovalWorkflowSchema);