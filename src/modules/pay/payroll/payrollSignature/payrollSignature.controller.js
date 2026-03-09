const PayrollSignature = require("./payrollSignature.model");

// ===============================
// 🔹 CREATE PAYROLL SIGNATURE
// ===============================
exports.addSignAuthority = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!adminId || !companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      employeeType,
      employeeId,
      employeeName,
      fatherName,
      designationId,
      designation,
      gender,
    } = req.body;

    if (!employeeType) {
      return res.status(400).json({
        success: false,
        message: "employeeType is required",
      });
    }

    // 🔎 Check if already exists
    const existingRecord = await PayrollSignature.findOne({
      adminId,
      companyId,
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Sign Authority already exists. Use update API instead.",
      });
    }

    // ✅ Create only
    const result = await PayrollSignature.create({
      adminId,
      companyId,
      employeeType,
      employeeId: employeeId || null,
      employeeName: employeeName || null,
      fatherName: fatherName || null,
      designationId: designationId || null,
      designation: designation || null,
      gender: gender || null,
    });

    return res.status(201).json({
      success: true,
      message: "Sign Authority Created Successfully",
      data: result,
    });

  } catch (error) {
    console.error("Add Sign Authority Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


exports.assignAuthority = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!adminId || !companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      effectiveFrom,
      fallbackAuthorityId,
      isPaySlipEnabled,
      isForm16Enabled,
      signingAuhorityId
    } = req.body;

    if (!effectiveFrom) {
      return res.status(400).json({
        success: false,
        message: "effectiveFrom is required",
      });
    }

    let existingRecord = await PayrollSignature.findOne({
      adminId,
      companyId,
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Sign Authority record not found. Please add sign authority first.",
      });
    }

    const updateData = {
      effectiveFrom,
      fallbackAuthorityId: fallbackAuthorityId || null,
      isPaySlipEnabled: isPaySlipEnabled || false,
      isForm16Enabled: isForm16Enabled || false,
      signingAuhorityId:signingAuhorityId || null
    };

    const result = await PayrollSignature.findByIdAndUpdate(
      existingRecord._id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Authority Assigned Successfully",
      data: result,
    });

  } catch (error) {
    console.error("Assign Authority Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// 🔹 GET ALL PAYROLL SIGNATURES
// ===============================
exports.getAllPayrollSignatures = async (req, res) => {
  try {
    const data = await PayrollSignature.find()
      .populate("adminId")
      .populate("companyId")
      .populate("employeeId")
      .populate("designationId")
      .populate("fallbackAuthorityId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get Payroll Signature Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};