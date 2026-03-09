const PayrollMethod = require("./payrollMethod.model");

// Create or Update Payroll Method
const createPayrollMethod = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const { packageType, salaryMethod } = req.body;

    const data = await PayrollMethod.findOneAndUpdate(
      { companyId }, // match company
      {
        adminId,
        companyId,
        packageType,
        salaryMethod
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Payroll method saved/updated successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get Payroll Method
const getPayrollMethod = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const data = await PayrollMethod.findOne({ companyId });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Payroll method not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll method fetched successfully",
      data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createPayrollMethod,
  getPayrollMethod
};