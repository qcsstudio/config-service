const BusinessUnit = require("./businessUnit.model");
exports.createBusinessUnit = async (req, res) => {
  try {

    const adminId = req.user?.userId;
    const addedByName = req.user?.name;
    const addedByImage = req.user?.image;

    const {
      businessUnitName,
      locationName,
      latitude,
      longitude,
      logo,
      assignBusinessHead,
      businessHead,
      companyOfficeId
    } = req.body;

    // ✅ Required Validation

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Latitude and Longitude are required"
      });
    }

    // ✅ Convert to Number
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Latitude and Longitude must be valid numbers"
      });
    }
      let officeIds = [];

    if (companyOfficeId) {
      if (Array.isArray(companyOfficeId)) {
        officeIds = companyOfficeId; // multiple ids
      } else {
        officeIds = [companyOfficeId]; // single id convert to array
      }
    }

    // ✅ Create GeoJSON format
    const location = {
      type: "Point",
      coordinates: [lng, lat]  // MUST BE [longitude, latitude]
    };

    const newUnit = new BusinessUnit({
      adminId,
      businessUnitName,
      locationName,
      location,
      logo,
      assignBusinessHead,
      businessHead,
      companyOfficeId: officeIds, 
      addedById: adminId,
      addedByName,
      addedByImage,
      assignedEmployeeList: []
    });

    await newUnit.save();

    // ✅ Send clean response with lat/long separately
    res.status(201).json({
      message: "Business Unit created successfully",
      data: {
        ...newUnit.toObject(),
        latitude: newUnit.location.coordinates[1],
        longitude: newUnit.location.coordinates[0]
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getAllBusinessUnits = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { country } = req.query;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // 🔹 Always filter by adminId
    const units = await BusinessUnit.find({ adminId })
      .populate({
        path: "companyOfficeId",
        match: country
          ? { "address.country": country }
          : {},
        select: "locationName address.country address.state address.city"
      });

    // 🔹 If country selected → remove unmatched units
    const filteredUnits = country
      ? units.filter(unit => unit.companyOfficeId.length > 0)
      : units;

    res.status(200).json({
      message: "Business Units fetched successfully",
      selectedCountry: country || null,
      total: filteredUnits.length,
      data: filteredUnits
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getBusinessUnitById = async (req, res) => {
  try {

    const { id } = req.params;

    const unit = await BusinessUnit.findById(id);

    if (!unit) {
      return res.status(404).json({ message: "Business Unit not found" });
    }

    res.status(200).json({
      message: "Business Unit fetched successfully",
      data: unit
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBusinessUnit = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      businessUnitName,
      locationName,
      latitude,
      longitude,
      logo,
      assignBusinessHead,
      businessHead
    } = req.body;

    let updateData = {
      businessUnitName,
      locationName,
      logo,
      assignBusinessHead,
      businessHead
    };

    // ✅ If latitude & longitude provided, convert to GeoJSON
    if (latitude !== undefined && longitude !== undefined) {

      const lat = Number(latitude);
      const lng = Number(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          message: "Latitude and Longitude must be valid numbers"
        });
      }

      updateData.location = {
        type: "Point",
        coordinates: [lng, lat]   // [longitude, latitude]
      };
    }

    const updated = await BusinessUnit.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Business Unit not found" });
    }

    res.status(200).json({
      message: "Business Unit updated successfully",
      data: {
        ...updated.toObject(),
        latitude: updated.location?.coordinates?.[1],
        longitude: updated.location?.coordinates?.[0]
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteBusinessUnit = async (req, res) => {
  try {

    const { id } = req.params;

    const deleted = await BusinessUnit.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Business Unit not found" });
    }

    res.status(200).json({
      message: "Business Unit deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

