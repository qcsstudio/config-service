const ProbationPlan = require("./probation.model");

const createOrUpdateProbationPlan = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const {
      policyName,
      description,
      probationDurationDays,
      isEarlyConfirmationAllowed,
      isAutoConfirm,
      notifyEmployee,
      notifySettings,
         companyOfficeId,
      _id
    } = req.body;

    // If notifyEmployee is false, reset notifySettings
    const finalNotifySettings = notifyEmployee ? notifySettings : {};
 let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const payload = {
      adminId,
      policyName,
      description,
      probationDurationDays,
      isEarlyConfirmationAllowed,
      isAutoConfirm,
      notifyEmployee,
      notifySettings: finalNotifySettings,

      // 🔹 Always empty while creating/updating from this API
      assignedEmployeeList: [],
      fullcount: 0,

      // 🔹 Added By (auto from token)
      addedbyid: req.user.userId,
      addedbyname: req.user.name,
      addedbyimagepath: req.user.image,
    };

    // 🔁 UPDATE
    if (_id) {
      const updated = await ProbationPlan.findOneAndUpdate(
        { _id },
      {
          ...payload
          // ❌ NOT including companyOfficeId here
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          message: "Probation plan not found",
        });
      }

      return res.status(200).json({
        message: "Probation plan updated successfully",
        data: updated,
      });
    }

    // 🆕 CREATE
    const created = await ProbationPlan.create({ ...payload,
      companyOfficeId: officeIds});

    res.status(201).json({
      message: "Probation plan created successfully",
      data: created,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllProbationPlans = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { country } = req.query;

    if (!adminId) return res.status(401).json({ message: "Unauthorized" });

    let plans = await ProbationPlan.find({ adminId }).sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      });

    if (country) plans = plans.filter(p => p.companyOfficeId !== null);

    res.status(200).json({
      message: "Probation plans fetched successfully",
      count: plans.length,
      data: plans,
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

    res.status(200).json({
      message: "Probation plan fetched successfully",
      data: plan,
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