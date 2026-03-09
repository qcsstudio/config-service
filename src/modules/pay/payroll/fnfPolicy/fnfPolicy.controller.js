const FnfPolicy = require("./fnfPolicy.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

/* ==============================
   CREATE POLICY
============================== */
exports.createFnfPolicy = async (req, res) => {
  try {

    const {
      policyName,
      basicPayDuringNotice,
      fnfProcessDays,
      payGratuity,
      gratuityThresholdYears,
      gratuityThresholdMonths,
      gratuityNonCTC,
      companyOfficeId,
      assignedEmployeeList
    } = req.body;

    /* -----------------------
       OFFICE ARRAY FIX
    ----------------------- */

    let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    /* -----------------------
       CREATE POLICY
    ----------------------- */

    const policy = await FnfPolicy.create({
      policyName,
      basicPayDuringNotice,
      fnfProcessDays,
      payGratuity,
      gratuityThresholdYears,
      gratuityThresholdMonths,
      gratuityNonCTC,
      companyOfficeId: officeIds,
      assignedEmployeeList,

      adminId: req.user._id,
      companyId: req.user.companyId,
    });

    const data = await populateEmployeeDetails(policy);

    res.status(201).json({
      success: true,
      message: "FnF Policy created successfully",
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==============================
   GET ALL POLICIES
============================== */
exports.getAllFnfPolicies = async (req, res) => {
  try {

    const { country } = req.query;

    const policies = await FnfPolicy.find({
      companyId: req.user?.companyId,
      isActive: true,
    }).populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      }).sort({ createdAt: -1 });

    const data = await populateEmployeeDetails(policies);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ==============================
   GET SINGLE POLICY
============================== */
exports.getFnfPolicyById = async (req, res) => {
  try {
    const policy = await FnfPolicy.findOne({
      _id: req.params.id,
    //   companyId: req.user.companyId,
    })

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    const data = await populateEmployeeDetails(policy);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   UPDATE POLICY
============================== */
exports.updateFnfPolicy = async (req, res) => {
  try {
    const policy = await FnfPolicy.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    const data = await populateEmployeeDetails(policy);

    res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==============================
   DELETE POLICY (SOFT DELETE)
============================== */
exports.deleteFnfPolicy = async (req, res) => {
  try {
    const policy = await FnfPolicy.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId: req.user.companyId,
      },
      { isActive: false },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Policy deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};