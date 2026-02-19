const Department = require("./department.model");

exports.createDepartment = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const {
      departmentName,
      isPartOfBusinessUnit,
      businessUnitId,
      isSubDepartment,
      parentDepartmentName,
      assignDepartmentHead,
      departmentHead
    } = req.body;

    // Validation
    if (!departmentName) {
      return res.status(400).json({ message: "Department name is required" });
    }

    if (assignDepartmentHead && !departmentHead) {
      return res.status(400).json({
        message: "Department head details are required"
      });
    }

    const newDepartment = new Department({
      adminId,
      departmentName,
      isPartOfBusinessUnit,
      businessUnitId,
      isSubDepartment,
      parentDepartmentName,
      assignDepartmentHead,
      departmentHead,
      addedById: adminId,
      addedByName: req.user?.name,
      addedByImage: req.user?.image
    });

    await newDepartment.save();

    res.status(201).json({
      message: "Department created successfully",
      data: newDepartment
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {


    const departments = await Department.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Departments fetched successfully",
      data: departments
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      departmentName,
      isPartOfBusinessUnit,
      businessUnitId,
      isSubDepartment,
      parentDepartmentName,
      assignDepartmentHead,
      departmentHead
    } = req.body;

    let updateData = {
      departmentName,
      isPartOfBusinessUnit,
      businessUnitId,
      isSubDepartment,
      parentDepartmentName,
      assignDepartmentHead,
      departmentHead
    };

    // ✅ If assigning head but no details
    if (assignDepartmentHead && !departmentHead) {
      return res.status(400).json({
        message: "Department head details are required"
      });
    }

    const updated = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteDepartment = async (req, res) => {
  try {

    const { id } = req.params;

    const deleted = await Department.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneDepartment = async (req, res) => {
  try {

    const { id } = req.params;

    const getOne = await Department.findOne(id);

    if (!getOne) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department fetch successfully",
      data:getOne
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

