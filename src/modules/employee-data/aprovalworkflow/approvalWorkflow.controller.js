const ApprovalWorkflow = require("./approvalWorkflow.model");
const populateEmployeeDetails = require("../../company-data/populateEmployees");


exports.createOrUpdateWorkflow = async (req, res) => {
  try {

    const { tabName, workflowId } = req.query;
    const workflowData = req.body;

    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!tabName) {
      return res.status(400).json({
        message: "tabName is required"
      });
    }

    const allowedTabs = [
      "defineWorkflow",
      "hrisWorkflow",
      "attendanceWorkflow",
      "leaveWorkflow",
      "expenseWorkflow",
      "exitWorkflow"
    ];

    if (!allowedTabs.includes(tabName)) {
      return res.status(400).json({
        message: "Invalid tab name"
      });
    }

    let workflowDoc;

    /* FIND EXISTING WORKFLOW */

    if (workflowId) {

      workflowDoc = await ApprovalWorkflow.findOne({
        _id: workflowId,
        adminId,
        companyId
      });

      if (!workflowDoc) {
        return res.status(404).json({
          message: "Workflow not found"
        });
      }

    } else {

      workflowDoc = await ApprovalWorkflow.findOne({
        adminId,
        companyId
      });

    }

    /* CREATE NEW WORKFLOW */

    if (!workflowDoc) {

      workflowDoc = new ApprovalWorkflow({
        adminId,
        companyId,

        addedById: req.user.userId,
        addedByName: req.user.name,
        addedByImagePath: req.user.image || null,

        tabs: {
          [tabName]: workflowData
        }
      });

    }

    /* UPDATE EXISTING TAB */

    else {

      workflowDoc.tabs = {
        ...workflowDoc.tabs,
        [tabName]: {
          ...workflowDoc.tabs[tabName],
          ...workflowData
        }
      };

    }

    await workflowDoc.save();

    /* POPULATE DATA */

    const populatedData = await ApprovalWorkflow
      .findById(workflowDoc._id)

      .populate("tabs.hrisWorkflow.approverHierarchyId")
      .populate("tabs.attendanceWorkflow.approverHierarchyId")
      .populate("tabs.leaveWorkflow.approverHierarchyId")
      .populate("tabs.expenseWorkflow.approverHierarchyId")
      .populate("tabs.exitWorkflow.approverHierarchyId")

      .populate("tabs.hrisWorkflow.allHandsEmployee")
      .populate("tabs.attendanceWorkflow.allHandsEmployee")
      .populate("tabs.leaveWorkflow.allHandsEmployee")
      .populate("tabs.expenseWorkflow.allHandsEmployee")
      .populate("tabs.exitWorkflow.allHandsEmployee")

      .populate("tabs.leaveWorkflow.levelApprovers.approverHierarchyId")
      .populate("tabs.exitWorkflow.levelApprovers.approverHierarchyId")

      .populate("tabs.hrisWorkflow.backupEmployeeId")
      .populate("tabs.leaveWorkflow.backupEmployeeId")

      .populate("assignedEmployeeList.employeeId")
      .populate("assignedEmployeeList.departmentId");

    return res.status(200).json({
      message: "Workflow saved successfully",
      data: populatedData
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

// {
//   "adminId": "665a1e4f9b2c123456789001",
//   "companyId": "665a1e4f9b2c123456789002",

//   "addedById": "665a1e4f9b2c123456789003",
//   "addedByName": "John Admin",
//   "addedByImagePath": "/uploads/admin/profile.png",

//   "tabs": {

//     "defineWorkflow": {
//       "workflowName": "Employee Leave Approval",
//       "description": "Workflow for managing leave approvals across departments"
//     },

//     "hrisWorkflow": {
//       "workflowType": "full_trust",
//       "approvalLevels": 1,
//       "autoHandleInaction": false,
//       "transferOnManagerChange": "transfer_pending_only"
//     },

//     "attendanceWorkflow": {
//       "sameAsHRIS": true,
//       "workflowType": "free_flow",
//       "approverHierarchyId": "665a1e4f9b2c123456789010",

//       "autoHandleInaction": true,
//       "forwardAfterDays": 3,
//       "inactionAction": "auto_approve",

//       "backupDecisionType": "backup_person",
//       "backupEmployeeId": "665a1e4f9b2c123456789011",

//       "transferOnManagerChange": "transfer_all"
//     },

//     "leaveWorkflow": {
//       "sameAsHRIS": false,
//       "workflowType": "level_based",

//       "approvalLevels": 2,
//       "levelApprovers": [
//         {
//           "levelNumber": 1,
//           "approverHierarchyId": "665a1e4f9b2c123456789012"
//         },
//         {
//           "levelNumber": 2,
//           "approverHierarchyId": "665a1e4f9b2c123456789013"
//         }
//       ],

//       "autoHandleInaction": true,
//       "forwardAfterDays": 2,
//       "inactionAction": "escalate",

//       "backupDecisionType": "self_approval",

//       "transferOnManagerChange": "transfer_pending_only"
//     },

//     "expenseWorkflow": {
//       "sameAsHRIS": false,
//       "workflowType": "all_hands_in",
//       "approverHierarchyId": "665a1e4f9b2c123456789014",

//       "autoHandleInaction": false,

//       "backupDecisionType": "backup_person",
//       "backupEmployeeId": "665a1e4f9b2c123456789015",

//       "transferOnManagerChange": "transfer_all"
//     },

//     "exitWorkflow": {
//       "workflowType": "level_based",

//       "approvalLevels": 3,
//       "levelApprovers": [
//         {
//           "levelNumber": 1,
//           "approverHierarchyId": "665a1e4f9b2c123456789016"
//         },
//         {
//           "levelNumber": 2,
//           "approverHierarchyId": "665a1e4f9b2c123456789017"
//         },
//         {
//           "levelNumber": 3,
//           "approverHierarchyId": "665a1e4f9b2c123456789018"
//         }
//       ],

//       "autoHandleInaction": true,
//       "forwardAfterDays": 5,
//       "inactionAction": "auto_reject",

//       "backupDecisionType": "backup_person",
//       "backupEmployeeId": "665a1e4f9b2c123456789019",

//       "transferOnManagerChange": "transfer_pending_only"
//     }
//   },

//   "assignedEmployeeList": [
//     {
//       "employeeId": "665a1e4f9b2c123456789020"
//     },
//     {
//       "departmentId": "665a1e4f9b2c123456789021"
//     }
//   ]
// }


// ✅ Get Workflow By Company
exports.getWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
   

    const workflow = await ApprovalWorkflow.findOne({
      _id: id,
    });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const populatedData = await populateEmployeeDetails(workflow);

    res.status(200).json({message:"approvalWorkflow fetch successfully", tabs: populatedData.tabs});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkflowAll = async (req, res) => {
  try {
const companyId = req.user?.companyId
    const workflow = await ApprovalWorkflow.find({companyId});

    if (!workflow || workflow.length === 0) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const populatedData = await populateEmployeeDetails(workflow);

    res.status(200).json({
      message: "Approval workflow fetched successfully",
      data: populatedData
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

