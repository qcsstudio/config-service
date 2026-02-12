const IncorporationModel = require("./incorporation.model");

// Create a new incorporation
const createIncorporation = async (req, res) => {
  try {
    const { companyId, companyLegalName, incorporationDate, companyType, cin, gstin, pan, tan } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const payload = { companyId, companyLegalName };

    if (incorporationDate) payload.incorporationDate = incorporationDate;
    if (companyType) payload.companyType = companyType;
    if (cin) payload.cin = cin;
    if (gstin) payload.gstin = gstin;
    if (pan) payload.pan = pan;
    if (tan) payload.tan = tan;

    const incorporation = await IncorporationModel.create(payload);

    res.status(201).json({
      message: "Incorporation created",
      incorporation,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single incorporation by ID
const getIncorporationById = async (req, res) => {
  try {
    const incorporation = await IncorporationModel.findById(req.params.id);

    if (!incorporation) {
      return res.status(404).json({ message: "Incorporation not found" });
    }

    res.status(200).json({ incorporation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createIncorporation,
  getIncorporationById,
};
