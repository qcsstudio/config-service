const OvertimePaymentPolicy = require("./overtimePayment.model");

/* ---------------- CREATE OR UPDATE POLICY ---------------- */

const createOrUpdateOvertimePolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      policyName,
      workDay,
      nonWorkDay,
      calcMethod,
      approval,
    } = req.body;

    const data = await OvertimePaymentPolicy.findOneAndUpdate(
      { companyId },
      {
        adminId,
        companyId,
        policyName,
        workDay,
        nonWorkDay,
        calcMethod,
        approval,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Overtime policy saved successfully",
      data,
    });
  } catch (error) {
    console.error("Overtime Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* ---------------- GET POLICY ---------------- */

const getOvertimePolicy = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const data = await OvertimePaymentPolicy.findOne({ companyId });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* ---------------- EXPORT ---------------- */

module.exports = {
  createOrUpdateOvertimePolicy,
  getOvertimePolicy,
};