const GlobalModel = require("./global.model");

// Create or update global settings
const createOrUpdateGlobal = async (req, res) => {
  try {
    const {
      companyId,
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

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const payload = {
      companyId,
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

    const existingGlobal = await GlobalModel.findOne({ companyId });

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

// Get global settings by companyId
const getGlobalSettings = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const globalSettings = await GlobalModel.findOne({ companyId });

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
