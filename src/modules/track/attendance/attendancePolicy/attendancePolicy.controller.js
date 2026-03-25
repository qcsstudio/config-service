const AttendancePolicy = require("./attendancePolicy.model")
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createAttendancePolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId

        
    const {  companyOfficeId, policyName, policyDescription, workRequest = {}, absenteeism = {}, punctuality = {}, timeAtWork = {}, status } = req.body;

    if (!policyName?.trim()) {
      return res.status(400).json({ success: false, message: "Policy name is required" });
    }

    const existingPolicy = await AttendancePolicy.findOne({ policyName: policyName.trim() });
    if (existingPolicy) {
      return res.status(400).json({ success: false, message: "Policy name already exists" });
    }
    let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }


    const policy = await AttendancePolicy.create({
      policyName: policyName.trim(),
      policyDescription,
      workRequest,
      absenteeism,
      punctuality,
      timeAtWork,
      status: status || "draft",
      adminId,
      companyId,
       companyOfficeId: officeIds,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance policy created successfully",
      data: policy
    });

  } catch (error) {
    console.error("Create Attendance Policy Error:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// in postman 
// {
//   "policyName": "General Attendance Policy",
//   "policyDescription": "Standard attendance rules",

//   "workRequest": {
//     "wfhOdType": "wfh",
//     "wfhMaxRequestsPerMonth": 4,
//     "backupMaxRequestsPerMonth": 2,
//     "restrictAttendanceRequests": true,
//     "restrictedRequestsCount": 3
//   },

//   "absenteeism": {
//     "autoActionsEnabled": true,
//     "noShowHandling": "assume-leave",
//     "leaveSubAction": "auto-deduct",
//     "absentLeaveType": "Casual Leave",
//     "absentLeavesToDeduct": "1"
//   },

//   "punctuality": {
//     "trackLateComers": true,
//     "lateMarkTrackingType": "grace-hours",
//     "graceHours": {
//       "monthlyGrace": { "hours": 2, "minutes": 0 },
//       "triggerAfter": { "hours": 0, "minutes": 15 },
//       "maxAllowed": { "hours": 3, "minutes": 0 },
//       "penaltyType": "deduct-refill",
//       "penalty": {
//         "enabled": "no-absent",
//         "leaveType": "Casual Leave",
//         "leavesToDeduct": "0.5",
//         "deductionPolicy": "auto-leave"
//       }
//     }
//   },

//   "timeAtWork": {
//     "requirementEnabled": "yes-daily",

//     "halfDay": {
//       "minDuration": {
//         "mode": "hrs",
//         "percent": null,
//         "time": { "hours": 4, "minutes": 0 }
//       },
//       "penalty": {
//         "enabled": "no-absent",
//         "leaveType": "Sick Leave",
//         "leavesToDeduct": "0.5"
//       }
//     },

//     "fullDay": {
//       "minDuration": {
//         "mode": "hrs",
//         "percent": null,
//         "time": { "hours": 8, "minutes": 0 }
//       },
//       "penalty": {
//         "enabled": "no-absent",
//         "leaveType": "Earned Leave",
//         "leavesToDeduct": "1"
//       }
//     },

//     "weekly": {
//       "requiredHours": { "hours": 40, "minutes": 0 },
//       "penalty": {
//         "enabled": "no-absent",
//         "leaveType": "Unpaid Leave",
//         "leavesToDeduct": "1"
//       }
//     }
//   },

//   "status": "draft"
// }


// GET ALL POLICIES
exports.getAllAttendancePolicies = async (req, res) => {
  try {

    const { status, search, page = 1, limit = 10 } = req.query;

      const query = {
      isDeleted: false,
      companyId: req.user.companyId   // ✅ ADD THIS
    };


    // 🔹 Filter by status
    if (status) {
      query.status = status;
    }

    // 🔹 Search by policy name
    if (search) {
      query.policyName = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const policies = await AttendancePolicy.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AttendancePolicy.countDocuments(query);
    const data = await populateEmployeeDetails(policies);

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data
    });

  } catch (error) {
    console.error("Get Attendance Policies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
exports.getAttendancePolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Find single policy
    const policy = await AttendancePolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    // 🔹 (optional) populate employee details
    const data = await populateEmployeeDetails([policy]);

    return res.status(200).json({
      success: true,
      data: data[0] // return single object
    });

  } catch (error) {
    console.error("Get One Policy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

exports.updateAttendancePolicy = async (req, res) => {
  try {
    const { id } = req.params;


    const existing = await AttendancePolicy.findOne({
      _id: id,
      isDeleted: false
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    const {
      policyName,
      policyDescription,
      workRequest,
      absenteeism,
      punctuality,
      timeAtWork,
      status,
      
    } = req.body;

    // ✅ Name validation
    if (policyName && !policyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Policy name cannot be empty"
      });
    }

    // ✅ Unique check
    if (policyName && policyName.trim() !== existing.policyName) {
      const duplicate = await AttendancePolicy.findOne({
        policyName: policyName.trim()
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Policy name already exists"
        });
      }
    }

    // ✅ Handle officeIds
  
    // ✅ SAFE UPDATE (no overwrite)
    if (policyName) existing.policyName = policyName.trim();
    if (policyDescription !== undefined) existing.policyDescription = policyDescription;

    if (workRequest) {
      existing.workRequest = {
        ...existing.workRequest.toObject(),
        ...workRequest
      };
    }

    if (absenteeism) {
      existing.absenteeism = {
        ...existing.absenteeism.toObject(),
        ...absenteeism
      };
    }

    if (punctuality) {
      existing.punctuality = {
        ...existing.punctuality.toObject(),
        ...punctuality
      };
    }

    if (timeAtWork) {
      existing.timeAtWork = {
        ...existing.timeAtWork.toObject(),
        ...timeAtWork
      };
    }

    if (status !== undefined) existing.status = status;

 
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Attendance policy updated successfully",
      data: existing
    });

  } catch (error) {
    console.error("Update Attendance Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

exports.deleteAttendancePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await AttendancePolicy.findOne({
      _id: id,
      isDeleted: false
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    // ✅ Soft delete
    policy.isDeleted = true;
    policy.deletedAt = new Date();

    await policy.save();

    return res.status(200).json({
      success: true,
      message: "Policy deleted successfully (soft delete)"
    });

  } catch (error) {
    console.error("Delete Attendance Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

