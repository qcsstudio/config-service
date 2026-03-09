const PayrollTag = require("./payrollTag.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

// ✅ Create Payroll Tag
exports.createPayrollTag = async (req, res) => {
  try {
    const adminId = req.user?.userId
    const companyId = req.user?.companyId
    const {
      tagName,
      valueType,
      companyOfficeId,
      isActive,
    } = req.body;

    // Basic validation
    // if (!tagName || !valueType) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "tagName and valueType are required",
    //   });
    // }
       let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }


    const newTag = await PayrollTag.create({
      adminId,
      companyId,
      tagName,
      valueType,
      companyOfficeId: officeIds,
    //   assignedEmployeeList,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Payroll Tag created successfully",
      data: newTag,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating Payroll Tag",
      error: error.message,
    });
  }
};

// ✅ Get All Payroll Tags
exports.getAllPayrollTags = async (req, res) => {
  try {
    const companyId = req.user?.userId;
    const { country } = req.query;

    let filter = {};

    if (companyId) {
      filter.companyId = companyId;
    }

    let tags = await PayrollTag.find(filter)
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      })
      .sort({ createdAt: -1 });
    if (country) {
      tags = tags.filter(tag => tag.companyOfficeId.length > 0);
    }

    const data = await populateEmployeeDetails(tags);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching Payroll Tags",
      error: error.message,
    });
  }
};