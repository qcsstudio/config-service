const ExtraTime = require("./extraTime.model"); // adjust path as needed

exports.createExtraTimePolicy = async (req, res) => {
  try {
    const userId = req.user?.userId;
 const companyId = req.user?.companyId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const {
      policyName,
      policyDescription = "",
      workingDayBenefits = {},
      nonWorkingDayBenefits = {},
      extraTimePolicy = {},
      status = "draft",
    } = req.body;

    // ✅ Validate policy name
    if (!policyName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Policy name is required",
      });
    }

    // ✅ Check duplicate for SAME ADMIN only
    const existingPolicy = await ExtraTime.findOne({
      policyName: policyName.trim(),
      adminId: userId,
    });

    if (existingPolicy) {
      return res.status(400).json({
        success: false,
        message: "Policy name already exists",
      });
    }

    // ✅ Create policy
    const policy = await ExtraTime.create({
      policyName: policyName.trim(),
      policyDescription,
      workingDayBenefits,
      nonWorkingDayBenefits,
      extraTimePolicy,
      status,
      adminId: userId,     // ✅ correct field
      updatedBy: userId,
      companyId,
    });

    return res.status(201).json({
      success: true,
      message: "Extra Time policy created successfully",
      data: policy,
    });

  } catch (error) {
    console.error("Create Extra Time Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// {
//   "policyName": "Standard Extra Time Policy",
//   "policyDescription": "Policy for working and non-working day extra time benefits",

//   "workingDayBenefits": {
//     "benefitEnabled": true,
//     "earnType": "hours",
//     "minimumHoursRequired": 8,
//     "leavesEarnedPerCycle": 1,
//     "canAccumulateHours": true,
//     "accumulationOverMonths": 3,
//     "compOffLimitPerDay": 1,
//     "minimumThresholdEnabled": true,
//     "minimumThresholdMinutes": 30
//   },

//   "nonWorkingDayBenefits": {
//     "benefitEnabled": true,
//     "earnType": "both",
//     "minimumHoursRequired": 6,
//     "leavesEarnedPerCycle": 1,
//     "canAccumulateHours": false,
//     "accumulationOverMonths": null,
//     "compOffLimitPerDay": 2
//   },

//   "extraTimePolicy": {
//     "approvalRequired": true,
//     "creditApprovalRequired": false,
//     "unusedBalanceHandling": "lapse",
//     "lapseDays": 30,
//     "attachmentsRequired": true,
//     "attachmentRequiredIfDaysGreaterThan": 2,
//     "attachmentInstructions": "Upload manager approval screenshot",
//     "allowPastDateApplications": true,
//     "pastDateApplicationDaysLimit": 7
//   },

//   "status": "draft"
// }
exports.getAllExtraTimePolicies = async (req, res) => {
  try {
    const policies = await ExtraTime.find().sort({ createdAt: -1 }); // latest first
    return res.status(200).json({
      success: true,
      message: "All Extra Time policies fetched",
      data: policies,
    });
  } catch (error) {
    console.error("Get All Policies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};