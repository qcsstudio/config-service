const SalaryCycle = require("./salaryCycle.model");

// CREATE SALARY CYCLE
const createSalaryCycle = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      salaryCycle,
      EarlyRunPayrollSettings,
      noAttendancePayroll
    } = req.body;

    // Check configurations length
    if (
      salaryCycle?.configurations &&
      salaryCycle.configurations.length > 4
    ) {
      return res.status(400).json({
        success: false,
        message: "Configurations cannot be more than 4",
      });
    }

    const newSalaryCycle = new SalaryCycle({
      adminId,
      companyId,
      salaryCycle,
      EarlyRunPayrollSettings,
      noAttendancePayroll,
    });

    await newSalaryCycle.save();

    return res.status(201).json({
      success: true,
      message: "Salary cycle created successfully",
      data: newSalaryCycle,
    });

  } catch (error) {
    console.error("Create Salary Cycle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating salary cycle",
    });
  }
};



// GET SALARY CYCLE
const getSalaryCycle = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID not found in token",
      });
    }

    const salaryCycle = await SalaryCycle.findOne({ companyId });

    if (!salaryCycle) {
      return res.status(404).json({
        success: false,
        message: "Salary cycle not found for this company",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Salary cycle fetched successfully",
      data: salaryCycle,
    });

  } catch (error) {
    console.error("Get Salary Cycle Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching salary cycle",
    });
  }
};


// EXPORT APIs
module.exports = {
  createSalaryCycle,
  getSalaryCycle
};

// {
//   "salaryCycle": {
//     "cycleName": "Monthly Payroll",

//     "configurations": [
//       {
//         "selectType": true,
//         "monthToMonthPayroll": false,
//         "definedWorkdays": false,
//         "excludeWeeklyOff": false
//       },
//       {
//         "selectType": false,
//         "monthToMonthPayroll": true,
//         "definedWorkdays": false,
//         "excludeWeeklyOff": false
//       },
//       {
//         "selectType": false,
//         "monthToMonthPayroll": false,
//         "definedWorkdays": true,
//         "excludeWeeklyOff": false
//       },
//       {
//         "selectType": false,
//         "monthToMonthPayroll": false,
//         "definedWorkdays": false,
//         "excludeWeeklyOff": true
//       }
//     ],

//     "payrollCycleName": "Standard Payroll",
//     "customizeAttendace": true
//   },

//   "EarlyRunPayrollSettings": {
//     "currentMonth": true,
//     "priorSchedules": 2,

//     "logs": [
//       {
//         "Months": true,
//         "EarlyBy": false,
//         "Schedulepayroll": true
//       }
//     ]
//   },

//   "noAttendancePayroll": {
//     "skipAttendance": false
//   }
// }