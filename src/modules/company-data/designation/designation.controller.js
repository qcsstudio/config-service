const Designation = require("../models/Designation");


// ✅ 1. CREATE DESIGNATION
exports.createDesignation = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    const {
      designationName,
      isPartOfDepartment,
      departmentId,
      departmentName
    } = req.body;

    const newDesignation = new Designation({
      adminId,
      designationName,
      isPartOfDepartment,
      departmentId: isPartOfDepartment ? departmentId : null,
      departmentName: isPartOfDepartment ? departmentName : "",
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

    const list = await Designation.find()
      .sort({ createdAt: -1 });

    res.status(200).json(list);

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

    res.status(200).json(data);

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

