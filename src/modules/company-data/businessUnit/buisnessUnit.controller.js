const BusinessUnit = require("./businessUnit.model");
const populateEmployeeDetails = require("../populateEmployees");
exports.createBusinessUnit = async (req, res) => {
  try {

    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      businessUnitName,
      locationName,
      latitude,
      longitude,
      logo,
      assignBusinessHead,
      businessHead,
      companyOfficeId
    } = req.body || {};

    // ✅ Safe latitude longitude
    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude);

    if (isNaN(lat)) lat = 0;
    if (isNaN(lng)) lng = 0;

    let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const location = {
      type: "Point",
      coordinates: [lng, lat]
    };

    const newUnit = new BusinessUnit({
      adminId,
      companyId,
      businessUnitName: businessUnitName || "",
      locationName: locationName || "",
      location,
      logo,
      assignBusinessHead,
      businessHead,
      companyOfficeId: officeIds,
      assignedEmployeeList: []
    });

    await newUnit.save();

    res.status(201).json({
      success: true,
      message: "Business Unit created successfully",
      data: {
        ...newUnit.toObject(),
        latitude: lat,
        longitude: lng
      }
    });

  } catch (error) {
    console.log(error, "error");

    res.status(500).json({
      success: false,
      message: error.message
    });
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

    const data = await populateEmployeeDetails(filteredUnits);

    res.status(200).json({
      message: "Business Units fetched successfully",
      selectedCountry: country || null,
      total: data.length,
      data
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

    const data = await populateEmployeeDetails(unit);

    res.status(200).json({
      message: "Business Unit fetched successfully",
      data
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

    const data = await populateEmployeeDetails(updated);

    res.status(200).json({
      message: "Business Unit updated successfully",
      data: {
        ...data,
        latitude: data.location?.coordinates?.[1],
        longitude: data.location?.coordinates?.[0]
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

