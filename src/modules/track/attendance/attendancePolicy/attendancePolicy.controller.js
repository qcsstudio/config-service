const AttendancePolicy = require("./attendancePolicy.model")

exports.createAttendancePolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId
    const addedByName = req.user?.name;
    const addedByImage = req.user?.image;

    const { policyName, policyDescription, workRequest = {}, absenteeism = {}, punctuality = {}, timeAtWork = {}, status } = req.body;

    if (!policyName?.trim()) {
      return res.status(400).json({ success: false, message: "Policy name is required" });
    }

    const existingPolicy = await AttendancePolicy.findOne({ policyName: policyName.trim() });
    if (existingPolicy) {
      return res.status(400).json({ success: false, message: "Policy name already exists" });
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
      addedByName,
      addedByImage,
      companyId
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

    const query = {};

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
      .limit(Number(limit))
      .select("-assignedEmployeeList"); // 🔥 HIDE assignedEmployeeList

    const total = await AttendancePolicy.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: policies
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

