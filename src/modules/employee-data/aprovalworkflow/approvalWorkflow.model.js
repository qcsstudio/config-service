const mongoose = require("mongoose");

/* ─────────────────────────────
   TAB 1: DEFINE WORKFLOW
─────────────────────────────*/
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


/* ─────────────────────────────
   LEVEL APPROVER
─────────────────────────────*/
const LevelApproverSchema = new mongoose.Schema(
{

  levelNumber: {
    type: Number
  },

  /* hierarchy role tags */
  hierarchyRoles: {
    type: [String],
    default: []
  },

  /* if specific employee selected */
  approverEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null
  },

  /* if hierarchy id selected */
  approverHierarchyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  /* additional employees */
  additionalEmployees: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    }],
    default: []
  }

},
{ _id: false }
);


/* ─────────────────────────────
   WORKFLOW CONFIG (HRIS / Leave etc)
─────────────────────────────*/
const SingleWorkflowSchema = new mongoose.Schema(
{

  /* Same as HRIS */
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

  /* All hands approvers */

  allHandsTags: {
    type: [String],
    default: []
  },

  allHandsEmployee: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    }],
    default: []
  },

  /* Single approver */

  approverHierarchyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  /* Level Based */

  levelApprovers: {
    type: [LevelApproverSchema],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 5,
      message: "Maximum 5 levels allowed"
    }
  },

  approvalLevels: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },

  /* Inaction Handling */

  autoHandleInaction: {
    type: Boolean,
    default: false
  },

  forwardAfterDays: {
    type: Number,
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

  /* Backup Decision */

  // backupDecisionType: {
  //   type: String,
  //   enum: [
  //     "self_approval",
  //     "backup_person"
  //   ],
  //   default: null
  // },
  self_approval:{
    type:Boolean,
    default:false
  },
  backup_person:{
     type:Boolean,
    default:false
  },

  backupEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null
  },

  /* Manager Change */
  transferToNewuser:{
  type:Boolean,
  default:false
},
transferToManagerChange:{
   type:Boolean,
  default:false
}


},
{ _id: false }
);


/* ─────────────────────────────
   ASSIGNED EMPLOYEES
─────────────────────────────*/
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


/* ─────────────────────────────
   MAIN WORKFLOW
─────────────────────────────*/
const ApprovalWorkflowSchema = new mongoose.Schema(
{

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

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

  assignedEmployeeList: {
    type: [AssignedTargetSchema],
    default: []
  }

},
{ timestamps: true }
);

module.exports = mongoose.model(
  "ApprovalWorkflow",
  ApprovalWorkflowSchema
);