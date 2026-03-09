const Policy = require("./PolicyCenter.model");
const BusinessUnit = require("../../company-data/businessUnit/businessUnit.model");
const Department = require("../../company-data/department/department.model");

exports.getBusinessUnitOrDepartment = async (req, res) => {
  try {
    const { type } = req.query;

    // 🔹 Get Business Units
    if (type === "BusinessUnit") {
      const businessUnits = await BusinessUnit.find()
        .select("_id businessUnitName");

      return res.status(200).json({
        success: true,
        type: "BusinessUnit",
        data: businessUnits
      });
    }

    // 🔹 Get Departments
    if (type === "Department") {
      const departments = await Department.find()
        .select("_id departmentName");

      return res.status(200).json({
        success: true,
        type: "Department",
        data: departments
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid type"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.createPolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      policyName,
      description,
      AssignPolicy,
      businessUnits,
      departments,
      visibleFrom,
      visibleTo,
    } = req.body;

    const file = req.file ? req.file.location : "";



    const policy = new Policy({
      policyName,
      description,
      file,
      AssignPolicy,
      visibleFrom,
      visibleTo,
      adminId,
      companyId,
      cluster: {
        businessUnits:
          AssignPolicy === "BusinessUnit"
            ? Array.isArray(businessUnits)
              ? businessUnits
              : [businessUnits]
            : [],
        departments:
          AssignPolicy === "Department"
            ? Array.isArray(departments)
              ? departments
              : [departments]
            : [],
      },
    });

    await policy.save();

    res.status(201).json({
      success: true,
      message: "Policy created successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getPolicies = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const policies = await Policy.find({
      companyId,
      isDeleted: false,
    })
      .populate("cluster.businessUnits", "_id businessUnitName")
      .populate("cluster.departments", "_id departmentName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: policies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;

    const policy = await Policy.findById(policyId)
      .populate("cluster.businessUnits", "_id businessUnitName")
      .populate("cluster.departments", "_id departmentName");

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updatePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;

    const {
      policyName,
      description,
      AssignPolicy,
      businessUnits,
      departments,
      visibleFrom,
      visibleTo,
    } = req.body;

    // find existing policy
    const existingPolicy = await Policy.findById(policyId);

    if (!existingPolicy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    const updateData = {};

    if (policyName) updateData.policyName = policyName;
    if (description) updateData.description = description;
    if (visibleFrom) updateData.visibleFrom = visibleFrom;
    if (visibleTo) updateData.visibleTo = visibleTo;

    // FILE LOGIC
    if (req.file) {
      // new file uploaded
      updateData.file = req.file.location;
    } else {
      // keep existing file
      updateData.file = existingPolicy.file;
    }

    // AssignPolicy logic
    if (AssignPolicy) {
      updateData.AssignPolicy = AssignPolicy;

      let cluster = {
        businessUnits: [],
        departments: [],
      };

      if (AssignPolicy === "BusinessUnit" && businessUnits) {
        cluster.businessUnits = Array.isArray(businessUnits)
          ? businessUnits
          : [businessUnits];
      }

      if (AssignPolicy === "Department" && departments) {
        cluster.departments = Array.isArray(departments)
          ? departments
          : [departments];
      }

      updateData.cluster = cluster;
    }

    const policy = await Policy.findByIdAndUpdate(
      policyId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Policy updated successfully",
      data: policy,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deletePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;

    await Policy.findByIdAndUpdate(policyId, {
      isDeleted: true,
    });

    res.json({
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