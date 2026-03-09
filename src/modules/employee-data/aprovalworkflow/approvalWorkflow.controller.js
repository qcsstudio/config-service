const ApprovalWorkflow = require("./approvalWorkflow.model");
const populateEmployeeDetails = require("../../company-data/populateEmployees");


exports.createOrUpdateWorkflow = async (req, res) => {
  try {
    const { tabName, workflowId } = req.query;
    const workflowData = req.body; // 👈 direct object from frontend
    const adminId = req.user?.userId;

    if (!tabName) {
      return res.status(400).json({ message: "tabName is required in query" });
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

    let workflowDoc;

    if (workflowId) {
      workflowDoc = await ApprovalWorkflow.findOne({
        _id: workflowId,
        adminId
      });

      if (!workflowDoc) {
        return res.status(404).json({ message: "Workflow not found" });
      }
    } else {
      workflowDoc = await ApprovalWorkflow.findOne({ adminId });
    }

    // 🔥 Convert direct object into ARRAY automatically
    const workflowArray = [workflowData];

    if (!workflowDoc) {
      workflowDoc = new ApprovalWorkflow({
        adminId,
        addedById: req.user.userId,
        addedByName: req.user.name,
        addedByImagePath: req.user.image || null,
        tabs: {
          [tabName]: workflowArray
        }
      });

      await workflowDoc.save();
    } else {
      workflowDoc.tabs[tabName] = workflowArray;
      await workflowDoc.save();
    }

    const populatedData = await populateEmployeeDetails(workflowDoc);

    res.status(200).json({
      message: "Workflow saved successfully",
      data: populatedData
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


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

    const workflow = await ApprovalWorkflow.find();

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

