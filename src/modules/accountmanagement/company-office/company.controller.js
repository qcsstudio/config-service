const CompanyOfficeModel = require("./company.model");

// Create a new company office
const createCompanyOffice = async (req, res) => {
  try {
    const companyId = req.user.companyId;

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
    } = req.body;

    if (!companyId || !locationName || !addressType || !addressLine1 || !country || !state || !city || !postalCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const office = await CompanyOfficeModel.create({
      companyId, // from auth token
      locationName,
      addressType,
      address: {
        addressLine1,
        addressLine2,
        country,
        state,
        city,
        postalCode,
      },
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


// Update a company office by ID
const updateCompanyOffice = async (req, res) => {
  try {
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
    } = req.body;

    const updateData = {};
    if (locationName) updateData.locationName = locationName;
    if (addressType) updateData.addressType = addressType;
    if (timezone) updateData.timeZone = timezone;
    if (ipAddress) updateData.ipAddress = ipAddress;

    if (addressLine1 || addressLine2 || country || state || city || postalCode) {
      updateData.address = {};
      if (addressLine1) updateData.address.addressLine1 = addressLine1;
      if (addressLine2) updateData.address.addressLine2 = addressLine2;
      if (country) updateData.address.country = country;
      if (state) updateData.address.state = state;
      if (city) updateData.address.city = city;
      if (postalCode) updateData.address.postalCode = postalCode;
    }

    const office = await CompanyOfficeModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!office) return res.status(404).json({ message: "Office not found" });

    res.status(200).json({ message: "Company office updated", office });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single company office by ID
const getCompanyOffice = async (req, res) => {
  try {
    const office = await CompanyOfficeModel.findById(req.params.id);
    if (!office) return res.status(404).json({ message: "Office not found" });
    res.status(200).json({ office });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all company offices for a company
const getAllCompanyOffices = async (req, res) => {
  try {
    const { companyId } = req.query;
    if (!companyId) return res.status(400).json({ message: "companyId is required" });

    const offices = await CompanyOfficeModel.find({ companyId }).sort({ createdAt: -1 });
    res.status(200).json({ offices });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a company office by ID
const deleteCompanyOffice = async (req, res) => {
  try {
    const office = await CompanyOfficeModel.findByIdAndDelete(req.params.id);
    if (!office) return res.status(404).json({ message: "Office not found" });

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
