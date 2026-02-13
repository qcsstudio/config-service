const GlobalModel = require("./global.model");

// Create or update global settings
const createOrUpdateGlobal = async (req, res) => {
  try {
    // ✅ Get companyAdminId from token
const companyAdminId = req.user?.userId;

    if (!companyAdminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const {
      subdomain,
      country,
      currency,
      callingCode,
      timezone,
      weekStart,
      leaveCycleStartMonth,
      financialYearStartMonth,
      dateFormat,
      timeFormat,
    } = req.body;

    const payload = {
      companyAdminId,
      subdomain,
      country: {
        name: country?.name,
        code: country?.code,
      },
      currency,
      callingCode,
      timezone,
      weekStart,
      leaveCycleStartMonth,
      financialYearStartMonth,
      dateFormat,
      timeFormat,
    };

    // 🔎 Check existing by companyAdminId
    const existingGlobal = await GlobalModel.findOne({ companyAdminId });

    let global;

    if (!existingGlobal) {
      global = await GlobalModel.create(payload);

      return res.status(201).json({
        message: "Global settings created",
        globalId: global._id,
      });

    } else {
      global = await GlobalModel.findByIdAndUpdate(
        existingGlobal._id,
        payload,
        { new: true }
      );

      return res.status(200).json({
        message: "Global settings updated",
        globalId: global._id,
      });
    }

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get global settings (by logged-in admin)
const getGlobalSettings = async (req, res) => {
  try {
const companyAdminId = req.user?.userId;

    if (!companyAdminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const globalSettings = await GlobalModel.findOne({ companyAdminId });

    if (!globalSettings) {
      return res.status(404).json({ message: "Global settings not found" });
    }

    res.status(200).json({ globalSettings });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrUpdateGlobal,
  getGlobalSettings,
};
