const IncorporationModel = require("./incorporation.model");


// CREATE or UPDATE (UPSERT)
const createIncorporation = async (req, res) => {
  try {

    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized. Company not found.",
      });
    }

    const {
      companyLegalName,
      incorporationDate,
      companyType,
      cin,
      gstin,
      pan,
      tan,
    } = req.body;

    if (!companyLegalName) {
      return res.status(400).json({
        message: "companyLegalName is required",
      });
    }

    const payload = {
      adminId,
      companyLegalName,
      incorporationDate,
      companyType,
      cin,
      gstin,
      pan,
      tan,
    };

    const incorporation = await IncorporationModel.findOneAndUpdate(
      { adminId },
      payload,
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Incorporation saved",
      incorporation,
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// GET BY ID (TENANT SAFE)
const getIncorporationById = async (req, res) => {
  try {
   

    const incorporation = await IncorporationModel.findOne({
      _id: req.params.id,
    });

    if (!incorporation) {
      return res.status(404).json({
        message: "Incorporation not found",
      });
    }

    res.status(200).json({ message:"incorporation fetch successfully", incorporation });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  createIncorporation,
  getIncorporationById,
};
