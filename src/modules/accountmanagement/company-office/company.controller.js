const CompanyOfficeModel = require("./company.model");

const createCompanyOffice = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized. Admin not found."
      });
    }

    const {
      locationName,
      addressType,
      address1,
      address2,
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

    // ✅ Required validation (NO lat/lng required)
    if (
      !locationName ||
      !addressType ||
      !address1 ||
      !country ||
      !state ||
      !city ||
      !postalCode
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // Optional geo support
    let location = {
      type: "Point",
      coordinates: [0, 0],
    };

    if (latitude && longitude) {
      location.coordinates = [
        Number(longitude),
        Number(latitude),
      ];
    }

    const office = await CompanyOfficeModel.create({
      adminId,

      locationName,
      addressType,

      address: {
        address1,
        address2,
        country,
        state,
        city,
        postalCode,
        location,
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
    res.status(500).json({ message: err.message });
  }
};



const updateCompanyOffice = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    const updateData = {};

    const {
      locationName,
      addressType,
      address1,
      address2,
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

    if (address1) updateData["address.address1"] = address1;
    if (address2) updateData["address.address2"] = address2;
    if (country) updateData["address.country"] = country;
    if (state) updateData["address.state"] = state;
    if (city) updateData["address.city"] = city;
    if (postalCode) updateData["address.postalCode"] = postalCode;

    // Optional geo update
    if (latitude && longitude) {
      updateData["address.location"] = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      };
    }

    const office = await CompanyOfficeModel.findOneAndUpdate(
      { _id: req.params.id, adminId },
      { $set: updateData },
      { new: true }
    );

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({
      message: "Updated successfully",
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
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const offices = await CompanyOfficeModel
      .find({ adminId })
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
