const Designation = require("./designation.model");
const populateEmployeeDetails = require("../populateEmployees");


// ✅ 1. CREATE DESIGNATION
exports.createDesignation = async (req, res) => {
  try {
    const adminId = req.user?.userId;
 const companyId = req.user?.companyId
    const {
      designationName,
      isPartOfDepartment,
      departmentId,
      departmentName,
      companyOfficeId
    } = req.body;
     let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const newDesignation = new Designation({
      adminId,
    companyId,
      designationName,
      isPartOfDepartment,
      departmentId: isPartOfDepartment ? departmentId : null,
      departmentName: isPartOfDepartment ? departmentName : "",
      companyOfficeId: officeIds,
      addedById: req.user?.userId,
      addedByName: req.user?.name,
      addedByImage: req.user?.image
    });

    await newDesignation.save();

    res.status(201).json({
      message: "Designation created successfully",
      data: newDesignation
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 2. GET ALL DESIGNATIONS
exports.getAllDesignations = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { country } = req.query;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Base query: match adminId
    let query = { adminId };

    // Fetch designations and populate companyOfficeId
    let designations = await Designation.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
      });

    // If country filter applied, remove designations with null companyOfficeId
    if (country) {
      designations = designations.filter(d => d.companyOfficeId !== null);
    }

    const data = await populateEmployeeDetails(designations);

    res.status(200).json({
      message: "Designations fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 3. GET SINGLE DESIGNATION
exports.getDesignationById = async (req, res) => {
  try {
    const data = await Designation.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    const populatedData = await populateEmployeeDetails(data);

    res.status(200).json(populatedData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 4. UPDATE DESIGNATION
exports.updateDesignation = async (req, res) => {
  try {
    const {
      designationName,
      isPartOfDepartment,
      departmentId,
      departmentName
    } = req.body;

    const updated = await Designation.findByIdAndUpdate(
      req.params.id,
      {
        designationName,
        isPartOfDepartment,
        departmentId: isPartOfDepartment ? departmentId : null,
        departmentName: isPartOfDepartment ? departmentName : ""
      },
      { new: true }
    );

    res.status(200).json({
      message: "Updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 5. DELETE DESIGNATION
exports.deleteDesignation = async (req, res) => {
  try {
    await Designation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

