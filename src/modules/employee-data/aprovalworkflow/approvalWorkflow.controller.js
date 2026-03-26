const ApprovalWorkflow = require("./approvalWorkflow.model");
const populateEmployeeDetails = require("../../company-data/populateEmployees");
const mongoose = require("mongoose")

exports.createWorkflow = async (req, res) => {
  try {
    const { tabName } = req.query;
    let workflowData = req.body;

    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!tabName) {
      return res.status(400).json({ message: "tabName is required" });
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
      return res.status(400).json({ message: "Invalid tab name" });
    }

    // 🔥 Handle levelApprovers
    if (workflowData.levelApprovers) {
      workflowData.levelApprovers = workflowData.levelApprovers.map(level => {
        if (
          level.hierarchyRoles &&
          level.hierarchyRoles.includes("Additional Employee")
        ) {
          return {
            ...level,
            additionalEmployees: level.additionalEmployees || []
          };
        }
        return { ...level, additionalEmployees: [] };
      });
    }


    // ✅ Create new
    const workflowDoc = new ApprovalWorkflow({
      adminId,
      companyId,
      addedById: req.user.userId,
      addedByName: req.user.name,
      addedByImagePath: req.user.image || null,
      tabs: {
        [tabName]: workflowData
      }
    });

    await workflowDoc.save();

    const populatedData = await ApprovalWorkflow.findById(workflowDoc._id)
      .populate("tabs.hrisWorkflow.allHandsEmployee")
      .populate("tabs.attendanceWorkflow.allHandsEmployee")
      .populate("tabs.leaveWorkflow.allHandsEmployee")
      .populate("tabs.expenseWorkflow.allHandsEmployee")
      .populate("tabs.exitWorkflow.allHandsEmployee")
      .populate("tabs.leaveWorkflow.levelApprovers.approverEmployeeId")
      .populate("tabs.leaveWorkflow.levelApprovers.additionalEmployees")
      .populate("tabs.hrisWorkflow.backupEmployeeId")
      .populate("tabs.leaveWorkflow.backupEmployeeId")
      .populate("assignedEmployeeList.employeeId")
      .populate("assignedEmployeeList.departmentId");

    return res.status(201).json({
      message: "Workflow created successfully",
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
exports.updateWorkflow = async (req, res) => {
  try {
    const { tabName, workflowId } = req.query;
    let workflowData = req.body;

    if (!tabName || !workflowId) {
      return res.status(400).json({
        message: "tabName and workflowId are required"
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

    // 🔥 Handle levelApprovers
    if (workflowData.levelApprovers) {
      workflowData.levelApprovers = workflowData.levelApprovers.map(level => {
        if (
          level.hierarchyRoles &&
          level.hierarchyRoles.includes("Additional Employee")
        ) {
          return {
            ...level,
            additionalEmployees: level.additionalEmployees || []
          };
        }
        return { ...level, additionalEmployees: [] };
      });
    }

    // ✅ Direct update using ID
    const updatedWorkflow = await ApprovalWorkflow.findByIdAndUpdate(
      workflowId,
      {
        $set: {
          [`tabs.${tabName}`]: workflowData
        }
      },
      { new: true }
    );

    if (!updatedWorkflow) {
      return res.status(404).json({
        message: "Workflow not found"
      });
    }

    // 🔁 Populate after update
    const populatedData = await ApprovalWorkflow.findById(workflowId)
      .populate("tabs.hrisWorkflow.allHandsEmployee")
      .populate("tabs.attendanceWorkflow.allHandsEmployee")
      .populate("tabs.leaveWorkflow.allHandsEmployee")
      .populate("tabs.expenseWorkflow.allHandsEmployee")
      .populate("tabs.exitWorkflow.allHandsEmployee")
      .populate("tabs.leaveWorkflow.levelApprovers.approverEmployeeId")
      .populate("tabs.leaveWorkflow.levelApprovers.additionalEmployees")
      .populate("tabs.hrisWorkflow.backupEmployeeId")
      .populate("tabs.leaveWorkflow.backupEmployeeId")
      .populate("assignedEmployeeList.employeeId")
      .populate("assignedEmployeeList.departmentId");

    return res.status(200).json({
      message: "Workflow updated successfully",
      data: populatedData
    });

  } catch (error) {
    console.error("Update Workflow Error:", error);
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
    const workflow = await ApprovalWorkflow.find(companyId);
console.log( workflow," workflow workflow workflow")
    // if (!workflow || workflow.length === 0) {
    //   return res.status(404).json({ message: "Workflow not found" });
    // }

    const populatedData = await populateEmployeeDetails(workflow);

    res.status(200).json({
      message: "Approval workflow fetched successfully",
      data: populatedData
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteWorkflow = async (req, res) => {
  try {
    const { id } = req.params; // ✅ workflow id from params

    // ❌ check company
   
    // ❌ check id present
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Workflow ID is required",
      });
    }

    // ❌ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workflow ID",
      });
    }

    // 🔍 find & delete (with company check)
    const deletedWorkflow = await ApprovalWorkflow.findOneAndDelete({
      _id: id,
    });

    // ✅ success
    return res.status(200).json({
      success: true,
      message: "Workflow deleted successfully",
      data: deletedWorkflow,
    });

  } catch (error) {
    console.error("Delete Workflow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

