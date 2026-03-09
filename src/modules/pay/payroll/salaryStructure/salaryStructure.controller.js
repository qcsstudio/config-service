const SalaryStructure = require("./salaryStructure.model")
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createSalaryStructure = async (req, res) => {
  try {
    const adminId = req.user?.userId
    const companyId = req.user?.companyId
    const {
      name,
      description,
      income,
      deduction,
      lop,
      trialRun,
      annualProration,
      monthlyProration,
      companyOfficeId,
    } = req.body;

   
 let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }
    // 🔹 Normalize Income Components
    const incomeComponents = Array.isArray(income)
      ? income
      : income
      ? [income]
      : [];

    // 🔹 Normalize Deduction Components
    const deductionComponents = Array.isArray(deduction)
      ? deduction
      : deduction
      ? [deduction]
      : [];

    // 🔹 Normalize LOP Configurations
    const lopConfigurations = Array.isArray(lop)
      ? lop
      : lop
      ? [lop]
      : [];

    const salaryStructure = await SalaryStructure.create({
      adminId,
      companyId,
      name,
      description,
      companyOfficeId: officeIds,
      incomeComponents,
      deductionComponents,
      lopConfigurations,
      trialRun,
      annualProration,
      monthlyProration,
    });

    res.status(201).json({
      success: true,
      message: "Salary structure created successfully",
      data: salaryStructure,
    });
  } catch (error) {
    console.error("Create Salary Structure Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllSalaryStructures = async (req, res) => {
  try {
    const companyId = req.user?.companyId
    const { country } = req.query; // ✅ Get country from query

    const structures = await SalaryStructure.find({
    companyId:companyId,
      isActive: true,
    })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {}, // ✅ Filter by country
        select: "locationName address.country address.state address.city",
      })
      .sort({ createdAt: -1 });

    const data = await populateEmployeeDetails(structures);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get Salary Structures Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.updateSalaryStructure = async (req, res) => {
  try {
    const adminId = req.user?.userId; // person who updates
    const { id } = req.params;

    const {
      name,
      description,
      income,
      deduction,
      lop,
      trialRun,
      annualProration,
      monthlyProration,
    } = req.body;

    // 🔹 Find existing record
    const existing = await SalaryStructure.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Salary structure not found",
      });
    }

    // 🔹 Normalize office ids
    let officeIds = [];
    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    // 🔹 Normalize arrays
    const incomeComponents = Array.isArray(income)
      ? income
      : income
      ? [income]
      : [];

    const deductionComponents = Array.isArray(deduction)
      ? deduction
      : deduction
      ? [deduction]
      : [];

    const lopConfigurations = Array.isArray(lop)
      ? lop
      : lop
      ? [lop]
      : [];

    // 🔹 Update updatedBy array (NO duplicate)
    let updatedByArray = existing.updatedBy || [];

    if (adminId) {
      const alreadyExists = updatedByArray.some(
        (id) => id.toString() === adminId.toString()
      );

      if (!alreadyExists) {
        updatedByArray.push(adminId);
      }
    }

    // 🔹 Update document (WITHOUT touching adminId/companyId)
    const updated = await SalaryStructure.findByIdAndUpdate(
      id,
      {
        name,
        description,
        companyOfficeId: officeIds,
        incomeComponents,
        deductionComponents,
        lopConfigurations,
        trialRun,
        annualProration,
        monthlyProration,
        updatedBy: updatedByArray,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Salary structure updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Salary Structure Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getOneSalaryStructure = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Salary structure ID is required",
      });
    }

    const salaryStructure = await SalaryStructure.findById(id)


    if (!salaryStructure) {
      return res.status(404).json({
        success: false,
        message: "Salary structure not found",
      });
    }

    const data = await populateEmployeeDetails(salaryStructure);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get One Salary Structure Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteSalaryStructure = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Salary structure ID is required",
      });
    }

    // 🔹 Find and delete
    const deletedSalaryStructure = await SalaryStructure.findByIdAndDelete(id);

    // 🔹 Check if record exists
    if (!deletedSalaryStructure) {
      return res.status(404).json({
        success: false,
        message: "Salary structure not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary structure deleted successfully",
      data: deletedSalaryStructure,
    });
  } catch (error) {
    console.error("Delete Salary Structure Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// {
//   "name": "CTC Structure - Level 1",
//   "description": "Monthly salary structure",

//   "income": [
//     {
//       "componentId": "65f1abc123456789abcd3333",
//       "componentName": "Basic Pay",
//       "design": {
//         "mode": "Fixed",
//         "fixedAmount": 30000
//       }
//     },
//     {
//       "componentId": "65f1abc123456789abcd4444",
//       "componentName": "HRA",
//       "design": {
//         "mode": "Formula",
//         "formulaValue": "40% of Basic Pay"
//       }
//     }
//   ],

//   "deduction": {
//     "componentId": "65f1abc123456789abcd5555",
//     "componentName": "PF",
//     "design": {
//       "mode": "Formula",
//       "formulaValue": "12% of Basic Pay"
//     }
//   },

//   "lop": {
//     "componentName": "Basic Pay",
//     "lossOfPay": true,
//     "lopArrears": true,
//     "salaryArrears": false,
//     "newJoinee": true,
//     "fnf": false
//   },

//   "trialRun": 45000,
//   "annualProration": 540000,
//   "monthlyProration": 45000
// }
