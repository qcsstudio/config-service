const mongoose = require("mongoose");

/* ─────────────────────────────────────────────
   TAB 1: Define Workflow
───────────────────────────────────────────── */
const DefineWorkflowSchema = new mongoose.Schema(
{
  workflowName: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: "",
    trim: true
  }
},
{ _id: false }
);


/* ─────────────────────────────────────────────
   LEVEL APPROVER (For level-based workflow)
───────────────────────────────────────────── */
const LevelApproverSchema = new mongoose.Schema(
{
  levelNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  approverHierarchyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
},
{ _id: false }
);


/* ─────────────────────────────────────────────
   SINGLE WORKFLOW CONFIG
   Used for HRIS / Attendance / Leave / Expense / Exit
───────────────────────────────────────────── */
const SingleWorkflowSchema = new mongoose.Schema(
{

  /* Same as HRIS toggle */
  sameAsHRIS: {
    type: Boolean,
    default: false
  },

  /* Workflow Type */
  workflowType: {
    type: String,
    enum: [
      "full_trust",
      "free_flow",
      "all_hands_in",
      "level_based"
    ],
    default: null
  },

  /* Approver (for free_flow & all_hands_in) */
  approverHierarchyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  /* Level-based approvals */
  levelApprovers: {
    type: [LevelApproverSchema],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 5,
      message: "Maximum 5 levels allowed"
    }
  },

  /* Number of approval levels */
  approvalLevels: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },

  /* Inaction handling */
  autoHandleInaction: {
    type: Boolean,
    default: false
  },

  forwardAfterDays: {
    type: Number,
    min: 1,
    default: null
  },

  inactionAction: {
    type: String,
    enum: [
      "auto_approve",
      "auto_reject",
      "escalate"
    ],
    default: null
  },

  /* Backup decision maker */
  backupDecisionType: {
    type: String,
    enum: [
      "self_approval",
      "backup_person"
    ],
    default: null
  },

  backupEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null
  },

  /* Manager change handling */
  transferOnManagerChange: {
    type: String,
    enum: [
      "transfer_all",
      "transfer_pending_only"
    ],
    default: null
  }

},
{ _id: false }
);


/* ─────────────────────────────────────────────
   ASSIGNED EMPLOYEE / DEPARTMENT
───────────────────────────────────────────── */
const AssignedTargetSchema = new mongoose.Schema(
{

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null
  },

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  }

},
{ _id: false }
);


/* ─────────────────────────────────────────────
   MAIN WORKFLOW SCHEMA
───────────────────────────────────────────── */
const ApprovalWorkflowSchema = new mongoose.Schema(
{

  /* Admin */
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    default: null
  },

  /* Added By */
  addedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },

  addedByName: {
    type: String
  },

  addedByImagePath: {
    type: String
  },

  addedDate: {
    type: Date,
    default: Date.now
  },

  /* Tabs */
  tabs: {

    defineWorkflow: {
      type: DefineWorkflowSchema,
      default: {}
    },

    hrisWorkflow: {
      type: SingleWorkflowSchema,
      default: {}
    },

    attendanceWorkflow: {
      type: SingleWorkflowSchema,
      default: {}
    },

    leaveWorkflow: {
      type: SingleWorkflowSchema,
      default: {}
    },

    expenseWorkflow: {
      type: SingleWorkflowSchema,
      default: {}
    },

    exitWorkflow: {
      type: SingleWorkflowSchema,
      default: {}
    }

  },

  /* Assigned Employees / Departments */
  assignedEmployeeList: {
    type: [AssignedTargetSchema],
    default: []
  }

},
{ timestamps: true }
);


/* ─────────────────────────────────────────────
   EXPORT MODEL
───────────────────────────────────────────── */
module.exports = mongoose.model(
  "ApprovalWorkflow",
  ApprovalWorkflowSchema
);