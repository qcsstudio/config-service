const ExitPolicy = require("./ExitPolicy.model");

// ── CREATE exit policy
// POST /config/create-exit-policy
exports.createExitPolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      name,
      description,
      notice,
      status,
      selfResign,
      changeNotice,
      managerInitiate,
      managerChangeNotice,
      notifyOn,
    } = req.body;

    const exitPolicy = await ExitPolicy.create({
      adminId,
      companyId,
      name,
      description,
      notice,
      status: status || "active",
      selfResign,
      // If selfResign is false, force changeNotice to false
      changeNotice: selfResign === false ? false : changeNotice,
      managerInitiate,
      // If managerInitiate is false, force managerChangeNotice to false
      managerChangeNotice: managerInitiate === false ? false : managerChangeNotice,
      notifyOn,
    });

    res.status(201).json({
      success: true,
      message: "Exit policy created successfully",
      data: exitPolicy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL exit policies for company
// GET /config/getAll-exit-policy
exports.getAllExitPolicies = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const policies = await ExitPolicy.find({ companyId, isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "Exit policies fetched successfully",
      data: policies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ONE exit policy by ID
// GET /config/getOne-exit-policy/:id
exports.getOneExitPolicy = async (req, res) => {
  try {

    const policy = await ExitPolicy.findOne({
      _id: req.params.id
    });

    if (!policy) {
      return res.status(404).json({ success: false, message: "Exit policy not found" });
    }

    res.status(200).json({
      success: true,
      message: "Exit policy fetched successfully",
      data: policy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE exit policy
// PUT /config/update-exit-policy/:id
exports.updateExitPolicy = async (req, res) => {
  try {

    const {
      name,
      description,
      notice,
      status,
      selfResign,
      changeNotice,
      managerInitiate,
      managerChangeNotice,
      notifyOn,
    } = req.body;

    const updated = await ExitPolicy.findOneAndUpdate(
      { _id: req.params.id},
      {
        name,
        description,
        notice,
        status,
        selfResign,
        changeNotice: selfResign === false ? false : changeNotice,
        managerInitiate,
        managerChangeNotice: managerInitiate === false ? false : managerChangeNotice,
        notifyOn,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Exit policy not found" });
    }

    res.status(200).json({
      success: true,
      message: "Exit policy updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE exit policy (soft delete)
// DELETE /config/delete-exit-policy/:id
exports.deleteExitPolicy = async (req, res) => {
  try {

    const deleted = await ExitPolicy.findOneAndUpdate(
      { _id: req.params.id },
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Exit policy not found" });
    }

    res.status(200).json({
      success: true,
      message: "Exit policy deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};