const CompanyOfficeModel = require("./company.model");

const createCompanyOffice = async (req, res) => {
  try {
    // ✅ Get admin id from normalized middleware payload
    const adminId = req.user?.userId;

    console.log("Company Admin ID from JWT:", adminId);

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized. Admin not found."
      });
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

    // ✅ Validation
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
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // ✅ Correct field name (matches schema)
    const office = await CompanyOfficeModel.create({
      adminId: adminId,

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
          coordinates: [Number(longitude), Number(latitude)],
        },
      },

      geoRadius: geoRadius || 10,
      timeZone: timezone || "Asia/Kolkata",
      ipAddress,
    });

    return res.status(201).json({
      message: "Company office created",
      office,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message
    });
  }
};


const updateCompanyOffice = async (req, res) => {
  try {
    // const adminId = req.user?.userId;;

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
      { _id: req.params.id },
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
    const adminId = req.user?.userId;;

    const office = await CompanyOfficeModel.findOne({
      _id: req.params.id,
      adminId,
    });

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.status(200).json({
      message: "Company data fetch successfully",
      office,
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCompanyOffices = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offices = await CompanyOfficeModel
      .find({ adminId })
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Company data fetch successfully", offices });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteCompanyOffice = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    const office = await CompanyOfficeModel.findOneAndDelete({
      _id: req.params.id,
      adminId,
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
