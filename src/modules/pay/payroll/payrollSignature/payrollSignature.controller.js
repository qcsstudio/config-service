const PayrollSignature = require("./payrollSignature.model");
const mongoose =require("mongoose")
const AuthorityMapping = require("./payrollSignatureAuthorityMapping.model");
// ===============================
// 🔹 CREATE PAYROLL SIGNATURE
// ===============================
exports.addSignAuthority = async (req, res) => {
  try {
    console.log(req.body,"eeeee")
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
      companyOfficeId
    } = req.body;


    // 🔎 Check if already exists
    // const existingRecord = await PayrollSignature.findOne({
    //   adminId,
    //   companyId,
    // });

    // if (existingRecord) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Sign Authority already exists. Use update API instead.",
    //   });
    // }
  let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
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
       companyOfficeId:officeIds
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

// ===============================
// 🔹 GET ALL PAYROLL SIGNATURES
// ===============================
exports.getAllPayrollSignatures = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { year } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID missing",
      });
    }

    let filter = { companyId };

    // ✅ Correct year match
    if (year) {
      filter.$expr = {
        $eq: [{ $year: "$effectiveFrom" }, Number(year)],
      };
    }

    const data = await PayrollSignature.find(filter)
      .populate("designationId")
      // .populate("fallbackAuthorityId")
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

exports.findAvailablePayrollSignatures = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID missing",
      });
    }

    // 🔍 Step 1: Get used authority IDs
    const mappings = await AuthorityMapping.find({ companyId })
      .select("fallbackAuthorityId signingAuthorityId");

    // ✅ Use Set to avoid duplicates
    const usedIdsSet = new Set();

    mappings.forEach((item) => {
      if (item.fallbackAuthorityId) {
        usedIdsSet.add(item.fallbackAuthorityId.toString());
      }
      if (item.signingAuthorityId) {
        usedIdsSet.add(item.signingAuthorityId.toString());
      }
    });

    const usedIds = [...usedIdsSet];

    // 🔍 Step 2: Filter (NO year filter)
    const filter = {
      companyId,
      _id: { $nin: usedIds }, // ❌ exclude already assigned
    };

    // 🔥 Step 3: Fetch data
    const data = await PayrollSignature.find(filter)
      .populate("designationId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Available payroll signatures fetched",
      count: data.length,
      data,
    });

  } catch (error) {
    console.error("findAvailablePayrollSignatures Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.assignAuthority = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const {
      fallbackAuthorityId,
      signingAuthorityId, // ✅ correct spelling
      effectiveFrom,
      isPaySlipEnabled,
      isForm16Enabled,
    } = req.body;

    // 🔍 Debug (remove later)
    console.log("BODY:", req.body);

    // ❌ Unauthorized
    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ❗ At least one ID required
    if (!fallbackAuthorityId && !signingAuthorityId) {
      return res.status(400).json({
        success: false,
        message: "At least one authority is required",
      });
    }

    let fallbackId;
    let signingId;

    // ✅ Validate fallbackAuthorityId
    if (fallbackAuthorityId) {
      if (!mongoose.Types.ObjectId.isValid(fallbackAuthorityId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fallbackAuthorityId",
        });
      }
      fallbackId = new mongoose.Types.ObjectId(fallbackAuthorityId);
    }

    // ✅ Validate signingAuthorityId
    if (signingAuthorityId) {
      if (!mongoose.Types.ObjectId.isValid(signingAuthorityId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid signingAuthorityId",
        });
      }
      signingId = new mongoose.Types.ObjectId(signingAuthorityId);
    }

    // 🔍 Prevent duplicate (dynamic query)
    const query = { companyId };

    if (fallbackId) query.fallbackAuthorityId = fallbackId;
    if (signingId) query.signingAuthorityId = signingId;

    const existing = await AuthorityMapping.findOne(query);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Mapping already exists",
      });
    }

    // ✅ Create data dynamically (NO NULLS)
    const createData = {
      companyId,
      effectiveFrom,
      isPaySlipEnabled,
      isForm16Enabled,
    };

    if (fallbackId) createData.fallbackAuthorityId = fallbackId;
    if (signingId) createData.signingAuthorityId = signingId;

    const mapping = await AuthorityMapping.create(createData);

    return res.status(201).json({
      success: true,
      message: "Created successfully",
      data: mapping,
    });

  } catch (error) {
    console.error("Assign Authority Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};