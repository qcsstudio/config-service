const ProbationPlan = require("./probation.model");
const populateEmployeeDetails = require("../../company-data/populateEmployees");

const createOrUpdateProbationPlan = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized. Admin not found."
      });
    }

    const {
      policyName,
      description,
      probationDurationDays,
      isEarlyConfirmationAllowed,
      isAutoConfirm,
      notifyEmployee,
      notifySettings,
      companyOfficeId
    } = req.body;

    if (!policyName) {
      return res.status(400).json({
        message: "Policy name is required"
      });
    }

    const finalNotifySettings = notifyEmployee ? notifySettings : {};

    let officeIds = [];
    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const payload = {
      adminId,
      companyId,
      policyName,
      description,
      probationDurationDays,
      isEarlyConfirmationAllowed,
      isAutoConfirm,
      notifyEmployee,
      notifySettings: finalNotifySettings,
      assignedEmployeeList: [],
      fullcount: 0,
      addedbyid: req.user.userId,
      addedbyname: req.user.name,
      addedbyimagepath: req.user.image,
      companyOfficeId: officeIds
    };

    // 🔁 UPDATE based on companyId + policyName
    const existing = await ProbationPlan.findOne({
      companyId,
      policyName
    });

    if (existing) {
      const updated = await ProbationPlan.findOneAndUpdate(
        { companyId, policyName },
        { $set: payload },
        { new: true }
      );

      return res.status(200).json({
        message: "Probation plan updated successfully",
        data: updated
      });
    }

    // 🆕 CREATE if not exists
    const created = await ProbationPlan.create(payload);

    return res.status(201).json({
      message: "Probation plan created successfully",
      data: created
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


const getAllProbationPlans = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { country } = req.query;

    if (!companyId) return res.status(401).json({ message: "Unauthorized" });

    let plans = await ProbationPlan.find({ companyId:companyId }).sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      });

    if (country) plans = plans.filter(p => p.companyOfficeId !== null);

    const data = await populateEmployeeDetails(plans);

    res.status(200).json({
      message: "Probation plans fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProbationPlanById = async (req, res) => {
  try {
   
    const plan = await ProbationPlan.findOne({
      _id: req.params.id,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Probation plan not found",
      });
    }

    const data = await populateEmployeeDetails(plan);

    res.status(200).json({
      message: "Probation plan fetched successfully",
      data,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProbationPlan = async (req, res) => {
  try {
  

    const deleted = await ProbationPlan.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Probation plan not found",
      });
    }

    res.status(200).json({
      message: "Probation plan deleted successfully",
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateProbationPlan,
  getAllProbationPlans,
  getProbationPlanById,
  deleteProbationPlan,
};