const Department = require("./department.model");
const populateEmployeeDetails = require("../populateEmployees");

exports.createDepartment = async (req, res) => {
  try {
    const adminId = req.user?.userId;
 const companyId = req.user?.companyId
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
      departmentheadId,
      departmentHead,
      companyOfficeId
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
 let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }
    const newDepartment = new Department({
      adminId,
      companyId,
      departmentName,
      isPartOfBusinessUnit,
      businessUnitId,
      isSubDepartment,
      parentDepartmentName,
      assignDepartmentHead,
      departmentheadId,
      departmentHead,
       companyOfficeId: officeIds,
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
    const adminId = req.user?.userId;
    const { country } = req.query;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Fetch departments and populate companyOfficeId with optional country filter
    const departments = await Department.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      });

    const data = await populateEmployeeDetails(departments);

    res.status(200).json({
      message: "Departments fetched successfully",
      data,
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
      departmentheadId,
      departmentHead
    } = req.body;

    let updateData = {
      departmentName,
      isPartOfBusinessUnit,
      businessUnitId,
      isSubDepartment,
      parentDepartmentName,
      assignDepartmentHead,
      departmentheadId,
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

    const data = await populateEmployeeDetails(updated);

    res.status(200).json({
      message: "Department updated successfully",
      data
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

    const data = await populateEmployeeDetails(getOne);

    res.status(200).json({
      message: "Department fetch successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

