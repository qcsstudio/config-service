const IncorporationModel = require("./incorporation.model");


const createIncorporation = async (req, res) => {
  try {
    // ✅ Get companyAdminId from token
    const companyAdminId = req.user?._id;

    if (!companyAdminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const {
      companyLegalName,
      incorporationDate,
      companyType,
      cin,
      gstin,
      pan,
      tan
    } = req.body;

    const payload = {
      companyAdminId,
      companyLegalName
    };

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
