const CompanyOfficeModel = require("./company.model");

const createCompanyOffice = async (req, res) => {
  try {
    const companyAdminId = req.user?._id;

    if (!companyAdminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const {
      locationName,
      addressType,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      postalCode,
      timezone,
      ipAddress,
      latitude,
      longitude,
      geoRadius,
    } = req.body;

    if (
      !locationName ||
      !addressType ||
      !addressLine1 ||
      !country ||
      !state ||
      !city ||
      !postalCode ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const office = await CompanyOfficeModel.create({
      companyAdminId,
      locationName,
      addressType,
      address: {
        addressLine1,
        addressLine2,
        country,
        state,
        city,
        postalCode,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      geoRadius: geoRadius || 10,
      timeZone: timezone || "Asia/Kolkata",
      ipAddress,
    });

    res.status(201).json({
      message: "Company office created",
      office,
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCompanyOffice = async (req, res) => {
  try {
    const companyAdminId = req.user?._id;

    const updateData = {};

    const {
      locationName,
      addressType,
      addressLine1,
      addressLine2,
      country,
      state,
      city,
      postalCode,
      timezone,
      ipAddress,
      latitude,
      longitude,
      geoRadius,
    } = req.body;

    if (locationName) updateData.locationName = locationName;
    if (addressType) updateData.addressType = addressType;
    if (timezone) updateData.timeZone = timezone;
    if (ipAddress) updateData.ipAddress = ipAddress;
    if (geoRadius) updateData.geoRadius = geoRadius;

    if (addressLine1) updateData["address.addressLine1"] = addressLine1;
    if (addressLine2) updateData["address.addressLine2"] = addressLine2;
    if (country) updateData["address.country"] = country;
    if (state) updateData["address.state"] = state;
    if (city) updateData["address.city"] = city;
    if (postalCode) updateData["address.postalCode"] = postalCode;

    if (latitude !== undefined && longitude !== undefined) {
      updateData["address.location"] = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    const office = await CompanyOfficeModel.findOneAndUpdate(
      { _id: req.params.id, companyAdminId },
      { $set: updateData },
      { new: true }
    );

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.status(200).json({
      message: "Company office updated successfully",
      office,
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCompanyOffice = async (req, res) => {
  try {
    const companyAdminId = req.user?._id;

    const office = await CompanyOfficeModel.findOne({
      _id: req.params.id,
      companyAdminId,
    });

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.status(200).json({ office });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCompanyOffices = async (req, res) => {
  try {
    const companyAdminId = req.user?._id;

    if (!companyAdminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offices = await CompanyOfficeModel
      .find({ companyAdminId })
      .sort({ createdAt: -1 });

    res.status(200).json({ offices });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCompanyOffice = async (req, res) => {
  try {
    const companyAdminId = req.user?._id;

    const office = await CompanyOfficeModel.findOneAndDelete({
      _id: req.params.id,
      companyAdminId,
    });

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.status(200).json({ message: "Company office deleted" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createCompanyOffice,
  updateCompanyOffice,
  getCompanyOffice,
  getAllCompanyOffices,
  deleteCompanyOffice,
};
